import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { DashboardService } from "./dashboard.service.js";

type AuthenticatedRequest = Request & { user: { userId: string } };

@Controller("dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("me")
  getMe(@Req() request: AuthenticatedRequest) {
    return this.dashboardService.getForUser(request.user.userId);
  }
}
