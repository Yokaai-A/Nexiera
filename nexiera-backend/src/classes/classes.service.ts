import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { basename, extname, join } from "node:path";
import { existsSync } from "node:fs";
import { ClassType, PrivateUploadPurpose, Role } from "../generated/prisma/client.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateClassDto } from "./dto/create-class.dto.js";
import { UpdateClassDto } from "./dto/update-class.dto.js";
import { CreateClassReportDto } from "./dto/create-class-report.dto.js";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

@Injectable()
export class ClassesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  private mapClassRecord(cls: any) {
    const reviews = cls.reviews || [];
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? Number(
            (
              reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
              totalReviews
            ).toFixed(1),
          )
        : 0;

    const studentCount = cls.transactions
      ? cls.transactions.filter((t: any) => t.status === "PAID").length
      : 0;
    const reservedSeatCount = cls.transactions
      ? cls.transactions.filter((t: any) => t.status === "PAID" || t.status === "PENDING").length
      : studentCount;

    return {
      id: cls.id,
      title: cls.title,
      slug: cls.slug,
      description: cls.description,
      shortDescription: cls.shortDescription || cls.description.slice(0, 150) + "...",
      type: cls.type,
      courseType: cls.type,
      price: String(cls.price),
      currency: "IDR",
      category: cls.category,
      mainCategory: cls.category,
      major: cls.major,
      campusTarget: cls.campusTarget,
      university: cls.campusTarget,
      organizerName: cls.type === ClassType.BOOTCAMP
        ? cls.creator?.organizationName || cls.creator?.fullName
        : undefined,
      organizerLogo: cls.type === ClassType.BOOTCAMP
        ? cls.creator?.organizationLogoUrl || cls.creator?.avatarUrl
        : undefined,
      bannerUrl: cls.bannerUrl,
      startsAt: cls.startsAt,
      accessDuration: cls.accessDuration,
      accessUntil: cls.accessUntil,
      maxQuota: cls.maxQuota,
      availableSeats: cls.maxQuota == null ? null : Math.max(0, cls.maxQuota - reservedSeatCount),
      meetingLink: cls.accessUntil && cls.accessUntil < new Date() ? null : cls.meetingLink,
      meetingUrl: cls.accessUntil && cls.accessUntil < new Date() ? null : cls.meetingLink,
      meetingPlatform: cls.meetingPlatform,
      materialLink: cls.accessUntil && cls.accessUntil < new Date() ? null : cls.materialLink,
      materialUrl: cls.accessUntil && cls.accessUntil < new Date() ? null : cls.materialLink,
      materialPlatform: cls.materialPlatform,
      recordingLink: cls.accessUntil && cls.accessUntil < new Date() ? null : cls.recordingLink,
      recordingUrl: cls.accessUntil && cls.accessUntil < new Date() ? null : cls.recordingLink,
      requirements: cls.requirements || [],
      facilities: cls.facilities || [],
      status: cls.reviewStatus === "PENDING_REVIEW" || cls.reviewStatus === "REJECTED" ? cls.reviewStatus : "ACTIVE",
      reviewStatus: cls.reviewStatus || "APPROVED",
      reviewNote: cls.reviewNote || null,
      reviewedById: cls.reviewedById || null,
      reviewedAt: cls.reviewedAt || null,
      createdAt: cls.createdAt,
      updatedAt: cls.updatedAt,
      creator: cls.creator
        ? {
            id: cls.creator.id,
            name: cls.creator.fullName,
            fullName: cls.creator.fullName,
            email: cls.creator.contactEmail || cls.creator.email,
            phoneNumber: cls.creator.phoneNumber,
            campus: cls.creator.campus,
            university: cls.creator.campus,
            major: cls.creator.major,
            avatarUrl: cls.creator.avatarUrl,
            bio: cls.creator.bio,
            headline: cls.creator.headline,
          }
        : undefined,
      tutor: cls.creator
        ? {
            id: cls.creator.id,
            name: cls.creator.fullName,
            email: cls.creator.contactEmail || cls.creator.email,
            phoneNumber: cls.creator.phoneNumber,
            campus: cls.creator.campus,
            university: cls.creator.campus,
            major: cls.creator.major,
            avatarUrl: cls.creator.avatarUrl,
            bio: cls.creator.bio,
            headline: cls.creator.headline,
          }
        : undefined,
      tutors: cls.tutors || [],
      studentCount,
      totalReviews,
      averageRating: avgRating,
      rating: avgRating,
    };
  }

  async listActiveClasses() {
    const classes = await this.prisma.class.findMany({
      where: { reviewStatus: "APPROVED" },
      orderBy: { createdAt: "desc" },
      include: {
        creator: true,
        tutors: true,
        reviews: true,
        transactions: true,
      },
    });

    return classes.map((c) => this.mapClassRecord(c));
  }

  async getClassDetail(idOrSlug: string, viewerId?: string) {
    const cls = await this.prisma.class.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        creator: true,
        tutors: true,
        reviews: {
          include: {
            user: true,
          },
        },
        transactions: true,
      },
    });

    if (!cls) {
      throw new NotFoundException("Kelas tidak ditemukan.");
    }
    if (cls.reviewStatus !== "APPROVED" && cls.creatorId !== viewerId) {
      throw new NotFoundException("Kelas tidak ditemukan.");
    }

    return this.mapClassRecord(cls);
  }

  findPendingReviews() {
    return this.prisma.class.findMany({
      where: { reviewStatus: "PENDING_REVIEW" },
      include: { creator: true, tutors: true, reviews: true, transactions: true },
      orderBy: { createdAt: "asc" },
    }).then((classes) => classes.map((item) => this.mapClassRecord(item)));
  }

  async reviewClass(adminId: string, classId: string, decision: "APPROVE" | "REJECT", note?: string) {
    if (decision === "REJECT" && !note?.trim()) {
      throw new BadRequestException("Berikan catatan perbaikan saat menolak kelas.");
    }
    const item = await this.prisma.class.findUnique({ where: { id: classId }, select: { id: true, creatorId: true, title: true, reviewStatus: true } });
    if (!item) throw new NotFoundException("Pengajuan kelas tidak ditemukan.");
    if (item.reviewStatus !== "PENDING_REVIEW") throw new ConflictException("Pengajuan kelas ini sudah ditinjau.");

    const reviewStatus = decision === "APPROVE" ? "APPROVED" : "REJECTED";
    const updated = await this.prisma.class.updateMany({
      where: { id: classId, reviewStatus: "PENDING_REVIEW" },
      data: { reviewStatus, reviewNote: note?.trim() || null, reviewedById: adminId, reviewedAt: new Date() },
    });
    if (updated.count === 0) throw new ConflictException("Pengajuan kelas ini sudah ditinjau.");

    await this.notifications.createNotification({
      userId: item.creatorId,
      title: decision === "APPROVE" ? "Kelas Disetujui" : "Kelas Perlu Diperbaiki",
      message: decision === "APPROVE"
        ? `Kelas "${item.title}" telah disetujui dan sekarang tampil di katalog.`
        : `Kelas "${item.title}" belum disetujui.${note?.trim() ? ` Catatan admin: ${note.trim()}` : " Silakan periksa kembali detail kelas dan kirim ulang untuk ditinjau."}`,
      type: "SYSTEM",
      linkUrl: "/dashboard/tutor/kelas",
    }).catch(() => null);

    const reviewedClass = await this.prisma.class.findUnique({
      where: { id: classId }, include: { creator: true, tutors: true, reviews: true, transactions: true },
    });
    if (!reviewedClass) throw new NotFoundException("Pengajuan kelas tidak ditemukan.");
    return this.mapClassRecord(reviewedClass);
  }

  async createClass(creatorId: string, body: CreateClassDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: creatorId },
    });
    if (!user) throw new NotFoundException("Pengguna tidak ditemukan");

    let registeredRoles: string[] = [];
    if (Array.isArray(user.roles)) {
      registeredRoles = user.roles as string[];
    } else if (typeof user.roles === "string") {
      try {
        registeredRoles = JSON.parse(user.roles) as string[];
      } catch {
        registeredRoles = [];
      }
    }
    if (
      (user.activeRole !== Role.PEER_TUTOR && user.activeRole !== Role.MITRA_BOOTCAMP) ||
      !registeredRoles.includes(user.activeRole)
    ) {
      throw new ForbiddenException("Aktifkan peran Peer-Tutor atau Mitra Bootcamp sebelum membuat kelas.");
    }

    const baseSlug = slugify(body.title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await this.prisma.class.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const classType =
      body.type ||
      (body.courseType === "BOOTCAMP"
        ? ClassType.BOOTCAMP
        : ClassType.PEER_TUTORING);
    const expectedClassType = user.activeRole === Role.MITRA_BOOTCAMP
      ? ClassType.BOOTCAMP
      : ClassType.PEER_TUTORING;
    if (classType !== expectedClassType) {
      throw new ForbiddenException("Jenis kelas tidak sesuai dengan peran aktif akun Anda.");
    }
    if (classType === ClassType.PEER_TUTORING && !["A", "A_MINUS", "B_PLUS"].includes(body.tutorGrade || "")) {
      throw new BadRequestException("Pilih nilai mata kuliah yang pernah Anda peroleh (A, A-, atau B+).");
    }

    const category = (body.category || body.mainCategory || "").trim();
    const major = body.major?.trim() || "";
    const campusTarget = (body.campusTarget || body.university || "").trim();
    if (!body.title.trim() || !category || !major || !campusTarget) {
      throw new BadRequestException("Nama mata kuliah, kategori, jurusan, dan kampus wajib diisi.");
    }
    const accessUntil = new Date(body.accessUntil);
    if (!Number.isFinite(accessUntil.getTime()) || accessUntil <= new Date()) {
      throw new BadRequestException("Tanggal akhir akses harus berada di masa mendatang.");
    }
    const startsAt = body.startsAt ? new Date(body.startsAt) : null;
    if (!startsAt || !Number.isFinite(startsAt.getTime()) || startsAt <= new Date() || accessUntil <= startsAt) {
      throw new BadRequestException("Jadwal kelas harus berada di masa mendatang dan sebelum tanggal akhir akses.");
    }
    if (!Number.isFinite(Number(body.price)) || Number(body.price) < 0) {
      throw new BadRequestException("Biaya kelas harus bernilai nol atau lebih.");
    }
    const bannerFilename = body.bannerUrl.startsWith("/uploads/") ? body.bannerUrl.slice("/uploads/".length) : "";
    const bannerPath = join(process.cwd(), "uploads", bannerFilename);
    if (!bannerFilename || basename(bannerFilename) !== bannerFilename || ![".png", ".jpg", ".jpeg", ".webp"].includes(extname(bannerFilename).toLowerCase()) || !existsSync(bannerPath)) {
      throw new BadRequestException("Banner kelas harus berupa gambar yang berhasil diunggah (PNG, JPEG, atau WebP).");
    }
    const meetingLink = body.meetingLink || body.meetingUrl || null;
    const materialLink = body.materialLink || body.materialUrl || null;
    const recordingLink = body.recordingLink || body.recordingUrl || null;

    const newClass = await this.prisma.class.create({
      data: {
        title: body.title.trim(),
        slug: finalSlug,
        description: body.description.trim(),
        shortDescription: body.shortDescription?.trim() || null,
        type: classType,
        tutorGrade: classType === ClassType.PEER_TUTORING ? body.tutorGrade : null,
        price: body.price || 0,
        category,
        major,
        campusTarget,
        bannerUrl: body.bannerUrl || null,
        startsAt,
        accessDuration: body.accessDuration?.trim() || null,
        accessUntil,
        maxQuota: body.maxQuota ?? null,
        meetingPlatform: body.meetingPlatform?.trim() || null,
        meetingLink,
        materialPlatform: body.materialPlatform?.trim() || null,
        materialLink,
        recordingLink,
        requirements: body.requirements ?? [],
        facilities: body.facilities ?? [],
        reviewStatus: "PENDING_REVIEW",
        reviewNote: null,
        reviewedById: null,
        reviewedAt: null,
        creatorId,
      },
    });




    if (classType === ClassType.BOOTCAMP) {
      if (body.tutors && body.tutors.length > 0) {
        for (const t of body.tutors) {
          await this.prisma.bootcampTutor.create({
            data: {
              classId: newClass.id,
              name: t.name,
              roleTitle: t.roleTitle || "Lead Mentor",
              avatarUrl: t.avatarUrl || null,
              headline: t.headline || null,
              linkedinUrl: t.linkedinUrl || null,
            },
          });
        }
      } else {

        await this.prisma.bootcampTutor.create({
          data: {
            classId: newClass.id,
            userId: user.id,
            name: user.fullName,
            roleTitle: "Lead Mentor / Pengajar Utama",
            avatarUrl: user.avatarUrl || null,
            headline: user.headline || user.campus || "Lead Instructor",
          },
        });
      }
    }

    return this.getClassDetail(newClass.id, creatorId);
  }

  async updateClass(classId: string, userId: string, body: UpdateClassDto) {
    const existing = await this.prisma.class.findUnique({
      where: { id: classId },
    });
    if (!existing) throw new NotFoundException("Kelas tidak ditemukan");
    if (existing.creatorId !== userId) {
      throw new ForbiddenException("Hanya pembuat kelas yang dapat mengubah detail kelas.");
    }
    const resubmittingForReview = existing.reviewStatus !== "APPROVED";

    const meetingLink = body.meetingLink || body.meetingUrl || undefined;
    const materialLink = body.materialLink || body.materialUrl || undefined;
    const recordingLink = body.recordingLink || body.recordingUrl || undefined;
    const category = body.category || body.mainCategory || undefined;
    const campusTarget = body.campusTarget || body.university || undefined;

    const updated = await this.prisma.class.update({
      where: { id: classId },
      data: {
        title: body.title?.trim() || undefined,
        tutorGrade: body.tutorGrade,
        description: body.description?.trim() || undefined,
        shortDescription: body.shortDescription?.trim() || undefined,
        category,
        major: body.major?.trim() || undefined,
        campusTarget: campusTarget?.trim() || undefined,
        bannerUrl: body.bannerUrl || undefined,
        startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
        accessDuration: body.accessDuration?.trim() || undefined,
        accessUntil: body.accessUntil ? new Date(body.accessUntil) : undefined,
        maxQuota: body.maxQuota,
        price: body.price !== undefined ? body.price : undefined,
        meetingLink,
        meetingPlatform: body.meetingPlatform?.trim() || undefined,
        materialLink,
        materialPlatform: body.materialPlatform?.trim() || undefined,
        recordingLink,
        requirements: body.requirements,
        facilities: body.facilities,
        reviewStatus: resubmittingForReview ? "PENDING_REVIEW" : undefined,
        reviewNote: resubmittingForReview ? null : undefined,
        reviewedById: resubmittingForReview ? null : undefined,
        reviewedAt: resubmittingForReview ? null : undefined,
      },
    });


    if (meetingLink && meetingLink !== existing.meetingLink) {
      const paidTransactions = await this.prisma.transaction.findMany({
        where: { classId, status: "PAID" },
        select: { userId: true },
      });

      for (const t of paidTransactions) {
        await this.notifications.createNotification({
          userId: t.userId,
          title: "Pembaruan Tautan Sesi Kelas",
          message: `Tautan pertemuan untuk kelas "${updated.title}" telah diperbarui. Cek jadwal bimbingan Anda.`,
          type: "ZOOM_UPDATE",
          linkUrl: `/dashboard/jadwal`,
        }).catch(() => null);
      }
    }

    return this.getClassDetail(updated.id, userId);
  }

  async listMyClasses(userId: string) {

    const createdClasses = await this.prisma.class.findMany({
      where: { creatorId: userId },
      include: {
        creator: true,
        tutors: true,
        reviews: true,
        transactions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const enrolledTransactions = await this.prisma.transaction.findMany({
      where: { userId, status: "PAID" },
      include: {
        class: {
          include: {
            creator: true,
            tutors: true,
            reviews: true,
            transactions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const enrolledMap = new Map();
    for (const tx of enrolledTransactions) {
      if (!enrolledMap.has(tx.class.id)) {
        enrolledMap.set(tx.class.id, {
          ...this.mapClassRecord(tx.class),
          paymentStatus: "PAID",
          paidAt: tx.createdAt,
        });
      }
    }

    return {
      created: createdClasses.map((c) => this.mapClassRecord(c)),
      enrolled: Array.from(enrolledMap.values()),
    };
  }

  async getMeetingLinks(classId: string, userId: string) {
    const cls = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { creator: true },
    });
    if (!cls) throw new NotFoundException("Kelas tidak ditemukan");

    const isCreator = cls.creatorId === userId;
    if (!isCreator && cls.accessUntil && cls.accessUntil < new Date()) {
      throw new ForbiddenException("Masa akses pembelajaran untuk kelas ini sudah berakhir.");
    }
    const isEnrolled = await this.prisma.transaction.findFirst({
      where: { classId, userId, status: "PAID" },
    });

    if (!isCreator && !isEnrolled) {
      throw new ForbiddenException(
        "Akses ditolak. Anda belum terdaftar pada kelas ini.",
      );
    }

    return {
      meetingLink: cls.meetingLink,
      meetingUrl: cls.meetingLink,
      materialLink: cls.materialLink,
      materialUrl: cls.materialLink,
      recordingLink: cls.recordingLink,
      recordingUrl: cls.recordingLink,
      creator: {
        fullName: cls.creator.fullName,
        email: cls.creator.contactEmail || cls.creator.email,
        phoneNumber: cls.creator.phoneNumber,
      },
    };
  }

  async createReport(userId: string, input: CreateClassReportDto) {
    const classId = input.targetType === "CLASS" ? input.targetId : (input.classId || null);
    if (classId && !(await this.prisma.class.findUnique({ where: { id: classId }, select: { id: true } }))) {
      throw new NotFoundException("Kelas yang dilaporkan tidak ditemukan.");
    }
    if (input.evidenceUrl) {
      const filename = input.evidenceUrl.startsWith("/uploads/private/") ? input.evidenceUrl.slice("/uploads/private/".length) : "";
      const upload = filename ? await this.prisma.privateUpload.findFirst({ where: { filename, ownerId: userId, purpose: PrivateUploadPurpose.REPORT_EVIDENCE }, select: { id: true } }) : null;
      if (!upload) throw new BadRequestException("Bukti laporan harus diunggah melalui formulir laporan ini.");
    }
    return this.prisma.classReport.create({
      data: { reporterId: userId, targetType: input.targetType, targetId: input.targetId,
        classId, category: input.category, description: input.description.trim(), evidenceUrl: input.evidenceUrl || null },
      select: { id: true, targetType: true, targetId: true, category: true, description: true, evidenceUrl: true, status: true, createdAt: true },
    });
  }

  async listMyReports(userId: string) {
    return this.prisma.classReport.findMany({
      where: { reporterId: userId }, orderBy: { createdAt: "desc" },
        select: { id: true, targetType: true, targetId: true, classId: true, category: true, description: true, evidenceUrl: true, status: true, adminNote: true, createdAt: true, updatedAt: true },
    });
  }

  listAdminReports() {
    return this.prisma.classReport.findMany({ include: { reporter: { select: { id: true, fullName: true, email: true } }, class: { select: { id: true, title: true } } }, orderBy: { createdAt: "asc" } });
  }

  async requestCourse(userId: string, input: { title: string; campus?: string; major?: string; courseCode?: string; note?: string }) {
    const title = input.title?.trim();
    if (!title || title.length > 160) throw new BadRequestException("Nama mata kuliah wajib diisi (maksimal 160 karakter).");
    const pending = await this.prisma.courseRequest.findFirst({ where: { userId, title: { equals: title }, status: "PENDING" } });
    if (pending) return pending;
    return this.prisma.courseRequest.create({ data: { userId, title, campus: input.campus?.trim() || null, major: input.major?.trim() || null, courseCode: input.courseCode?.trim() || null, note: input.note?.trim() || null } });
  }

  listCourseRequests() {
    return this.prisma.courseRequest.findMany({ where: { status: "PENDING" }, include: { user: { select: { fullName: true, email: true } } }, orderBy: { createdAt: "asc" } });
  }

  async updateReportStatus(adminId: string, reportId: string, status: "UNDER_REVIEW" | "RESOLVED" | "DISMISSED", note?: string) {
    void adminId;
    if (!["UNDER_REVIEW", "RESOLVED", "REJECTED"].includes(status)) throw new BadRequestException("Status laporan tidak valid.");
    const report = await this.prisma.classReport.findUnique({ where: { id: reportId } });
    if (!report) throw new NotFoundException("Laporan tidak ditemukan.");
      const adminNote = note?.trim() || null;
      const updated = await this.prisma.classReport.update({ where: { id: reportId }, data: { status, adminNote } });
      await this.notifications.createNotification({ userId: report.reporterId, title: "Status Laporan Diperbarui", message: `Status laporan Anda: ${status === "UNDER_REVIEW" ? "Sedang Ditinjau" : status === "RESOLVED" ? "Selesai" : "Ditutup"}.${adminNote ? `\nCatatan admin: ${adminNote}` : ""}`, type: "SYSTEM", linkUrl: "/dashboard/kelas-saya" });
    return updated;
  }

  async listTutorParticipants(userId: string) {
    const myClasses = await this.prisma.class.findMany({
      where: { creatorId: userId },
      select: {
        id: true,
        title: true,
        type: true,
        category: true,
        campusTarget: true,
        price: true,
      },
    });
    const classIds = myClasses.map((c) => c.id);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        classId: { in: classIds },
        status: "PAID",
      },
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
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return transactions.map((t) => ({
      id: t.id,
      status: t.status,
      paidAt: t.createdAt,
      createdAt: t.createdAt,
      user: {
        id: t.user.id,
        name: t.user.fullName,
        email: t.user.email,
        phoneNumber: t.user.phoneNumber,
      },
      class: {
        id: t.class.id,
        title: t.class.title,
      },
    }));
  }

  async cancelClass(classId: string, userId: string, reason?: string) {
    const cls = await this.prisma.class.findUnique({
      where: { id: classId },
    });
    if (!cls) throw new NotFoundException("Kelas tidak ditemukan");
    if (cls.creatorId !== userId) {
      throw new ForbiddenException("Hanya pembuat kelas yang dapat membatalkan kelas.");
    }


    await this.prisma.transaction.updateMany({
      where: { classId, status: "PENDING" },
      data: { status: "CANCELLED" },
    });

    return { success: true };
  }
}
