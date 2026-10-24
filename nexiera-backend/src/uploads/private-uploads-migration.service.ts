import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { copyFileSync, existsSync, mkdirSync, renameSync, unlinkSync } from "node:fs";
import { basename, join } from "node:path";
import { PrismaService } from "../prisma/prisma.service.js";
import { PrivateUploadPurpose, type PrivateUploadPurpose as PrivateUploadPurposeType } from "../generated/prisma/client.js";

@Injectable()
export class PrivateUploadsMigration implements OnModuleInit {
  private readonly logger = new Logger(PrivateUploadsMigration.name);
  private readonly publicDirectory = join(process.cwd(), "uploads");
  private readonly privateDirectory = join(process.cwd(), "private-uploads");

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    mkdirSync(this.privateDirectory, { recursive: true });
    const [users, applications, reports, transactions] = await Promise.all([
      this.prisma.user.findMany({ where: { bootcampStudentProofUrl: { startsWith: "/uploads/" } }, select: { id: true, bootcampStudentProofUrl: true } }),
      this.prisma.roleApplication.findMany({ where: { studentProofUrl: { startsWith: "/uploads/" } }, select: { id: true, studentProofUrl: true } }),
      this.prisma.classReport.findMany({ where: { evidenceUrl: { startsWith: "/uploads/" } }, select: { id: true, evidenceUrl: true } }),
      this.prisma.transaction.findMany({ where: { refundProofUrl: { startsWith: "/uploads/" } }, select: { id: true, refundProofUrl: true } }),
    ]);

    const references = new Map<string, Array<{ model: "user" | "application" | "report" | "transaction"; id: string }>>();
    const add = (url: string | null, model: "user" | "application" | "report" | "transaction", id: string) => {
      if (!url || url.startsWith("/uploads/private/")) return;
      const list = references.get(url) || [];
      list.push({ model, id });
      references.set(url, list);
    };
    users.forEach((item) => add(item.bootcampStudentProofUrl, "user", item.id));
    applications.forEach((item) => add(item.studentProofUrl, "application", item.id));
    reports.forEach((item) => add(item.evidenceUrl, "report", item.id));
    transactions.forEach((item) => add(item.refundProofUrl, "transaction", item.id));

    for (const [oldUrl, owners] of references) {
      const filename = basename(oldUrl);
      if (filename !== oldUrl.slice("/uploads/".length) || !/^[a-zA-Z0-9._-]+$/.test(filename)) continue;
      const oldPath = join(this.publicDirectory, filename);
      const newUrl = `/uploads/private/${filename}`;
      const newPath = join(this.privateDirectory, filename);
      if (existsSync(oldPath)) {
        const hasPublicReference = await this.hasPublicReference(oldUrl);
        if (hasPublicReference) {
          if (!existsSync(newPath)) copyFileSync(oldPath, newPath);
          const publicCopy = `public-${filename}`;
          copyFileSync(oldPath, join(this.publicDirectory, publicCopy));
          await this.repointPublicReferences(oldUrl, `/uploads/${publicCopy}`);
          unlinkSync(oldPath);
        } else if (!existsSync(newPath)) {
          renameSync(oldPath, newPath);
        } else {
          unlinkSync(oldPath);
        }
      }
      for (const owner of owners) {
        let ownerId: string | undefined;
        let purpose: PrivateUploadPurposeType = PrivateUploadPurpose.STUDENT_PROOF;
        if (owner.model === "user") {
          const updated = await this.prisma.user.update({ where: { id: owner.id }, data: { bootcampStudentProofUrl: newUrl }, select: { id: true } });
          ownerId = updated.id;
        }
        if (owner.model === "application") {
          const updated = await this.prisma.roleApplication.update({ where: { id: owner.id }, data: { studentProofUrl: newUrl }, select: { userId: true } });
          ownerId = updated.userId;
        }
        if (owner.model === "report") {
          const updated = await this.prisma.classReport.update({ where: { id: owner.id }, data: { evidenceUrl: newUrl }, select: { reporterId: true } });
          ownerId = updated.reporterId;
          purpose = PrivateUploadPurpose.REPORT_EVIDENCE;
        }
        if (owner.model === "transaction") {
          const updated = await this.prisma.transaction.update({ where: { id: owner.id }, data: { refundProofUrl: newUrl }, select: { userId: true } });
          ownerId = updated.userId;
          purpose = PrivateUploadPurpose.REFUND_PROOF;
        }
        if (ownerId) {
          await this.prisma.privateUpload.upsert({
            where: { filename },
            create: { filename, ownerId, purpose },
            update: {},
          });
        }
      }
    }
    if (references.size) this.logger.log(`Migrated ${references.size} legacy private upload reference(s) to protected storage.`);
  }

  private async repointPublicReferences(oldUrl: string, newUrl: string) {
    await Promise.all([
      this.prisma.user.updateMany({ where: { avatarUrl: oldUrl }, data: { avatarUrl: newUrl } }),
      this.prisma.user.updateMany({ where: { bannerUrl: oldUrl }, data: { bannerUrl: newUrl } }),
      this.prisma.user.updateMany({ where: { organizationLogoUrl: oldUrl }, data: { organizationLogoUrl: newUrl } }),
      this.prisma.class.updateMany({ where: { bannerUrl: oldUrl }, data: { bannerUrl: newUrl } }),
      this.prisma.roleApplication.updateMany({ where: { logoUrl: oldUrl }, data: { logoUrl: newUrl } }),
      this.prisma.ad.updateMany({ where: { imageUrl: oldUrl }, data: { imageUrl: newUrl } }),
    ]);
  }

  private async hasPublicReference(url: string) {
    const [profileRefs, classRefs, logoRefs, adRefs] = await Promise.all([
      this.prisma.user.count({ where: { OR: [{ avatarUrl: url }, { bannerUrl: url }, { organizationLogoUrl: url }] } }),
      this.prisma.class.count({ where: { bannerUrl: url } }),
      this.prisma.roleApplication.count({ where: { logoUrl: url } }),
      this.prisma.ad.count({ where: { imageUrl: url } }),
    ]);
    return profileRefs + classRefs + logoRefs + adRefs > 0;
  }
}
