ALTER TABLE `transactions`
  ADD COLUMN `refundStatus` ENUM('NOT_REQUESTED', 'PENDING_REVIEW', 'PROCESSING', 'REFUNDED', 'REJECTED') NOT NULL DEFAULT 'NOT_REQUESTED',
  ADD COLUMN `refundMethod` VARCHAR(191) NULL,
  ADD COLUMN `refundAccountName` VARCHAR(191) NULL,
  ADD COLUMN `refundAccountNumber` VARCHAR(191) NULL,
  ADD COLUMN `refundRequestedAt` DATETIME(3) NULL,
  ADD COLUMN `refundedAt` DATETIME(3) NULL;

CREATE TABLE `ClassReport` (
  `id` VARCHAR(191) NOT NULL,
  `reporterId` VARCHAR(191) NOT NULL,
  `targetType` ENUM('CLASS', 'ORGANIZER') NOT NULL,
  `targetId` VARCHAR(191) NOT NULL,
  `classId` VARCHAR(191) NULL,
  `category` VARCHAR(64) NOT NULL,
  `description` TEXT NOT NULL,
  `evidenceUrl` TEXT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'PENDING_REVIEW',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `ClassReport_targetType_targetId_status_idx` (`targetType`, `targetId`, `status`),
  INDEX `ClassReport_reporterId_createdAt_idx` (`reporterId`, `createdAt`),
  PRIMARY KEY (`id`),
  CONSTRAINT `ClassReport_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ClassReport_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
