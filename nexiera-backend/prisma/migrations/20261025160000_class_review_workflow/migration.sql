ALTER TABLE `classes`
  ADD COLUMN `reviewStatus` VARCHAR(32) NOT NULL DEFAULT 'APPROVED',
  ADD COLUMN `reviewNote` TEXT NULL,
  ADD COLUMN `reviewedById` VARCHAR(191) NULL,
  ADD COLUMN `reviewedAt` DATETIME(3) NULL,
  ADD INDEX `classes_reviewStatus_createdAt_idx` (`reviewStatus`, `createdAt`);
