import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AdPlacement } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateAdDto } from "./dto/create-ad.dto.js";

@Injectable()
export class AdsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async getSlot(placement: AdPlacement) {
    const now = new Date();
    const ads = await this.prisma.ad.findMany({
      where: {
        placement,
        status: "ACTIVE",
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        subtitle: true,
        placement: true,
        imageUrl: true,
        targetUrl: true,
        startsAt: true,
        endsAt: true,
      },
    });
    if (ads.length > 0) return { source: "advertiser" as const, ads };

    const frontendUrl = this.config.getOrThrow<string>("FRONTEND_URL");
    return {
      source: "nexiera" as const,
      ads: [
        {
          id: `official-${placement.toLowerCase()}`,
          title: "Belajar lebih terarah bersama NEXIERA",
          placement,
          imageUrl: `${frontendUrl}/banner-cari-kelas.jpeg`,
          targetUrl: `${frontendUrl}/cari-kelas`,
          official: true,
        },
      ],
    };
  }

  async create(ownerId: string, body: CreateAdDto) {
    const owner = await this.prisma.user.findUnique({ where: { id: ownerId }, select: { role: true } });
    if (!owner) throw new NotFoundException("User not found");
    if (owner.role !== "TUTOR" && owner.role !== "ADMIN") {
      throw new ForbiddenException("Only tutors can create advertisements");
    }

    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(body.endsAt);
    if (!Number.isFinite(startsAt.getTime()) || !Number.isFinite(endsAt.getTime()) || endsAt <= startsAt) {
      throw new BadRequestException("Ad end time must be later than its start time");
    }

    return this.prisma.ad.create({
      data: {
        ownerId,
        title: body.title.trim(),
        subtitle: body.subtitle.trim(),
        placement: body.placement,
        imageUrl: body.imageUrl,
        targetUrl: body.targetUrl,
        startsAt,
        endsAt,
        status: "ACTIVE",
      },
    });
  }

  async recordImpression(adId: string) {
    const ad = await this.findActiveAd(adId);
    await this.prisma.ad.update({
      where: { id: ad.id },
      data: { impressions: { increment: 1 } },
      select: { id: true },
    });
    return { tracked: true };
  }

  async recordClick(adId: string) {
    const ad = await this.findActiveAd(adId);
    await this.prisma.ad.update({
      where: { id: ad.id },
      data: { clicks: { increment: 1 } },
      select: { id: true },
    });
    return { tracked: true, targetUrl: ad.targetUrl };
  }

  findMyAds(ownerId: string) {
    return this.prisma.ad.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
    });
  }

  private async findActiveAd(adId: string) {
    const now = new Date();
    const ad = await this.prisma.ad.findFirst({
      where: {
        id: adId,
        status: "ACTIVE",
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      select: { id: true, targetUrl: true },
    });
    if (!ad) throw new BadRequestException("Ad is not currently active");
    return ad;
  }
}
