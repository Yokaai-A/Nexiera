import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { UpdatePhoneDto } from "./dto/update-phone.dto.js";
import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { SubmitTutorApplicationDto } from "./dto/submit-tutor-application.dto.js";
import { ReviewTutorApplicationDto } from "./dto/review-tutor-application.dto.js";
import { UsersService } from "./users.service.js";

type AuthenticatedRequest = Request & { user: { userId: string } };

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getMe(@Req() request: AuthenticatedRequest) {
    return this.usersService.findProfile(request.user.userId);
  }

  @Patch("me/phone")
  updatePhone(
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdatePhoneDto,
  ) {
    return this.usersService.updateWhatsAppNumber(request.user.userId, body.phoneNumber);
  }

  @Patch("me")
  updateProfile(
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(request.user.userId, body);
  }

  @Get("me/tutor-application")
  getTutorApplication(@Req() request: AuthenticatedRequest) {
    return this.usersService.findTutorApplication(request.user.userId);
  }

  @Post("me/tutor-application")
  submitTutorApplication(
    @Req() request: AuthenticatedRequest,
    @Body() body: SubmitTutorApplicationDto,
  ) {
    return this.usersService.submitTutorApplication(request.user.userId, body);
  }

  @Get("admin/tutor-applications")
  listTutorApplications(@Req() request: AuthenticatedRequest) {
    return this.usersService.listTutorApplications(request.user.userId);
  }

  @Patch("admin/tutor-applications/:applicationId")
  reviewTutorApplication(
    @Req() request: AuthenticatedRequest,
    @Param("applicationId") applicationId: string,
    @Body() body: ReviewTutorApplicationDto,
  ) {
    return this.usersService.reviewTutorApplication(applicationId, request.user.userId, body.status);
  }
}
