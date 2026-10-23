-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `googleId` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(32) NOT NULL,
    `role` ENUM('STUDENT', 'TUTOR', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    `university` VARCHAR(191) NULL,
    `major` VARCHAR(191) NULL,
    `studentNumber` VARCHAR(64) NULL,
    `semester` VARCHAR(64) NULL,
    `avatarUrl` TEXT NULL,
    `coverUrl` TEXT NULL,
    `bio` TEXT NULL,
    `headline` VARCHAR(191) NULL,
    `organizationName` VARCHAR(191) NULL,
    `organizationLogoUrl` TEXT NULL,
    `location` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_googleId_key`(`googleId`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TutorApplication` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('PEER_TUTOR', 'BOOTCAMP_PARTNER') NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `organizationName` VARCHAR(191) NULL,
    `contactPerson` VARCHAR(191) NULL,
    `studentCardUrl` TEXT NULL,
    `transcriptUrl` TEXT NULL,
    `organizationProofUrl` TEXT NULL,
    `notes` TEXT NULL,
    `reviewerId` VARCHAR(191) NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TutorApplication_userId_key`(`userId`),
    INDEX `TutorApplication_status_submittedAt_idx`(`status`, `submittedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Class` (
    `id` VARCHAR(191) NOT NULL,
    `tutorId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `shortDescription` TEXT NULL,
    `description` TEXT NOT NULL,
    `mainCategory` VARCHAR(191) NULL,
    `major` VARCHAR(191) NULL,
    `university` VARCHAR(191) NULL,
    `courseType` ENUM('PEER_TUTORING', 'BOOTCAMP') NOT NULL DEFAULT 'PEER_TUTORING',
    `organizerName` VARCHAR(191) NULL,
    `organizerLogo` TEXT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'IDR',
    `status` ENUM('DRAFT', 'ACTIVE', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `startsAt` DATETIME(3) NULL,
    `accessDuration` VARCHAR(191) NULL,
    `maxQuota` INTEGER NULL,
    `requirements` JSON NULL,
    `facilities` JSON NULL,
    `meetingPlatform` VARCHAR(32) NULL,
    `meetingUrl` TEXT NULL,
    `materialPlatform` VARCHAR(32) NULL,
    `materialUrl` TEXT NULL,
    `recordingUrl` TEXT NULL,
    `driveUrl` TEXT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancellationReason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Class_status_startsAt_idx`(`status`, `startsAt`),
    INDEX `Class_tutorId_status_idx`(`tutorId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `classId` VARCHAR(191) NOT NULL,
    `midtransOrderId` VARCHAR(64) NULL,
    `midtransTransactionId` VARCHAR(64) NULL,
    `midtransRedirectUrl` TEXT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `currency` CHAR(3) NOT NULL DEFAULT 'IDR',
    `status` ENUM('PENDING', 'PAID', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `refundStatus` ENUM('NOT_REQUESTED', 'PROCESSING', 'COMPLETED', 'FAILED', 'MANUAL_REQUIRED') NOT NULL DEFAULT 'NOT_REQUESTED',
    `refundProviderReference` VARCHAR(191) NULL,
    `refundFailureReason` TEXT NULL,
    `paidAt` DATETIME(3) NULL,
    `refundRequestedAt` DATETIME(3) NULL,
    `refundedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Transaction_midtransOrderId_key`(`midtransOrderId`),
    UNIQUE INDEX `Transaction_midtransTransactionId_key`(`midtransTransactionId`),
    INDEX `Transaction_classId_status_idx`(`classId`, `status`),
    UNIQUE INDEX `Transaction_userId_classId_status_key`(`userId`, `classId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Presence` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `classId` VARCHAR(191) NOT NULL,
    `status` ENUM('PRESENT', 'ABSENT', 'LATE') NOT NULL DEFAULT 'ABSENT',
    `markedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Presence_classId_status_idx`(`classId`, `status`),
    UNIQUE INDEX `Presence_userId_classId_key`(`userId`, `classId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ad` (
    `id` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` TEXT NULL,
    `placement` ENUM('HOME_HERO', 'CLASS_CATALOG', 'DASHBOARD') NOT NULL,
    `imageUrl` TEXT NOT NULL,
    `targetUrl` TEXT NOT NULL,
    `startsAt` DATETIME(3) NOT NULL,
    `endsAt` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'PAUSED') NOT NULL DEFAULT 'ACTIVE',
    `impressions` INTEGER NOT NULL DEFAULT 0,
    `clicks` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Ad_placement_status_startsAt_endsAt_idx`(`placement`, `status`, `startsAt`, `endsAt`),
    INDEX `Ad_ownerId_status_idx`(`ownerId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassReview` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `classId` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,
    `reply` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ClassReview_classId_createdAt_idx`(`classId`, `createdAt`),
    UNIQUE INDEX `ClassReview_userId_classId_key`(`userId`, `classId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassReport` (
    `id` VARCHAR(191) NOT NULL,
    `reporterId` VARCHAR(191) NOT NULL,
    `targetType` ENUM('CLASS', 'ORGANIZER') NOT NULL,
    `targetId` VARCHAR(191) NOT NULL,
    `classId` VARCHAR(191) NULL,
    `category` VARCHAR(64) NOT NULL,
    `description` TEXT NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'PENDING_REVIEW',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ClassReport_targetType_targetId_status_idx`(`targetType`, `targetId`, `status`),
    INDEX `ClassReport_reporterId_createdAt_idx`(`reporterId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TutorApplication` ADD CONSTRAINT `TutorApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presence` ADD CONSTRAINT `Presence_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Presence` ADD CONSTRAINT `Presence_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ad` ADD CONSTRAINT `Ad_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassReview` ADD CONSTRAINT `ClassReview_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassReview` ADD CONSTRAINT `ClassReview_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassReport` ADD CONSTRAINT `ClassReport_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassReport` ADD CONSTRAINT `ClassReport_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
