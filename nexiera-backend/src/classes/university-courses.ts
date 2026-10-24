export const universityCourses = [
  {
    title: "Struktur Data & Algoritma",
    slug: "struktur-data-dan-algoritma",
    type: "PEER_TUTORING",
    category: "Sains & Teknologi",
    major: "Teknik Informatika",
    campusTarget: "BINUS University",
    price: 75000,
    bannerUrl: "/images/courses/data-structures.svg",
    description: "Pendampingan akademik mendalam untuk materi Pointer, Linked List, Stack, Queue, Binary Tree, dan Graph berbasis silabus perkuliahan persiapan UTS/UAS.",
  },
  {
    title: "Aljabar Linear",
    slug: "kalkulus-1-dan-aljabar-linier",
    type: "PEER_TUTORING",
    category: "Sains & Teknologi",
    major: "Teknik Informatika",
    campusTarget: "BINUS University",
    price: 0,
    bannerUrl: "/images/courses/calculus.svg",
    description: "Sesi bimbingan akademis komprehensif membahas materi Limit, Turunan, Integral, serta Vektor & Matriks sesuai kurikulum perguruan tinggi.",
  },
  {
    title: "Sistem Basis Data",
    slug: "sistem-basis-data",
    type: "PEER_TUTORING",
    category: "Sains & Teknologi",
    major: "Sistem Informasi",
    campusTarget: "Universitas Indonesia",
    price: 60000,
    bannerUrl: "/images/courses/database-systems.svg",
    description: "Bimbingan terstruktur merancang Entity Relationship Diagram (ERD), normalisasi skema relasional (1NF-3NF), dan penulisan query SQL kompleks.",
  },
  {
    title: "Pengantar Akuntansi Keuangan",
    slug: "pengantar-akuntansi-keuangan",
    type: "PEER_TUTORING",
    category: "Ekonomi & Bisnis",
    major: "Akuntansi",
    campusTarget: "Universitas Indonesia",
    price: 50000,
    bannerUrl: "/images/courses/accounting.svg",
    description: "Pembahasan silabus dasar akuntansi, siklus akuntansi perusahaan jasa dan dagang, hingga penyusunan laporan keuangan UTS/UAS.",
  },
  {
    title: "Object Oriented Programming",
    slug: "bootcamp-pemrograman-berorientasi-objek",
    type: "BOOTCAMP",
    category: "Sains & Teknologi",
    major: "Teknik Informatika",
    campusTarget: null,
    price: 150000,
    bannerUrl: "/images/courses/oop.svg",
    description: "Program bimbingan kelompok intensif 2 minggu membahas tuntas konsep Encapsulation, Inheritance, Polymorphism, dan Abstraction untuk persiapan ujian semester.",
  },
] as const;

export function findUniversityCourse(title?: string | null, category?: string | null, campusTarget?: string | null) {
  return universityCourses.find((course) =>
    course.title === title?.trim() &&
    course.category === category?.trim() &&
    (course.campusTarget ?? "") === (campusTarget ?? "").trim(),
  );
}

export function isUniversityCourseRecord(record: {
  title?: string | null;
  type?: string | null;
  category?: string | null;
  major?: string | null;
  campusTarget?: string | null;
  price?: number | string | { toString(): string } | null;
}) {
  const course = findUniversityCourse(record.title, record.category, record.campusTarget);
  return Boolean(
    course &&
      course.title === record.title &&
      course.type === record.type &&
      course.category === record.category &&
      course.campusTarget === record.campusTarget &&
      Number(record.price) === course.price,
  );
}
