"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, GraduationCap, Handshake, Lock, PlusCircle, RefreshCw, Rocket } from "lucide-react";
import { useUserStore, type UserRole } from "@/src/store/useUserStore";
import { TutorVerificationModal } from "./TutorVerificationModal";

const AVAILABLE_ROLES: Array<{ role: UserRole; title: string; subtitle: string; icon: React.ReactNode; defaultType: "peer_tutor" | "bootcamp_partner" }> = [
  {
    role: "student",
    title: "Mahasiswa",
    subtitle: "Akses bimbingan, jadwal & materi",
    icon: <GraduationCap className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />,
    defaultType: "peer_tutor",
  },
  {
    role: "tutor",
    title: "Peer-Tutor",
    subtitle: "Kelola kelas bimbingan mandiri",
    icon: <Handshake className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />,
    defaultType: "peer_tutor",
  },
  {
    role: "bootcamp_partner",
    title: "Mitra Bootcamp",
    subtitle: "Penyelenggara program intensif",
    icon: <Rocket className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />,
    defaultType: "bootcamp_partner",
  },
];

const metaMap: Record<string, { title: string; subtitle: string; icon: React.ReactNode }> = {
  student: AVAILABLE_ROLES[0],
  MAHASISWA: AVAILABLE_ROLES[0],
  tutor: AVAILABLE_ROLES[1],
  PEER_TUTOR: AVAILABLE_ROLES[1],
  bootcamp: AVAILABLE_ROLES[2],
  bootcamp_partner: AVAILABLE_ROLES[2],
  MITRA_BOOTCAMP: AVAILABLE_ROLES[2],
};

export function SidebarRoleBox() {
  const router = useRouter();
  const user = useUserStore();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"peer_tutor" | "bootcamp_partner">("peer_tutor");

  const currentRole = user.activeRole || "student";
  const current = metaMap[currentRole] || AVAILABLE_ROLES[0];

  function isRoleUnlocked(role: UserRole) {
    if (role === "student" || role === "MAHASISWA") return true;
    if (role === "tutor" || role === "PEER_TUTOR") {
      return user.roles.includes("tutor") || user.roles.includes("PEER_TUTOR");
    }
    if (role === "bootcamp" || role === "bootcamp_partner" || role === "MITRA_BOOTCAMP") {
      return (
        user.roles.includes("bootcamp") ||
        user.roles.includes("bootcamp_partner") ||
        user.roles.includes("MITRA_BOOTCAMP")
      );
    }
    return false;
  }

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (root.current && !root.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  async function selectRole(targetRole: UserRole, defaultType: "peer_tutor" | "bootcamp_partner") {
    if (!isRoleUnlocked(targetRole)) {
      setModalType(defaultType);
      setModalOpen(true);
      setOpen(false);
      return;
    }

    if (targetRole === currentRole) {
      setOpen(false);
      return;
    }
    try {
      setIsSwitching(true);
      setSwitchError("");
      await user.setActiveRole(targetRole);
      setOpen(false);
      router.replace(targetRole === "student" ? "/dashboard" : "/dashboard/tutor");
    } catch (cause) {
      setSwitchError(cause instanceof Error ? cause.message : "Peran gagal diganti.");
    } finally {
      setIsSwitching(false);
    }
  }

  return (
    <>
      <div
        ref={root}
        className="relative rounded-[6px] border border-[#D9DEE7] bg-white p-3.5 sm:p-4 dark:border-[#343945] dark:bg-[#191C23]"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-[#626B78] dark:text-[#B1B7C3]">
              Peran Aktif
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              {current.icon}
              <span className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                {current.title}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
              {current.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            disabled={isSwitching}
            aria-expanded={open}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-[4px] border border-[#2457C5] bg-[#2457C5] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSwitching ? "animate-spin" : ""}`} />
            <span>Ganti</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {open && (
          <div className="absolute left-0 right-0 top-full z-40 mt-1.5 space-y-1 rounded-[6px] border border-[#D9DEE7] bg-white p-2 shadow-lg dark:border-[#343945] dark:bg-[#191C23]">
            {switchError && <p role="alert" className="rounded px-2 py-1 text-[11px] text-red-700 dark:text-red-300">{switchError}</p>}
            <p className="px-2 py-1 text-[11px] font-medium text-[#626B78] dark:text-[#B1B7C3]">
              Pilih Mode Akun (Single-Account)
            </p>
            {AVAILABLE_ROLES.map((item) => {
              const isSelected = item.role === currentRole;
              const unlocked = isRoleUnlocked(item.role);

              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => selectRole(item.role, item.defaultType)}
                  className={`flex w-full items-center justify-between rounded px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-[#2457C5]/10 text-[#2457C5] dark:text-[#78A0FF]"
                      : "hover:bg-[#E5E9F0] dark:hover:bg-[#20242D] text-[#20232B] dark:text-[#F3F4F6]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{item.title}</span>
                        {!unlocked && (
                          <span className="inline-flex items-center gap-0.5 rounded-[3px] bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                            <Lock className="h-2.5 w-2.5" /> Daftar Dulu
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#626B78] dark:text-[#B1B7C3]">
                        {unlocked ? item.subtitle : "Klik untuk mengisi formulir pendaftaran"}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />
                  )}
                </button>
              );
            })}


            {(!isRoleUnlocked("tutor") || !isRoleUnlocked("bootcamp_partner")) && (
              <div className="mt-2 border-t border-[#D9DEE7] pt-1.5 dark:border-[#343945]">
                {!isRoleUnlocked("tutor") && (
                  <button
                    type="button"
                    onClick={() => {
                      setModalType("peer_tutor");
                      setModalOpen(true);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-[#2457C5] hover:underline dark:text-[#78A0FF]"
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> Daftar Jadi Peer-Tutor
                  </button>
                )}
                {!isRoleUnlocked("bootcamp_partner") && (
                  <button
                    type="button"
                    onClick={() => {
                      setModalType("bootcamp_partner");
                      setModalOpen(true);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-purple-600 hover:underline dark:text-purple-400"
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> Daftar Mitra Bootcamp
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <TutorVerificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType={modalType}
      />
    </>
  );
}
