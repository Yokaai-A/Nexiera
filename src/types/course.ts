// src/types/course.ts

export type CourseType = "PEER_TUTORING" | "BOOTCAMP";
export type PricingModel = "FREE" | "PAID";
export type MeetingPlatform = "ZOOM" | "GMEET" | "DISCORD";
export type MaterialPlatform = "NOTION" | "DRIVE" | "PDF" | "GITHUB";

export interface Tutor {
  id: string;
  name: string;
  role: string; // Contoh: "Mahasiswa Computer Science BINUS"
  avatarUrl: string;
}

export interface AcademicCourse {
  id: string;
  title: string; // Contoh: "Algoritma & Pemrograman"
  subjectCategory: string; // Contoh: "Computer Science"
  university: string; // Default: "BINUS University"
  shortDescription: string;
  fullDescription: string;

  type: CourseType; // "PEER_TUTORING" | "BOOTCAMP"
  pricingModel: PricingModel; // "FREE" | "PAID"
  priceAmount?: number; // Input angka nominal Rp (jika berbayar)

  // Penyelenggara & Multi-Tutor
  organizerName: string; // Nama Tutor atau Nama Mitra (Booster Academy)
  organizerLogo?: string;
  tutors: Tutor[]; // 1 orang jika Peer-Tutoring, Multi-tutor jika Bootcamp

  // Centralized Access Hub Links
  meetingPlatform: MeetingPlatform;
  meetingUrl: string; // Link Zoom / GMeet
  materialPlatform: MaterialPlatform;
  materialUrl: string; // Link Catatan Notion

  scheduleDate: string;
  accessDuration: string; // Contoh: "Lifetime Access"
  maxQuota: number;
  availableSeats: number;
  requirements: string[];
  facilities: string[];
  createdAt: string;

  // Metadata tambahan untuk UI
  tags?: string[];
  rating?: number;
  reviewCount?: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  campus: string; // Default: "BINUS University"
  major: string; // Contoh: "Computer Science"
  isCampusVerified: boolean;
  isLoggedIn: boolean;
  avatarUrl?: string;
  semester?: string;
}

export interface FilterState {
  searchQuery: string;
  campus: string;
  subjectCategory: string;
  courseType: "ALL" | CourseType;
  pricingModel: "ALL" | PricingModel;
  campusVerifiedOnly: boolean;
}
