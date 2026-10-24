"use client";

import { useEffect, useSyncExternalStore } from "react";
import { nexieraApi, type ApiUser } from "@/src/lib/api";

export type UserRole = "student" | "tutor" | "bootcamp" | "bootcamp_partner" | "admin" | "MAHASISWA" | "PEER_TUTOR" | "MITRA_BOOTCAMP";

export interface UserState {
  id: string;
  name: string;
  fullName: string;
  email: string;
  contactEmail?: string;
  roles: UserRole[];
  activeRole: UserRole;
  role: UserRole;
  activeViewRole: UserRole;
  campus?: string;
  university?: string;
  major?: string;
  nim?: string;
  semester?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  coverUrl?: string;
  bannerUrl?: string;
  bio?: string;
  headline?: string;
  organizationName?: string;
  organizationLogoUrl?: string;
  location?: string;
  isLoggedIn: boolean;
  tutorApplicationStatus?: "PENDING" | "APPROVED" | "REJECTED" | null;
  tutorApplicationData?: { submittedAt?: string } | null;
  setRole: (role: UserRole) => void;
  setActiveRole: (role: UserRole) => Promise<void>;
  setActiveViewRole: (role: UserRole) => void;
  addRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
  updateUser: (data: Partial<UserState>) => Promise<void>;
  submitTutorApplication: (payload: {
    type: "PEER_TUTOR" | "BOOTCAMP_PARTNER" | "peer_tutor" | "bootcamp_partner" | string;
    campus?: string;
    major?: string;
    organizationName?: string;
    contactEmail?: string;
    contactPerson?: string;
    organizationProofUrl?: string;
    organizationWebsiteUrl?: string;
    studentProofUrl?: string;
    notes?: string;
  }) => Promise<void>;
}

type UserSnapshot = Omit<
  UserState,
  | "setRole"
  | "setActiveRole"
  | "setActiveViewRole"
  | "addRole"
  | "hasRole"
  | "updateUser"
  | "submitTutorApplication"
>;

const ANONYMOUS_USER: UserSnapshot = {
  id: "",
  name: "",
  fullName: "",
  email: "",
  roles: ["student"],
  activeRole: "student",
  role: "student",
  activeViewRole: "student",
  isLoggedIn: false,
};

let currentState: UserSnapshot = ANONYMOUS_USER;
let hydration: Promise<void> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function normalizeRole(roleStr?: string): UserRole {
  if (roleStr === "PEER_TUTOR" || roleStr === "TUTOR" || roleStr === "tutor") return "tutor";
  if (roleStr === "MITRA_BOOTCAMP" || roleStr === "bootcamp" || roleStr === "bootcamp_partner") return "bootcamp_partner";
  if (roleStr === "ADMIN" || roleStr === "admin") return "admin";
  return "student";
}

function toBackendRole(role: UserRole): string {
  if (role === "tutor" || role === "PEER_TUTOR") return "PEER_TUTOR";
  if (role === "bootcamp" || role === "bootcamp_partner" || role === "MITRA_BOOTCAMP") return "MITRA_BOOTCAMP";
  return "MAHASISWA";
}

function mapUser(user: ApiUser): UserSnapshot {
  const normActive = normalizeRole(user.activeRole || user.role);

  let rawRoles: string[] = [];
  if (Array.isArray(user.roles)) {
    rawRoles = user.roles;
  } else if (typeof user.roles === "string") {
    try { rawRoles = JSON.parse(user.roles); } catch { rawRoles = ["MAHASISWA"]; }
  } else {
    rawRoles = ["MAHASISWA"];
  }

  const mappedRoles: UserRole[] = ["student"];
  for (const r of rawRoles) {
    const nr = normalizeRole(r);
    if (!mappedRoles.includes(nr)) mappedRoles.push(nr);
  }
  if (!mappedRoles.includes(normActive)) mappedRoles.push(normActive);

  const displayName = user.fullName || user.name || "Pengguna";

  return {
    id: user.id,
    name: displayName,
    fullName: displayName,
    email: user.email,
    contactEmail: user.contactEmail || undefined,
    roles: mappedRoles,
    activeRole: normActive,
    role: normActive,
    activeViewRole: normActive,
    campus: user.campus || user.university || undefined,
    university: user.campus || user.university || undefined,
    major: user.major || undefined,
    nim: user.studentNumber || undefined,
    semester: user.semester || undefined,
    phoneNumber: user.phoneNumber || undefined,
    avatarUrl: user.avatarUrl || undefined,
    coverUrl: user.bannerUrl || user.coverUrl || undefined,
    bannerUrl: user.bannerUrl || user.coverUrl || undefined,
    bio: user.bio || undefined,
    headline: user.headline || undefined,
    organizationName: user.organizationName || undefined,
    organizationLogoUrl: user.organizationLogoUrl || undefined,
    location: user.location || undefined,
    isLoggedIn: true,
  };
}

export async function refreshUser() {
  if (!hydration) {
    hydration = nexieraApi
      .me()
      .then((user) => {
        currentState = mapUser(user);
      })
      .catch(() => {
        currentState = ANONYMOUS_USER;
      })
      .finally(() => {
        hydration = null;
        notify();
      });
  }
  await hydration;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

async function activateRole(role: UserRole) {
  const backendRole = toBackendRole(role);
  const updated = await nexieraApi.switchRole(backendRole);
  currentState = mapUser(updated);
  notify();
}

async function updateUser(data: Partial<UserState>) {
  if (!currentState.isLoggedIn) throw new Error("Masuk terlebih dahulu untuk mengubah profil.");

  const payload: Partial<ApiUser> = {};
  if (data.fullName !== undefined || data.name !== undefined) payload.fullName = data.fullName || data.name || "";
  if (data.contactEmail !== undefined) payload.contactEmail = data.contactEmail;
  if (data.campus !== undefined || data.university !== undefined) payload.campus = data.campus || data.university || "";
  if (data.major !== undefined) payload.major = data.major;
  if (data.nim !== undefined) payload.studentNumber = data.nim;
  if (data.semester !== undefined) payload.semester = data.semester;
  if (data.bio !== undefined) payload.bio = data.bio;
  if (data.headline !== undefined) payload.headline = data.headline;
  if (data.avatarUrl !== undefined) payload.avatarUrl = data.avatarUrl;
  if (data.bannerUrl !== undefined || data.coverUrl !== undefined) payload.bannerUrl = data.bannerUrl || data.coverUrl || "";
  if (data.phoneNumber !== undefined) payload.phoneNumber = data.phoneNumber;
  if (data.organizationName !== undefined) payload.organizationName = data.organizationName;
  if (data.organizationLogoUrl !== undefined) payload.organizationLogoUrl = data.organizationLogoUrl;
  if (data.location !== undefined) payload.location = data.location;

  const updated = await nexieraApi.updateProfile(payload);
  currentState = mapUser(updated);
  notify();
}

function useUserStore(): UserState {
  const state = useSyncExternalStore(subscribe, () => currentState, () => ANONYMOUS_USER);
  useEffect(() => {
    void refreshUser();
  }, []);

  return {
    ...state,
    setRole: (r) => void activateRole(r),
    setActiveRole: activateRole,
    setActiveViewRole: (r) => {
      currentState = { ...currentState, activeViewRole: r };
      notify();
    },
    addRole: () => undefined,
    hasRole: (role) =>
      state.roles.includes(role) ||
      (role === "bootcamp_partner" && state.roles.includes("bootcamp")),
    updateUser,
    submitTutorApplication: async (payload) => {
      const isBootcamp = payload.type.toUpperCase() === "BOOTCAMP_PARTNER" || payload.type === "bootcamp_partner";
      if (isBootcamp) {
        await nexieraApi.applyBootcamp({
          organizationName: payload.organizationName || "Lembaga Bootcamp",
          contactEmail: payload.contactEmail || payload.contactPerson || "",
          logoUrl: payload.organizationProofUrl,
          websiteUrl: payload.organizationWebsiteUrl,
          studentProofUrl: payload.studentProofUrl || "",
          description: payload.notes,
        });
      } else {
        await nexieraApi.applyTutor({
          campus: payload.campus || currentState.university || currentState.campus,
          major: payload.major || currentState.major,
          studentProofUrl: payload.studentProofUrl || "",
          notes: payload.notes,
        });
      }
    },
  };
}

export { useUserStore };
