ALTER TABLE `transactions`
  MODIFY `status` ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  ADD COLUMN `refundProofUrl` TEXT NULL;

CREATE TABLE `role_applications` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `type` ENUM('PEER_TUTOR', 'MITRA_BOOTCAMP') NOT NULL,
  `status` ENUM('PENDING_VERIFICATION', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING_VERIFICATION',
  `campus` VARCHAR(191) NULL,
  `major` VARCHAR(191) NULL,
  `studentProofUrl` TEXT NOT NULL,
  `organizationName` VARCHAR(191) NULL,
  `contactEmail` VARCHAR(191) NULL,
  `logoUrl` TEXT NULL,
  `websiteUrl` TEXT NULL,
  `description` TEXT NULL,
  `reviewNote` TEXT NULL,
  `reviewedById` VARCHAR(191) NULL,
  `reviewedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `role_applications_userId_type_key` (`userId`, `type`),
  INDEX `role_applications_status_createdAt_idx` (`status`, `createdAt`),
  PRIMARY KEY (`id`),
  CONSTRAINT `role_applications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `private_uploads` (
  `id` VARCHAR(191) NOT NULL,
  `filename` VARCHAR(191) NOT NULL,
  `ownerId` VARCHAR(191) NOT NULL,
  `purpose` ENUM('STUDENT_PROOF', 'REPORT_EVIDENCE', 'REFUND_PROOF') NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `private_uploads_filename_key` (`filename`),
  INDEX `private_uploads_ownerId_purpose_createdAt_idx` (`ownerId`, `purpose`, `createdAt`),
  PRIMARY KEY (`id`),
  CONSTRAINT `private_uploads_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
