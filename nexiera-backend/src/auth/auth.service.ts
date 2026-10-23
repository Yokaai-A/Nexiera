import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { UsersService, type GoogleUserProfile } from "../users/users.service.js";
import type { LoginDto } from "./dto/login.dto.js";
import type { RegisterDto } from "./dto/register.dto.js";

interface ProfileSetupPayload extends GoogleUserProfile {
  purpose: "complete-profile";
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    if (Buffer.byteLength(dto.password, "utf8") > 72) {
      throw new BadRequestException("Password must not exceed 72 UTF-8 bytes");
    }
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.createPasswordUser({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
    });
    return {
      accessToken: await this.createAccessToken(user.id, user.email),
      user,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findForPasswordLogin(dto.email);
    if (user?.googleId && !user.password) {
      throw new UnauthorizedException("This account uses Google Sign-In. Continue with Google instead.");
    }
    if (!user?.password || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException("Email or password is incorrect");
    }
    const { password: _password, googleId: _googleId, ...profile } = user;
    return {
      accessToken: await this.createAccessToken(profile.id, profile.email),
      user: profile,
    };
  }

  async googleSignIn(profile: GoogleUserProfile) {
    const user = await this.usersService.findGoogleUser(profile);
    if (user) {
      return {
        kind: "authenticated" as const,
        user,
        accessToken: await this.createAccessToken(user.id, user.email),
      };
    }

    return {
      kind: "complete-profile" as const,
      setupToken: await this.jwtService.signAsync(
        { ...profile, purpose: "complete-profile" },
        { secret: this.config.getOrThrow<string>("JWT_SECRET"), expiresIn: "10m" },
      ),
    };
  }

  async completeGoogleProfile(token: string, phoneNumber: string) {
    let profile: ProfileSetupPayload;
    try {
      profile = await this.jwtService.verifyAsync<ProfileSetupPayload>(token, {
        secret: this.config.getOrThrow<string>("JWT_SECRET"),
      });
    } catch {
      throw new UnauthorizedException("Profile setup token is invalid or expired");
    }

    if (profile.purpose !== "complete-profile") {
      throw new UnauthorizedException("Token cannot be used to complete a profile");
    }

    const user = await this.usersService.createGoogleUser(profile, phoneNumber);
    return {
      user,
      accessToken: await this.createAccessToken(user.id, user.email),
    };
  }

  private createAccessToken(userId: string, email: string) {
    return this.jwtService.signAsync({ sub: userId, email });
  }
}
