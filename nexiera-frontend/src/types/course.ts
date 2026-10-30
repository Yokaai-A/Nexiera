
export type CourseType = "PEER_TUTORING" | "BOOTCAMP";
export type PricingModel = "FREE" | "PAID";
export type MeetingPlatform = "ZOOM" | "GMEET" | "DISCORD";
export type MaterialPlatform = "NOTION" | "DRIVE" | "PDF" | "GITHUB";

export interface Tutor {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface AcademicCourse {
  id: string;
  slug?: string;
  bannerUrl?: string;
  title: string;
  mainCategory: string;
  major: string;
  subjectCategory?: string;
  university: string;
  shortDescription: string;
  fullDescription: string;

  type: CourseType;
  pricingModel: PricingModel;
  priceAmount?: number;

  organizerName?: string;
  organizerLogo?: string;
  tutors?: Tutor[];

  meetingPlatform?: MeetingPlatform;
  meetingUrl?: string;
  materialPlatform?: MaterialPlatform;
  materialUrl?: string;
  recordingUrl?: string;

  scheduleDate?: string;
  accessDuration?: string;
  accessUntil?: string;
  maxQuota?: number;
  availableSeats?: number | null;
  requirements?: string[];
  facilities?: string[];
  createdAt?: string;

  tags?: string[];
  rating?: number;
  reviewCount?: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  campus: string;
  major: string;
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
