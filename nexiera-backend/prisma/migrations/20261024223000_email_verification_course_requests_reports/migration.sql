ALTER TABLE `users` ADD COLUMN `emailVerifiedAt` DATETIME(3) NULL;
UPDATE `users` SET `emailVerifiedAt` = CURRENT_TIMESTAMP(3) WHERE `emailVerifiedAt` IS NULL;

ALTER TABLE `ClassReport` ADD COLUMN `adminNote` TEXT NULL;

CREATE TABLE `email_verification_tokens` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `tokenHash` CHAR(64) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `consumedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `email_verification_tokens_tokenHash_key` (`tokenHash`),
  INDEX `email_verification_tokens_userId_createdAt_idx` (`userId`, `createdAt`),
  PRIMARY KEY (`id`),
  CONSTRAINT `email_verification_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `course_requests` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(160) NOT NULL,
  `campus` VARCHAR(160) NULL,
  `major` VARCHAR(160) NULL,
  `courseCode` VARCHAR(64) NULL,
  `note` TEXT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `course_requests_status_createdAt_idx` (`status`, `createdAt`),
  PRIMARY KEY (`id`),
  CONSTRAINT `course_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
