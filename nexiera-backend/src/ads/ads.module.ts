import { Module } from "@nestjs/common";
import { AdsController, CampaignsController } from "./ads.controller.js";
import { AdsService } from "./ads.service.js";
import { AdminGuard } from "../auth/admin.guard.js";

@Module({
  controllers: [AdsController, CampaignsController],
  providers: [AdsService, AdminGuard],
})
export class AdsModule {}
