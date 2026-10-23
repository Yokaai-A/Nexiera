import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { CancelClassDto } from "./dto/cancel-class.dto.js";
import { CreateClassReportDto } from "./dto/create-class-report.dto.js";
import { CreateClassDto } from "./dto/create-class.dto.js";
import { CreateReviewDto } from "./dto/create-review.dto.js";
import { ReviewReplyDto } from "./dto/review-reply.dto.js";
import { UpdateClassDto } from "./dto/update-class.dto.js";
import { ClassesService } from "./classes.service.js";

type AuthenticatedRequest = Request & { user: { userId: string } };

@Controller("classes")
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  listActiveClasses() {
    return this.classesService.listActiveClasses();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createDraft(@Req() request: AuthenticatedRequest, @Body() body: CreateClassDto) {
    return this.classesService.createDraft(request.user.userId, body);
  }

  @Post("publish")
  @UseGuards(JwtAuthGuard)
  createPublishedClass(@Req() request: AuthenticatedRequest, @Body() body: CreateClassDto) {
    return this.classesService.createPublishedClass(request.user.userId, body);
  }

  @Patch(":classId/publish")
  @UseGuards(JwtAuthGuard)
  publishClass(
    @Param("classId") classId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.classesService.publishClass(classId, request.user.userId);
  }

  @Get(":classId/manage")
  @UseGuards(JwtAuthGuard)
  getManagedClass(@Param("classId") classId: string, @Req() request: AuthenticatedRequest) {
    return this.classesService.getManagedClass(classId, request.user.userId);
  }

  @Patch(":classId")
  @UseGuards(JwtAuthGuard)
  updateClass(
    @Param("classId") classId: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdateClassDto,
  ) {
    return this.classesService.updateClass(classId, request.user.userId, body);
  }

  @Get("mine")
  @UseGuards(JwtAuthGuard)
  listMyClasses(@Req() request: AuthenticatedRequest) {
    return this.classesService.listMyClasses(request.user.userId);
  }

  @Get("tutor/participants")
  @UseGuards(JwtAuthGuard)
  listTutorParticipants(@Req() request: AuthenticatedRequest) {
    return this.classesService.listTutorParticipants(request.user.userId);
  }

  @Post("reports")
  @UseGuards(JwtAuthGuard)
  createReport(@Req() request: AuthenticatedRequest, @Body() body: CreateClassReportDto) {
    return this.classesService.createReport(request.user.userId, body);
  }

  @Get(":classId/reviews")
  getReviews(@Param("classId") classId: string) {
    return this.classesService.getReviews(classId);
  }

  @Post(":classId/reviews")
  @UseGuards(JwtAuthGuard)
  createReview(
    @Param("classId") classId: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateReviewDto,
  ) {
    return this.classesService.createReview(classId, request.user.userId, body);
  }

  @Patch(":classId/reviews/:reviewId/reply")
  @UseGuards(JwtAuthGuard)
  replyToReview(
    @Param("classId") classId: string,
    @Param("reviewId") reviewId: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: ReviewReplyDto,
  ) {
    return this.classesService.replyToReview(classId, reviewId, request.user.userId, body);
  }

  @Get(":classId")
  getClassDetail(@Param("classId") classId: string) {
    return this.classesService.getClassDetail(classId);
  }

  @Get(":classId/meeting-links")
  @UseGuards(JwtAuthGuard)
  getMeetingLinks(
    @Param("classId") classId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.classesService.getMeetingLinks(classId, request.user.userId);
  }

  @Patch(":classId/cancel")
  @UseGuards(JwtAuthGuard)
  cancelClass(
    @Param("classId") classId: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: CancelClassDto,
  ) {
    return this.classesService.cancelClass(classId, request.user.userId, body.reason);
  }
}
