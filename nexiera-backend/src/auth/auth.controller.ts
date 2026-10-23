import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { CompleteGoogleProfileDto } from "./dto/complete-google-profile.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { RegisterDto } from "./dto/register.dto.js";
import { AuthService } from "./auth.service.js";
import { GoogleOAuthGuard } from "./google-oauth.guard.js";
import type { GoogleUserProfile } from "../users/users.service.js";

type GoogleRequest = Request & { user: GoogleUserProfile };
type CookieRequest = Request & { cookies: Record<string, string | undefined> };

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post("register")
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(body);
    this.setAccessCookie(response, result.accessToken);
    return result;
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(body);
    this.setAccessCookie(response, result.accessToken);
    return result;
  }

  @Get("google")
  @UseGuards(GoogleOAuthGuard)
  googleLogin() {}

  @Get("google/callback")
  @UseGuards(GoogleOAuthGuard)
  async googleCallback(@Req() request: GoogleRequest, @Res() response: Response) {
    const result = await this.authService.googleSignIn(request.user);
    const frontendUrl = this.config.getOrThrow<string>("FRONTEND_URL");

    if (result.kind === "complete-profile") {
      response.cookie(this.profileCookieName(), result.setupToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth/complete-profile",
        maxAge: 10 * 60 * 1000,
      });
      return response.redirect(`${frontendUrl}/complete-profile`);
    }

    this.setAccessCookie(response, result.accessToken);
    return response.redirect(`${frontendUrl}/dashboard`);
  }

  @Post("complete-profile")
  async completeProfile(
    @Body() body: CompleteGoogleProfileDto,
    @Req() request: CookieRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const setupToken = request.cookies[this.profileCookieName()];
    if (!setupToken) {
      throw new UnauthorizedException("Profile setup session is missing or expired");
    }
    const result = await this.authService.completeGoogleProfile(setupToken, body.phoneNumber);
    response.clearCookie(this.profileCookieName(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api/auth/complete-profile",
    });
    this.setAccessCookie(response, result.accessToken);
    return { user: result.user };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(this.cookieName(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return { success: true };
  }

  private setAccessCookie(response: Response, token: string) {
    response.cookie(this.cookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });
  }

  private cookieName() {
    return this.config.get<string>("AUTH_COOKIE_NAME") || "nexiera_access_token";
  }

  private profileCookieName() {
    return "nexiera_profile_setup_token";
  }
}
