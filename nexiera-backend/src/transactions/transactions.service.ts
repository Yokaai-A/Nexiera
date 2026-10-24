import { randomUUID } from "node:crypto";
import { createHash, timingSafeEqual } from "node:crypto";
import { basename, join } from "node:path";
import { existsSync } from "node:fs";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Logger,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrivateUploadPurpose, TransactionStatus } from "../generated/prisma/client.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { isUniversityCourseRecord } from "../classes/university-courses.js";
import { MidtransService } from "./midtrans.service.js";

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly midtrans: MidtransService,
    private readonly config: ConfigService,
    private readonly notifications: NotificationsService,
  ) {}

  async createCheckout(userId: string, classId: string) {
    const [user, classRecord] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, fullName: true, email: true, phoneNumber: true, campus: true, major: true },
      }),
      this.prisma.class.findUnique({
        where: { id: classId },
        select: {
          id: true,
          creatorId: true,
          title: true,
          price: true,
          type: true,
          category: true,
          campusTarget: true,
        },
      }),
    ]);

    if (!user) throw new NotFoundException("Pengguna tidak ditemukan.");
    if (!user.campus?.trim() || !user.major?.trim()) {
      throw new BadRequestException("Lengkapi kampus dan program studi di profil utama sebelum mendaftar kelas.");
    }
    if (!classRecord) throw new NotFoundException("Kelas tidak ditemukan.");
    if (!isUniversityCourseRecord(classRecord)) {
      throw new NotFoundException("Kelas tidak termasuk mata kuliah resmi yang tersedia di NEXIERA.");
    }

    if (classRecord.creatorId === userId) {
      throw new ForbiddenException("Pengajar tidak dapat mendaftar di kelas sendiri.");
    }

    const priceNum = Number(classRecord.price);

    // Check if already paid
    const alreadyPaid = await this.prisma.transaction.findFirst({
      where: { userId, classId, status: TransactionStatus.PAID },
    });
    if (alreadyPaid) {
      throw new ConflictException("Anda sudah terdaftar pada kelas ini.");
    }

    const orderId = `NEX-${Date.now()}-${randomUUID().slice(0, 6)}`;

    // Free class: auto PAID
    if (priceNum === 0) {
      const transaction = await this.prisma.transaction.create({
        data: {
          orderId,
          userId,
          classId,
          amount: 0,
          status: TransactionStatus.PAID,
        },
      });

      // Send notifications
      await this.notifications.createNotification({
        userId,
        title: "Pendaftaran Kelas Berhasil",
        message: `Selamat! Anda berhasil terdaftar di kelas gratis "${classRecord.title}". Akses materi dan link pertemuan di Kelas Saya.`,
        type: "ENROLLMENT",
        linkUrl: "/dashboard/kelas-saya",
      }).catch(() => null);

      await this.notifications.createNotification({
        userId: classRecord.creatorId,
        title: "Peserta Baru Terdaftar",
        message: `${user.fullName} telah bergabung ke kelas "${classRecord.title}".`,
        type: "ENROLLMENT",
        linkUrl: "/dashboard/tutor/peserta",
      }).catch(() => null);

      return {
        transactionId: transaction.id,
        status: transaction.status,
        redirectUrl: null,
      };
    }

    const serverKey = this.config.get<string>("MIDTRANS_SERVER_KEY");
    if (!serverKey || serverKey.trim() === "") {
      const transaction = await this.prisma.transaction.create({
        data: {
          orderId,
          userId,
          classId,
          amount: priceNum,
          status: TransactionStatus.FAILED,
        },
      });

      return {
        transactionId: transaction.id,
        status: transaction.status,
        redirectUrl: null,
      };
    }

    // Midtrans integration if server key is present
    const pendingTransaction = await this.prisma.transaction.create({
      data: { orderId, userId, classId, amount: priceNum, status: TransactionStatus.PENDING },
    });
    let snap: { redirectUrl: string };
    try {
      snap = await this.midtrans.createSnapCheckout({
        orderId,
        amount: priceNum,
        classId: classRecord.id,
        classTitle: classRecord.title,
        customer: {
          name: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber || "08123456789",
        },
      });

    } catch {
      const transaction = await this.prisma.transaction.update({ where: { id: pendingTransaction.id }, data: { status: TransactionStatus.FAILED } });
      return {
        transactionId: transaction.id,
        status: transaction.status,
        redirectUrl: null,
      };
    }

    return { transactionId: pendingTransaction.id, status: pendingTransaction.status, redirectUrl: snap.redirectUrl };
  }

  async listMine(userId: string) {
    const list = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        class: {
          select: {
            id: true,
            title: true,
            category: true,
            type: true,
            startsAt: true,
            campusTarget: true,
            price: true,
          },
        },
      },
    });

    return list.filter((t) => isUniversityCourseRecord(t.class)).map((t) => ({
      id: t.id,
      orderId: t.orderId,
      amount: String(t.amount),
      currency: "IDR",
      status: t.status,
      refundStatus: t.refundStatus,
      refundMethod: t.refundMethod,
      refundAccountName: t.refundAccountName,
      refundAccountNumber: t.refundAccountNumber,
      createdAt: t.createdAt,
      paidAt: t.status === "PAID" ? t.createdAt : null,
      class: {
        id: t.class.id,
        title: t.class.title,
        startsAt: t.class.startsAt,
        status: "ACTIVE",
      },
    }));
  }

  async requestRefund(userId: string, transactionId: string, body: { method: "BANK" | "EWALLET"; accountName: string; accountNumber: string }) {
    const tx = await this.prisma.transaction.findUnique({ where: { id: transactionId }, include: { class: { select: { title: true } } } });
    if (!tx || tx.userId !== userId) throw new NotFoundException("Transaksi tidak ditemukan.");
    if (tx.status !== "PAID" || tx.refundStatus !== "NOT_REQUESTED" || Number(tx.amount) <= 0) throw new ConflictException("Transaksi ini tidak memenuhi syarat pengajuan refund.");
    if (!(["BANK", "EWALLET"] as string[]).includes(body.method) || body.accountName?.trim().length < 2 || body.accountNumber?.trim().length < 5) throw new BadRequestException("Data rekening atau e-wallet belum valid.");
    const updated = await this.prisma.transaction.update({ where: { id: transactionId }, data: {
      refundStatus: "PENDING_REVIEW", refundMethod: body.method,
      refundAccountName: body.accountName.trim(), refundAccountNumber: body.accountNumber.trim(), refundRequestedAt: new Date(),
    } });
    return { id: updated.id, status: updated.status, refundStatus: updated.refundStatus };
  }

  async listPendingRefunds() {
    return this.prisma.transaction.findMany({
      where: { refundStatus: "PENDING_REVIEW", status: "PAID" },
      include: {
        class: { select: { id: true, title: true } },
        user: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { refundRequestedAt: "asc" },
    });
  }

  async reviewRefund(adminId: string, transactionId: string, decision: "APPROVE" | "REJECT", note?: string, proofUrl?: string) {
    const tx = await this.prisma.transaction.findUnique({ where: { id: transactionId }, include: { class: { select: { title: true } } } });
    if (!tx || tx.refundStatus !== "PENDING_REVIEW" || tx.status !== "PAID") throw new ConflictException("Refund tidak berada pada status tinjauan.");
    if (decision !== "APPROVE" && decision !== "REJECT") throw new BadRequestException("Keputusan review tidak valid.");
    if (decision === "APPROVE") {
      const filename = proofUrl?.startsWith("/uploads/private/") ? proofUrl.slice("/uploads/private/".length) : "";
      const upload = filename ? await this.prisma.privateUpload.findFirst({ where: { filename, ownerId: adminId, purpose: PrivateUploadPurpose.REFUND_PROOF }, select: { id: true } }) : null;
      if (!upload || basename(filename) !== filename || !existsSync(join(process.cwd(), "private-uploads", filename))) {
        throw new BadRequestException("Unggah bukti transfer refund yang valid sebelum menyetujui refund.");
      }
    }
    const saved = await this.prisma.$transaction(async (db) => {
      const result = await db.transaction.update({ where: { id: tx.id }, data: decision === "APPROVE"
        ? { status: "REFUNDED", refundStatus: "REFUNDED", refundedAt: new Date(), refundProofUrl: proofUrl }
        : { refundStatus: "REJECTED" } });
      return result;
    });
    await this.notifications.createNotification({
      userId: tx.userId,
      title: decision === "APPROVE" ? "Refund Disetujui" : "Pengajuan Refund Ditolak",
      message: `${decision === "APPROVE" ? `Refund kelas “${tx.class.title}” telah disetujui. Hak akses kelas sudah dihentikan.` : `Pengajuan refund kelas “${tx.class.title}” ditolak.`}${note?.trim() ? `\nCatatan admin: ${note.trim()}` : ""}`,
      type: "SYSTEM",
      linkUrl: "/dashboard/transaksi",
    }).catch((error: unknown) => this.logger.error(`Status refund tersimpan, tetapi notifikasi gagal dibuat: ${error instanceof Error ? error.message : String(error)}`));
    return { id: saved.id, status: saved.status, refundStatus: saved.refundStatus };
  }

  async handleMidtransWebhook(body: Record<string, unknown>) {
    const orderId = typeof body.order_id === "string" ? body.order_id : "";
    const statusCode = typeof body.status_code === "string" ? body.status_code : "";
    const grossAmount = typeof body.gross_amount === "string" ? body.gross_amount : "";
    const signature = typeof body.signature_key === "string" ? body.signature_key : "";
    const serverKey = this.config.get<string>("MIDTRANS_SERVER_KEY")?.trim();
    if (!serverKey || !orderId || !statusCode || !grossAmount || !signature) {
      throw new ForbiddenException("Webhook Midtrans tidak valid.");
    }

    const expected = createHash("sha512").update(`${orderId}${statusCode}${grossAmount}${serverKey}`).digest("hex");
    const providedBuffer = Buffer.from(signature.toLowerCase(), "utf8");
    const expectedBuffer = Buffer.from(expected, "utf8");
    if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
      throw new ForbiddenException("Tanda tangan webhook Midtrans tidak valid.");
    }

    const transaction = await this.prisma.transaction.findUnique({
      where: { orderId },
      include: { class: { select: { title: true, creatorId: true } }, user: { select: { fullName: true } } },
    });
    if (!transaction) throw new NotFoundException("Transaksi webhook tidak ditemukan.");
    if (Number(grossAmount) !== Number(transaction.amount)) {
      throw new ForbiddenException("Nominal webhook Midtrans tidak sesuai dengan transaksi.");
    }

    const midtransStatus = typeof body.transaction_status === "string" ? body.transaction_status : "";
    const fraudStatus = typeof body.fraud_status === "string" ? body.fraud_status : "";
    const reportedStatus = midtransStatus === "settlement" || (midtransStatus === "capture" && fraudStatus === "accept")
      ? TransactionStatus.PAID
      : midtransStatus === "expire" || midtransStatus === "cancel" || midtransStatus === "deny"
        ? TransactionStatus.CANCELLED
        : TransactionStatus.PENDING;
    const wasPaid = transaction.status === TransactionStatus.PAID;
    const nextStatus = wasPaid ? TransactionStatus.PAID : reportedStatus;
    const updated = await this.prisma.transaction.update({ where: { id: transaction.id }, data: { status: nextStatus } });

    if (!wasPaid && nextStatus === TransactionStatus.PAID) {
      await this.notifyPaymentSuccess(transaction.userId, transaction.user.fullName, transaction.class.creatorId, transaction.class.title);
    }
    return { received: true, status: updated.status };
  }

  private async notifyPaymentSuccess(userId: string, fullName: string, creatorId: string, classTitle: string) {
    await Promise.all([
      this.notifications.createNotification({
        userId,
        title: "Pembayaran Berhasil",
        message: `Pembayaran untuk kelas “${classTitle}” telah diterima. Anda sekarang memiliki akses penuh ke sesi kelas.`,
        type: "ENROLLMENT",
        linkUrl: "/dashboard/kelas-saya",
      }),
      this.notifications.createNotification({
        userId: creatorId,
        title: "Peserta Baru Membeli Kelas",
        message: `${fullName} telah membayar dan terdaftar di kelas “${classTitle}”.`,
        type: "ENROLLMENT",
        linkUrl: "/dashboard/tutor/peserta",
      }),
    ]);
  }
}
