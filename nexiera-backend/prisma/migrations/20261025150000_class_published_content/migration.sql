ALTER TABLE `classes`
  ADD COLUMN `shortDescription` TEXT NULL,
  ADD COLUMN `meetingPlatform` VARCHAR(191) NULL,
  ADD COLUMN `materialPlatform` VARCHAR(191) NULL,
  ADD COLUMN `requirements` JSON NULL,
  ADD COLUMN `facilities` JSON NULL;
