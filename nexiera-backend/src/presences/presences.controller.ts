import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { MarkPresenceDto } from "./dto/mark-presence.dto.js";
import { PresencesService } from "./presences.service.js";

type AuthenticatedRequest = Request & { user: { userId: string } };

@Controller("presences")
@UseGuards(JwtAuthGuard)
export class PresencesController {
  constructor(private readonly presencesService: PresencesService) {}

  @Post("classes/:classId/me")
  markOwnPresence(
    @Param("classId") classId: string,
    @Req() request: AuthenticatedRequest,
    @Body() body: MarkPresenceDto,
  ) {
    return this.presencesService.markOwnPresence(classId, request.user.userId, body.status);
  }
}
