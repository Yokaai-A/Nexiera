import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { isUniversityCourseRecord } from "../classes/university-courses.js";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getForUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, activeRole: true, roles: true, fullName: true },
    });
    if (!user) throw new NotFoundException("Pengguna tidak ditemukan.");

    const isTutorOrBootcamp =
      user.activeRole === "PEER_TUTOR" || user.activeRole === "MITRA_BOOTCAMP";

    if (!isTutorOrBootcamp) {
      // Mahasiswa view
      const [enrolledTransactions] = await Promise.all([
        this.prisma.transaction.findMany({
          where: { userId, status: "PAID" },
          orderBy: { createdAt: "desc" },
          include: {
            class: {
              include: {
                creator: true,
              },
            },
          },
        }),
      ]);

      const validEnrollments = enrolledTransactions.filter((t) => isUniversityCourseRecord(t.class));
      const uniqueEnrollments = Array.from(
        new Map(validEnrollments.map((transaction) => [transaction.class.id, transaction])).values(),
      );
      const classes = uniqueEnrollments.map((t) => ({
        id: t.class.id,
        title: t.class.title,
        slug: t.class.slug,
        category: t.class.category,
        major: t.class.major,
        bannerUrl: t.class.bannerUrl,
        meetingLink: t.class.meetingLink,
        meetingUrl: t.class.meetingLink,
        materialLink: t.class.materialLink,
        materialUrl: t.class.materialLink,
        recordingLink: t.class.recordingLink,
        recordingUrl: t.class.recordingLink,
        type: t.class.type,
        courseType: t.class.type,
        startsAt: t.class.startsAt,
        status: "ACTIVE",
        creator: {
          id: t.class.creator.id,
          name: t.class.creator.fullName,
          email: t.class.creator.contactEmail || t.class.creator.email,
          phoneNumber: t.class.creator.phoneNumber,
        },
      }));

      const transactions = validEnrollments.map((t) => ({
        id: t.id,
        amount: String(t.amount),
        currency: "IDR",
        status: t.status,
        refundStatus: "NOT_REQUESTED",
        createdAt: t.createdAt,
        paidAt: t.createdAt,
        class: {
          id: t.class.id,
          title: t.class.title,
          startsAt: t.class.startsAt,
          status: "ACTIVE",
        },
      }));

      return {
        role: "STUDENT",
        activeRole: user.activeRole,
        classes,
        transactions,
        attendedSessionsCount: classes.length,
        totalRevenue: 0,
        pendingBalance: 0,
        netBalance: 0,
        completedClassRevenue: 0,
        adMetrics: { impressions: 0, clicks: 0, ctr: 0 },
        students: [],
      };
    }

    // Tutor / Mitra Bootcamp view
    const [createdClasses, transactions, ads] = await Promise.all([
      this.prisma.class.findMany({
        where: { creatorId: userId },
        orderBy: { createdAt: "desc" },
        include: {
          reviews: true,
          transactions: true,
        },
      }),
      this.prisma.transaction.findMany({
        where: { class: { creatorId: userId } },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phoneNumber: true,
              campus: true,
            },
          },
          class: {
            select: {
              id: true,
              title: true,
                type: true,
                category: true,
                major: true,
                campusTarget: true,
                price: true,
            },
          },
        },
      }),
      this.prisma.ad.findMany({
        where: { ownerId: userId },
        select: { impressions: true, clicks: true },
      }),
    ]);

    const validCreatedClasses = createdClasses.filter(isUniversityCourseRecord);
    const validTransactions = transactions.filter((t) => isUniversityCourseRecord(t.class));
    const paidTransactions = validTransactions.filter((t) => t.status === "PAID");
    const grossRevenue = paidTransactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );
    // Net balance after 8% platform fee
    const netBalance = Math.round(grossRevenue * 0.92);
    const pendingBalance = 0; // or unwithdrawn balance
    const completedClassRevenue = grossRevenue;

    const impressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
    const clicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);

    const studentsById = new Map<
      string,
      {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        classTitles: Set<string>;
      }
    >();

    for (const t of paidTransactions) {
      const existing = studentsById.get(t.user.id) || {
        id: t.user.id,
        name: t.user.fullName,
        email: t.user.email,
        phoneNumber: t.user.phoneNumber || "-",
        classTitles: new Set<string>(),
      };
      existing.classTitles.add(t.class.title);
      studentsById.set(t.user.id, existing);
    }

    return {
      role: user.activeRole === "PEER_TUTOR" ? "TUTOR" : "BOOTCAMP",
      activeRole: user.activeRole,
      classes: validCreatedClasses.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        category: c.category,
        major: c.major,
        price: String(c.price),
        type: c.type,
        bannerUrl: c.bannerUrl,
        meetingLink: c.meetingLink,
        materialLink: c.materialLink,
        status: "ACTIVE",
        studentCount: c.transactions.filter((t) => t.status === "PAID").length,
      })),
      transactions: validTransactions.map((t) => ({
        id: t.id,
        amount: String(t.amount),
        currency: "IDR",
        status: t.status,
        refundStatus: "NOT_REQUESTED",
        createdAt: t.createdAt,
        paidAt: t.createdAt,
        user: {
          id: t.user.id,
          name: t.user.fullName,
          email: t.user.email,
          phoneNumber: t.user.phoneNumber,
        },
        class: {
          id: t.class.id,
          title: t.class.title,
          status: "ACTIVE",
        },
      })),
      totalRevenue: grossRevenue,
      netBalance,
      pendingBalance,
      completedClassRevenue,
      adMetrics: {
        impressions,
        clicks,
        ctr: impressions === 0 ? 0 : (clicks / impressions) * 100,
      },
      students: [...studentsById.values()].map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phoneNumber: s.phoneNumber,
        classTitles: [...s.classTitles],
      })),
    };
  }
}
