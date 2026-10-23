"use client";

import { useEffect, useSyncExternalStore } from "react";
import { nexieraApi, type ApiTutorApplication, type ApiUser } from "@/src/lib/api";

export type UserRole = "student" | "tutor" | "bootcamp" | "bootcamp_partner" | "admin";
export type ApplicationStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

export interface TutorApplicationData {
  type?: "peer_tutor" | "bootcamp_partner";
  studentCardUrl?: string | null;
  transcriptUrl?: string | null;
  organizationProofUrl?: string | null;
  organizationName?: string;
  contactPerson?: string;
  notes?: string;
  submittedAt?: string;
}

export interface UserState {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  activeRole: UserRole;
  role: UserRole;
  activeViewRole: UserRole;
  tutorApplicationStatus: ApplicationStatus;
  tutorApplicationData?: TutorApplicationData;
  university?: string;
  major?: string;
  nim?: string;
  semester?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  headline?: string;
  organizationName?: string;
  organizationLogoUrl?: string;
  location?: string;
  isLoggedIn: boolean;
  setRole: (role: UserRole) => void;
  setActiveRole: (role: UserRole) => void;
  setActiveViewRole: (role: UserRole) => void;
  addRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
  submitTutorApplication: (data: TutorApplicationData) => Promise<void>;
  updateUser: (data: Partial<Omit<UserState, "updateUser" | "setRole" | "setActiveRole" | "setActiveViewRole" | "addRole" | "hasRole" | "submitTutorApplication">>) => Promise<void>;
}

type UserSnapshot = Omit<UserState,
  | "setRole"
  | "setActiveRole"
  | "setActiveViewRole"
  | "addRole"
  | "hasRole"
  | "submitTutorApplication"
  | "updateUser"
>;

const ANONYMOUS_USER: UserSnapshot = {
  id: "",
  name: "",
  email: "",
  roles: ["student"],
  activeRole: "student",
  role: "student",
  activeViewRole: "student",
  tutorApplicationStatus: "NONE",
  isLoggedIn: false,
};

let currentState: UserSnapshot = ANONYMOUS_USER;
let hydration: Promise<void> | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function toUserRole(role: ApiUser["role"]): UserRole {
  if (role === "TUTOR") return "tutor";
  if (role === "ADMIN") return "admin";
  return "student";
}

function mapApplication(application: ApiTutorApplication | null): Pick<UserSnapshot, "tutorApplicationStatus" | "tutorApplicationData"> {
  if (!application) return { tutorApplicationStatus: "NONE", tutorApplicationData: undefined };
  return {
    tutorApplicationStatus: application.status,
    tutorApplicationData: {
      type: application.type === "PEER_TUTOR" ? "peer_tutor" : "bootcamp_partner",
      studentCardUrl: application.studentCardUrl,
      transcriptUrl: application.transcriptUrl,
      organizationProofUrl: application.organizationProofUrl,
      organizationName: application.organizationName || undefined,
      contactPerson: application.contactPerson || undefined,
      notes: application.notes || undefined,
      submittedAt: application.submittedAt,
    },
  };
}

function mapUser(user: ApiUser, application: ApiTutorApplication | null = null): UserSnapshot {
  const databaseRole = toUserRole(user.role);
  const isBootcamp = databaseRole === "tutor" && (application?.type === "BOOTCAMP_PARTNER" || Boolean(user.organizationName));
  const role: UserRole = isBootcamp ? "bootcamp_partner" : databaseRole;

  const roles: UserRole[] = ["student"];
  if (role === "tutor") roles.push("tutor");
  if (role === "bootcamp_partner") roles.push("bootcamp_partner");
  if (role === "admin") roles.push("tutor", "bootcamp_partner", "admin");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles,
    activeRole: role,
    role,
    activeViewRole: role,
    ...mapApplication(application),
    university: user.university || undefined,
    major: user.major || undefined,
    nim: user.studentNumber || undefined,
    semester: user.semester || undefined,
    phoneNumber: user.phoneNumber,
    avatarUrl: user.avatarUrl || undefined,
    coverUrl: user.coverUrl || undefined,
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
    hydration = nexieraApi.me()
      .then(async (user) => {
        const application = await nexieraApi.tutorApplication().catch(() => null);
        currentState = mapUser(user, application);
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

function activateRole(role: UserRole) {
  if (currentState.roles.includes(role)) {
    currentState = { ...currentState, activeRole: role, role, activeViewRole: role };
    notify();
  }
}

async function updateUser(data: Parameters<UserState["updateUser"]>[0]) {
  if (!currentState.isLoggedIn) throw new Error("Masuk terlebih dahulu untuk mengubah profil.");
  const profile: Record<string, string> = {};
  const map: Array<[keyof typeof data, string]> = [
    ["name", "name"], ["university", "university"], ["major", "major"],
    ["nim", "studentNumber"], ["semester", "semester"], ["avatarUrl", "avatarUrl"],
    ["coverUrl", "coverUrl"], ["bio", "bio"], ["headline", "headline"],
    ["organizationName", "organizationName"], ["organizationLogoUrl", "organizationLogoUrl"],
    ["location", "location"],
  ];
  for (const [source, target] of map) {
    const value = data[source];
    if (typeof value === "string") profile[target] = value;
  }

  if (data.phoneNumber !== undefined) await nexieraApi.updatePhone(data.phoneNumber);
  if (Object.keys(profile).length > 0) {
    const updated = await nexieraApi.updateProfile(profile);
    const application = await nexieraApi.tutorApplication().catch(() => null);
    currentState = mapUser(updated, application);
  } else if (data.phoneNumber !== undefined) {
    const updated = await nexieraApi.me();
    const application = await nexieraApi.tutorApplication().catch(() => null);
    currentState = mapUser(updated, application);
  }
  notify();
}

async function submitTutorApplication(data: TutorApplicationData) {
  if (!currentState.isLoggedIn) throw new Error("Masuk terlebih dahulu untuk mengajukan verifikasi.");
  if (!data.type) throw new Error("Jenis pengajuan wajib dipilih.");
  const application = await nexieraApi.submitTutorApplication({
    type: data.type === "peer_tutor" ? "PEER_TUTOR" : "BOOTCAMP_PARTNER",
    organizationName: data.organizationName,
    contactPerson: data.contactPerson,
    studentCardUrl: data.studentCardUrl || undefined,
    transcriptUrl: data.transcriptUrl || undefined,
    organizationProofUrl: data.organizationProofUrl || undefined,
    notes: data.notes,
  });
  currentState = { ...currentState, ...mapApplication(application) };
  notify();
}

function useUserStore(): UserState {
  const state = useSyncExternalStore(subscribe, () => currentState, () => ANONYMOUS_USER);
  useEffect(() => {
    void refreshUser();
  }, []);

  return {
    ...state,
    setRole: activateRole,
    setActiveRole: activateRole,
    setActiveViewRole: activateRole,
    addRole: () => undefined,
    hasRole: (role) => state.roles.includes(role) || (role === "bootcamp_partner" && state.roles.includes("bootcamp")),
    submitTutorApplication,
    updateUser,
  };
}

export { useUserStore };
