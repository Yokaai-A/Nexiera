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
import type { Response } from "express";
import { diskStorage } from "multer";
import { basename, extname, join } from "path";
import { existsSync, mkdirSync } from "fs";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { AdminGuard } from "../auth/admin.guard.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { PrivateUploadPurpose } from "../generated/prisma/client.js";
import { ConfigService } from "@nestjs/config";

type AuthenticatedRequest = { user: { userId: string } };

const UPLOADS_DIR = join(process.cwd(), "uploads");
const PRIVATE_UPLOADS_DIR = join(process.cwd(), "private-uploads");
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!existsSync(PRIVATE_UPLOADS_DIR)) {
  mkdirSync(PRIVATE_UPLOADS_DIR, { recursive: true });
}

const storage = diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, UPLOADS_DIR);
  },
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = extname(file.originalname).toLowerCase();
    callback(null, `${uniqueSuffix}${ext}`);
  },
});

const privateStorage = diskStorage({
  destination: (_req, _file, callback) => callback(null, PRIVATE_UPLOADS_DIR),
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${uniqueSuffix}${extname(file.originalname).toLowerCase()}`);
  },
});

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

function imageFileFilter(
  _req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return callback(
      new BadRequestException(
        "Tipe file tidak didukung. Harap unggah file PNG, JPEG, JPG, atau WebP.",
      ),
      false,
    );
  }
  callback(null, true);
}

function studentProofFileFilter(
  _req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  if (![...ALLOWED_MIME_TYPES, "application/pdf"].includes(file.mimetype)) {
    return callback(new BadRequestException("Bukti mahasiswa harus berupa PNG, JPEG, WebP, atau PDF."), false);
  }
  callback(null, true);
}

@Controller("uploads")
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {}

  @Post("profile")
  @UseInterceptors(
    FileInterceptor("file", {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 2 * 1024 * 1024 }, // Max 2 MB
    }),
  )
  uploadProfile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File gambar profil/logo wajib diunggah.");
    }
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @Post("banner")
  @UseInterceptors(
    FileInterceptor("file", {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // Max 5 MB
    }),
  )
  uploadBanner(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File gambar banner/sampul wajib diunggah.");
    }
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @Post("report-evidence")
  @UseInterceptors(FileInterceptor("file", {
    storage: privateStorage, fileFilter: imageFileFilter, limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async uploadReportEvidence(@Req() request: AuthenticatedRequest, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Bukti foto wajib diunggah.");
    await this.prisma.privateUpload.create({ data: { filename: file.filename, ownerId: request.user.userId, purpose: PrivateUploadPurpose.REPORT_EVIDENCE } });
    return { url: `/uploads/private/${file.filename}`, filename: file.filename, size: file.size, mimetype: file.mimetype };
  }

  @Post("bootcamp-student-proof")
  @UseInterceptors(FileInterceptor("file", {
    storage: privateStorage, fileFilter: studentProofFileFilter, limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async uploadBootcampStudentProof(@Req() request: AuthenticatedRequest, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Bukti mahasiswa aktif wajib diunggah.");
    await this.prisma.privateUpload.create({ data: { filename: file.filename, ownerId: request.user.userId, purpose: PrivateUploadPurpose.STUDENT_PROOF } });
    return { url: `/uploads/private/${file.filename}`, filename: file.filename, size: file.size, mimetype: file.mimetype };
  }

  @Post("refund-proof")
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor("file", {
    storage: privateStorage, fileFilter: studentProofFileFilter, limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async uploadRefundProof(@Req() request: AuthenticatedRequest, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Bukti transfer refund wajib diunggah.");
    await this.prisma.privateUpload.create({ data: { filename: file.filename, ownerId: request.user.userId, purpose: PrivateUploadPurpose.REFUND_PROOF } });
    return { url: `/uploads/private/${file.filename}`, filename: file.filename, size: file.size, mimetype: file.mimetype };
  }

  @Get("private/:filename")
  async getPrivateUpload(
    @Param("filename") filename: string,
    @Req() request: { user: { userId: string } },
    @Res() response: Response,
  ) {
    if (!filename || basename(filename) !== filename || !/^[a-zA-Z0-9._-]+$/.test(filename)) {
      throw new NotFoundException("Berkas tidak ditemukan.");
    }
    const [user, upload] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: request.user.userId }, select: { roles: true, email: true } }),
      this.prisma.privateUpload.findUnique({ where: { filename } }),
    ]);
    let roles: unknown = user?.roles;
    if (typeof roles === "string") {
      try { roles = JSON.parse(roles); } catch { roles = []; }
    }
    const adminEmails = (this.config.get<string>("ADMIN_EMAILS") || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
    const isAdmin = (Array.isArray(roles) && roles.includes("ADMIN")) || adminEmails.includes(user?.email.toLowerCase() || "");
    const isOwner = upload?.ownerId === request.user.userId;
    if (!upload) throw new NotFoundException("Berkas tidak ditemukan.");
    if (!isAdmin && !isOwner) {
      throw new ForbiddenException("Anda tidak memiliki akses ke berkas ini.");
    }

    const path = join(PRIVATE_UPLOADS_DIR, filename);
    if (!existsSync(path)) throw new NotFoundException("Berkas tidak ditemukan.");
    response.setHeader("X-Content-Type-Options", "nosniff");
    return response.download(path);
  }
}
