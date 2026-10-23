import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { TransactionsService } from "../transactions/transactions.service.js";
import { CreateClassReportDto } from "./dto/create-class-report.dto.js";
import { CreateClassDto } from "./dto/create-class.dto.js";
import { CreateReviewDto } from "./dto/create-review.dto.js";
import { ReviewReplyDto } from "./dto/review-reply.dto.js";
import { UpdateClassDto } from "./dto/update-class.dto.js";

@Injectable()
export class ClassesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactions: TransactionsService,
  ) {}

  async listActiveClasses() {
    const classes = await this.prisma.class.findMany({
      where: { status: "ACTIVE", startsAt: { gte: new Date() } },
      // Put the newest published class first so a freshly created class can be
      // featured in the catalog's free/paid slots.
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        currency: true,
        shortDescription: true,
        mainCategory: true,
        major: true,
        university: true,
        courseType: true,
        organizerName: true,
        organizerLogo: true,
        startsAt: true,
        accessDuration: true,
        maxQuota: true,
        requirements: true,
        facilities: true,
        meetingPlatform: true,
        tutor: { select: { id: true, name: true } },
      },
    });
    if (classes.length === 0) return [];

    const enrollments = await this.prisma.transaction.groupBy({
      by: ["classId"],
      where: { classId: { in: classes.map((classRecord) => classRecord.id) }, status: "PAID" },
      _count: { _all: true },
    });
    const enrolledByClass = new Map(enrollments.map((item) => [item.classId, item._count._all]));

    const catalog = classes.map((classRecord) => ({
      ...classRecord,
      availableSeats: classRecord.maxQuota === null
        ? null
        : Math.max(0, classRecord.maxQuota - (enrolledByClass.get(classRecord.id) || 0)),
    }));

    return catalog;
  }

  async getClassDetail(classId: string) {
    const classRecord = await this.prisma.class.findFirst({
      where: { id: classId, status: "ACTIVE" },
      select: {
        id: true,
        title: true,
        shortDescription: true,
        description: true,
        mainCategory: true,
        major: true,
        university: true,
        courseType: true,
        organizerName: true,
        organizerLogo: true,
        price: true,
        currency: true,
        startsAt: true,
        accessDuration: true,
        maxQuota: true,
        requirements: true,
        facilities: true,
        meetingPlatform: true,
        tutor: { select: { id: true, name: true } },
      },
    });
    if (!classRecord) throw new NotFoundException("Class not found");
    return classRecord;
  }

  async getManagedClass(classId: string, tutorId: string) {
    await this.assertTutor(tutorId);
    const classRecord = await this.prisma.class.findFirst({
      where: { id: classId, tutorId },
      select: {
        id: true, title: true, shortDescription: true, description: true,
        mainCategory: true, major: true, university: true, courseType: true,
        organizerName: true, organizerLogo: true, price: true, currency: true,
        status: true, startsAt: true, accessDuration: true, maxQuota: true,
        requirements: true, facilities: true, meetingPlatform: true, meetingUrl: true,
        materialPlatform: true, materialUrl: true, recordingUrl: true, driveUrl: true,
        cancellationReason: true, tutor: { select: { id: true, name: true } },
      },
    });
    if (!classRecord) throw new NotFoundException("Class not found");
    return classRecord;
  }

  async updateClass(classId: string, tutorId: string, body: UpdateClassDto) {
    await this.assertTutor(tutorId);
    const existing = await this.prisma.class.findFirst({
      where: { id: classId, tutorId, status: { not: "CANCELLED" } },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException("Class not found");
    const startsAt = body.startsAt ? new Date(body.startsAt) : undefined;
    if (startsAt && startsAt <= new Date()) {
      throw new BadRequestException("Class start time must be in the future");
    }
    return this.prisma.class.update({
      where: { id: classId },
      data: {
        title: body.title?.trim(),
        shortDescription: body.shortDescription?.trim(),
        description: body.description?.trim(),
        mainCategory: body.mainCategory?.trim(),
        major: body.major?.trim(),
        university: body.university?.trim(),
        courseType: body.courseType,
        organizerName: body.organizerName?.trim(),
        organizerLogo: body.organizerLogo,
        price: body.price,
        startsAt,
        accessDuration: body.accessDuration?.trim(),
        maxQuota: body.maxQuota,
        requirements: body.requirements,
        facilities: body.facilities,
        meetingPlatform: body.meetingPlatform,
        meetingUrl: body.meetingUrl,
        materialPlatform: body.materialPlatform,
        materialUrl: body.materialUrl,
        recordingUrl: body.recordingUrl,
        driveUrl: body.driveUrl,
      },
      select: {
        id: true, title: true, shortDescription: true, description: true,
        mainCategory: true, major: true, university: true, courseType: true,
        organizerName: true, organizerLogo: true, price: true, currency: true,
        status: true, startsAt: true, accessDuration: true, maxQuota: true,
        requirements: true, facilities: true, meetingPlatform: true, meetingUrl: true,
        materialPlatform: true, materialUrl: true, recordingUrl: true, driveUrl: true,
        cancellationReason: true, tutor: { select: { id: true, name: true } },
      },
    });
  }

  async listMyClasses(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!user) throw new NotFoundException("User not found");

    if (user.role === "TUTOR") {
      return this.prisma.class.findMany({
        where: { tutorId: userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          shortDescription: true,
          description: true,
          mainCategory: true,
          major: true,
          university: true,
          courseType: true,
          organizerName: true,
          organizerLogo: true,
          price: true,
          currency: true,
          status: true,
          startsAt: true,
          maxQuota: true,
          tutor: { select: { id: true, name: true } },
          _count: { select: { transactions: true } },
        },
      });
    }

    const enrollments = await this.prisma.transaction.findMany({
      where: { userId, status: "PAID" },
      orderBy: { paidAt: "desc" },
      select: {
        id: true,
        status: true,
        paidAt: true,
        class: {
          select: {
            id: true,
            title: true,
            shortDescription: true,
            description: true,
            mainCategory: true,
            major: true,
            university: true,
            courseType: true,
            organizerName: true,
            organizerLogo: true,
            price: true,
            currency: true,
            status: true,
            startsAt: true,
            maxQuota: true,
            meetingPlatform: true,
            meetingUrl: true,
            materialPlatform: true,
            materialUrl: true,
            recordingUrl: true,
            driveUrl: true,
            tutor: { select: { id: true, name: true, email: true, phoneNumber: true } },
          },
        },
      },
    });
    return enrollments.map(({ id, status, paidAt, class: classRecord }) => ({
      ...classRecord,
      meetingUrl: classRecord.status === "CANCELLED" ? null : classRecord.meetingUrl,
      enrollmentId: id,
      paymentStatus: status,
      paidAt,
    }));
  }

  async listTutorParticipants(tutorId: string) {
    await this.assertTutor(tutorId);
    const transactions = await this.prisma.transaction.findMany({
      where: { class: { tutorId }, status: { in: ["PAID", "REFUNDED"] } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        refundStatus: true,
        paidAt: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true, phoneNumber: true } },
        class: { select: { id: true, title: true } },
      },
    });
    if (transactions.length === 0) return [];

    const presences = await this.prisma.presence.findMany({
      where: {
        classId: { in: [...new Set(transactions.map((item) => item.class.id))] },
        userId: { in: [...new Set(transactions.map((item) => item.user.id))] },
      },
      select: { classId: true, userId: true, status: true, markedAt: true },
    });
    const presenceByEnrollment = new Map(
      presences.map((presence) => [`${presence.classId}:${presence.userId}`, presence]),
    );
    return transactions.map((transaction) => ({
      ...transaction,
      presence: presenceByEnrollment.get(`${transaction.class.id}:${transaction.user.id}`) || null,
    }));
  }

  async getReviews(classId: string) {
    const classExists = await this.prisma.class.findUnique({ where: { id: classId }, select: { id: true } });
    if (!classExists) throw new NotFoundException("Class not found");
    return this.prisma.classReview.findMany({
      where: { classId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        comment: true,
        reply: true,
        createdAt: true,
        user: { select: { id: true, name: true, university: true, major: true } },
      },
    });
  }

  async createReview(classId: string, userId: string, body: CreateReviewDto) {
    const enrollment = await this.prisma.transaction.findFirst({
      where: { classId, userId, status: "PAID", class: { status: "ACTIVE" } },
      select: { id: true },
    });
    if (!enrollment) {
      throw new ForbiddenException("Only enrolled students can review this class");
    }
    return this.prisma.classReview.upsert({
      where: { userId_classId: { userId, classId } },
      create: {
        userId,
        classId,
        rating: body.rating,
        comment: body.comment.trim(),
      },
      update: { rating: body.rating, comment: body.comment.trim() },
      select: {
        id: true,
        rating: true,
        comment: true,
        reply: true,
        createdAt: true,
        user: { select: { id: true, name: true, university: true, major: true } },
      },
    });
  }

  async replyToReview(classId: string, reviewId: string, tutorId: string, body: ReviewReplyDto) {
    await this.assertTutor(tutorId);
    const review = await this.prisma.classReview.findFirst({
      where: { id: reviewId, classId, class: { tutorId } },
      select: { id: true },
    });
    if (!review) throw new NotFoundException("Review not found for this tutor's class");
    return this.prisma.classReview.update({
      where: { id: review.id },
      data: { reply: body.reply.trim() },
      select: { id: true, reply: true, updatedAt: true },
    });
  }

  async createReport(reporterId: string, body: CreateClassReportDto) {
    let classId: string | null = null;
    if (body.targetType === "CLASS") {
      const enrollment = await this.prisma.transaction.findFirst({
        where: { userId: reporterId, classId: body.targetId, status: "PAID" },
        select: { id: true },
      });
      if (!enrollment) {
        throw new ForbiddenException("Only enrolled students can report this class");
      }
      classId = body.targetId;
    }

    return this.prisma.classReport.create({
      data: {
        reporterId,
        targetType: body.targetType,
        targetId: body.targetId,
        classId,
        category: body.category,
        description: body.description.trim(),
      },
      select: { id: true, status: true, createdAt: true },
    });
  }

  async createDraft(tutorId: string, body: CreateClassDto) {
    return this.createClass(tutorId, body, "DRAFT");
  }

  async createPublishedClass(tutorId: string, body: CreateClassDto) {
    if (!body.meetingUrl?.trim()) {
      throw new BadRequestException("Add a class meeting link before publishing");
    }
    return this.createClass(tutorId, body, "ACTIVE");
  }

  private async createClass(tutorId: string, body: CreateClassDto, status: "DRAFT" | "ACTIVE") {
    const tutor = await this.prisma.user.findUnique({
      where: { id: tutorId },
      select: { role: true, name: true, organizationName: true, organizationLogoUrl: true },
    });
    if (!tutor || tutor.role !== "TUTOR") {
      throw new ForbiddenException("Only tutors can create classes");
    }

    const startsAt = new Date(body.startsAt);
    if (startsAt <= new Date()) {
      throw new BadRequestException("Class start time must be in the future");
    }

    return this.prisma.class.create({
      data: {
        tutorId,
        title: body.title.trim(),
        shortDescription: body.shortDescription?.trim() || null,
        description: body.description.trim(),
        mainCategory: body.mainCategory?.trim() || null,
        major: body.major?.trim() || null,
        university: body.university?.trim() || null,
        courseType: body.courseType,
        organizerName: body.organizerName?.trim() || tutor.organizationName || tutor.name,
        organizerLogo: body.organizerLogo || tutor.organizationLogoUrl,
        price: body.price,
        currency: "IDR",
        startsAt,
        accessDuration: body.accessDuration?.trim() || null,
        maxQuota: body.maxQuota,
        requirements: body.requirements,
        facilities: body.facilities,
        meetingPlatform: body.meetingPlatform,
        meetingUrl: body.meetingUrl?.trim() || null,
        materialPlatform: body.materialPlatform,
        materialUrl: body.materialUrl?.trim() || null,
        recordingUrl: body.recordingUrl?.trim() || null,
        driveUrl: body.driveUrl?.trim() || null,
        status,
      },
      select: {
        id: true,
        title: true,
        description: true,
        shortDescription: true,
        mainCategory: true,
        major: true,
        university: true,
        courseType: true,
        organizerName: true,
        organizerLogo: true,
        price: true,
        currency: true,
        startsAt: true,
        accessDuration: true,
        maxQuota: true,
        requirements: true,
        facilities: true,
        meetingPlatform: true,
        status: true,
        tutor: { select: { id: true, name: true } },
      },
    });
  }

  async publishClass(classId: string, tutorId: string) {
    await this.assertTutor(tutorId);
    const classRecord = await this.prisma.class.findUnique({
      where: { id: classId },
      select: { id: true, tutorId: true, status: true, startsAt: true, meetingUrl: true },
    });
    if (!classRecord) throw new NotFoundException("Class not found");
    if (classRecord.tutorId !== tutorId) {
      throw new ForbiddenException("Only the class tutor can publish it");
    }
    if (classRecord.status !== "DRAFT") {
      throw new ConflictException("Only draft classes can be published");
    }
    if (!classRecord.startsAt || classRecord.startsAt <= new Date()) {
      throw new BadRequestException("Set a future class start time before publishing");
    }
    if (!classRecord.meetingUrl) {
      throw new BadRequestException("Add a class meeting link before publishing");
    }

    const published = await this.prisma.class.updateMany({
      where: { id: classId, tutorId, status: "DRAFT" },
      data: { status: "ACTIVE" },
    });
    if (published.count === 0) {
      throw new ConflictException("Class status changed before it could be published");
    }

    return this.prisma.class.findUnique({
      where: { id: classId },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        currency: true,
        startsAt: true,
        status: true,
      },
    });
  }

  async getMeetingLinks(classId: string, userId: string) {
    const paidTransaction = await this.prisma.transaction.findFirst({
      where: {
        classId,
        userId,
        status: "PAID",
        class: { status: "ACTIVE" },
      },
      select: {
        class: {
          select: {
            id: true,
            title: true,
            startsAt: true,
            meetingUrl: true,
            driveUrl: true,
            materialUrl: true,
            recordingUrl: true,
          },
        },
      },
    });

    if (!paidTransaction) {
      throw new ForbiddenException("Meeting links are available to paid students only");
    }

    return paidTransaction.class;
  }

  async cancelClass(classId: string, tutorId: string, reason: string) {
    await this.assertTutor(tutorId);
    const result = await this.prisma.class.updateMany({
      where: { id: classId, tutorId, status: "ACTIVE" },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancellationReason: reason.trim(),
      },
    });

    if (result.count === 0) {
      const exists = await this.prisma.class.findUnique({ where: { id: classId }, select: { id: true } });
      if (!exists) throw new NotFoundException("Class not found");
      throw new ForbiddenException("Only the class tutor can cancel an active class");
    }

    const refunds = await this.transactions.refundPaidTransactionsForClass(classId);
    return {
      classId,
      status: "CANCELLED",
      refundPolicy: "Full paid amount requested through Midtrans, with manual transfer follow-up when required",
      cancellationReason: reason.trim(),
      refunds,
    };
  }

  private async assertTutor(tutorId: string) {
    const tutor = await this.prisma.user.findUnique({
      where: { id: tutorId },
      select: { role: true },
    });
    if (!tutor || tutor.role !== "TUTOR") {
      throw new ForbiddenException("Only tutors can manage classes");
    }
  }
}
