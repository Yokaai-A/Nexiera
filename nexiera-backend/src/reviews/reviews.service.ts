import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { NotificationsService } from "../notifications/notifications.service.js";

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async getReviewsForClass(classId: string) {
    const classItem = await this.prisma.class.findUnique({
      where: { id: classId },
      select: { id: true, title: true },
    });
    if (!classItem) {
      throw new NotFoundException("Kelas tidak ditemukan.");
    }

    const reviews = await this.prisma.review.findMany({
      where: { classId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            campus: true,
          },
        },
      },
    });

    const totalReviews = reviews.length;
    let sumRating = 0;
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const rev of reviews) {
      sumRating += rev.rating;
      if (distribution[rev.rating] !== undefined) {
        distribution[rev.rating]++;
      }
    }

    const averageRating = totalReviews > 0 ? Number((sumRating / totalReviews).toFixed(1)) : 0;

    return {
      averageRating,
      totalReviews,
      distribution,
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        reply: r.reply,
        createdAt: r.createdAt,
        user: {
          id: r.user.id,
          name: r.user.fullName,
          avatarUrl: r.user.avatarUrl,
          campus: r.user.campus,
        },
      })),
    };
  }

  async createReview(
    classId: string,
    userId: string,
    rating: number,
    comment?: string,
  ) {
    if (!rating || rating < 1 || rating > 5) {
      throw new BadRequestException("Rating harus bernilai antara 1 sampai 5.");
    }

    const classItem = await this.prisma.class.findUnique({
      where: { id: classId },
      select: { id: true, title: true, creatorId: true },
    });
    if (!classItem) {
      throw new NotFoundException("Kelas tidak ditemukan.");
    }


    const transaction = await this.prisma.transaction.findFirst({
      where: {
        classId,
        userId,
        status: "PAID",
      },
    });

    if (!transaction) {
      throw new ForbiddenException(
        "Anda harus terdaftar dan menyelesaikan pembayaran untuk memberikan ulasan pada kelas ini.",
      );
    }


    const existing = await this.prisma.review.findUnique({
      where: {
        userId_classId: { userId, classId },
      },
    });

    if (existing) {
      throw new ConflictException("Anda sudah memberikan ulasan untuk kelas ini.");
    }

    const review = await this.prisma.review.create({
      data: {
        classId,
        userId,
        rating,
        comment: comment?.trim() || null,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            campus: true,
          },
        },
      },
    });


    await this.notifications.createNotification({
      userId: classItem.creatorId,
      title: "Ulasan Baru Diterima",
      message: `Mahasiswa ${review.user.fullName} memberikan ulasan bintang ${rating} pada kelas "${classItem.title}".`,
      type: "REVIEW",
      linkUrl: `/dashboard/tutor/ulasan`,
    }).catch(() => null);

    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      reply: review.reply,
      createdAt: review.createdAt,
      user: {
        id: review.user.id,
        name: review.user.fullName,
        avatarUrl: review.user.avatarUrl,
        campus: review.user.campus,
      },
    };
  }

  async replyToReview(
    classId: string,
    reviewId: string,
    replyText: string,
    tutorUserId: string,
  ) {
    if (!replyText || replyText.trim().length < 2) {
      throw new BadRequestException("Balasan minimal 2 karakter.");
    }

    const classItem = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { tutors: true },
    });
    if (!classItem) {
      throw new NotFoundException("Kelas tidak ditemukan.");
    }

    const isCreator = classItem.creatorId === tutorUserId;
    const isBootcampTutor = classItem.tutors.some(
      (bt) => bt.userId === tutorUserId,
    );

    if (!isCreator && !isBootcampTutor) {
      throw new ForbiddenException(
        "Hanya tutor pengajar atau penyelenggara yang dapat membalas ulasan ini.",
      );
    }

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            campus: true,
          },
        },
      },
    });

    if (!review || review.classId !== classId) {
      throw new NotFoundException("Ulasan tidak ditemukan pada kelas ini.");
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: { reply: replyText.trim() },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            campus: true,
          },
        },
      },
    });


    await this.notifications
      .createNotification({
        userId: review.userId,
        title: "Tutor Membalas Ulasan Anda",
        message: `Tutor membalas ulasan Anda pada kelas "${classItem.title}".`,
        type: "REVIEW",
        linkUrl: `/detail-kelas/${classItem.slug || classItem.id}`,
      })
      .catch(() => null);

    return {
      id: updated.id,
      rating: updated.rating,
      comment: updated.comment,
      reply: updated.reply,
      createdAt: updated.createdAt,
      user: {
        id: updated.user.id,
        name: updated.user.fullName,
        avatarUrl: updated.user.avatarUrl,
        campus: updated.user.campus,
      },
    };
  }
}

