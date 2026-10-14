# 📘 NEXIERA — Technical Architecture & Product Blueprint (MVP)

---

## 🛠️ 1. Struktur Folder Codebase & Config Existing (Next.js App Router)

Dokumen ini disesuaikan 100% dengan struktur folder `src/` dan konfigurasi Tailwind yang sudah ada di dalam codebase Next.js Anda:

```text
nexiera/
├── public/
│   ├── assets/
│   │   ├── images/          # Banner, ilustrasi chibi hero, visual assets
│   │   └── icons/           # Logo NEXIERA SVG
├── src/
│   ├── app/                 # Next.js App Router Pages (5 Halaman Utama)
│   │   ├── page.tsx         # [1] Home / Landing Page
│   │   ├── cari-kelas/
│   │   │   └── page.tsx     # [2] Katalog & Filter Kelas
│   │   ├── buat-kelas/
│   │   │   └── page.tsx     # [3] Form Publikasi Kelas Baru
│   │   ├── tentang-kami/
│   │   │   └── page.tsx     # [4] Halaman Visi, Misi & 5 Founders BINUS
│   │   ├── login/
│   │   │   └── page.tsx     # [5a] Auth Split View - Login
│   │   ├── register/
│   │   │   └── page.tsx     # [5b] Auth Split View - Register
│   │   ├── onboarding/
│   │   │   └── page.tsx     # Form Lengkapi Profil (Kampus & Jurusan)
│   │   ├── globals.css      # Custom styling & CSS variables
│   │   └── layout.tsx       # Root Layout (Navbar & Footer Wrapper)
│   │
│   ├── components/          # Reusable React UI Components
│   │   ├── common/          # Navbar, Footer, Banner
│   │   ├── cards/           # CourseCard, CategoryCard, TutorCard
│   │   └── sections/        # HeroSection, CategorySection, BenefitSection
│   │
│   ├── lib/                 # Utility & Mock State Management
│   │   ├── mockData.ts      # Dummy initial data kelas & user
│   │   └── storage.ts       # LocalStorage helper untuk simpan state baru
│   │
│   └── types/               # TypeScript Definitions
│       └── course.ts        # Interface AcademicCourse, UserProfile, FilterState
│
├── tailwind.config.ts       # Custom Brand Color Palette Nexiera
└── package.json
```

---

## 🎨 2. Styling & Color System (`tailwind.config.ts`)

Konfigurasi Tailwind CSS yang sudah diterapkan pada komponen UI:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nexiera: {
          navy: {
            DEFAULT: "#0F172A", // Text utama & Header
            light: "#1E293B",   // Card background / dark container
            dark: "#080D1A",    // Deep accent
          },
          blue: {
            DEFAULT: "#2563EB", // Primary Brand Accent & CTA Buttons
            hover: "#1D4ED8",   // Button hover state
            light: "#EFF6FF",   // Soft blue container & badge background
          },
          cyan: {
            DEFAULT: "#06B6D4", // Highlight accent & glow
            light: "#67E8F9",
          },
          slate: {
            DEFAULT: "#64748B", // Subtitle & muted text
            light: "#F8FAFC",   // Page background
            border: "#E2E8F0",  // Divider & card border
          },
        },
      },
      borderRadius: {
        card: "16px",
        button: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 📑 3. Konsep Inti & Identitas Produk

### 3.1 Positioning Utama
* **Khusus Mata Kuliah Akademik**: Platform ini murni 100% dirancang untuk **Mata Kuliah Kampus** (contoh: *Algorithm and Programming*, *Algorithm Design and Analysis*, *Software Engineering*, *Computational Physics*, *Kalkulus*, dll.) untuk persiapan UTS/UAS dan praktikum semester. Bukan untuk *career switching* atau general IT bootcamp.
* **Two-Sided Marketplace**:
  1. **Learner**: Mahasiswa yang butuh bimbingan matkul & akses catatan rapi *Notion Study Hub*.
  2. **Tutor / Organizer**: Tutor individu (mahasiswa) atau organisasi/mitra kampus (seperti *Booster Academy*).

### 3.2 Latar Belakang & Founders
* **Tahun Berdiri**: 2026.
* **Founders**: Didirikan oleh **5 orang mahasiswa Universitas Bina Nusantara (BINUS)**.
* **Tujuan**: Menyatukan informasi kelas bimbingan dan materi kuliah yang selama ini tercecer di grup *chat* WhatsApp/LINE ke dalam satu papan pengumuman digital terstruktur.

---

## 👥 4. Pembeda Tipe Kelas: Peer-Tutoring vs Bootcamp

Di dalam codebase dan form pembuatan kelas, struktur kelas dipisahkan menjadi dua tipe:

| Parameter UI & Data | 🤝 Peer-Tutoring (Individu) | 🚀 Bootcamp (Mitra / Organisasi) |
| :--- | :--- | :--- |
| **Penyelenggara** | 1 Orang Tutor Mahasiswa | Organisasi / Komunitas (contoh: *Booster Academy*) |
| **Jumlah Pengajar** | **Single Tutor** (Pembuat akun) | **Multi-Tutor** (Dua pengajar atau lebih) |
| **Card Header** | Avatar & Nama Tutor Individu | Logo & Nama Mitra Organisasi |
| **Badge Color** | Label Slate/Soft Blue `[Peer-Tutoring]` | Label Cyan/Blue `[Bootcamp]` |
| **Form Section 3** | Diisi otomatis oleh profil user | Menyediakan tombol `+ Tambah Pengajar` |

---

## 🏛️ 5. Penyesuaian Detail 5 Halaman Utama Existing

### [1] Landing Page (`src/app/page.tsx`)
* **Header & Navbar**: Logo NEXIERA, Navigasi (`Home`, `Cari Kelas`, `Buat Kelas`, `Tentang Kami`), Notifikasi, dan Auth State (Tombol `Login`/`Register` vs Icon Profile).
* **Hero Section**:
  * Headline: *"Tingkatkan Prestasi Kuliah Bersama Tutor Sebaya Terverifikasi"*
  * Visual: Ilustrasi karakter chibi topi 'N' & hoodie biru memangku laptop dengan gelembung obrolan *"Menemukan Kelas Terbaik"*.
* **Key Benefits**: Card *Catatan Notion Rapi*, *Tutor Sebaya Terpilih*, dan *Fokus Nilai UTS/UAS*.
* **Kategori Kelas Grid**: *Sains & Teknologi*, *Ekonomi & Bisnis*, *Sosial & Hukum*, *Kesehatan & Kedokteran*, *Seni Desain & Arsitektur*, *Pertanian & Peternakan*.
* **Mengapa Memilih NEXIERA**: 3 pilar (*Temukan Kelas*, *Belajar dari Tutor*, *Bagikan Keahlian*).
* **CTA Banner**: *"Punya Keahlian yang Ingin Dibagikan? Siap Jadi Tutor Kampus?"*.

### [2] Cari Kelas (`src/app/cari-kelas/page.tsx`)
* **Featured Banner**: Carousel promo *"BOOTCAMP TERBAIK DARI BOOSTER ACADEMY PRESENTS"*.
* **Filter Bar**: Input search kata kunci matkul + Dropdown filter Kampus, Tipe Kelas (*Bootcamp* vs *Peer-Tutoring*), dan Model Biaya (*Gratis* vs *Berbayar*).
* **Katalog Grid**: Menampilkan data dummy awal + data kelas baru buatan user dari `localStorage`.

### [3] Buat Kelas (`src/app/buat-kelas/page.tsx`)
Form multi-section untuk publikasi kelas:
1. **Header & Program**: Kategori Jurusan, Universitas (*Binus University*), Nama Kelas, Deskripsi, Deskripsi Detail, Syarat, dan Fasilitas.
2. **Detail Event**: Tanggal, Format (*Online - Zoom/GMeet*), Masa Akses Materi, Kuota Peserta.
3. **Penyelenggara**: Input Avatar, Nama, Peran (*Mahasiswa CS*), serta opsi Multi-Tutor untuk Bootcamp.
4. **Tipe Kelas**: Toggle `Bootcamp` vs `Peer - Tutoring`.
5. **Kapasitas & Biaya**: Toggle `Gratis` vs `Berbayar` (input nominal Rp).
* **Submit Action**: Menyimpan data kelas baru ke `localStorage` dan langsung menampilkan hasilnya di halaman `/cari-kelas`.

### [4] Auth Modals / Pages (`src/app/login/page.tsx` & `src/app/register/page.tsx`)
* Layout split card modern berlatar garis geometris.
* **Register Flow**: Setelah menekan tombol Register, user diarahkan ke `/onboarding` untuk memilih **Kampus Asal** (*BINUS University*) dan **Jurusan** (*Computer Science*, dll.).
* **State Update**: Mengubah status Navbar dari `Login`/`Register` menjadi **Profile Icon / Avatar**.

### [5] Tentang Kami (`src/app/tentang-kami/page.tsx`)
* Headline: *"Dibuat oleh Mahasiswa, untuk Mahasiswa."*
* Cerita pendirian tahun **2026** oleh **5 mahasiswa BINUS**.
* Nilai utama dan Grid 5 Card Profil Founders BINUS.

---

## 🛠️ 6. Data Mockup & TypeScript Schema (`src/types/course.ts`)

```typescript
// src/types/course.ts

export type CourseType = "PEER_TUTORING" | "BOOTCAMP";
export type PricingModel = "FREE" | "PAID";
export type MeetingPlatform = "ZOOM" | "GMEET" | "DISCORD";
export type MaterialPlatform = "NOTION" | "DRIVE" | "PDF" | "GITHUB";

export interface Tutor {
  id: string;
  name: string;
  role: string;          // Contoh: "Mahasiswa Computer Science BINUS"
  avatarUrl: string;
}

export interface AcademicCourse {
  id: string;
  title: string;              // Contoh: "Algoritma & Pemrograman"
  subjectCategory: string;    // Contoh: "Computer Science"
  university: string;         // Default: "BINUS University"
  shortDescription: string;
  fullDescription: string;
  
  type: CourseType;           // "PEER_TUTORING" | "BOOTCAMP"
  pricingModel: PricingModel; // "FREE" | "PAID"
  priceAmount?: number;       // Input angka nominal Rp (jika berbayar)
  
  // Penyelenggara & Multi-Tutor
  organizerName: string;      // Nama Tutor atau Nama Mitra (Booster Academy)
  organizerLogo?: string;
  tutors: Tutor[];            // 1 orang jika Peer-Tutoring, Multi-tutor jika Bootcamp
  
  // Centralized Access Hub Links
  meetingPlatform: MeetingPlatform;
  meetingUrl: string;         // Link Zoom / GMeet
  materialPlatform: MaterialPlatform;
  materialUrl: string;        // Link Catatan Notion
  
  scheduleDate: string;
  accessDuration: string;     // Contoh: "Lifetime Access"
  maxQuota: number;
  availableSeats: number;
  requirements: string[];
  facilities: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  campus: string;             // Default: "BINUS University"
  major: string;              // Contoh: "Computer Science"
  isCampusVerified: boolean;
  isLoggedIn: boolean;
  avatarUrl?: string;
}
```