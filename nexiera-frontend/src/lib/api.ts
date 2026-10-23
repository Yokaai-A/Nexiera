const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (process.env.NODE_ENV === "production" && !configuredApiBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL must be configured for production builds");
}
const API_BASE_URL = (configuredApiBaseUrl || "http://localhost:4000/api").replace(/\/$/, "");

function getBrowserApiBaseUrl() {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return API_BASE_URL;

  const apiUrl = new URL(API_BASE_URL);
  const pageHost = window.location.hostname;
  const isLoopback = (hostname: string) => hostname === "localhost" || hostname === "127.0.0.1";
  if (isLoopback(apiUrl.hostname) && isLoopback(pageHost)) {
    apiUrl.hostname = pageHost;
    return apiUrl.toString().replace(/\/$/, "");
  }
  return API_BASE_URL;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  university: string | null;
  major: string | null;
  studentNumber: string | null;
  semester: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string | null;
  headline: string | null;
  organizationName: string | null;
  organizationLogoUrl: string | null;
  location: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: ApiUser;
}

export interface ApiClass {
  id: string;
  title: string;
  shortDescription: string | null;
  description: string;
  mainCategory: string | null;
  major: string | null;
  university: string | null;
  courseType: "PEER_TUTORING" | "BOOTCAMP";
  organizerName: string | null;
  organizerLogo: string | null;
  price: string;
  currency: string;
  status?: "DRAFT" | "ACTIVE" | "CANCELLED";
  startsAt: string | null;
  accessDuration?: string | null;
  maxQuota: number | null;
  availableSeats?: number | null;
  requirements?: string[] | null;
  facilities?: string[] | null;
  meetingPlatform?: string | null;
  meetingUrl?: string | null;
  materialPlatform?: string | null;
  materialUrl?: string | null;
  recordingUrl?: string | null;
  driveUrl?: string | null;
  cancellationReason?: string | null;
  tutor: { id: string; name: string; email?: string; phoneNumber?: string };
  enrollmentId?: string;
  paymentStatus?: string;
  paidAt?: string | null;
  studentCount?: number;
}

export interface ApiTransaction {
  id: string;
  amount: string;
  currency: string;
  status: "PENDING" | "PAID" | "REFUNDED";
  refundStatus: "NOT_REQUESTED" | "PROCESSING" | "COMPLETED" | "FAILED" | "MANUAL_REQUIRED";
  createdAt: string;
  paidAt: string | null;
  class: Pick<ApiClass, "id" | "title" | "startsAt" | "status">;
  user?: Pick<ApiUser, "id" | "name" | "email" | "phoneNumber">;
}

export interface ApiAd {
  id: string;
  title: string;
  subtitle: string | null;
  placement: "HOME_HERO" | "CLASS_CATALOG" | "DASHBOARD";
  imageUrl: string;
  targetUrl: string;
  startsAt: string;
  endsAt: string;
  status: "ACTIVE" | "PAUSED";
  impressions: number;
  clicks: number;
}

export interface DashboardData {
  role: ApiUser["role"];
  classes: ApiClass[];
  transactions: ApiTransaction[];
  attendedSessionsCount?: number;
  totalRevenue: number;
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
  comment: string;
  reply: string | null;
  createdAt: string;
  user: { id: string; name: string; university: string | null; major: string | null };
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

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("nexiera_access_token");
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("nexiera_access_token", token);
  } else {
    localStorage.removeItem("nexiera_access_token");
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  const token = getStoredToken();
  if (token && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${token}`);
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

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getBrowserAuthUrl(path: string) {
  return `${getBrowserApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export const nexieraApi = {
  register: async (payload: { email: string; password: string; fullName: string; phoneNumber: string }) => {
    const res = await apiFetch<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) });
    if (res?.accessToken) setStoredToken(res.accessToken);
    return res;
  },
  login: async (payload: { email: string; password: string }) => {
    const res = await apiFetch<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) });
    if (res?.accessToken) setStoredToken(res.accessToken);
    return res;
  },
  me: () => apiFetch<ApiUser>("/users/me"),
  updateProfile: (profile: Partial<Omit<ApiUser, "id" | "email" | "role">>) =>
    apiFetch<ApiUser>("/users/me", { method: "PATCH", body: JSON.stringify(profile) }),
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
    setStoredToken(null);
    return apiFetch<{ success: boolean }>("/auth/logout", { method: "POST" });
  },
  classes: () => apiFetch<ApiClass[]>("/classes"),
  classById: (id: string) => apiFetch<ApiClass>(`/classes/${encodeURIComponent(id)}`),
  managedClass: (id: string) => apiFetch<ApiClass>(`/classes/${encodeURIComponent(id)}/manage`),
  updateClass: (id: string, payload: Record<string, unknown>) =>
    apiFetch<ApiClass>(`/classes/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) }),
  myClasses: () => apiFetch<ApiClass[]>("/classes/mine"),
  tutorParticipants: () => apiFetch<Array<{
    id: string;
    status: string;
    refundStatus: string;
    paidAt: string | null;
    createdAt: string;
    user: Pick<ApiUser, "id" | "name" | "email" | "phoneNumber">;
    class: Pick<ApiClass, "id" | "title">;
    presence: { status: string; markedAt: string | null } | null;
  }>>("/classes/tutor/participants"),
  createClass: (payload: Record<string, unknown>) =>
    apiFetch<ApiClass>("/classes", { method: "POST", body: JSON.stringify(payload) }),
  createPublishedClass: (payload: Record<string, unknown>) =>
    apiFetch<ApiClass>("/classes/publish", { method: "POST", body: JSON.stringify(payload) }),
  publishClass: (id: string) => apiFetch<ApiClass>(`/classes/${encodeURIComponent(id)}/publish`, { method: "PATCH" }),
  cancelClass: (id: string, reason: string) =>
    apiFetch<{ refunds: { eligible: number; requested: number; failed: number; manualRequired: number } }>(
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
  myAds: () => apiFetch<ApiAd[]>("/ads/mine"),
  createAd: (payload: { title: string; subtitle: string; placement: ApiAd["placement"]; imageUrl: string; targetUrl: string; startsAt: string; endsAt: string }) =>
    apiFetch<ApiAd>("/ads", { method: "POST", body: JSON.stringify(payload) }),
  trackAdImpression: (id: string) => apiFetch<{ tracked: boolean }>(`/ads/${encodeURIComponent(id)}/impression`, { method: "POST" }),
  trackAdClick: (id: string) => apiFetch<{ tracked: boolean; targetUrl: string }>(`/ads/${encodeURIComponent(id)}/click`, { method: "POST" }),
  reviews: (classId: string) => apiFetch<ApiReview[]>(`/classes/${encodeURIComponent(classId)}/reviews`),
  createReview: (classId: string, payload: { rating: number; comment: string }) =>
    apiFetch<ApiReview>(`/classes/${encodeURIComponent(classId)}/reviews`, { method: "POST", body: JSON.stringify(payload) }),
  replyToReview: (classId: string, reviewId: string, reply: string) =>
    apiFetch<{ id: string; reply: string; updatedAt: string }>(`/classes/${encodeURIComponent(classId)}/reviews/${encodeURIComponent(reviewId)}/reply`, { method: "PATCH", body: JSON.stringify({ reply }) }),
  createReport: (payload: { targetType: "CLASS" | "ORGANIZER"; targetId: string; category: string; description: string }) =>
    apiFetch("/classes/reports", { method: "POST", body: JSON.stringify(payload) }),
};
