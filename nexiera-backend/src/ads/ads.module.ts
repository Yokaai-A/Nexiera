import { Module } from "@nestjs/common";
import { AdsController } from "./ads.controller.js";
import { AdsService } from "./ads.service.js";
import { AdminGuard } from "../auth/admin.guard.js";

@Module({
  controllers: [AdsController],
  providers: [AdsService, AdminGuard],
})
export class AdsModule {}
