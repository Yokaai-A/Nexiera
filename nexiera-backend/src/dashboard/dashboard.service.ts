import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getForUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!user) throw new NotFoundException("User not found");

    if (user.role !== "TUTOR") {
      const [classes, transactions, attendedSessionsCount] = await Promise.all([
        this.prisma.class.findMany({
          where: { transactions: { some: { userId, status: "PAID" } } },
          orderBy: { startsAt: "asc" },
          select: {
            id: true,
            title: true,
            status: true,
            startsAt: true,
            meetingPlatform: true,
            meetingUrl: true,
            materialUrl: true,
            driveUrl: true,
            tutor: { select: { id: true, name: true, email: true, phoneNumber: true } },
          },
        }),
        this.prisma.transaction.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            refundStatus: true,
            createdAt: true,
            class: { select: { id: true, title: true, startsAt: true, status: true } },
          },
        }),
        this.prisma.presence.count({
          where: { userId, status: "PRESENT" },
        }),
      ]);
      return {
        role: user.role,
        classes: classes.map((item) => ({
          ...item,
          meetingUrl: item.status === "CANCELLED" ? null : item.meetingUrl,
        })),
        transactions,
        attendedSessionsCount,
        totalRevenue: 0,
        pendingBalance: 0,
        completedClassRevenue: 0,
        adMetrics: { impressions: 0, clicks: 0, ctr: 0 },
        students: [],
      };
    }

    const [classes, transactions, ads] = await Promise.all([
      this.prisma.class.findMany({
        where: { tutorId: userId },
        orderBy: { startsAt: "asc" },
        select: { id: true, title: true, status: true, startsAt: true },
      }),
      this.prisma.transaction.findMany({
        where: { class: { tutorId: userId } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          userId: true,
          amount: true,
          currency: true,
          status: true,
          refundStatus: true,
          createdAt: true,
          paidAt: true,
          user: { select: { id: true, name: true, email: true, phoneNumber: true } },
          class: { select: { id: true, title: true, startsAt: true, status: true } },
        },
      }),
      this.prisma.ad.findMany({
        where: { ownerId: userId },
        select: { impressions: true, clicks: true },
      }),
    ]);

    const paidTransactions = transactions.filter(
      (transaction) => transaction.status === "PAID" && transaction.class.status !== "CANCELLED",
    );
    const now = new Date();
    const totalRevenue = paidTransactions.reduce((sum, transaction) => sum + transaction.amount.toNumber(), 0);
    const pendingBalance = paidTransactions
      .filter((transaction) => transaction.class.startsAt && transaction.class.startsAt > now)
      .reduce((sum, transaction) => sum + transaction.amount.toNumber(), 0);
    const completedClassRevenue = Math.max(0, totalRevenue - pendingBalance);
    const impressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
    const clicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);

    const studentsById = new Map<string, {
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      classTitles: Set<string>;
    }>();
    for (const transaction of paidTransactions) {
      const existing = studentsById.get(transaction.user.id) || {
        ...transaction.user,
        classTitles: new Set<string>(),
      };
      existing.classTitles.add(transaction.class.title);
      studentsById.set(transaction.user.id, existing);
    }

    return {
      role: user.role,
      classes,
      transactions,
      totalRevenue,
      pendingBalance,
      completedClassRevenue,
      adMetrics: {
        impressions,
        clicks,
        ctr: impressions === 0 ? 0 : (clicks / impressions) * 100,
      },
      students: [...studentsById.values()].map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        phoneNumber: student.phoneNumber,
        classTitles: [...student.classTitles],
      })),
    };
  }
}
