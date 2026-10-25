import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ user?: { userId?: string; email?: string } }>();
    const userId = request.user?.userId;
    const tokenEmail = request.user?.email?.trim().toLowerCase();
    if (!userId || !tokenEmail) throw new ForbiddenException("Token admin tidak valid.");

    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    const databaseEmail = user?.email.trim().toLowerCase();
    const allowlistedEmails = (this.config.get<string>("ADMIN_EMAILS") || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
    if (!databaseEmail || databaseEmail !== tokenEmail || !allowlistedEmails.includes(databaseEmail)) {
      throw new ForbiddenException("Akses admin diperlukan.");
    }
    return true;
  }
}
