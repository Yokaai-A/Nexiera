import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateAdDto, type AdPlacementType } from "./dto/create-ad.dto.js";

@Injectable()
export class AdsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getSlot(placement: AdPlacementType) {
    const now = new Date();
    const ads = await this.prisma.ad.findMany({
      where: {
        placement,
        status: "APPROVED",
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
        status: true,
        impressions: true,
        clicks: true,
      },
    });
    return { source: ads.length > 0 ? "advertiser" as const : "nexiera" as const, ads };
  }

  async create(ownerId: string, body: CreateAdDto) {
    const owner = await this.prisma.user.findUnique({ where: { id: ownerId }, select: { activeRole: true } });
    if (!owner) throw new NotFoundException("Pengguna tidak ditemukan");

    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(body.endsAt);
    if (!Number.isFinite(startsAt.getTime()) || !Number.isFinite(endsAt.getTime()) || endsAt <= startsAt) {
      throw new BadRequestException("Waktu berakhir iklan harus lebih lanjut dari waktu mulai.");
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
        status: "PENDING_REVIEW",
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

  findPendingAdmin() {
    return this.prisma.ad.findMany({
      where: { status: "PENDING_REVIEW" },
      include: { owner: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  async reviewAdmin(adId: string, decision: "APPROVE" | "REJECT") {
    const ad = await this.prisma.ad.findUnique({ where: { id: adId }, select: { id: true, status: true } });
    if (!ad) throw new NotFoundException("Pengajuan iklan tidak ditemukan.");
    if (ad.status !== "PENDING_REVIEW") throw new ConflictException("Pengajuan iklan sudah ditinjau.");
    const status = decision === "APPROVE" ? "APPROVED" : "REJECTED";
    return this.prisma.ad.update({ where: { id: adId }, data: { status } });
  }

  private async findActiveAd(adId: string) {
    const now = new Date();
    const ad = await this.prisma.ad.findFirst({
      where: {
        id: adId,
        status: "APPROVED",
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      select: { id: true, targetUrl: true },
    });
    if (!ad) throw new BadRequestException("Iklan saat ini tidak aktif.");
    return ad;
  }
}
