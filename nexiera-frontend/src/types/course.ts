
export type CourseType = "PEER_TUTORING" | "BOOTCAMP";
export type PricingModel = "FREE" | "PAID";
export type MeetingPlatform = "ZOOM" | "GMEET" | "DISCORD";
export type MaterialPlatform = "NOTION" | "DRIVE" | "PDF" | "GITHUB";

export interface Tutor {
  id: string;
  name: string; // Nama murni tanpa gelar formal
  role: string; // Contoh: "Mahasiswa Computer Science BINUS"
  avatarUrl: string;
}

export interface AcademicCourse {
  id: string;
  title: string; // Nama mata kuliah murni (tanpa kode matkul)
  mainCategory: string; // Contoh: "Sains & Teknologi", "Ekonomi & Bisnis"
  major: string; // Contoh: "Computer Science", "Information Systems"
  subjectCategory?: string; // Kompatibilitas mundur
  university: string; // Default: "BINUS University"
  shortDescription: string;
  fullDescription: string;

  type: CourseType; // "PEER_TUTORING" | "BOOTCAMP"
  pricingModel: PricingModel; // "FREE" | "PAID"
  priceAmount?: number;

  organizerName: string;
  organizerLogo?: string;
  tutors: Tutor[]; // 1 orang jika Peer-Tutoring, Multi-tutor jika Bootcamp

  meetingPlatform: MeetingPlatform;
  meetingUrl: string; // Link Sesi Live (Zoom / GMeet / Discord)
  materialPlatform?: MaterialPlatform;
  materialUrl?: string; // Link Catatan / Materi (Opsional - Invisible jika kosong)
  recordingUrl?: string; // Link Penyimpanan / Rekaman Sesi (Opsional - Invisible jika kosong)

  scheduleDate: string;
  accessDuration: string; // Contoh: "Lifetime Access"
  maxQuota: number;
  availableSeats: number;
  requirements: string[];
  facilities: string[];
  createdAt: string;

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
  role?: "student" | "tutor" | "bootcamp" | "bootcamp_partner";
  avatarUrl?: string;
  semester?: string;
}

export interface FilterState {
  searchQuery: string;
  campus: string;
  mainCategory: string;
  major: string;
  courseSubject: string;
  courseType: "ALL" | CourseType;
  pricingModel: "ALL" | PricingModel;
  campusVerifiedOnly: boolean;
}
