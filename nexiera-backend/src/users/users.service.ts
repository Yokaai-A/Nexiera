import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash, randomBytes } from "node:crypto";
import { PrivateUploadPurpose, Role, RoleApplicationStatus, RoleApplicationType } from "../generated/prisma/client.js";
import { NotificationsService } from "../notifications/notifications.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";

export interface GoogleUserProfile {
  googleId: string;
  email: string;
  name: string;
}

interface CreatePasswordUserInput {
  email: string;
  passwordHash: string;
  fullName: string;
  phoneNumber?: string;
  emailVerified?: boolean;
}

const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  contactEmail: true,
  fullName: true,
  avatarUrl: true,
  bannerUrl: true,
  headline: true,
  bio: true,
  campus: true,
  major: true,
  studentNumber: true,
  semester: true,
  organizationName: true,
  organizationLogoUrl: true,
  organizationWebsiteUrl: true,
  location: true,
  roles: true,
  activeRole: true,
  phoneNumber: true,
  createdAt: true,
  updatedAt: true,
  emailVerifiedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  async createPasswordUser(input: CreatePasswordUserInput) {
    const email = input.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existingUser) {
      throw new ConflictException(
        "Akun dengan email ini sudah terdaftar. Silakan masuk.",
      );
    }

    const defaultRoles = [Role.MAHASISWA];

    return this.prisma.user.create({
      data: {
        email,
        password: input.passwordHash,
        fullName: input.fullName.trim(),
        phoneNumber: input.phoneNumber?.trim() || null,
        roles: defaultRoles,
        activeRole: Role.MAHASISWA,
        emailVerifiedAt: input.emailVerified ? new Date() : null,
      },
      select: PUBLIC_USER_SELECT,
    });
  }

  async issueEmailVerification(userId: string) {
    const token = randomBytes(32).toString("base64url");
    await this.prisma.emailVerificationToken.updateMany({ where: { userId, consumedAt: null }, data: { consumedAt: new Date() } });
    await this.prisma.emailVerificationToken.create({ data: { userId, tokenHash: createHash("sha256").update(token).digest("hex"), expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) } });
    return token;
  }

  async verifyEmailToken(token: string) {
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const record = await this.prisma.emailVerificationToken.findUnique({ where: { tokenHash } });
    if (!record || record.consumedAt || record.expiresAt <= new Date()) throw new BadRequestException("Tautan verifikasi tidak valid atau sudah kedaluwarsa.");
    await this.prisma.$transaction([
      this.prisma.emailVerificationToken.update({ where: { id: record.id }, data: { consumedAt: new Date() } }),
      this.prisma.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date() } }),
    ]);
    return { success: true };
  }

  async findUnverifiedPasswordUser(email: string) {
    return this.prisma.user.findFirst({ where: { email: email.trim().toLowerCase(), password: { not: null }, emailVerifiedAt: null }, select: { id: true, email: true, fullName: true } });
  }

  findForPasswordLogin(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { ...PUBLIC_USER_SELECT, password: true },
    });
  }

  async findGoogleUser(profile: GoogleUserProfile) {
    const byEmail = await this.prisma.user.findUnique({
      where: { email: profile.email.toLowerCase() },
      select: PUBLIC_USER_SELECT,
    });
    if (byEmail && !byEmail.emailVerifiedAt) {
      return this.prisma.user.update({ where: { id: byEmail.id }, data: { emailVerifiedAt: new Date() }, select: PUBLIC_USER_SELECT });
    }
    return byEmail;
  }

  async createGoogleUser(profile: GoogleUserProfile, phoneNumber?: string) {
    const defaultRoles = [Role.MAHASISWA];
    return this.prisma.user.create({
      data: {
        email: profile.email.toLowerCase(),
        fullName: profile.name,
        phoneNumber: phoneNumber?.trim() || null,
        roles: defaultRoles,
        activeRole: Role.MAHASISWA,
        emailVerifiedAt: new Date(),
      },
      select: PUBLIC_USER_SELECT,
    });
  }

  async findProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: PUBLIC_USER_SELECT,
    });
    if (!user) throw new NotFoundException("Pengguna tidak ditemukan");
    let roles: unknown = user.roles;
    if (typeof roles === "string") {
      try { roles = JSON.parse(roles); } catch { roles = [Role.MAHASISWA]; }
    }
    const roleList = Array.isArray(roles) ? [...roles] as string[] : [Role.MAHASISWA];
    const adminEmails = (this.config.get<string>("ADMIN_EMAILS") || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
    const isAllowlistedAdmin = adminEmails.includes(user.email.toLowerCase());
    if (!isAllowlistedAdmin) {
      return { ...user, roles: roleList.filter((role) => role !== "ADMIN") };
    }
    if (!roleList.includes("ADMIN")) roleList.push("ADMIN");
    return { ...user, roles: roleList };
  }

  async switchRole(userId: string, targetRole: Role) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, roles: true, activeRole: true },
    });
    if (!user) throw new NotFoundException("Pengguna tidak ditemukan");

    let rolesList: Role[] = [];
    if (Array.isArray(user.roles)) {
      rolesList = user.roles as Role[];
    } else if (typeof user.roles === "string") {
      try {
        rolesList = JSON.parse(user.roles);
      } catch {
        rolesList = [Role.MAHASISWA];
      }
    } else {
      rolesList = [Role.MAHASISWA];
    }

    if (!rolesList.includes(targetRole)) {
      throw new BadRequestException(
        "Peran ini belum dibuka pada akun Anda. Silakan ajukan pendaftaran peran terlebih dahulu.",
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        activeRole: targetRole,
        roles: rolesList,
      },
      select: PUBLIC_USER_SELECT,
    });
  }

  async applyTutor(
    userId: string,
    dto: {
      campus?: string;
      major?: string;
      studentProofUrl?: string;
      notes?: string;
    },
  ) {
    if (!dto.campus?.trim() || !dto.major?.trim()) {
      throw new BadRequestException("Kampus dan jurusan wajib diisi.");
    }
    if (!dto.studentProofUrl?.startsWith("/uploads/private/")) {
      throw new BadRequestException("Bukti mahasiswa aktif wajib diunggah sebelum mendaftar sebagai Peer-Tutor.");
    }
    const proofFilename = dto.studentProofUrl.slice("/uploads/private/".length);
    const proof = await this.prisma.privateUpload.findFirst({ where: { filename: proofFilename, ownerId: userId, purpose: PrivateUploadPurpose.STUDENT_PROOF }, select: { id: true } });
    if (!proof) throw new BadRequestException("Bukti mahasiswa aktif harus diunggah melalui formulir pendaftaran ini.");
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, roles: true } });
    if (!user) throw new NotFoundException("Pengguna tidak ditemukan");
    const existingApplication = await this.prisma.roleApplication.findUnique({ where: { userId_type: { userId, type: RoleApplicationType.PEER_TUTOR } }, select: { status: true } });
    if (existingApplication && existingApplication.status !== RoleApplicationStatus.REJECTED) {
      throw new ConflictException("Pengajuan Peer-Tutor Anda sedang diproses atau sudah disetujui.");
    }
    const roleApplication = await this.prisma.roleApplication.upsert({
      where: { userId_type: { userId, type: RoleApplicationType.PEER_TUTOR } },
      update: {
        status: RoleApplicationStatus.PENDING_VERIFICATION,
        campus: dto.campus.trim(),
        major: dto.major.trim(),
        studentProofUrl: dto.studentProofUrl.trim(),
        description: dto.notes?.trim() || null,
        reviewNote: null,
        reviewedAt: null,
        reviewedById: null,
      },
      create: {
        userId,
        type: RoleApplicationType.PEER_TUTOR,
        status: RoleApplicationStatus.PENDING_VERIFICATION,
        campus: dto.campus.trim(),
        major: dto.major.trim(),
        studentProofUrl: dto.studentProofUrl.trim(),
        description: dto.notes?.trim() || null,
      },
    });
    await this.notifications.createNotification({
      userId,
      title: "Pengajuan Peer-Tutor Diterima",
      message: "Berkas Anda sudah diterima dan menunggu pemeriksaan admin. Akses Peer-Tutor akan dibuka setelah pengajuan disetujui.",
      type: "SYSTEM",
      linkUrl: "/dashboard",
    }).catch(() => null);
    return roleApplication;
  }

  async applyBootcamp(
    userId: string,
    dto: {
      organizationName: string;
      contactEmail: string;
      logoUrl?: string;
      websiteUrl?: string;
      studentProofUrl?: string;
      description?: string;
    },
  ) {
    if (
      !dto.organizationName?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.contactEmail?.trim() || "") ||
      !dto.logoUrl?.startsWith("/uploads/") ||
      !dto.studentProofUrl?.startsWith("/uploads/private/") ||
      !dto.description?.trim()
    ) {
      throw new BadRequestException("Nama organisasi, email kontak, logo, bukti mahasiswa aktif, dan deskripsi organisasi wajib diisi.");
    }
    const proofFilename = dto.studentProofUrl.slice("/uploads/private/".length);
    const proof = await this.prisma.privateUpload.findFirst({ where: { filename: proofFilename, ownerId: userId, purpose: PrivateUploadPurpose.STUDENT_PROOF }, select: { id: true } });
    if (!proof) throw new BadRequestException("Bukti mahasiswa aktif harus diunggah melalui formulir pendaftaran ini.");
    let websiteUrl: string | null = null;
    if (dto.websiteUrl?.trim()) {
      try {
        const parsed = new URL(dto.websiteUrl.trim());
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error();
        websiteUrl = parsed.toString();
      } catch {
        throw new BadRequestException("Tautan website atau media sosial harus berupa URL HTTP/HTTPS yang valid.");
      }
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) throw new NotFoundException("Pengguna tidak ditemukan");
    const existingApplication = await this.prisma.roleApplication.findUnique({ where: { userId_type: { userId, type: RoleApplicationType.MITRA_BOOTCAMP } }, select: { status: true } });
    if (existingApplication && existingApplication.status !== RoleApplicationStatus.REJECTED) {
      throw new ConflictException("Pengajuan Mitra Bootcamp Anda sedang diproses atau sudah disetujui.");
    }
    const application = await this.prisma.roleApplication.upsert({
      where: { userId_type: { userId, type: RoleApplicationType.MITRA_BOOTCAMP } },
      update: {
        status: RoleApplicationStatus.PENDING_VERIFICATION,
        studentProofUrl: dto.studentProofUrl.trim(),
        organizationName: dto.organizationName.trim(),
        contactEmail: dto.contactEmail.trim().toLowerCase(),
        logoUrl: dto.logoUrl?.trim() || null,
        websiteUrl,
        description: dto.description?.trim() || null,
        reviewNote: null,
        reviewedAt: null,
        reviewedById: null,
      },
      create: {
        userId,
        type: RoleApplicationType.MITRA_BOOTCAMP,
        status: RoleApplicationStatus.PENDING_VERIFICATION,
        studentProofUrl: dto.studentProofUrl.trim(),
        organizationName: dto.organizationName.trim(),
        contactEmail: dto.contactEmail.trim().toLowerCase(),
        logoUrl: dto.logoUrl?.trim() || null,
        websiteUrl,
        description: dto.description?.trim() || null,
      },
    });
    await this.notifications.createNotification({
      userId,
      title: "Pengajuan Mitra Bootcamp Diterima",
      message: "Data organisasi dan bukti mahasiswa aktif sudah diterima. Pengajuan menunggu pemeriksaan admin sebelum akses Mitra Bootcamp dibuka.",
      type: "SYSTEM",
      linkUrl: "/dashboard",
    }).catch(() => null);
    return application;
  }

  listMyRoleApplications(userId: string) {
    return this.prisma.roleApplication.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  }

  listRoleApplications(status?: RoleApplicationStatus) {
    return this.prisma.roleApplication.findMany({
      where: status ? { status } : undefined,
      include: { user: { select: { id: true, fullName: true, email: true, campus: true, major: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  async reviewRoleApplication(adminId: string, applicationId: string, decision: "APPROVE" | "REJECT", note?: string) {
    const application = await this.prisma.roleApplication.findUnique({ where: { id: applicationId } });
    if (!application) throw new NotFoundException("Pengajuan peran tidak ditemukan.");
    if (application.status !== RoleApplicationStatus.PENDING_VERIFICATION) {
      throw new BadRequestException("Pengajuan ini sudah ditinjau.");
    }

    const role = application.type === RoleApplicationType.PEER_TUTOR ? Role.PEER_TUTOR : Role.MITRA_BOOTCAMP;
    const saved = await this.prisma.$transaction(async (db) => {
      let roles: unknown = (await db.user.findUniqueOrThrow({ where: { id: application.userId }, select: { roles: true } })).roles;
      if (typeof roles === "string") {
        try { roles = JSON.parse(roles); } catch { roles = [Role.MAHASISWA]; }
      }
      const nextRoles = Array.isArray(roles) ? [...roles] as string[] : [Role.MAHASISWA];
      if (decision === "APPROVE" && !nextRoles.includes(role)) nextRoles.push(role);
      if (!nextRoles.includes(Role.MAHASISWA)) nextRoles.unshift(Role.MAHASISWA);

      if (decision === "APPROVE") {
        await db.user.update({
          where: { id: application.userId },
          data: application.type === RoleApplicationType.PEER_TUTOR
            ? { roles: nextRoles, campus: application.campus || undefined, major: application.major || undefined, headline: `Peer-Tutor ${application.major || ""}`.trim(), bootcampStudentProofUrl: application.studentProofUrl }
            : { roles: nextRoles, organizationName: application.organizationName || undefined, contactEmail: application.contactEmail || undefined, organizationLogoUrl: application.logoUrl || undefined, organizationWebsiteUrl: application.websiteUrl, bootcampStudentProofUrl: application.studentProofUrl, headline: "Mitra Lembaga Bootcamp Akademik", bio: application.description || undefined },
        });
      }

      const updated = await db.roleApplication.update({
        where: { id: applicationId },
        data: {
          status: decision === "APPROVE" ? RoleApplicationStatus.APPROVED : RoleApplicationStatus.REJECTED,
          reviewNote: note?.trim() || null,
          reviewedById: adminId,
          reviewedAt: new Date(),
        },
      });
      return updated;
    });

    await this.notifications.createNotification({
      userId: application.userId,
      title: decision === "APPROVE" ? "Pendaftaran Peran Disetujui" : "Pendaftaran Peran Ditolak",
      message: `${application.type === RoleApplicationType.PEER_TUTOR ? "Peer-Tutor" : "Mitra Bootcamp"}: ${decision === "APPROVE" ? "pengajuan Anda telah disetujui dan akses peran sudah dibuka." : "pengajuan Anda belum disetujui."}${note?.trim() ? `\nCatatan admin: ${note.trim()}` : ""}`,
      type: "SYSTEM",
      linkUrl: decision === "APPROVE" ? "/dashboard/tutor" : "/dashboard",
    }).catch(() => null);
    return saved;
  }

  async updateWhatsAppNumber(userId: string, phoneNumber: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { phoneNumber: phoneNumber.trim() },
      select: PUBLIC_USER_SELECT,
    });
  }

  async updateProfile(userId: string, body: UpdateProfileDto) {
    const fullName = body.fullName?.trim() || body.name?.trim();
    const campus = body.campus !== undefined ? body.campus.trim() : body.university?.trim();
    const bannerInput = body.bannerUrl !== undefined ? body.bannerUrl : body.coverUrl;

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName || undefined,
        contactEmail: body.contactEmail !== undefined ? body.contactEmail.trim().toLowerCase() || null : undefined,
        campus: campus !== undefined ? campus.trim() || null : undefined,
        major: body.major !== undefined ? body.major.trim() || null : undefined,
        studentNumber: body.studentNumber !== undefined ? body.studentNumber.trim() || null : undefined,
        semester: body.semester !== undefined ? body.semester.trim() || null : undefined,
        avatarUrl: body.avatarUrl !== undefined ? body.avatarUrl.trim() || null : undefined,
        bannerUrl: bannerInput !== undefined ? bannerInput.trim() || null : undefined,
        bio: body.bio !== undefined ? body.bio.trim() || null : undefined,
        headline: body.headline !== undefined ? body.headline.trim() || null : undefined,
        phoneNumber: body.phoneNumber !== undefined ? body.phoneNumber.trim() || null : undefined,
        organizationName: body.organizationName !== undefined ? body.organizationName.trim() || null : undefined,
        organizationLogoUrl: body.organizationLogoUrl !== undefined ? body.organizationLogoUrl.trim() || null : undefined,
        location: body.location !== undefined ? body.location.trim() || null : undefined,
      },
      select: PUBLIC_USER_SELECT,
    });
  }
}
