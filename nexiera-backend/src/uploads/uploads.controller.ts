import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Request, Response } from "express";
import { memoryStorage } from "multer";
import { basename, extname, join } from "node:path";
import { existsSync } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileTypeFromBuffer } from "file-type";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { AdminGuard } from "../auth/admin.guard.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { PrivateUploadPurpose } from "../generated/prisma/client.js";
import { ConfigService } from "@nestjs/config";

type AuthenticatedRequest = Request & { user: { userId: string; email: string } };
type StoredUpload = { filename: string; size: number; mimetype: string };

const UPLOADS_DIR = join(process.cwd(), "uploads");
const PRIVATE_UPLOADS_DIR = join(process.cwd(), "private-uploads");
const IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
const PROOF_MIME_TYPES = new Set([...IMAGE_MIME_TYPES, "application/pdf"]);
const MIME_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

function normalizeMimeType(mimetype: string) {
  return mimetype === "image/jpg" ? "image/jpeg" : mimetype.toLowerCase();
}

function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!IMAGE_MIME_TYPES.has(file.mimetype.toLowerCase())) {
    return callback(new BadRequestException("Tipe file tidak didukung. Harap unggah PNG, JPEG, JPG, atau WebP."), false);
  }
  callback(null, true);
}

function proofFileFilter(
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!PROOF_MIME_TYPES.has(file.mimetype.toLowerCase())) {
    return callback(new BadRequestException("Bukti harus berupa PNG, JPEG, WebP, atau PDF."), false);
  }
  callback(null, true);
}

async function storeUpload(file: Express.Multer.File | undefined, isPrivate: boolean, allowPdf = false): Promise<StoredUpload> {
  if (!file?.buffer?.length) throw new BadRequestException("File wajib diunggah.");

  const declaredMime = normalizeMimeType(file.mimetype);
  const allowedMimeTypes = allowPdf ? PROOF_MIME_TYPES : IMAGE_MIME_TYPES;
  const detected = await fileTypeFromBuffer(file.buffer);
  if (!detected || !allowedMimeTypes.has(detected.mime) || detected.mime !== declaredMime) {
    throw new BadRequestException("Isi file tidak cocok dengan tipe gambar atau dokumen yang diizinkan.");
  }

  const filename = `${randomUUID()}.${MIME_EXTENSIONS[detected.mime]}`;
  const directory = isPrivate ? PRIVATE_UPLOADS_DIR : UPLOADS_DIR;
  const path = join(directory, filename);
  await mkdir(directory, { recursive: true });
  await writeFile(path, file.buffer, { flag: "wx", mode: isPrivate ? 0o600 : 0o644 });
  return { filename, size: file.size, mimetype: detected.mime };
}

@Controller("uploads")
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {}

  @Post("profile")
  @UseInterceptors(FileInterceptor("file", {
    storage: memoryStorage(),
    fileFilter: imageFileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async uploadProfile(@UploadedFile() file: Express.Multer.File) {
    const stored = await storeUpload(file, false);
    return { url: `/uploads/${stored.filename}`, ...stored };
  }

  @Post("banner")
  @UseInterceptors(FileInterceptor("file", {
    storage: memoryStorage(),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadBanner(@UploadedFile() file: Express.Multer.File) {
    const stored = await storeUpload(file, false);
    return { url: `/uploads/${stored.filename}`, ...stored };
  }

  @Post("report-evidence")
  @UseInterceptors(FileInterceptor("file", {
    storage: memoryStorage(), fileFilter: imageFileFilter, limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async uploadReportEvidence(@Req() request: AuthenticatedRequest, @UploadedFile() file: Express.Multer.File) {
    return this.storePrivateUpload(request.user.userId, file, PrivateUploadPurpose.REPORT_EVIDENCE);
  }

  @Post("bootcamp-student-proof")
  @UseInterceptors(FileInterceptor("file", {
    storage: memoryStorage(), fileFilter: proofFileFilter, limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async uploadBootcampStudentProof(@Req() request: AuthenticatedRequest, @UploadedFile() file: Express.Multer.File) {
    return this.storePrivateUpload(request.user.userId, file, PrivateUploadPurpose.STUDENT_PROOF, true);
  }

  @Post("refund-proof")
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor("file", {
    storage: memoryStorage(), fileFilter: proofFileFilter, limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async uploadRefundProof(@Req() request: AuthenticatedRequest, @UploadedFile() file: Express.Multer.File) {
    return this.storePrivateUpload(request.user.userId, file, PrivateUploadPurpose.REFUND_PROOF, true);
  }

  @Get("private/:filename")
  async getPrivateUpload(
    @Param("filename") filename: string,
    @Req() request: AuthenticatedRequest,
    @Res() response: Response,
  ) {
    if (!filename || basename(filename) !== filename || !/^[a-f0-9-]+\.(?:png|jpg|webp|pdf)$/i.test(filename)) {
      throw new NotFoundException("Berkas tidak ditemukan.");
    }
    const [user, upload] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: request.user.userId }, select: { email: true } }),
      this.prisma.privateUpload.findUnique({ where: { filename } }),
    ]);
    if (!user || user.email.trim().toLowerCase() !== request.user.email.trim().toLowerCase()) {
      throw new NotFoundException("Berkas tidak ditemukan.");
    }
    const isOwner = upload?.ownerId === request.user.userId;
    const allowlistedEmails = (this.config.get<string>("ADMIN_EMAILS") || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
    const isAllowlistedAdmin = allowlistedEmails.includes(user.email.trim().toLowerCase());
    if (!upload) throw new NotFoundException("Berkas tidak ditemukan.");
    if (!isOwner && !isAllowlistedAdmin) throw new ForbiddenException("Anda tidak memiliki akses ke berkas ini.");

    const path = join(PRIVATE_UPLOADS_DIR, filename);
    if (!existsSync(path)) throw new NotFoundException("Berkas tidak ditemukan.");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cache-Control", "private, no-store");
    response.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
    return response.download(path);
  }

  private async storePrivateUpload(userId: string, file: Express.Multer.File | undefined, purpose: PrivateUploadPurpose, allowPdf = false) {
    const stored = await storeUpload(file, true, allowPdf);
    const path = join(PRIVATE_UPLOADS_DIR, stored.filename);
    try {
      await this.prisma.privateUpload.create({ data: { filename: stored.filename, ownerId: userId, purpose } });
    } catch (error) {
      await unlink(path).catch(() => undefined);
      throw error;
    }
    return { url: `/uploads/private/${stored.filename}`, ...stored };
  }
}
