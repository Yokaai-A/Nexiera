import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, type Profile } from "passport-google-oauth20";
import type { GoogleUserProfile } from "../users/users.service.js";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>("GOOGLE_CLIENT_ID"),
      clientSecret: config.getOrThrow<string>("GOOGLE_CLIENT_SECRET"),
      callbackURL: config.getOrThrow<string>("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): GoogleUserProfile {
    const email = profile.emails?.[0]?.value;
    if (!profile.id || !email || !profile.emails?.[0]?.verified) {
      throw new UnauthorizedException("Google must provide a verified account email");
    }

    return {
      googleId: profile.id,
      email: email.toLowerCase(),
      name: profile.displayName || email,
    };
  }
}
