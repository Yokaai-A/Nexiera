import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { AdPlacement } from "../generated/prisma/client.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { AdsService } from "./ads.service.js";
import { CreateAdDto } from "./dto/create-ad.dto.js";

type AuthenticatedRequest = Request & { user: { userId: string } };
const AD_PLACEMENTS = Object.values(AdPlacement) as string[];

@Controller("ads")
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get("slot/:placement")
  getSlot(@Param("placement") placement: string) {
    if (!AD_PLACEMENTS.includes(placement)) {
      throw new BadRequestException(`placement must be one of: ${AD_PLACEMENTS.join(", ")}`);
    }
    return this.adsService.getSlot(placement as AdPlacement);
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
