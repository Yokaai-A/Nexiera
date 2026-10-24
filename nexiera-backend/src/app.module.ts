import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { AdsModule } from "./ads/ads.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { ClassesModule } from "./classes/classes.module.js";
import { DashboardModule } from "./dashboard/dashboard.module.js";
import { NotificationsModule } from "./notifications/notifications.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { ReviewsModule } from "./reviews/reviews.module.js";
import { TransactionsModule } from "./transactions/transactions.module.js";
import { UploadsModule } from "./uploads/uploads.module.js";
import { UsersModule } from "./users/users.module.js";

@Module({
  imports: [
    // Resolve backend .env relative to this module so start:dev works whether
    // it is launched from the backend folder or the monorepo root.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ClassesModule,
    TransactionsModule,
    ReviewsModule,
    NotificationsModule,
    UploadsModule,
    AdsModule,
    DashboardModule,
  ],
})
export class AppModule {}
