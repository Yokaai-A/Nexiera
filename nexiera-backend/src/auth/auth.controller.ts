import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { LoginDto } from "./dto/login.dto.js";
import { RegisterDto } from "./dto/register.dto.js";
import { AuthService } from "./auth.service.js";
import { GoogleOAuthGuard } from "./google-oauth.guard.js";
import type { GoogleUserProfile } from "../users/users.service.js";

type GoogleRequest = Request & { user: GoogleUserProfile };

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
    if ("accessToken" in result && typeof result.accessToken === "string") this.setAccessCookie(response, result.accessToken);
    return result;
  }

  @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Body() body: { token: string }) { return this.authService.verifyEmail(body.token); }

  @Post("resend-verification")
  @HttpCode(HttpStatus.OK)
  resendVerification(@Body() body: { email: string }) { return this.authService.resendVerification(body.email); }

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
    this.setAccessCookie(response, result.accessToken);
    return response.redirect(`${frontendUrl}/dashboard`);
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
}
