import { ForbiddenException, Injectable } from "@nestjs/common";
import { PresenceStatus } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class PresencesService {
  constructor(private readonly prisma: PrismaService) {}

  async markOwnPresence(classId: string, userId: string, status: PresenceStatus) {
    const paidEnrollment = await this.prisma.transaction.findFirst({
      where: { classId, userId, status: "PAID", class: { status: "ACTIVE" } },
      select: { id: true },
    });
    if (!paidEnrollment) {
      throw new ForbiddenException("Only a paid student can record class presence");
    }

    return this.prisma.presence.upsert({
      where: { userId_classId: { userId, classId } },
      create: { userId, classId, status, markedAt: new Date() },
      update: { status, markedAt: new Date() },
    });
  }
}
