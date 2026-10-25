import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { MailService } from "../mail/mail.service.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async listForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException("Notifikasi tidak ditemukan.");
    }
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  }

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: "ENROLLMENT" | "ZOOM_UPDATE" | "REVIEW" | "SYSTEM";
    linkUrl?: string;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        linkUrl: data.linkUrl || null,
      },
    });



    void this.prisma.user.findUnique({
      where: { id: data.userId },
      select: { email: true, fullName: true },
    }).then((user) => {
      if (!user?.email) return;
      void this.mail.sendNotificationEmail({
        to: user.email,
        recipientName: user.fullName,
        title: notification.title,
        message: notification.message,
        linkUrl: notification.linkUrl || undefined,
      }).catch((error: unknown) => {
        this.logger.error(`Gagal mengirim email notifikasi ke ${user.email}: ${error instanceof Error ? error.message : String(error)}`);
      });
    }).catch((error: unknown) => {
      this.logger.error(`Gagal menyiapkan email notifikasi untuk pengguna ${data.userId}: ${error instanceof Error ? error.message : String(error)}`);
    });

    return notification;
  }
}
