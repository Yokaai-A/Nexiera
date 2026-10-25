import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { AdminGuard } from "../auth/admin.guard.js";
import { AdsService } from "./ads.service.js";
import { CreateAdDto, type AdPlacementType } from "./dto/create-ad.dto.js";
import { ReviewAdDto } from "./dto/review-ad.dto.js";

type AuthenticatedRequest = Request & { user: { userId: string } };
const AD_PLACEMENTS: AdPlacementType[] = ["HOME_HERO", "SIDE_MARGIN"];

@Controller("ads")
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get("slot/:placement")
  getSlot(@Param("placement") placement: string) {
    if (!AD_PLACEMENTS.includes(placement as AdPlacementType)) {
      throw new BadRequestException(`placement must be one of: ${AD_PLACEMENTS.join(", ")}`);
    }
    return this.adsService.getSlot(placement as AdPlacementType);
  }

  @Get("admin/pending")
  @UseGuards(JwtAuthGuard, AdminGuard)
  listPendingAdmin() {
    return this.adsService.findPendingAdmin();
  }

  @Patch(":adId/review")
  @UseGuards(JwtAuthGuard, AdminGuard)
  reviewAdmin(@Param("adId") adId: string, @Body() body: ReviewAdDto) {
    return this.adsService.reviewAdmin(adId, body.decision);
  }

  @Get("mine")
  @UseGuards(JwtAuthGuard)
  getMine(@Req() request: AuthenticatedRequest) {
    return this.adsService.findMyAds(request.user.userId);
  }

  @Post(":adId/impression")
  recordImpression(@Param("adId") adId: string) {
    return this.adsService.recordImpression(adId);
  }

  @Post(":adId/click")
  recordClick(@Param("adId") adId: string) {
    return this.adsService.recordClick(adId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() request: AuthenticatedRequest, @Body() body: CreateAdDto) {
    return this.adsService.create(request.user.userId, body);
  }
}
