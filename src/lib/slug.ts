export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface OrganizerProfileData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  campus: string;
  logo: string;
  coverImage?: string;
  establishedYear: string;
}

export interface TutorProfileData {
  slug: string;
  name: string;
  role: string;
  campus: string;
  major: string;
  bio: string;
  avatarUrl: string;
}

export const ORGANIZERS_DATA: Record<string, OrganizerProfileData> = {
  "booster-academy": {
    slug: "booster-academy",
    name: "Booster Academy",
    tagline: "Mitra Belajar & Bimbingan Intensif Mahasiswa Kampus",
    description:
      "Booster Academy adalah wadah bimbingan belajar akademik yang berfokus pada kurikulum perkuliahan teknik dan ilmu komputer. Dikelola oleh kolaborasi mahasiswa tingkat atas berprestasi untuk membantu pemahaman konsep fundamental, pembedahan materi silabus, dan pemantapan latihan ujian UTS & UAS.",
    campus: "BINUS University",
    logo: "/logo.png",
    coverImage: "/banner-cari-kelas.png",
    establishedYear: "2026",
  },
};

export const TUTORS_DATA: Record<string, TutorProfileData> = {
  "kevin-sanjaya": {
    slug: "kevin-sanjaya",
    name: "Kevin Sanjaya",
    role: "Mahasiswa Computer Science BINUS",
    campus: "BINUS University",
    major: "Computer Science",
    bio: "Mahasiswa Computer Science tingkat atas BINUS University. Aktif memandu bimbingan pemrograman dasar bahasa C, pointer, dynamic memory, serta persiapan ujian Algoritma dan Pemrograman.",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
  },
  "clarissa-wijaya": {
    slug: "clarissa-wijaya",
    name: "Clarissa Wijaya",
    role: "Mahasiswa Computer Science BINUS",
    campus: "BINUS University",
    major: "Computer Science",
    bio: "Mahasiswa Computer Science BINUS University. Berfokus pada perancangan kurikulum belajar terarah, pembuatan catatan silabus lengkap, dan bank soal latihan praktikum.",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
  },
  "rizky-pratama": {
    slug: "rizky-pratama",
    name: "Rizky Pratama",
    role: "Mahasiswa Computer Science BINUS",
    campus: "BINUS University",
    major: "Computer Science",
    bio: "Mahasiswa Computer Science BINUS University. Berfokus membimbing mata kuliah Algorithm Design & Analysis (ADA), kompleksitas Big-O, Greedy, Graph Algorithms, dan Dynamic Programming.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
  },
  "devina-putri": {
    slug: "devina-putri",
    name: "Devina Putri",
    role: "Mahasiswa Information Systems BINUS",
    campus: "BINUS University",
    major: "Information Systems",
    bio: "Mahasiswa Information Systems BINUS University. Membimbing mahasiswa dalam mata kuliah Software Engineering, perancangan diagram UML lengkap, dan metodologi Agile Scrum.",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
  },
  "bima-santoso": {
    slug: "bima-santoso",
    name: "Bima Santoso",
    role: "Mahasiswa Computer Science BINUS",
    campus: "BINUS University",
    major: "Computer Science",
    bio: "Mahasiswa Computer Science BINUS University. Mendampingi mahasiswa dalam penguasaan Database Systems, normalisasi 1NF-3NF, ERD skema relasional, dan optimasi query SQL.",
    avatarUrl:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80",
  },
  "jessica-amanda": {
    slug: "jessica-amanda",
    name: "Jessica Amanda",
    role: "Mahasiswa Manajemen BINUS",
    campus: "BINUS University",
    major: "Manajemen",
    bio: "Mahasiswa Manajemen BINUS University. Berpengalaman membimbing persiapan ujian Manajemen Keuangan, perhitungan rasio finansial, WACC, Capital Budgeting, serta simulasi NPV & IRR.",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
  },
  "farhan-mahendra": {
    slug: "farhan-mahendra",
    name: "Farhan Mahendra",
    role: "Mahasiswa Hukum BINUS",
    campus: "BINUS University",
    major: "Hukum",
    bio: "Mahasiswa Hukum BINUS University. Mengkhususkan bimbingan pada mata kuliah Hukum Bisnis dan Korporasi, bedah klausul kontrak dagang, dan dasar regulasi perseroan terbatas.",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80",
  },
};
