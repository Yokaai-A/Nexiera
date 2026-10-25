CREATE SCHEMA IF NOT EXISTS "public";
CREATE TYPE "Role" AS ENUM ('MAHASISWA', 'PEER_TUTOR', 'MITRA_BOOTCAMP');
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');
CREATE TYPE "RoleApplicationType" AS ENUM ('PEER_TUTOR', 'MITRA_BOOTCAMP');
CREATE TYPE "RoleApplicationStatus" AS ENUM ('PENDING_VERIFICATION', 'APPROVED', 'REJECTED');
CREATE TYPE "PrivateUploadPurpose" AS ENUM ('STUDENT_PROOF', 'REPORT_EVIDENCE', 'REFUND_PROOF');
CREATE TYPE "RefundStatus" AS ENUM ('NOT_REQUESTED', 'PENDING_REVIEW', 'PROCESSING', 'REFUNDED', 'REJECTED');
CREATE TYPE "ReportTargetType" AS ENUM ('CLASS', 'ORGANIZER');
CREATE TYPE "ClassType" AS ENUM ('PEER_TUTORING', 'BOOTCAMP');
CREATE TYPE "TutorGrade" AS ENUM ('A', 'A_MINUS', 'B_PLUS');
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactEmail" TEXT,
    "password" TEXT,
    "fullName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bannerUrl" TEXT,
    "headline" TEXT,
    "bio" TEXT,
    "campus" TEXT,
    "major" TEXT,
    "studentNumber" TEXT,
    "semester" TEXT,
    "organizationName" TEXT,
    "organizationLogoUrl" TEXT,
    "organizationWebsiteUrl" TEXT,
    "bootcampStudentProofUrl" TEXT,
    "location" TEXT,
    "tutorGpa" DECIMAL(3,2),
    "tutorTranscriptUrl" TEXT,
    "roles" JSONB NOT NULL DEFAULT '["MAHASISWA"]',
    "activeRole" "Role" NOT NULL DEFAULT 'MAHASISWA',
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "type" "ClassType" NOT NULL DEFAULT 'PEER_TUTORING',
    "tutorGrade" "TutorGrade",
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "category" TEXT NOT NULL,
    "major" TEXT,
    "campusTarget" TEXT,
    "bannerUrl" TEXT,
    "startsAt" TIMESTAMP(3),
    "accessDuration" VARCHAR(191),
    "accessUntil" TIMESTAMP(3),
    "maxQuota" INTEGER,
    "meetingPlatform" VARCHAR(191),
    "meetingLink" TEXT,
    "materialPlatform" VARCHAR(191),
    "materialLink" TEXT,
    "recordingLink" TEXT,
    "requirements" JSONB,
    "facilities" JSONB,
    "reviewStatus" VARCHAR(32) NOT NULL DEFAULT 'APPROVED',
    "reviewNote" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "bootcamp_tutors" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "headline" TEXT,
    "linkedinUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bootcamp_tutors_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "reply" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "refundStatus" "RefundStatus" NOT NULL DEFAULT 'NOT_REQUESTED',
    "refundMethod" TEXT,
    "refundAccountName" TEXT,
    "refundAccountNumber" TEXT,
    "refundRequestedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "refundProofUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "role_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "RoleApplicationType" NOT NULL,
    "status" "RoleApplicationStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "campus" TEXT,
    "major" TEXT,
    "studentProofUrl" TEXT NOT NULL,
    "organizationName" TEXT,
    "contactEmail" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "description" TEXT,
    "reviewNote" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_applications_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "private_uploads" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "purpose" "PrivateUploadPurpose" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "private_uploads_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ClassReport" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "targetType" "ReportTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "classId" TEXT,
    "category" VARCHAR(64) NOT NULL,
    "description" TEXT NOT NULL,
    "evidenceUrl" TEXT,
    "status" VARCHAR(32) NOT NULL DEFAULT 'PENDING_REVIEW',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassReport_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "email_verification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" CHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "course_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "campus" VARCHAR(160),
    "major" VARCHAR(160),
    "courseCode" VARCHAR(64),
    "note" TEXT,
    "status" VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_requests_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "linkUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ads" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "placement" TEXT NOT NULL DEFAULT 'HOME_HERO',
    "imageUrl" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ads_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "classes_slug_key" ON "classes"("slug");
CREATE INDEX "classes_startsAt_idx" ON "classes"("startsAt");
CREATE INDEX "classes_reviewStatus_createdAt_idx" ON "classes"("reviewStatus", "createdAt");
CREATE UNIQUE INDEX "reviews_userId_classId_key" ON "reviews"("userId", "classId");
CREATE UNIQUE INDEX "transactions_orderId_key" ON "transactions"("orderId");
CREATE INDEX "role_applications_status_createdAt_idx" ON "role_applications"("status", "createdAt");
CREATE UNIQUE INDEX "role_applications_userId_type_key" ON "role_applications"("userId", "type");
CREATE UNIQUE INDEX "private_uploads_filename_key" ON "private_uploads"("filename");
CREATE INDEX "private_uploads_ownerId_purpose_createdAt_idx" ON "private_uploads"("ownerId", "purpose", "createdAt");
CREATE INDEX "ClassReport_targetType_targetId_status_idx" ON "ClassReport"("targetType", "targetId", "status");
CREATE INDEX "ClassReport_reporterId_createdAt_idx" ON "ClassReport"("reporterId", "createdAt");
CREATE UNIQUE INDEX "email_verification_tokens_tokenHash_key" ON "email_verification_tokens"("tokenHash");
CREATE INDEX "email_verification_tokens_userId_createdAt_idx" ON "email_verification_tokens"("userId", "createdAt");
CREATE INDEX "course_requests_status_createdAt_idx" ON "course_requests"("status", "createdAt");
ALTER TABLE "classes" ADD CONSTRAINT "classes_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bootcamp_tutors" ADD CONSTRAINT "bootcamp_tutors_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "bootcamp_tutors" ADD CONSTRAINT "bootcamp_tutors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "role_applications" ADD CONSTRAINT "role_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "private_uploads" ADD CONSTRAINT "private_uploads_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClassReport" ADD CONSTRAINT "ClassReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClassReport" ADD CONSTRAINT "ClassReport_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_requests" ADD CONSTRAINT "course_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ads" ADD CONSTRAINT "ads_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

