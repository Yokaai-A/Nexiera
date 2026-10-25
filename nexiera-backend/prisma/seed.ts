import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, Role, ClassType } from "../src/generated/prisma/client.js";
import { universityCourses } from "../src/classes/university-courses.js";
import { demoClassSessions } from "./demo-class-sessions.js";
export { universityCourses };

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT || 3306),
  user: process.env.DATABASE_USER || "nexiera",
  password: process.env.DATABASE_PASSWORD || "nexiera_local_password",
  database: process.env.DATABASE_NAME || "nexiera",
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database with authentic NEXIERA academic classes...");
  const defaultPasswordHash = await bcrypt.hash("password123", 12);




  const tutorKevin = await prisma.user.upsert({
    where: { email: "kevin@student.com" },
    update: {
      password: defaultPasswordHash,
      emailVerifiedAt: new Date(),
      fullName: "Kevin Sanjaya",
      roles: [Role.MAHASISWA, Role.PEER_TUTOR, Role.MITRA_BOOTCAMP],
      activeRole: Role.PEER_TUTOR,
      campus: "BINUS University",
      major: "Teknik Informatika",
      contactEmail: "kevin.tutor@binus.ac.id",
      headline: "Peer-Tutor Teknik Informatika BINUS",
      bio: "Mahasiswa tingkat atas Teknik Informatika dengan fokus pada Algoritma, Struktur Data, dan Pemrograman C/C++. Berpengalaman membimbing puluhan mahasiswa dalam persiapan UTS & UAS.",
    },
    create: {
      email: "kevin@student.com",
      emailVerifiedAt: new Date(),
      contactEmail: "kevin.tutor@binus.ac.id",
      password: defaultPasswordHash,
      fullName: "Kevin Sanjaya",
      phoneNumber: "081234567890",
      roles: [Role.MAHASISWA, Role.PEER_TUTOR, Role.MITRA_BOOTCAMP],
      activeRole: Role.PEER_TUTOR,
      campus: "BINUS University",
      major: "Teknik Informatika",
      headline: "Peer-Tutor Teknik Informatika BINUS",
      bio: "Mahasiswa tingkat atas Teknik Informatika dengan fokus pada Algoritma, Struktur Data, dan Pemrograman C/C++. Berpengalaman membimbing puluhan mahasiswa dalam persiapan UTS & UAS.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
  });

  const tutorAhmad = await prisma.user.upsert({
    where: { email: "ahmad@student.com" },
    update: {
      password: defaultPasswordHash,
      emailVerifiedAt: new Date(),
      fullName: "Ahmad Dahlan",
      roles: [Role.MAHASISWA, Role.PEER_TUTOR],
      activeRole: Role.PEER_TUTOR,
      campus: "Universitas Indonesia",
      major: "Sistem Informasi",
      contactEmail: "ahmad.dahlan@ui.ac.id",
      headline: "Peer-Tutor Sistem Informasi UI",
      bio: "Fokus pada Rekayasa Perangkat Lunak, Basis Data SQL, dan Pemodelan Sistem Berorientasi Objek.",
    },
    create: {
      email: "ahmad@student.com",
      emailVerifiedAt: new Date(),
      contactEmail: "ahmad.dahlan@ui.ac.id",
      password: defaultPasswordHash,
      fullName: "Ahmad Dahlan",
      phoneNumber: "081298765432",
      roles: [Role.MAHASISWA, Role.PEER_TUTOR],
      activeRole: Role.PEER_TUTOR,
      campus: "Universitas Indonesia",
      major: "Sistem Informasi",
      headline: "Peer-Tutor Sistem Informasi UI",
      bio: "Fokus pada Rekayasa Perangkat Lunak, Basis Data SQL, dan Pemodelan Sistem Berorientasi Objek.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    },
  });

  const boosterAcademy = await prisma.user.upsert({
    where: { email: "rafi.pratama@student.ac.id" },
    update: {
      password: defaultPasswordHash,
      emailVerifiedAt: new Date(),
      fullName: "Rafi Pratama",
      roles: [Role.MAHASISWA, Role.PEER_TUTOR, Role.MITRA_BOOTCAMP],
      activeRole: Role.MITRA_BOOTCAMP,
      campus: "BINUS University",
      major: "Teknik Informatika",
      organizationName: "Booster Academy",
      organizationLogoUrl: "/Logo_Akhir.png",
      contactEmail: "info@boosteracademy.id",
      headline: "Mahasiswa Teknik Informatika & Pengelola Mitra Bootcamp",
      bio: "Mahasiswa BINUS University yang mengelola program bimbingan akademik Booster Academy.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    },
    create: {
      email: "rafi.pratama@student.ac.id",
      emailVerifiedAt: new Date(),
      contactEmail: "info@boosteracademy.id",
      password: defaultPasswordHash,
      fullName: "Rafi Pratama",
      phoneNumber: "081311223344",
      roles: [Role.MAHASISWA, Role.PEER_TUTOR, Role.MITRA_BOOTCAMP],
      activeRole: Role.MITRA_BOOTCAMP,
      campus: "BINUS University",
      major: "Teknik Informatika",
      organizationName: "Booster Academy",
      organizationLogoUrl: "/Logo_Akhir.png",
      headline: "Mahasiswa Teknik Informatika & Pengelola Mitra Bootcamp",
      bio: "Mahasiswa BINUS University yang mengelola program bimbingan akademik Booster Academy.",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    },
  });

  const studentBudi = await prisma.user.upsert({
    where: { email: "budi@student.com" },
    update: {
      password: defaultPasswordHash,
      emailVerifiedAt: new Date(),
      fullName: "Budi Pratama",
      roles: [Role.MAHASISWA, Role.PEER_TUTOR, Role.MITRA_BOOTCAMP],
      activeRole: Role.MAHASISWA,
      campus: "BINUS University",
      major: "Teknik Informatika",
      contactEmail: "budi.pratama@gmail.com",
      headline: "Mahasiswa Teknik Informatika BINUS (Akun Demo Evaluasi)",
      bio: "Akun demo evaluasi dengan seluruh peran terbuka [MAHASISWA, PEER_TUTOR, MITRA_BOOTCAMP].",
    },
    create: {
      email: "budi@student.com",
      emailVerifiedAt: new Date(),
      contactEmail: "budi.pratama@gmail.com",
      password: defaultPasswordHash,
      fullName: "Budi Pratama",
      phoneNumber: "081399887766",
      roles: [Role.MAHASISWA, Role.PEER_TUTOR, Role.MITRA_BOOTCAMP],
      activeRole: Role.MAHASISWA,
      campus: "BINUS University",
      major: "Teknik Informatika",
      headline: "Mahasiswa Teknik Informatika BINUS (Akun Demo Evaluasi)",
      bio: "Akun demo evaluasi dengan seluruh peran terbuka [MAHASISWA, PEER_TUTOR, MITRA_BOOTCAMP].",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    },
  });


  async function upsertAcademicCourse(
    course: (typeof universityCourses)[number],
    creatorId: string,
  ) {
    const existing = await prisma.class.findUnique({ where: { slug: course.slug } });
    const demoSession = demoClassSessions[course.slug as keyof typeof demoClassSessions];
    const data = {
      title: course.title,
      slug: course.slug,
      description: course.description,
      type: course.type as ClassType,
      price: course.price,
      category: course.category,
      major: course.major,
      campusTarget: course.campusTarget,
      bannerUrl: course.bannerUrl,
      startsAt: demoSession.startsAt,
      meetingLink: demoSession.meetingLink,
      materialLink: demoSession.materialLink,
      recordingLink: null,
      creatorId,
    };
    const record = existing
      ? await prisma.class.update({ where: { id: existing.id }, data })
      : await prisma.class.create({ data });

    await prisma.bootcampTutor.deleteMany({ where: { classId: record.id } });
    if (course.type === "BOOTCAMP") {
      await prisma.bootcampTutor.create({
        data: {
          classId: record.id,
          name: "Kevin Sanjaya",
          roleTitle: "Pengajar Mata Kuliah",
          headline: "Pengajar program akademik",
          avatarUrl: tutorKevin.avatarUrl,
        },
      });
    }
    return record;
  }

  const courseStructure = await upsertAcademicCourse(
    universityCourses[0],
    tutorKevin.id,
  );
  await upsertAcademicCourse(
    universityCourses[1],
    tutorKevin.id,
  );
  const courseDatabase = await upsertAcademicCourse(
    universityCourses[2],
    tutorAhmad.id,
  );
  await upsertAcademicCourse(
    universityCourses[3],
    tutorAhmad.id,
  );
  const courseObjectOriented = await upsertAcademicCourse(
    universityCourses[4],
    boosterAcademy.id,
  );


  await prisma.transaction.deleteMany({
    where: { userId: studentBudi.id, classId: courseDatabase.id },
  });
  await prisma.transaction.deleteMany({
    where: {
      userId: studentBudi.id,
      classId: courseObjectOriented.id,
      amount: 0,
      orderId: { not: "NEX-SEED-ENROLL-1" },
    },
  });

  await prisma.transaction.upsert({
    where: { orderId: "NEX-SEED-ENROLL-1" },
    update: {
      status: "PAID",
      refundStatus: "NOT_REQUESTED",
      refundMethod: null,
      refundAccountName: null,
      refundAccountNumber: null,
      refundRequestedAt: null,
      refundedAt: null,
      classId: courseObjectOriented.id,
      amount: universityCourses[4].price,
    },
    create: {
      orderId: "NEX-SEED-ENROLL-1",
      userId: studentBudi.id,
      classId: courseObjectOriented.id,
      amount: universityCourses[4].price,
      status: "PAID",
    },
  });

  await prisma.transaction.upsert({
    where: { orderId: "NEX-SEED-ENROLL-2" },
    update: {
      status: "PAID",
      refundStatus: "NOT_REQUESTED",
      refundMethod: null,
      refundAccountName: null,
      refundAccountNumber: null,
      refundRequestedAt: null,
      refundedAt: null,
      classId: courseStructure.id,
      amount: universityCourses[0].price,
    },
    create: {
      orderId: "NEX-SEED-ENROLL-2",
      userId: studentBudi.id,
      classId: courseStructure.id,
      amount: universityCourses[0].price,
      status: "PAID",
    },
  });


  await prisma.review.deleteMany({
    where: { userId: studentBudi.id, classId: courseStructure.id },
  });


  await prisma.notification.deleteMany({
    where: { userId: studentBudi.id, type: "ENROLLMENT" },
  });
  await prisma.notification.createMany({
    data: [
      {
        userId: studentBudi.id,
        title: "Pendaftaran Kelas Berhasil",
        message: `Anda terdaftar di kelas "${courseObjectOriented.title}". Jadwal dan tautan sesi tersedia di Kelas Saya.`,
        type: "ENROLLMENT",
        linkUrl: "/dashboard/kelas-saya",
      },
      {
        userId: studentBudi.id,
        title: "Pendaftaran Kelas Berhasil",
        message: `Anda terdaftar di kelas "${courseStructure.title}". Jadwal dan tautan sesi tersedia di Kelas Saya.`,
        type: "ENROLLMENT",
        linkUrl: "/dashboard/kelas-saya",
      },
    ],
  });

  console.log("Database seeded successfully with authentic production-ready data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
