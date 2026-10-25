import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { Request } from "express";

interface JwtPayload {
  sub: string;
  email: string;
}

function accessTokenFromCookie(request: Request): string | null {
  const cookieName = process.env.AUTH_COOKIE_NAME || "nexiera_access_token";
  return request.cookies?.[cookieName] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        accessTokenFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>("JWT_SECRET"),
    });
  }

  validate(payload: JwtPayload) {
    if (typeof payload.sub !== "string" || !payload.sub || typeof payload.email !== "string" || !payload.email) {
      throw new UnauthorizedException("Token tidak valid.");
    }
    return { userId: payload.sub, email: payload.email.toLowerCase() };
  }
}
