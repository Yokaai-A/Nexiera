import { Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { NotificationsService } from "./notifications.service.js";

type AuthenticatedRequest = Request & { user: { userId: string } };

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.notificationsService.listForUser(request.user.userId);
  }

  @Patch(":id/read")
  markAsRead(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    return this.notificationsService.markAsRead(id, request.user.userId);
  }

  @Patch("read-all")
  markAllAsRead(@Req() request: AuthenticatedRequest) {
    return this.notificationsService.markAllAsRead(request.user.userId);
  }
}
