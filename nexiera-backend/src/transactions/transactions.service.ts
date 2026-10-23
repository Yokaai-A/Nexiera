import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service.js";
import type { MidtransNotification } from "./dto/midtrans-notification.dto.js";
import { MidtransRefundRejectedError, MidtransService } from "./midtrans.service.js";

function toMinorUnits(value: string): bigint | null {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value);
  if (!match) return null;
  return BigInt(match[1]) * 100n + BigInt((match[2] || "").padEnd(2, "0"));
}

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly midtrans: MidtransService,
    private readonly config: ConfigService,
  ) {}

  async createCheckout(userId: string, classId: string) {
    const [user, classRecord] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, phoneNumber: true },
      }),
      this.prisma.class.findUnique({
        where: { id: classId },
        select: { id: true, tutorId: true, title: true, price: true, currency: true, startsAt: true, status: true },
      }),
    ]);
    if (!user) throw new NotFoundException("User not found");
    if (!classRecord) throw new NotFoundException("Class not found");
    if (classRecord.status !== "ACTIVE" || !classRecord.startsAt || classRecord.startsAt <= new Date()) {
      throw new ConflictException("This class is not available for enrollment");
    }
    if (classRecord.tutorId === userId) {
      throw new ForbiddenException("Tutors cannot enroll in their own class");
    }
    if (classRecord.currency !== "IDR") {
      throw new BadRequestException("Midtrans checkout currently supports IDR classes only");
    }

    const amount = classRecord.price.toNumber();
    if (!Number.isSafeInteger(amount) || amount < 0) {
      throw new BadRequestException("Class price must be a non-negative whole IDR amount");
    }

    const paidEnrollment = await this.prisma.transaction.findFirst({
      where: { userId, classId, status: "PAID" },
      select: { id: true },
    });
    if (paidEnrollment) throw new ConflictException("You already have access to this class");

    if (amount === 0) {
      try {
        const enrollment = await this.prisma.transaction.create({
          data: {
            userId,
            classId,
            amount: 0,
            currency: classRecord.currency,
            status: "PAID",
            paidAt: new Date(),
          },
          select: { id: true, status: true },
        });
        return { transactionId: enrollment.id, status: enrollment.status, redirectUrl: null };
      } catch (error) {
        const concurrentEnrollment = await this.prisma.transaction.findFirst({
          where: { userId, classId, status: "PAID" },
          select: { id: true, status: true },
        });
        if (concurrentEnrollment) {
          return {
            transactionId: concurrentEnrollment.id,
            status: concurrentEnrollment.status,
            redirectUrl: null,
          };
        }
        throw error;
      }
    }

    const serverKey = this.config.get<string>("MIDTRANS_SERVER_KEY");
    if (!serverKey || serverKey.trim() === "") {
      const enrollment = await this.prisma.transaction.create({
        data: {
          userId,
          classId,
          amount: classRecord.price,
          currency: classRecord.currency,
          status: "PAID",
          paidAt: new Date(),
        },
        select: { id: true, status: true },
      });
      return { transactionId: enrollment.id, status: enrollment.status, redirectUrl: null };
    }

    const existingPending = await this.findPendingCheckout(userId, classId);
    if (existingPending) {
      return this.checkoutResponse(existingPending);
    }

    let transaction: { id: string; midtransOrderId: string | null };
    try {
      transaction = await this.prisma.transaction.create({
        data: {
          userId,
          classId,
          midtransOrderId: `nexiera-${randomUUID()}`,
          amount: classRecord.price,
          currency: classRecord.currency,
        },
      });
    } catch (error) {
      const concurrentPending = await this.findPendingCheckout(userId, classId);
      if (concurrentPending) return this.checkoutResponse(concurrentPending);
      throw error;
    }

    try {
      if (!transaction.midtransOrderId) {
        throw new ConflictException("Payment transaction is missing its Midtrans order reference");
      }
      const checkout = await this.midtrans.createSnapCheckout({
        orderId: transaction.midtransOrderId,
        amount,
        classId: classRecord.id,
        classTitle: classRecord.title,
        customer: {
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
      });
      const updated = await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          midtransRedirectUrl: checkout.redirectUrl,
        },
      });
      return this.checkoutResponse(updated);
    } catch (error) {
      await this.prisma.transaction.deleteMany({
        where: { id: transaction.id, status: "PENDING" },
      }).catch(() => undefined);
      throw error;
    }
  }

  listMine(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        refundStatus: true,
        createdAt: true,
        paidAt: true,
        refundedAt: true,
        class: { select: { id: true, title: true, startsAt: true, status: true } },
      },
    });
  }

  private findPendingCheckout(userId: string, classId: string) {
    return this.prisma.transaction.findFirst({
      where: { userId, classId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        midtransOrderId: true,
        amount: true,
        currency: true,
        midtransRedirectUrl: true,
      },
    });
  }

  private checkoutResponse(transaction: {
    id: string;
    midtransOrderId: string | null;
    amount: { toFixed: (decimalPlaces: number) => string };
    currency: string;
    midtransRedirectUrl: string | null;
  }) {
    if (!transaction.midtransOrderId) {
      throw new ConflictException("Payment transaction is missing its Midtrans order reference");
    }
    if (!transaction.midtransRedirectUrl) {
      throw new ConflictException("Payment checkout is being prepared; try again shortly");
    }
    return {
      transactionId: transaction.id,
      orderId: transaction.midtransOrderId,
      amount: transaction.amount.toFixed(2),
      currency: transaction.currency,
      redirectUrl: transaction.midtransRedirectUrl,
    };
  }

  verifyNotificationSignature(notification: MidtransNotification): boolean {
    const serverKey = this.config.get<string>("MIDTRANS_SERVER_KEY");
    if (!serverKey || !/^[a-f\d]{128}$/i.test(notification.signature_key)) return false;

    const expected = createHash("sha512")
      .update(
        `${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`,
      )
      .digest();
    const received = Buffer.from(notification.signature_key, "hex");
    return received.length === expected.length && timingSafeEqual(received, expected);
  }

  async handleMidtransNotification(notification: MidtransNotification) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { midtransOrderId: notification.order_id },
      include: { class: true },
    });
    if (!transaction) return { received: true, matched: false };

    const expectedAmount = toMinorUnits(transaction.amount.toFixed(2));
    const notifiedAmount = toMinorUnits(notification.gross_amount);
    if (expectedAmount === null || notifiedAmount === null || expectedAmount !== notifiedAmount) {
      throw new BadRequestException("Webhook amount does not match the transaction");
    }

    // Webhook delivery may be retried or arrive out of order; a refund is terminal.
    if (transaction.status === "REFUNDED") {
      return { received: true, matched: true };
    }

    const status = notification.transaction_status.toLowerCase();
    const fraudStatus = notification.fraud_status?.toLowerCase();
    const paid = status === "settlement" || (status === "capture" && fraudStatus === "accept");

    if (paid) {
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "PAID",
          paidAt: transaction.paidAt || new Date(),
          midtransTransactionId: notification.transaction_id || undefined,
        },
      });

      if (transaction.class.status === "CANCELLED") {
        await this.requestFullRefund(transaction.id, "Class cancelled by tutor");
      }
    } else if (status === "refund") {
      if (notification.bank_confirmed_at) {
        await this.prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: "REFUNDED", refundStatus: "COMPLETED", refundedAt: new Date() },
        });
      } else {
        await this.prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            refundStatus: "PROCESSING",
            refundRequestedAt: transaction.refundRequestedAt || new Date(),
          },
        });
      }
    }

    return { received: true, matched: true };
  }

  async refundPaidTransactionsForClass(classId: string) {
    const paidTransactions = await this.prisma.transaction.findMany({
      where: { classId, status: "PAID", amount: { gt: 0 }, midtransOrderId: { not: null } },
      select: { id: true },
    });

    let requested = 0;
    let failed = 0;
    let manualRequired = 0;
    for (const transaction of paidTransactions) {
      const outcome = await this.requestFullRefund(transaction.id, "Class cancelled by tutor");
      if (outcome === "requested" || outcome === "already-processing") requested += 1;
      if (outcome === "failed") failed += 1;
      if (outcome === "manual-required") manualRequired += 1;
    }

    return { eligible: paidTransactions.length, requested, failed, manualRequired };
  }

  async completeManualRefund(transactionId: string, adminId: string, transferReference: string) {
    await this.assertAdmin(adminId);

    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      select: { id: true, status: true, refundStatus: true },
    });
    if (!transaction) throw new NotFoundException("Transaction not found");
    if (transaction.status !== "PAID" || transaction.refundStatus !== "MANUAL_REQUIRED") {
      throw new ConflictException("Transaction is not awaiting a manual refund");
    }

    const updated = await this.prisma.transaction.updateMany({
      where: {
        id: transactionId,
        status: "PAID",
        refundStatus: "MANUAL_REQUIRED",
      },
      data: {
        status: "REFUNDED",
        refundStatus: "COMPLETED",
        refundProviderReference: transferReference.trim(),
        refundFailureReason: null,
        refundedAt: new Date(),
      },
    });
    if (updated.count === 0) {
      throw new ConflictException("Manual refund was already reconciled");
    }

    return { transactionId, status: "REFUNDED", transferReference: transferReference.trim() };
  }

  async listManualRefunds(adminId: string) {
    await this.assertAdmin(adminId);
    return this.prisma.transaction.findMany({
      where: { status: "PAID", refundStatus: "MANUAL_REQUIRED" },
      orderBy: { refundRequestedAt: "asc" },
      select: {
        id: true,
        amount: true,
        currency: true,
        refundFailureReason: true,
        refundRequestedAt: true,
        user: { select: { name: true, phoneNumber: true } },
        class: { select: { title: true } },
      },
    });
  }

  private async assertAdmin(adminId: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true },
    });
    if (!admin || admin.role !== "ADMIN") {
      throw new ForbiddenException("Only an admin can access manual refunds");
    }
  }

  private async requestFullRefund(transactionId: string, reason: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });
    if (!transaction || transaction.status !== "PAID") return "skipped" as const;
    if (transaction.refundStatus === "PROCESSING" || transaction.refundStatus === "COMPLETED") {
      return "already-processing" as const;
    }

    const claim = await this.prisma.transaction.updateMany({
      where: {
        id: transactionId,
        status: "PAID",
        refundStatus: { in: ["NOT_REQUESTED", "FAILED", "MANUAL_REQUIRED"] },
      },
      data: {
        refundStatus: "PROCESSING",
        refundRequestedAt: new Date(),
        refundFailureReason: null,
      },
    });
    if (claim.count === 0) return "already-processing" as const;

    try {
      const serverKey = this.config.get<string>("MIDTRANS_SERVER_KEY");
      if (!serverKey || serverKey.trim() === "") {
        await this.prisma.transaction.update({
          where: { id: transactionId },
          data: {
            status: "REFUNDED",
            refundStatus: "COMPLETED",
            refundFailureReason: null,
            refundedAt: new Date(),
          },
        });
        return "completed" as const;
      }

      const referenceId = transaction.midtransTransactionId || transaction.midtransOrderId;
      if (!referenceId) {
        await this.prisma.transaction.update({
          where: { id: transactionId },
          data: {
            refundStatus: "MANUAL_REQUIRED",
            refundFailureReason: "Midtrans transaction reference is missing; complete a direct transfer refund.",
          },
        });
        return "manual-required" as const;
      }
      const result = await this.midtrans.requestFullRefund(
        referenceId,
        transaction.id,
        reason,
      );
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: {
          refundProviderReference: result.refund_key || result.transaction_id || null,
        },
      });
      return "requested" as const;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Refund request failed";
      const manualRequired = error instanceof MidtransRefundRejectedError && error.statusCode === "412";
      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: {
          refundStatus: manualRequired ? "MANUAL_REQUIRED" : "FAILED",
          refundFailureReason: message.slice(0, 2000),
        },
      });
      return manualRequired ? "manual-required" as const : "failed" as const;
    }
  }
}
