# NEXIERA MVP - Complete System Architecture & AI Implementation Guide

Dokumen ini berisi seluruh spesifikasi sistem, skema database, arsitektur modul backend (NestJS), panduan integrasi frontend (Next.js), konfigurasi lingkungan, serta prompt lengkap untuk dieksekusi oleh AI Agent / IDE Assistant (seperti Cursor, Claude, atau ChatGPT).

---

## 1. Ringkasan Proyek & Aturan Bisnis Inti (Business Rules)

- **Platform**: Marketplace kelas bimbingan & bootcamp edukasi ("NEXIERA").
- **Tech Stack**:
  - **Backend**: NestJS (TypeScript), Prisma ORM, MySQL 8.0, Google OAuth 2.0, Payment Gateway (Midtrans/Xendit Webhook).
  - **Frontend**: Next.js (App Router), Tailwind CSS.
- **Aturan Bisnis Utama**:
  1. **Tanpa Wallet / Voucher Internal**: Pembayaran dilakukan via payment gateway, dan pengembalian dana (_refund_) ditransfer langsung ke rekening bank / e-wallet pengguna.
  2. **Wajib Nomor WhatsApp**: Profil pengguna (`User`) wajib menyimpan nomor telepon/WhatsApp (`phoneNumber`) untuk memudahkan komunikasi langsung antar-pengajar dan mahasiswa.
  3. **Proteksi Tautan Meeting**: Tautan Zoom/GMeet/Drive (`meetingLink`) disembunyikan secara eksplisit dan hanya terbuka jika transaksi peserta berstatus `PAID` (atau jika pengguna adalah pemilik kelas).
  4. **Pembatalan Kelas & Auto-Refund**: Pengajar dapat membatalkan kelas. Tindakan ini mengubah status kelas menjadi `CANCELLED` dan secara otomatis mengubah status seluruh transaksi peserta `PAID` menjadi `REFUNDED` (100% auto-refund).
  5. **Sistem Iklan Mandiri & Fallback Banner**: Pengajar/mitra dapat menyewa slot iklan (`HERO_BANNER`, `IN_FEED`, `SIDEBAR`). Jika suatu slot tidak memiliki iklan aktif (`activeAds == 0`), sistem otomatis menampilkan **Banner Official NEXIERA**.
  6. **Pelacakan Presensi Sederhana**: Presensi dihitung berdasarkan sesi yang diikuti (misal `3/4 Sesi`).
  7. **Manajemen Peserta MVP yang Ramping**: Bebas dari persetujuan manual yang rumit; status peserta menjadi `Aktif` secara otomatis via laporan webhook payment gateway.

---

## 2. Skema Database MySQL (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  MAHASISWA
  PEER_TUTOR
  MITRA_BOOTCAMP
  ADMIN
}

enum StatusKelas {
  DRAFT
  ACTIVE
  CANCELLED
  COMPLETED
}

enum StatusTransaksi {
  PENDING
  PAID
  REFUNDED
  FAILED
}

enum SlotIklan {
  HERO_BANNER
  IN_FEED
  SIDEBAR
}

enum StatusIklan {
  PENDING_PAYMENT
  ACTIVE
  EXPIRED
  REJECTED
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  fullName     String
  phoneNumber  String?  @db.VarChar(20) // Nomor WhatsApp wajib untuk komunikasi
  avatarUrl    String?  @db.Text
  role         Role     @default(MAHASISWA)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  classesTaught Class[]       @relation("TutorClasses")
  transactions  Transaction[] @relation("StudentTransactions")
  presences     Presence[]
  ads           Ad[]

  @@map("users")
}

model Class {
  id                 String      @id @default(uuid())
  tutorId            String
  tutor              User        @relation("TutorClasses", fields: [tutorId], references: [id], onDelete: Cascade)
  title              String      @db.VarChar(255)
  description        String      @db.Text
  subject            String      @db.VarChar(100)
  price              Decimal     @db.Decimal(12, 2)
  status             StatusKelas @default(ACTIVE)
  meetingLink        String?     @db.Text // Dilindungi: hanya dikirim/ditampilkan jika status transaksi PAID
  totalSessions      Int         @default(1)
  scheduleInfo       String?     @db.VarChar(255)
  cancellationReason String?     @db.Text
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt

  transactions Transaction[]
  presences    Presence[]
  ads          Ad[]

  @@index([subject])
  @@index([status])
  @@map("classes")
}

model Transaction {
  id                  String          @id @default(uuid())
  studentId           String
  student             User            @relation("StudentTransactions", fields: [studentId], references: [id], onDelete: Cascade)
  classId             String
  class               Class           @relation(fields: [classId], references: [id], onDelete: Cascade)
  amount              Decimal         @db.Decimal(12, 2) // Total kotor
  platformFee         Decimal         @db.Decimal(12, 2) // Komisi platform (5%-10%)
  netAmount           Decimal         @db.Decimal(12, 2) // Pendapatan bersih tutor
  status              StatusTransaksi @default(PENDING)
  snapToken           String?         @db.VarChar(255) // Reference Token dari Midtrans/Xendit
  paymentType         String?         @db.VarChar(50)  // gopay, bank_transfer, qris, dll.
  refundBankName      String?         @db.VarChar(50)  // Data transfer pengembalian dana
  refundAccountNumber String?         @db.VarChar(50)
  refundAccountName   String?         @db.VarChar(100)
  paidAt              DateTime?
  refundedAt          DateTime?
  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt

  @@index([studentId])
  @@index([classId])
  @@index([status])
  @@map("transactions")
}

model Presence {
  id         String   @id @default(uuid())
  classId    String
  class      Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  studentId  String
  student    User     @relation(fields: [studentId], references: [id], onDelete: Cascade)
  sessionNum Int      // Sesi ke-N (misal: 1, 2, 3)
  attendedAt DateTime @default(now())

  @@unique([classId, studentId, sessionNum]) // Mencegah duplikasi absensi pada sesi yang sama
  @@map("presences")
}

model Ad {
  id          String      @id @default(uuid())
  tutorId     String
  tutor       User        @relation(fields: [tutorId], references: [id], onDelete: Cascade)
  classId     String?
  class       Class?      @relation(fields: [classId], references: [id], onDelete: Set Null)
  slotType    SlotIklan
  bannerUrl   String      @db.Text
  targetUrl   String?     @db.Text
  price       Decimal     @db.Decimal(12, 2)
  status      StatusIklan @default(PENDING_PAYMENT)
  impressions Int         @default(0)
  clicks      Int         @default(0)
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([slotType, status])
  @@map("ads")
}

3. Struktur Folder Proyek Rekomendasi
Plaintext
projects/
├── nexiera-backend/          # Repositori NestJS
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── common/
│   │   │   ├── decorators/current-user.decorator.ts
│   │   │   ├── guards/jwt-auth.guard.ts
│   │   │   └── filters/http-exception.filter.ts
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   ├── auth/
│   │   │   ├── strategies/google.strategy.ts
│   │   │   ├── strategies/jwt.strategy.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   ├── classes/
│   │   │   ├── classes.controller.ts
│   │   │   ├── classes.service.ts
│   │   │   └── classes.module.ts
│   │   ├── transactions/
│   │   │   ├── transactions.controller.ts
│   │   │   ├── transactions.service.ts
│   │   │   └── transactions.module.ts
│   │   ├── ads/
│   │   │   ├── ads.controller.ts
│   │   │   ├── ads.service.ts
│   │   │   └── ads.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   ├── docker-compose.yml
│   └── package.json
│
└── nexiera-frontend/         # Repositori Next.js
    ├── app/
    │   ├── (auth)/
    │   ├── dashboard/
    │   │   ├── tutor/
    │   │   └── student/
    │   ├── kelas/
    │   │   ├── page.tsx
    │   │   └── [id]/page.tsx
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── ads/
    │   │   └── banner-slot.tsx
    │   └── ui/
    ├── lib/
    │   └── api.ts
    ├── .env.local.example
    └── package.json
4. Implementasi Kode Logika Utama (NestJS)
A. Autentikasi Google OAuth Strategy (src/auth/strategies/google.strategy.ts)
TypeScript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const email = emails[0].value;

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          fullName: `${name.givenName || ''} ${name.familyName || ''}`.trim(),
          avatarUrl: photos[0]?.value,
          role: 'MAHASISWA',
        },
      });
    }

    done(null, user);
  }
}
B. Proteksi Tautan Meeting (src/classes/classes.service.ts)
TypeScript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async getClassDetails(classId: string, userId?: string) {
    const foundClass = await this.prisma.class.findUnique({
      where: { id: classId },
      include: {
        tutor: {
          select: { id: true, fullName: true, avatarUrl: true, phoneNumber: true },
        },
      },
    });

    if (!foundClass) throw new NotFoundException('Kelas tidak ditemukan');

    let hasPaidAccess = false;

    if (userId) {
      if (foundClass.tutorId === userId) {
        hasPaidAccess = true;
      } else {
        const transaction = await this.prisma.transaction.findFirst({
          where: {
            classId,
            studentId: userId,
            status: 'PAID',
          },
        });
        if (transaction) hasPaidAccess = true;
      }
    }

    return {
      ...foundClass,
      meetingLink: hasPaidAccess ? foundClass.meetingLink : null,
      isEnrolled: hasPaidAccess,
    };
  }
}
C. Pemrosesan Checkout & Payment Webhook (src/transactions/transactions.service.ts)
TypeScript
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async createCheckout(studentId: string, classId: string) {
    const targetClass = await this.prisma.class.findUnique({ where: { id: classId } });
    if (!targetClass || targetClass.status !== 'ACTIVE') {
      throw new BadRequestException('Kelas tidak tersedia untuk dipesan');
    }

    const amount = Number(targetClass.price);
    const platformFeeRate = 0.08;
    const platformFee = amount * platformFeeRate;
    const netAmount = amount - platformFee;

    const transaction = await this.prisma.transaction.create({
      data: {
        studentId,
        classId,
        amount,
        platformFee,
        netAmount,
        status: 'PENDING',
      },
    });

    const snapToken = `SNAP-TOKEN-${transaction.id}`;

    await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: { snapToken },
    });

    return { transactionId: transaction.id, snapToken, amount };
  }

  async handleMidtransWebhook(payload: any) {
    const { order_id, transaction_status, fraud_status, signature_key, statusCode, gross_amount } = payload;
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${statusCode}${gross_amount}${serverKey}`)
      .digest('hex');

    if (hash !== signature_key) {
      throw new BadRequestException('Invalid signature key');
    }

    let updatedStatus: 'PAID' | 'FAILED' | 'PENDING' = 'PENDING';

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept' || !fraud_status) {
        updatedStatus = 'PAID';
      }
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      updatedStatus = 'FAILED';
    }

    if (updatedStatus !== 'PENDING') {
      await this.prisma.transaction.update({
        where: { id: order_id },
        data: {
          status: updatedStatus,
          paidAt: updatedStatus === 'PAID' ? new Date() : null,
          paymentType: payload.payment_type || 'online_payment',
        },
      });
    }

    return { status: 'OK' };
  }
}
D. Pembatalan Kelas Otomatis & Auto-Refund (src/classes/classes.service.ts)
TypeScript
async cancelClassByTutor(classId: string, tutorId: string, reason: string) {
  const targetClass = await this.prisma.class.findUnique({ where: { id: classId } });

  if (!targetClass) throw new NotFoundException('Kelas tidak ditemukan');
  if (targetClass.tutorId !== tutorId) {
    throw new BadRequestException('Anda tidak berhak membatalkan kelas ini');
  }

  await this.prisma.class.update({
    where: { id: classId },
    data: {
      status: 'CANCELLED',
      cancellationReason: reason,
    },
  });

  const paidTransactions = await this.prisma.transaction.findMany({
    where: { classId, status: 'PAID' },
  });

  const refundPromises = paidTransactions.map((tx) =>
    this.prisma.transaction.update({
      where: { id: tx.id },
      data: {
        status: 'REFUNDED',
        refundedAt: new Date(),
      },
    }),
  );

  await Promise.all(refundPromises);

  return {
    message: 'Kelas berhasil dibatalkan. Seluruh transaksi peserta telah diproses untuk auto-refund.',
    affectedStudents: paidTransactions.length,
  };
}
E. Ads Fallback Banner Logic (src/ads/ads.service.ts)
TypeScript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SlotIklan } from '@prisma/client';

@Injectable()
export class AdsService {
  constructor(private prisma: PrismaService) {}

  async getActiveAdsBySlot(slot: SlotIklan) {
    const activeAds = await this.prisma.ad.findMany({
      where: {
        slotType: slot,
        status: 'ACTIVE',
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      include: {
        class: { select: { id: true, title: true, subject: true, price: true } },
      },
    });

    if (activeAds.length === 0) {
      return [
        {
          id: 'official-fallback-banner',
          isFallback: true,
          slotType: slot,
          bannerUrl: '/assets/images/official-nexiera-banner.png',
          targetUrl: '/kelas',
          title: 'Tingkatkan Skill Bersama Peer-Tutor NEXIERA',
        },
      ];
    }

    return activeAds;
  }
}
5. Konfigurasi Environment & Container
docker-compose.yml
YAML
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: nexiera_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: nexiera_db
      MYSQL_USER: nexiera_user
      MYSQL_PASSWORD: nexiera_password
    ports:
      - '3306:3306'
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
.env.example
Cuplikan kode
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

DATABASE_URL="mysql://nexiera_user:nexiera_password@localhost:3306/nexiera_db"

JWT_SECRET="NEXIERA_SUPER_SECRET_JWT_KEY_2026"
JWT_EXPIRES_IN="7d"

GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

MIDTRANS_SERVER_KEY="SB-Mid-server-YOUR_SERVER_KEY"
MIDTRANS_CLIENT_KEY="SB-Mid-client-YOUR_CLIENT_KEY"
MIDTRANS_IS_PRODUCTION=false
```
