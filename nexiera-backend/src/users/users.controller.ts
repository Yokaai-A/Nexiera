import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { Role } from "../generated/prisma/client.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { AdminGuard } from "../auth/admin.guard.js";
import { RoleApplicationStatus } from "../generated/prisma/client.js";
import { ApplyTutorDto } from "./dto/apply-tutor.dto.js";
import { ApplyBootcampDto } from "./dto/apply-bootcamp.dto.js";
import { UpdatePhoneDto } from "./dto/update-phone.dto.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { ReviewRoleApplicationDto } from "./dto/review-role-application.dto.js";
import { UsersService } from "./users.service.js";
import { IsEnum } from "class-validator";

type AuthenticatedRequest = Request & { user: { userId: string } };

class SwitchRoleDto {
  @IsEnum(Role)
  role!: Role;
}

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getMe(@Req() request: AuthenticatedRequest) {
    return this.usersService.findProfile(request.user.userId);
  }

  @Patch("switch-role")
  switchRole(
    @Req() request: AuthenticatedRequest,
    @Body() body: SwitchRoleDto,
  ) {
    if (!body?.role || !Object.values(Role).includes(body.role)) {
      throw new BadRequestException(
        "Peran tidak valid. Pilih antara MAHASISWA, PEER_TUTOR, atau MITRA_BOOTCAMP.",
      );
    }
    return this.usersService.switchRole(request.user.userId, body.role);
  }

  @Patch("me/phone")
  updatePhone(
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdatePhoneDto,
  ) {
    return this.usersService.updateWhatsAppNumber(
      request.user.userId,
      body.phoneNumber,
    );
  }

  @Patch("me")
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(request.user.userId, body);
  }

  @Post("apply-tutor")
  applyTutor(
    @Req() request: AuthenticatedRequest,
    @Body() body: ApplyTutorDto,
  ) {
    return this.usersService.applyTutor(request.user.userId, body);
  }

  @Post("apply-bootcamp")
  applyBootcamp(
    @Req() request: AuthenticatedRequest,
    @Body() body: ApplyBootcampDto,
  ) {
    return this.usersService.applyBootcamp(request.user.userId, body);
  }

  @Get("me/role-applications")
  listMyRoleApplications(@Req() request: AuthenticatedRequest) {
    return this.usersService.listMyRoleApplications(request.user.userId);
  }

  @Get("admin/role-applications")
  @UseGuards(AdminGuard)
  listRoleApplications() {
    return this.usersService.listRoleApplications(RoleApplicationStatus.PENDING_VERIFICATION);
  }

  @Patch("admin/role-applications/:applicationId/review")
  @UseGuards(AdminGuard)
  reviewRoleApplication(
    @Req() request: AuthenticatedRequest,
    @Param("applicationId") applicationId: string,
    @Body() body: ReviewRoleApplicationDto,
  ) {
    return this.usersService.reviewRoleApplication(request.user.userId, applicationId, body.decision, body.note);
  }

  @Post("me/tutor-application")
  submitTutorApplication(
    @Req() request: AuthenticatedRequest,
    @Body() body: any,
  ) {
    if (body?.type === "BOOTCAMP_PARTNER" || body?.type === "bootcamp_partner" || body?.organizationName) {
      return this.usersService.applyBootcamp(request.user.userId, {
        organizationName: body.organizationName || "Lembaga Bootcamp",
        contactEmail: body.contactEmail || body.contactPerson || "",
        logoUrl: body.organizationProofUrl || body.logoUrl,
        websiteUrl: body.websiteUrl || body.organizationWebsiteUrl,
        studentProofUrl: body.studentProofUrl || body.activeStudentProofUrl,
        description: body.notes,
      });
    }
    return this.usersService.applyTutor(request.user.userId, {
      campus: body.campus,
      major: body.major,
      studentProofUrl: body.studentProofUrl,
      notes: body.notes,
    });
  }

  @Get("me/tutor-application")
  getTutorApplication() {
    return null;
  }
}
