import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AdsModule } from "./ads/ads.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { ClassesModule } from "./classes/classes.module.js";
import { DashboardModule } from "./dashboard/dashboard.module.js";
import { PresencesModule } from "./presences/presences.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { TransactionsModule } from "./transactions/transactions.module.js";
import { UsersModule } from "./users/users.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ClassesModule,
    TransactionsModule,
    PresencesModule,
    AdsModule,
    DashboardModule,
  ],
})
export class AppModule {}
