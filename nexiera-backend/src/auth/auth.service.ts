import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { UsersService, type GoogleUserProfile } from "../users/users.service.js";
import type { LoginDto } from "./dto/login.dto.js";
import type { RegisterDto } from "./dto/register.dto.js";
import { MailService } from "../mail/mail.service.js";

interface ProfileSetupPayload extends GoogleUserProfile {
  purpose: "complete-profile";
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto) {
    if (Buffer.byteLength(dto.password, "utf8") > 72) {
      throw new BadRequestException("Password must not exceed 72 UTF-8 bytes");
    }
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const email = dto.email.trim().toLowerCase();
    const user = await this.usersService.createPasswordUser({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phoneNumber: dto.phoneNumber,
      emailVerified: false,
    });
    const token = await this.usersService.issueEmailVerification(user.id);
    const url = new URL(`/verify-email?token=${encodeURIComponent(token)}`, this.config.get<string>("FRONTEND_URL") || "http://localhost:3000").toString();
    if (this.devVerificationLinksEnabled()) {
      return { emailVerificationRequired: true, email: user.email, verificationUrl: url, emailDelivery: "LOCAL_TEST" as const };
    }
    void this.mail.sendVerificationEmail(user.email, user.fullName, url).catch((error) => this.logger.error(`Email verifikasi gagal: ${String(error)}`));
    return { emailVerificationRequired: true, email: user.email };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findForPasswordLogin(dto.email);
    if (user && !user.password) {
      throw new UnauthorizedException("Akun ini terdaftar via Google. Silakan masuk dengan Google.");
    }
    if (!user?.password || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException("Email atau kata sandi tidak valid.");
    }
    if (!user.emailVerifiedAt) throw new UnauthorizedException("Verifikasi email melalui tautan yang dikirim sebelum masuk.");
    const { password: _password, ...profile } = user;
    return {
      accessToken: await this.createAccessToken(profile.id, profile.email),
      user: profile,
    };
  }

  async resendVerification(email: string) {
    const user = await this.usersService.findUnverifiedPasswordUser(email);
    if (user) {
      const token = await this.usersService.issueEmailVerification(user.id);
      const url = new URL(`/verify-email?token=${encodeURIComponent(token)}`, this.config.get<string>("FRONTEND_URL") || "http://localhost:3000").toString();
      if (this.devVerificationLinksEnabled()) {
        return { success: true, message: "Mode uji lokal: buka tautan verifikasi berikut.", verificationUrl: url };
      }
      void this.mail.sendVerificationEmail(user.email, user.fullName, url).catch((error) => this.logger.error(`Email verifikasi gagal: ${String(error)}`));
    }
    return { success: true, message: "Jika akun belum diverifikasi, tautan verifikasi akan dikirim ke email akun." };
  }

  verifyEmail(token: string) { return this.usersService.verifyEmailToken(token); }

  private devVerificationLinksEnabled() {
    return this.config.get<string>("EMAIL_VERIFICATION_DEV_LINKS") === "true";
  }

  async googleSignIn(profile: GoogleUserProfile) {
    let user = await this.usersService.findGoogleUser(profile);
    if (!user) {
      user = await this.usersService.createGoogleUser(profile);
    }
    return {
      kind: "authenticated" as const,
      user,
      accessToken: await this.createAccessToken(user.id, user.email),
    };
  }

  private createAccessToken(userId: string, email: string) {
    return this.jwtService.signAsync({ sub: userId, email });
  }
}
