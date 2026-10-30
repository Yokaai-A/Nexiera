import "reflect-metadata";
import cookieParser from "cookie-parser";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import type { NextFunction, Request, Response } from "express";
import { AppModule } from "./app.module.js";
import { getPublicUploadsDir } from "./uploads/storage-paths.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const frontendUrl = config.getOrThrow<string>("FRONTEND_URL");
  const frontendOrigin = new URL(frontendUrl).origin;
  const frontendOrigins = new Set([frontendOrigin]);



  if (process.env.NODE_ENV !== "production") {
    const configuredOrigin = new URL(frontendOrigin);
    if (configuredOrigin.hostname === "localhost" || configuredOrigin.hostname === "127.0.0.1") {
      const loopbackAlias = new URL(frontendUrl);
      loopbackAlias.hostname = configuredOrigin.hostname === "localhost" ? "127.0.0.1" : "localhost";
      frontendOrigins.add(loopbackAlias.origin);
    }
  }

  app.useSecurityHeaders();
  app.getHttpAdapter().getInstance().disable("x-powered-by");
  if (process.env.NODE_ENV === "production") {
    app.getHttpAdapter().getInstance().set("trust proxy", 1);
  }
  app.enableCsrfProtection({
    trustedOrigins: [...frontendOrigins],
    exclude: [
      { path: "transactions/webhook/midtrans", method: RequestMethod.POST },
    ],
  });
  app.setGlobalPrefix("api");
  const express = (await import("express")).default;
  app.use("/uploads", (_request: Request, response: Response, next: NextFunction) => {


    if (!_request.originalUrl.startsWith("/uploads/private/")) {
      response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
    next();
  }, express.static(getPublicUploadsDir()));
  app.use(cookieParser());
  app.enableCors({
    origin: [...frontendOrigins],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(config.get<string>("PORT") || 4000);
  await app.listen(port);
}

void bootstrap();
