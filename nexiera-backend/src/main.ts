import "reflect-metadata";
import cookieParser from "cookie-parser";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const frontendUrl = config.getOrThrow<string>("FRONTEND_URL");
  const frontendOrigins = new Set([frontendUrl]);

  // Localhost and 127.0.0.1 are common equivalent dev URLs, but browsers
  // treat them as different origins for CORS, cookies, and CSRF checks.
  if (process.env.NODE_ENV !== "production") {
    const configuredOrigin = new URL(frontendUrl);
    if (configuredOrigin.hostname === "localhost" || configuredOrigin.hostname === "127.0.0.1") {
      const loopbackAlias = new URL(frontendUrl);
      loopbackAlias.hostname = configuredOrigin.hostname === "localhost" ? "127.0.0.1" : "localhost";
      frontendOrigins.add(loopbackAlias.origin);
    }
  }

  app.useSecurityHeaders();
  app.enableCsrfProtection({
    trustedOrigins: [...frontendOrigins],
    exclude: [
      { path: "transactions/webhook/midtrans", method: RequestMethod.POST },
    ],
  });
  app.setGlobalPrefix("api");
  const uploadsPath = (await import("path")).join(process.cwd(), "uploads");
  const express = (await import("express")).default;
  app.use("/uploads", express.static(uploadsPath));
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
