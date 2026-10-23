import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT || 3306),
  user: process.env.DATABASE_USER || "nexiera",
  password: process.env.DATABASE_PASSWORD || "nexiera_local_password",
  database: process.env.DATABASE_NAME || "nexiera",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database with authentic academic classes...");
  const defaultPasswordHash = await bcrypt.hash("password123", 12);

  // 1. Create Tutors & Students
  const tutorKevin = await prisma.user.upsert({
    where: { email: "kevin.sanjaya@binus.ac.id" },
    update: { password: defaultPasswordHash },
    create: {
      email: "kevin.sanjaya@binus.ac.id",
      password: defaultPasswordHash,
      name: "Kevin Sanjaya",
      phoneNumber: "081234567890",
      role: "TUTOR",
      university: "BINUS University",
      major: "Computer Science",
      studentNumber: "2602123456",
      semester: "Semester 5",
      headline: "Peer-Tutor Computer Science BINUS",
      bio: "Mahasiswa tingkat atas Computer Science dengan fokus pada Algoritma, Struktur Data, dan Pemrograman C/C++. Berpengalaman membimbing puluhan mahasiswa dalam persiapan UTS & UAS.",
      location: "Jakarta Barat",
    },
  });

  const tutorAhmad = await prisma.user.upsert({
    where: { email: "ahmad.dahlan@ui.ac.id" },
    update: { password: defaultPasswordHash },
    create: {
      email: "ahmad.dahlan@ui.ac.id",
      password: defaultPasswordHash,
      name: "Ahmad Dahlan",
      phoneNumber: "081298765432",
      role: "TUTOR",
      university: "Universitas Indonesia",
      major: "Information Systems",
      studentNumber: "2106123456",
      semester: "Semester 7",
      headline: "Peer-Tutor Information Systems UI",
      bio: "Fokus pada Software Engineering, Basis Data, dan Pemodelan Sistem Berorientasi Objek.",
      location: "Depok",
    },
  });

  const boosterOrg = await prisma.user.upsert({
    where: { email: "admin@boosteracademy.id" },
    update: { password: defaultPasswordHash },
    create: {
      email: "admin@boosteracademy.id",
      password: defaultPasswordHash,
      name: "Booster Academy",
      phoneNumber: "081311223344",
      role: "TUTOR",
      university: "BINUS University",
      major: "Computer Science",
      organizationName: "Booster Academy",
      organizationLogoUrl: "/Logo_Akhir.png",
      headline: "Mitra Bootcamp Akademik & Persiapan Ujian",
      bio: "Lembaga pelatihan intensif bimbingan mata kuliah kurikulum perguruan tinggi dengan mentor berpengalaman.",
      location: "Jakarta",
    },
  });

  const studentBudi = await prisma.user.upsert({
    where: { email: "budi.pratama@binus.ac.id" },
    update: { password: defaultPasswordHash },
    create: {
      email: "budi.pratama@binus.ac.id",
      password: defaultPasswordHash,
      name: "Budi Pratama",
      phoneNumber: "081399887766",
      role: "STUDENT",
      university: "BINUS University",
      major: "Computer Science",
      studentNumber: "2702998877",
      semester: "Semester 3",
      headline: "Mahasiswa Computer Science BINUS",
      bio: "Mahasiswa aktif angkatan 2024 yang sedang mempersiapkan diri menghadapi ujian semester.",
      location: "Jakarta",
    },
  });

  // 2. Create Classes
  const now = new Date();
  const futureDate1 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const futureDate2 = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
  const futureDate3 = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000);
  const futureDate4 = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  const futureDate5 = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000);

  const classAlgoProg = await prisma.class.upsert({
    where: { id: "class-algoprog-binus" },
    update: {},
    create: {
      id: "class-algoprog-binus",
      tutorId: tutorKevin.id,
      title: "Algorithm and Programming",
      shortDescription: "Bimbingan intensif persiapan ujian mata kuliah Algorithm and Programming kurikulum Computer Science.",
      description: "Pembedahan mendalam konsep dasar algoritma pemrograman, pointer, array, recursion, dynamic memory allocation, hingga struktur data dasar untuk persiapan ujian tengah semester (UTS). Sesi live interaktif dengan latihan soal dan live coding.",
      mainCategory: "Sains & Teknologi",
      major: "Computer Science",
      university: "BINUS University",
      courseType: "PEER_TUTORING",
      organizerName: "Kevin Sanjaya",
      price: 150000,
      currency: "IDR",
      status: "ACTIVE",
      startsAt: futureDate1,
      accessDuration: "Satu Semester Penuh",
      maxQuota: 20,
      meetingPlatform: "GMEET",
      meetingUrl: "https://meet.google.com/nex-algo-prog",
      materialPlatform: "DRIVE",
      materialUrl: "https://drive.google.com/drive/folders/nexiera-algoprog",
      recordingUrl: "https://drive.google.com/drive/folders/nexiera-recordings",
      requirements: ["Memiliki laptop dengan compiler C/C++", "Telah mengambil matkul Algoritma"],
      facilities: ["Sesi Live Google Meet", "Catatan Kuliah Terstruktur", "Rekaman Sesi Tersimpan", "Akses Tanya Jawab WhatsApp"],
    },
  });

  const classDataStruct = await prisma.class.upsert({
    where: { id: "class-datastruct-binus" },
    update: {},
    create: {
      id: "class-datastruct-binus",
      tutorId: tutorKevin.id,
      title: "Data Structures",
      shortDescription: "Kuasai materi struktur data dari linked list hingga balanced trees.",
      description: "Pendalaman linked list (singly, doubly, circular), stack, queue, binary search tree (BST), AVL tree, dan heap beserta implementasi kode C/C++ dan analisis kompleksitas Big-O.",
      mainCategory: "Sains & Teknologi",
      major: "Computer Science",
      university: "BINUS University",
      courseType: "PEER_TUTORING",
      organizerName: "Kevin Sanjaya",
      price: 175000,
      currency: "IDR",
      status: "ACTIVE",
      startsAt: futureDate2,
      accessDuration: "Satu Semester Penuh",
      maxQuota: 15,
      meetingPlatform: "ZOOM",
      meetingUrl: "https://zoom.us/j/9876543210",
      materialPlatform: "DRIVE",
      materialUrl: "https://drive.google.com/drive/folders/nexiera-datastruct",
      recordingUrl: "https://drive.google.com/drive/folders/nexiera-datastruct-recordings",
      requirements: ["Memahami dasar bahasa C/C++", "Telah lulus Algorithm and Programming"],
      facilities: ["Live Session Zoom", "Slide Presentasi & Code Snippets", "Rekaman Setiap Pertemuan"],
    },
  });

  const classSEBootcamp = await prisma.class.upsert({
    where: { id: "class-se-bootcamp-booster" },
    update: {},
    create: {
      id: "class-se-bootcamp-booster",
      tutorId: boosterOrg.id,
      title: "Software Engineering & System Modeling",
      shortDescription: "Bootcamp perancangan perangkat lunak dan UML diagram untuk mahasiswa SI & CS.",
      description: "Bootcamp intensif perancangan arsitektur perangkat lunak, UML diagram (Use Case, Class, Sequence, Activity), Design Patterns, dan metodologi Agile Scrum yang relevan dengan tugas besar dan silabus akademik.",
      mainCategory: "Sains & Teknologi",
      major: "Information Systems",
      university: "BINUS University",
      courseType: "BOOTCAMP",
      organizerName: "Booster Academy",
      organizerLogo: "/Logo_Akhir.png",
      price: 350000,
      currency: "IDR",
      status: "ACTIVE",
      startsAt: futureDate3,
      accessDuration: "Akses Seumur Hidup",
      maxQuota: 30,
      meetingPlatform: "GMEET",
      meetingUrl: "https://meet.google.com/nex-se-bootcamp",
      materialPlatform: "DRIVE",
      materialUrl: "https://drive.google.com/drive/folders/nexiera-se-bootcamp",
      recordingUrl: "https://drive.google.com/drive/folders/nexiera-se-recordings",
      requirements: ["Laptop untuk pemodelan UML", "Ketertarikan pada arsitektur sistem"],
      facilities: ["Sesi Interaktif Bersama Mentor", "Template Dokumen Perancangan", "Sertifikat Penyelesaian", "Grup Diskusi Komunitas"],
    },
  });

  const classKalkulus = await prisma.class.upsert({
    where: { id: "class-kalkulus-itb" },
    update: {},
    create: {
      id: "class-kalkulus-itb",
      tutorId: tutorKevin.id,
      title: "Calculus and Linear Algebra",
      shortDescription: "Persiapan ujian kalkulus dan aljabar linier dengan latihan soal terarah.",
      description: "Bimbingan pemahaman konsep limit, turunan, integral, matriks, sistem persamaan linear, dan nilai eigen dengan pembahasan soal-soal ujian terdahulu dan trik penyelesaian cepat.",
      mainCategory: "Sains & Teknologi",
      major: "Computer Science",
      university: "Institut Teknologi Bandung",
      courseType: "PEER_TUTORING",
      organizerName: "Kevin Sanjaya",
      price: 120000,
      currency: "IDR",
      status: "ACTIVE",
      startsAt: futureDate4,
      accessDuration: "Satu Semester Penuh",
      maxQuota: 25,
      meetingPlatform: "GMEET",
      meetingUrl: "https://meet.google.com/nex-kalkulus",
      materialPlatform: "DRIVE",
      materialUrl: "https://drive.google.com/drive/folders/nexiera-kalkulus",
      requirements: ["Kertas cakar & alat tulis"],
      facilities: ["Bank Soal Ujian & Pembahasan", "Live Meeting Interaktif"],
    },
  });

  const classAkuntansi = await prisma.class.upsert({
    where: { id: "class-akuntansi-binus" },
    update: {},
    create: {
      id: "class-akuntansi-binus",
      tutorId: tutorAhmad.id,
      title: "Introduction to Financial Accounting",
      shortDescription: "Sesi bimbingan gratis dasar akuntansi dan penyusunan jurnal umum.",
      description: "Sesi pengenalan persamaan dasar akuntansi, analisis transaksi, siklus akuntansi, jurnal umum, buku besar, neraca saldo, dan laporan keuangan dasar bagi mahasiswa tingkat awal.",
      mainCategory: "Ekonomi & Bisnis",
      major: "Akuntansi",
      university: "BINUS University",
      courseType: "PEER_TUTORING",
      organizerName: "Ahmad Dahlan",
      price: 0,
      currency: "IDR",
      status: "ACTIVE",
      startsAt: futureDate5,
      accessDuration: "Satu Semester Penuh",
      maxQuota: 50,
      meetingPlatform: "ZOOM",
      meetingUrl: "https://zoom.us/j/1234567890",
      materialPlatform: "DRIVE",
      materialUrl: "https://drive.google.com/drive/folders/nexiera-akuntansi",
      requirements: ["Kalkulator", "Alat tulis"],
      facilities: ["Sesi Gratis untuk Pemula", "Worksheet Excel Latihan"],
    },
  });

  // 3. Create Sample Paid Enrollment for Budi Pratama
  await prisma.transaction.upsert({
    where: {
      userId_classId_status: {
        userId: studentBudi.id,
        classId: classAlgoProg.id,
        status: "PAID",
      },
    },
    update: {},
    create: {
      userId: studentBudi.id,
      classId: classAlgoProg.id,
      amount: 150000,
      currency: "IDR",
      status: "PAID",
      paidAt: new Date(),
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
