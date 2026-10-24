import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user?: { userId?: string } }>();
    const userId = request.user?.userId;
    if (!userId) throw new ForbiddenException("Akses admin diperlukan.");

    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { roles: true, email: true } });
    let roles: unknown = user?.roles;
    if (typeof roles === "string") {
      try { roles = JSON.parse(roles); } catch { roles = []; }
    }
    const allowlistedEmails = (this.config.get<string>("ADMIN_EMAILS") || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
    const isAllowlisted = allowlistedEmails.includes(user?.email.toLowerCase() || "");
    if ((!Array.isArray(roles) || !roles.includes("ADMIN")) && !isAllowlisted) {
      throw new ForbiddenException("Akses admin diperlukan.");
    }
    return true;
  }
}
