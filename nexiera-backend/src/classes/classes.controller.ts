import {
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
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { AdminGuard } from "../auth/admin.guard.js";
import { CreateClassDto } from "./dto/create-class.dto.js";
import { UpdateReportStatusDto } from "./dto/update-report-status.dto.js";
import { ReviewClassDto } from "./dto/review-class.dto.js";
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

  @Get("admin/pending")
  @UseGuards(JwtAuthGuard, AdminGuard)
  listPendingAdmin() {
    return this.classesService.findPendingReviews();
  }

  @Patch(":classId/review")
  @UseGuards(JwtAuthGuard, AdminGuard)
  reviewAdmin(@Req() request: AuthenticatedRequest, @Param("classId") classId: string, @Body() body: ReviewClassDto) {
    return this.classesService.reviewClass(request.user.userId, classId, body.decision, body.note);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createClass(
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateClassDto,
  ) {
    return this.classesService.createClass(request.user.userId, body);
  }

  @Post("publish")
  @UseGuards(JwtAuthGuard)
  createPublishedClass(
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateClassDto,
  ) {
    return this.classesService.createClass(request.user.userId, body);
  }

  @Patch(":classId/publish")
  @UseGuards(JwtAuthGuard)
  publishClass(@Param("classId") classId: string, @Req() request: AuthenticatedRequest) {
    return this.classesService.getClassDetail(classId, request.user.userId);
  }

  @Get(":classId/manage")
  @UseGuards(JwtAuthGuard)
  getManagedClass(@Param("classId") classId: string, @Req() request: AuthenticatedRequest) {
    return this.classesService.getClassDetail(classId, request.user.userId);
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

  @Get(":classId")
  getClassDetail(@Param("classId") classId: string) {
    return this.classesService.getClassDetail(classId);
  }

  @Post("reports")
  @UseGuards(JwtAuthGuard)
  createReport(@Req() request: AuthenticatedRequest, @Body() body: import("./dto/create-class-report.dto.js").CreateClassReportDto) {
    return this.classesService.createReport(request.user.userId, body);
  }

  @Patch("reports/:reportId/status")
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateReportStatus(@Req() request: AuthenticatedRequest, @Param("reportId") reportId: string, @Body() body: UpdateReportStatusDto) {
    return this.classesService.updateReportStatus(request.user.userId, reportId, body.status, body.note);
  }

  @Get("reports/admin")
  @UseGuards(JwtAuthGuard, AdminGuard)
  listAdminReports() { return this.classesService.listAdminReports(); }

  @Post("course-requests")
  @UseGuards(JwtAuthGuard)
  requestCourse(@Req() request: AuthenticatedRequest, @Body() body: { title: string; campus?: string; major?: string; courseCode?: string; note?: string }) { return this.classesService.requestCourse(request.user.userId, body); }

  @Get("course-requests/admin")
  @UseGuards(JwtAuthGuard, AdminGuard)
  adminCourseRequests() { return this.classesService.listCourseRequests(); }

  @Get("reports/mine")
  @UseGuards(JwtAuthGuard)
  listMyReports(@Req() request: AuthenticatedRequest) {
    return this.classesService.listMyReports(request.user.userId);
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
    @Body() body: { reason?: string },
  ) {
    return this.classesService.cancelClass(classId, request.user.userId, body?.reason);
  }
}
