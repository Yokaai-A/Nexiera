import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { SubmitTutorApplicationDto } from "./dto/submit-tutor-application.dto.js";

export interface GoogleUserProfile {
  googleId: string;
  email: string;
  name: string;
}

interface CreatePasswordUserInput {
  email: string;
  passwordHash: string;
  fullName: string;
  phoneNumber: string;
}

const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  phoneNumber: true,
  role: true,
  university: true,
  major: true,
  studentNumber: true,
  semester: true,
  avatarUrl: true,
  coverUrl: true,
  bio: true,
  headline: true,
  organizationName: true,
  organizationLogoUrl: true,
  location: true,
  createdAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createPasswordUser(input: CreatePasswordUserInput) {
    const email = input.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existingUser) {
      throw new ConflictException("An account with this email already exists. Sign in or use Google Sign-In.");
    }

    try {
      return await this.prisma.user.create({
        data: {
          email,
          password: input.passwordHash,
          name: input.fullName.trim(),
          phoneNumber: input.phoneNumber.trim(),
          role: "STUDENT",
        },
        select: PUBLIC_USER_SELECT,
      });
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException("An account with this email already exists. Sign in or use Google Sign-In.");
      }
      throw error;
    }
  }

  findForPasswordLogin(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { ...PUBLIC_USER_SELECT, password: true, googleId: true },
    });
  }

  async findGoogleUser(profile: GoogleUserProfile) {
    const byGoogleId = await this.prisma.user.findUnique({
      where: { googleId: profile.googleId },
      select: PUBLIC_USER_SELECT,
    });
    if (byGoogleId) return byGoogleId;

    const byEmail = await this.prisma.user.findUnique({
      where: { email: profile.email },
      select: { ...PUBLIC_USER_SELECT, googleId: true },
    });
    if (!byEmail) return null;

    if (byEmail.googleId && byEmail.googleId !== profile.googleId) {
      throw new UnauthorizedException("This email is linked to a different Google account");
    }

    if (!byEmail.googleId) {
      return this.prisma.user.update({
        where: { id: byEmail.id },
        data: { googleId: profile.googleId },
        select: PUBLIC_USER_SELECT,
      });
    }

    const { googleId: _googleId, ...publicUser } = byEmail;
    return publicUser;
  }

  async createGoogleUser(profile: GoogleUserProfile, phoneNumber: string) {
    return this.prisma.user.create({
      data: {
        googleId: profile.googleId,
        email: profile.email,
        name: profile.name,
        phoneNumber: phoneNumber.trim(),
      },
      select: PUBLIC_USER_SELECT,
    });
  }

  async findProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: PUBLIC_USER_SELECT,
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async updateWhatsAppNumber(userId: string, phoneNumber: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { phoneNumber: phoneNumber.trim() },
      select: PUBLIC_USER_SELECT,
    });
  }

  async updateProfile(userId: string, body: UpdateProfileDto) {
    const profile = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: body.name?.trim(),
        university: body.university?.trim(),
        major: body.major?.trim(),
        studentNumber: body.studentNumber?.trim(),
        semester: body.semester?.trim(),
        avatarUrl: body.avatarUrl?.trim(),
        coverUrl: body.coverUrl?.trim(),
        bio: body.bio?.trim(),
        headline: body.headline?.trim(),
        organizationName: body.organizationName?.trim(),
        organizationLogoUrl: body.organizationLogoUrl?.trim(),
        location: body.location?.trim(),
      },
      select: PUBLIC_USER_SELECT,
    });
    return profile;
  }

  async findTutorApplication(userId: string) {
    return this.prisma.tutorApplication.findUnique({ where: { userId } });
  }

  async submitTutorApplication(userId: string, body: SubmitTutorApplicationDto) {
    if (body.type === "PEER_TUTOR" && (!body.studentCardUrl || !body.transcriptUrl)) {
      throw new BadRequestException("Student card and transcript document URLs are required");
    }
    if (body.type === "BOOTCAMP_PARTNER" && (!body.organizationName?.trim() || !body.contactPerson?.trim() || !body.organizationProofUrl)) {
      throw new BadRequestException("Organization name, contact person, and proof document URL are required");
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!user) throw new NotFoundException("User not found");
    if (user.role === "TUTOR" || user.role === "ADMIN") throw new ConflictException("This account already has tutor or administrator access");

    const current = await this.prisma.tutorApplication.findUnique({ where: { userId }, select: { status: true } });
    if (current?.status === "PENDING") throw new ConflictException("A tutor application is already under review");
    if (current?.status === "APPROVED") throw new ConflictException("This application has already been approved");
    return this.prisma.tutorApplication.upsert({
      where: { userId },
      create: {
        userId, type: body.type, status: "PENDING",
        organizationName: body.organizationName?.trim() || null,
        contactPerson: body.contactPerson?.trim() || null,
        studentCardUrl: body.studentCardUrl || null,
        transcriptUrl: body.transcriptUrl || null,
        organizationProofUrl: body.organizationProofUrl || null,
        notes: body.notes?.trim() || null,
        submittedAt: new Date(), reviewedAt: null, reviewerId: null,
      },
      update: {
        type: body.type, status: "PENDING",
        organizationName: body.organizationName?.trim() || null,
        contactPerson: body.contactPerson?.trim() || null,
        studentCardUrl: body.studentCardUrl || null,
        transcriptUrl: body.transcriptUrl || null,
        organizationProofUrl: body.organizationProofUrl || null,
        notes: body.notes?.trim() || null,
        submittedAt: new Date(), reviewedAt: null, reviewerId: null,
      },
    });
  }

  async listTutorApplications(adminId: string) {
    await this.assertAdmin(adminId);
    return this.prisma.tutorApplication.findMany({
      orderBy: [{ status: "asc" }, { submittedAt: "asc" }],
      include: { user: { select: { id: true, name: true, email: true, phoneNumber: true, university: true, major: true } } },
    });
  }

  async reviewTutorApplication(applicationId: string, adminId: string, status: "APPROVED" | "REJECTED") {
    await this.assertAdmin(adminId);
    return this.prisma.$transaction(async (transaction) => {
      const application = await transaction.tutorApplication.findUnique({ where: { id: applicationId } });
      if (!application) throw new NotFoundException("Tutor application not found");
      if (application.status !== "PENDING") throw new ConflictException("Only pending applications can be reviewed");
      const reviewed = await transaction.tutorApplication.update({
        where: { id: application.id },
        data: { status, reviewerId: adminId, reviewedAt: new Date() },
      });
      if (status === "APPROVED") {
        await transaction.user.update({
          where: { id: application.userId },
          data: {
            role: "TUTOR",
            organizationName: application.type === "BOOTCAMP_PARTNER" ? application.organizationName : undefined,
          },
        });
      }
      return reviewed;
    });
  }

  private async assertAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!user || user.role !== "ADMIN") throw new ForbiddenException("Administrator access required");
  }
}

function isUniqueConstraintViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}
