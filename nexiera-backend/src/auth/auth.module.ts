import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { GoogleOAuthGuard } from "./google-oauth.guard.js";
import { GoogleStrategy } from "./google.strategy.js";
import { JwtStrategy } from "./jwt.strategy.js";

const googleStrategyProvider = {
  provide: GoogleStrategy,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    if (!config.get<string>("GOOGLE_CLIENT_ID") || !config.get<string>("GOOGLE_CLIENT_SECRET")) {
      return null;
    }
    return new GoogleStrategy(config);
  },
};

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("JWT_SECRET"),
        signOptions: { expiresIn: "15m" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, googleStrategyProvider, GoogleOAuthGuard, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
