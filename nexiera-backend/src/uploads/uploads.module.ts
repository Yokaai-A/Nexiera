import { Module } from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard.js";
import { PrivateUploadsMigration } from "./private-uploads-migration.service.js";
import { UploadsController } from "./uploads.controller.js";
import { UploadStorageService } from "./upload-storage.service.js";

@Module({
  controllers: [UploadsController],
  providers: [AdminGuard, PrivateUploadsMigration, UploadStorageService],
  exports: [UploadStorageService],
})
export class UploadsModule {}
