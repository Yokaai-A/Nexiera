import "reflect-metadata";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || !["localhost", "127.0.0.1", "::1"].includes(new URL(databaseUrl).hostname)) {
  throw new Error("Demo refresh only runs against a local database.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

const demoClasses = [
  {
    slug: "bootcamp-pemrograman-berorientasi-objek",
    orderId: "NEX-SEED-ENROLL-1",
    startsAt: new Date("2026-10-27T19:00:00+07:00"),
    meetingLink: "https://meet.jit.si/nexiera-demo-budi-object-oriented-programming-2026",
    materialLink: "https://docs.oracle.com/javase/tutorial/java/concepts/",
  },
  {
    slug: "struktur-data-dan-algoritma",
    orderId: "NEX-SEED-ENROLL-2",
    startsAt: new Date("2026-10-29T19:00:00+07:00"),
    meetingLink: "https://meet.jit.si/nexiera-demo-budi-struktur-data-2026",
    materialLink: "https://visualgo.net/en",
  },
] as const;

async function main() {
  const student = await prisma.user.findUnique({ where: { email: "budi@student.com" } });
  if (!student) throw new Error("Demo account budi@student.com was not found. Run the normal seed first.");

  const databaseClass = await prisma.class.findUnique({ where: { slug: "sistem-basis-data" }, select: { id: true } });
  if (databaseClass) {
    await prisma.transaction.deleteMany({ where: { userId: student.id, classId: databaseClass.id } });
  }

  const oopClass = await prisma.class.findUnique({ where: { slug: "bootcamp-pemrograman-berorientasi-objek" }, select: { id: true } });
  if (oopClass) {
    await prisma.transaction.deleteMany({
      where: { userId: student.id, classId: oopClass.id, amount: 0, orderId: { not: "NEX-SEED-ENROLL-1" } },
    });
  }

  for (const demo of demoClasses) {
    const classRecord = await prisma.class.findUnique({ where: { slug: demo.slug } });
    if (!classRecord) throw new Error(`Demo class ${demo.slug} was not found. Run the normal seed first.`);

    await prisma.class.update({
      where: { id: classRecord.id },
      data: {
        startsAt: demo.startsAt,
        meetingLink: demo.meetingLink,
        materialLink: demo.materialLink,
        recordingLink: null,
      },
    });

    await prisma.transaction.upsert({
      where: { orderId: demo.orderId },
      update: {
        userId: student.id,
        classId: classRecord.id,
        amount: classRecord.price,
        status: "PAID",
        refundStatus: "NOT_REQUESTED",
        refundMethod: null,
        refundAccountName: null,
        refundAccountNumber: null,
        refundRequestedAt: null,
        refundedAt: null,
      },
      create: {
        orderId: demo.orderId,
        userId: student.id,
        classId: classRecord.id,
        amount: classRecord.price,
        status: "PAID",
        refundStatus: "NOT_REQUESTED",
      },
    });
  }

  await prisma.notification.deleteMany({ where: { userId: student.id, type: "ENROLLMENT" } });
  await prisma.notification.createMany({
    data: [
      {
        userId: student.id,
        title: "Pendaftaran Kelas Berhasil",
        message: 'Anda terdaftar di kelas "Object Oriented Programming". Jadwal dan tautan sesi tersedia di Kelas Saya.',
        type: "ENROLLMENT",
        linkUrl: "/dashboard/kelas-saya",
      },
      {
        userId: student.id,
        title: "Pendaftaran Kelas Berhasil",
        message: 'Anda terdaftar di kelas "Struktur Data & Algoritma". Jadwal dan tautan sesi tersedia di Kelas Saya.',
        type: "ENROLLMENT",
        linkUrl: "/dashboard/kelas-saya",
      },
    ],
  });

  console.log("Budi demo refreshed: Database Systems enrollment/notification removed; OOP and Data Structures enrollments, schedules, links, and notifications are ready.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
