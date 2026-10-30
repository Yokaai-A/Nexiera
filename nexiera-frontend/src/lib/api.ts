const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (process.env.NODE_ENV === "production" && !configuredApiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL must be configured for production builds");
}
const API_BASE_URL = (configuredApiBaseUrl || "http://localhost:4000/api").replace(/\/$/, "");

function getBrowserApiBaseUrl() {
  if (typeof window !== "undefined") return "/api";
  return API_BASE_URL;
}

export interface ApiUser {
  id: string;
  name?: string;
  fullName: string;
  email: string;
  contactEmail?: string | null;
  phoneNumber?: string | null;
  role?: "STUDENT" | "TUTOR" | "ADMIN" | "MAHASISWA" | "PEER_TUTOR" | "MITRA_BOOTCAMP";
  roles?: string[];
  activeRole?: string;
  university?: string | null;
  campus?: string | null;
  major?: string | null;
  studentNumber?: string | null;
  semester?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
  headline?: string | null;
  organizationName?: string | null;
  organizationLogoUrl?: string | null;
  organizationWebsiteUrl?: string | null;
  location?: string | null;
}

export interface AuthResponse {
  user?: ApiUser;
  emailVerificationRequired?: boolean;
  email?: string;
  verificationUrl?: string;
}

export interface ApiBootcampTutor {
  id: string;
  name: string;
  roleTitle: string;
  avatarUrl?: string | null;
  headline?: string | null;
  linkedinUrl?: string | null;
}

export interface ApiClass {
  id: string;
  title: string;
  slug?: string;
  shortDescription?: string | null;
  description: string;
  mainCategory?: string | null;
  category?: string;
  major?: string | null;
  university?: string | null;
  campusTarget?: string | null;
  courseType?: "PEER_TUTORING" | "BOOTCAMP";
  type?: "PEER_TUTORING" | "BOOTCAMP";
  organizerName?: string | null;
  organizerLogo?: string | null;
  bannerUrl?: string | null;
  price: string;
  currency: string;
  status?: "DRAFT" | "ACTIVE" | "CANCELLED" | "PENDING_REVIEW" | "REJECTED";
  reviewStatus?: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  reviewNote?: string | null;
  reviewedById?: string | null;
  reviewedAt?: string | null;
  startsAt?: string | null;
  accessDuration?: string | null;
  accessUntil?: string | null;
  maxQuota?: number | null;
  availableSeats?: number | null;
  requirements?: string[] | null;
  facilities?: string[] | null;
  meetingPlatform?: string | null;
  meetingUrl?: string | null;
  meetingLink?: string | null;
  materialPlatform?: string | null;
  materialUrl?: string | null;
  materialLink?: string | null;
  recordingUrl?: string | null;
  recordingLink?: string | null;
  driveUrl?: string | null;
  cancellationReason?: string | null;
  creator?: {
    id: string;
    name: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    campus?: string | null;
    university?: string | null;
    major?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    headline?: string | null;
  };
  tutor?: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    campus?: string | null;
    university?: string | null;
    major?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    headline?: string | null;
  };
  tutors?: ApiBootcampTutor[];
  enrollmentId?: string;
  paymentStatus?: string;
  paidAt?: string | null;
  studentCount?: number;
  totalReviews?: number;
  averageRating?: number;
  rating?: number;
  createdAt?: string | null;
}

export interface ApiTransaction {
  id: string;
  orderId?: string;
  amount: string;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED";
  refundStatus?: "NOT_REQUESTED" | "PENDING_REVIEW" | "PROCESSING" | "REFUNDED" | "REJECTED" | "COMPLETED" | "FAILED" | "MANUAL_REQUIRED";
  refundMethod?: string | null;
  refundAccountName?: string | null;
  refundAccountNumber?: string | null;
  refundProofUrl?: string | null;
  refundRequestedAt?: string | null;
  createdAt: string;
  paidAt: string | null;
  class: Pick<ApiClass, "id" | "title" | "startsAt" | "status">;
  user?: Pick<ApiUser, "id" | "name" | "fullName" | "email" | "phoneNumber">;
}

export interface ApiAd {
  id: string;
  title: string;
  subtitle: string | null;
  placement: "HOME_HERO" | "SIDE_MARGIN";
  imageUrl: string;
  targetUrl: string;
  startsAt: string;
  endsAt: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "ACTIVE" | "PAUSED";
  impressions: number;
  clicks: number;
}

export interface DashboardData {
  role: string;
  activeRole?: string;
  classes: ApiClass[];
  transactions: ApiTransaction[];
  attendedSessionsCount?: number;
  totalRevenue: number;
  netBalance?: number;
  pendingBalance: number;
  completedClassRevenue: number;
  adMetrics: { impressions: number; clicks: number; ctr: number };
  students: Array<{
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    classTitles: string[];
  }>;
}

export interface ApiReview {
  id: string;
  rating: number;
  comment: string | null;
  reply?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    campus?: string | null;
    university?: string | null;
    major?: string | null;
  };
}

export interface ReviewsData {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
  reviews: ApiReview[];
}

export interface ApiNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  linkUrl: string | null;
  createdAt: string;
}

export interface ApiTutorApplication {
  id: string;
  type: "PEER_TUTOR" | "BOOTCAMP_PARTNER";
  status: "PENDING" | "APPROVED" | "REJECTED";
  organizationName: string | null;
  contactPerson: string | null;
  studentCardUrl: string | null;
  transcriptUrl: string | null;
  organizationProofUrl: string | null;
  notes: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

export interface ApiRoleApplication {
  id: string;
  type: "PEER_TUTOR" | "MITRA_BOOTCAMP";
  status: "PENDING_VERIFICATION" | "APPROVED" | "REJECTED";
  campus: string | null;
  major: string | null;
  studentProofUrl: string;
  organizationName: string | null;
  contactEmail: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  reviewNote: string | null;
  createdAt: string;
  user?: Pick<ApiUser, "id" | "fullName" | "email" | "campus" | "major">;
}

if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("nexiera_access_token");
  } catch {
    // Authentication uses the HttpOnly cookie; localStorage is optional and may be disabled.
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  const response = await fetch(`${getBrowserApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string | string[] } | null;
    const message = Array.isArray(payload?.message)
      ? payload.message.join(", ")
      : payload?.message || `Permintaan gagal (${response.status})`;
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getPrivateFileUrl(path: string) {
  return path.startsWith("/api/") ? path : `/api${path.startsWith("/") ? path : `/${path}`}`;
}

export function getPublicUploadUrl(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function getBrowserAuthUrl(path: string) {
  return `/api${path.startsWith("/") ? path : `/${path}`}`;
}

export const nexieraApi = {
  register: async (payload: { email: string; password: string; fullName: string; phoneNumber: string }) => {
    return apiFetch<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) });
  },
  verifyEmail: (token: string) => apiFetch<{ success: boolean }>("/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) }),
  resendVerification: (email: string) => apiFetch<{ success: boolean; message: string; verificationUrl?: string }>("/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) }),
  login: async (payload: { email: string; password: string }) => {
    return apiFetch<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) });
  },
  me: () => apiFetch<ApiUser>("/users/me"),
  updateProfile: (profile: Partial<ApiUser>) =>
    apiFetch<ApiUser>("/users/me", { method: "PATCH", body: JSON.stringify(profile) }),
  switchRole: (role: string) =>
    apiFetch<ApiUser>("/users/switch-role", { method: "PATCH", body: JSON.stringify({ role }) }),
  applyTutor: (payload: {
    campus?: string;
    major?: string;
    studentProofUrl: string;
    notes?: string;
  }) => apiFetch<ApiRoleApplication>("/users/apply-tutor", { method: "POST", body: JSON.stringify(payload) }),
  applyBootcamp: (payload: {
    organizationName: string;
    contactEmail: string;
    logoUrl?: string;
    websiteUrl?: string;
    studentProofUrl: string;
    description?: string;
  }) => apiFetch<ApiRoleApplication>("/users/apply-bootcamp", { method: "POST", body: JSON.stringify(payload) }),
  myRoleApplications: () => apiFetch<ApiRoleApplication[]>("/users/me/role-applications"),
  adminRoleApplications: () => apiFetch<ApiRoleApplication[]>("/users/admin/role-applications"),
  reviewRoleApplication: (applicationId: string, payload: { decision: "APPROVE" | "REJECT"; note?: string }) =>
    apiFetch<ApiRoleApplication>(`/users/admin/role-applications/${encodeURIComponent(applicationId)}/review`, { method: "PATCH", body: JSON.stringify(payload) }),
  adminRefunds: () => apiFetch<ApiTransaction[]>("/transactions/admin/refunds"),
  reviewRefund: (transactionId: string, payload: { decision: "APPROVE" | "REJECT"; note?: string; proofUrl?: string }) =>
    apiFetch<{ id: string; status: string; refundStatus: string }>(`/transactions/${encodeURIComponent(transactionId)}/refund/review`, { method: "PATCH", body: JSON.stringify(payload) }),
  updatePhone: (phoneNumber: string) =>
    apiFetch<ApiUser>("/users/me/phone", { method: "PATCH", body: JSON.stringify({ phoneNumber }) }),
  tutorApplication: () => apiFetch<ApiTutorApplication | null>("/users/me/tutor-application"),
  submitTutorApplication: (payload: {
    type: ApiTutorApplication["type"];
    organizationName?: string;
    contactPerson?: string;
    studentCardUrl?: string;
    transcriptUrl?: string;
    organizationProofUrl?: string;
    notes?: string;
  }) => apiFetch<ApiTutorApplication>("/users/me/tutor-application", { method: "POST", body: JSON.stringify(payload) }),
  logout: async () => {
    return apiFetch<{ success: boolean }>("/auth/logout", { method: "POST" });
  },
  uploadProfile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<{ url: string; filename: string }>("/uploads/profile", {
      method: "POST",
      body: formData,
    });
  },
  uploadBootcampStudentProof: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<{ url: string; filename: string; size: number; mimetype: string }>("/uploads/bootcamp-student-proof", {
      method: "POST",
      body: formData,
    });
  },
  uploadRefundProof: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetch<{ url: string; filename: string }>("/uploads/refund-proof", { method: "POST", body: form });
  },
  uploadBanner: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<{ url: string; filename: string }>("/uploads/banner", {
      method: "POST",
      body: formData,
    });
  },
  classes: () => apiFetch<ApiClass[]>("/classes"),
  classById: (id: string) => apiFetch<ApiClass>(`/classes/${encodeURIComponent(id)}`),
  managedClass: (id: string) => apiFetch<ApiClass>(`/classes/${encodeURIComponent(id)}/manage`),
  updateClass: (id: string, payload: Record<string, unknown>) =>
    apiFetch<ApiClass>(`/classes/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) }),
  myClasses: () => apiFetch<{ created: ApiClass[]; enrolled: ApiClass[] }>("/classes/mine"),
  tutorParticipants: () => apiFetch<Array<{
    id: string;
    status: string;
    refundStatus?: string;
    paidAt: string | null;
    createdAt: string;
    user: Pick<ApiUser, "id" | "name" | "email" | "phoneNumber">;
    class: Pick<ApiClass, "id" | "title">;
  }>>("/classes/tutor/participants"),
  createClass: (payload: Record<string, unknown>) =>
    apiFetch<ApiClass>("/classes", { method: "POST", body: JSON.stringify(payload) }),
  createPublishedClass: (payload: Record<string, unknown>) =>
    apiFetch<ApiClass>("/classes/publish", { method: "POST", body: JSON.stringify(payload) }),
  publishClass: (id: string) => apiFetch<ApiClass>(`/classes/${encodeURIComponent(id)}/publish`, { method: "PATCH" }),
  cancelClass: (id: string, reason?: string) =>
    apiFetch<{ success: boolean; refunds?: Array<{ id: string; amount: number; status: string }> }>(
      `/classes/${encodeURIComponent(id)}/cancel`,
      { method: "PATCH", body: JSON.stringify({ reason }) },
    ),
  transactions: () => apiFetch<ApiTransaction[]>("/transactions/mine"),
  checkout: (classId: string) => apiFetch<{ transactionId: string; status?: string; redirectUrl: string | null }>(
    "/transactions",
    { method: "POST", body: JSON.stringify({ classId }) },
  ),
  meetingLinks: (classId: string) => apiFetch<ApiClass>(`/classes/${encodeURIComponent(classId)}/meeting-links`),
  dashboard: () => apiFetch<DashboardData>("/dashboard/me"),
  adsSlot: (placement: ApiAd["placement"]) => apiFetch<{ source: "advertiser" | "nexiera"; ads: Array<ApiAd & { official?: boolean }> }>(
    `/ads/slot/${placement}`,
  ),
  adminPendingAds: () => apiFetch<Array<ApiAd & { owner: Pick<ApiUser, "id" | "name" | "fullName" | "email"> }>>("/ads/admin/pending"),
  reviewAd: (adId: string, decision: "APPROVE" | "REJECT") =>
    apiFetch<ApiAd>(`/ads/${encodeURIComponent(adId)}/review`, { method: "PATCH", body: JSON.stringify({ decision }) }),
  myAds: () => apiFetch<ApiAd[]>("/campaigns/mine"),
  createAd: (payload: { title: string; subtitle: string; placement: ApiAd["placement"]; imageUrl: string; targetUrl: string; startsAt: string; endsAt: string }) =>
    apiFetch<ApiAd>("/ads", { method: "POST", body: JSON.stringify(payload) }),
  trackAdImpression: (id: string) => apiFetch<{ tracked: boolean }>(`/ads/${encodeURIComponent(id)}/impression`, { method: "POST" }),
  trackAdClick: (id: string) => apiFetch<{ tracked: boolean; targetUrl: string }>(`/ads/${encodeURIComponent(id)}/click`, { method: "POST" }),
  reviews: (classId: string) => apiFetch<ReviewsData>(`/classes/${encodeURIComponent(classId)}/reviews`),
  createReview: (classId: string, payload: { rating: number; comment?: string }) =>
    apiFetch<ApiReview>(`/classes/${encodeURIComponent(classId)}/reviews`, { method: "POST", body: JSON.stringify(payload) }),
  replyToReview: (classId: string, reviewId: string, reply: string) =>
    apiFetch<ApiReview>(`/classes/${encodeURIComponent(classId)}/reviews/${encodeURIComponent(reviewId)}/reply`, { method: "PATCH", body: JSON.stringify({ reply }) }),
  notifications: () => apiFetch<ApiNotification[]>("/notifications"),
  markNotificationRead: (id: string) => apiFetch<ApiNotification>(`/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () => apiFetch<{ success: boolean }>("/notifications/read-all", { method: "PATCH" }),
  uploadReportEvidence: (file: File) => { const form = new FormData(); form.append("file", file); return apiFetch<{ url: string }>("/uploads/report-evidence", { method: "POST", body: form }); },
  myReports: () => apiFetch<Array<{ id: string; targetType: string; targetId: string; classId: string | null; category: string; status: string; adminNote?: string | null; createdAt: string }>>("/classes/reports/mine"),
  adminReports: () => apiFetch<Array<{ id: string; targetType: string; targetId: string; category: string; description: string; evidenceUrl?: string | null; status: string; reporter: { fullName: string; email: string }; class?: { title: string } | null }>>("/classes/reports/admin"),
  adminPendingClasses: () => apiFetch<ApiClass[]>("/classes/admin/pending"),
  reviewClass: (classId: string, decision: "APPROVE" | "REJECT", note?: string) =>
    apiFetch<ApiClass>(`/classes/${encodeURIComponent(classId)}/review`, {
      method: "PATCH",
      body: JSON.stringify({ decision, note }),
    }),
  reviewReport: (id: string, status: "RESOLVED" | "DISMISSED", note?: string) => apiFetch(`/classes/reports/${encodeURIComponent(id)}/status`, { method: "PATCH", body: JSON.stringify({ status, note }) }),
  requestCourse: (payload: { title: string; campus?: string; major?: string; courseCode?: string; note?: string }) => apiFetch("/classes/course-requests", { method: "POST", body: JSON.stringify(payload) }),
  createReport: (payload: { targetType: "CLASS" | "ORGANIZER"; targetId: string; category: string; description: string; evidenceUrl?: string; classId?: string }) =>
    apiFetch("/classes/reports", { method: "POST", body: JSON.stringify(payload) }),
  requestRefund: (id: string, payload: { method: "BANK" | "EWALLET"; accountName: string; accountNumber: string }) =>
    apiFetch(`/transactions/${encodeURIComponent(id)}/refund`, { method: "POST", body: JSON.stringify(payload) }),
};
