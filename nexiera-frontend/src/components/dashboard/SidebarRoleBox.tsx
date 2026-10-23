"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, GraduationCap, Handshake, RefreshCw, Rocket } from "lucide-react";
import { useUserStore, type UserRole } from "@/src/store/useUserStore";
import { TutorVerificationModal } from "./TutorVerificationModal";

const meta: Record<UserRole, { title: string; subtitle: string; icon: React.ReactNode }> = {
  student: {
    title: "Mahasiswa",
    subtitle: "Akses bimbingan & materi",
    icon: <GraduationCap className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />,
  },
  tutor: {
    title: "Peer-Tutor",
    subtitle: "Pengelolaan kelas mandiri",
    icon: <Handshake className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />,
  },
  bootcamp: {
    title: "Mitra Bootcamp",
    subtitle: "Penyelenggara program",
    icon: <Rocket className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />,
  },
  bootcamp_partner: {
    title: "Mitra Bootcamp",
    subtitle: "Penyelenggara program",
    icon: <Rocket className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />,
  },
  admin: {
    title: "Administrator",
    subtitle: "Pengelolaan platform",
    icon: <Check className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />,
  },
};

export function SidebarRoleBox() {
  const router = useRouter();
  const user = useUserStore();
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [applicationType, setApplicationType] = useState<"peer_tutor" | "bootcamp_partner">("peer_tutor");

  const currentRole = user.activeRole || user.role || "student";
  const current = meta[currentRole] || meta.student;
  const roles: UserRole[] = user.roles?.length ? user.roles : [currentRole];

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (root.current && !root.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  function selectRole(role: UserRole) {
    user.setActiveRole(role);
    setOpen(false);
    router.replace(role === "student" ? "/dashboard" : "/dashboard/tutor");
  }

  function apply(type: "peer_tutor" | "bootcamp_partner") {
    setApplicationType(type);
    setOpen(false);
    setApplicationOpen(true);
  }

  const canSwitch = roles.length > 1;

  return (
    <div
      ref={root}
      className="relative rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[#626B78] dark:text-[#B1B7C3]">
            Peran Aktif
          </p>
          <div className="mt-1 flex items-center gap-2">
            {current.icon}
            <span className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              {current.title}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            {current.subtitle}
          </p>
        </div>

        {canSwitch ? (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-[4px] border border-[#2457C5] bg-[#2457C5] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Ganti</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        ) : user.role === "student" && user.tutorApplicationStatus !== "PENDING" ? (
          <button
            type="button"
            onClick={() => apply("peer_tutor")}
            className="shrink-0 inline-flex items-center gap-1 rounded-[4px] border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs font-medium text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6] dark:hover:bg-[#20242D] transition-colors"
          >
            Daftar Tutor
          </button>
        ) : null}
      </div>

      {user.tutorApplicationStatus === "PENDING" && (
        <div className="mt-3 border-t border-[#D9DEE7] pt-2.5 dark:border-[#343945]">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Pengajuan pengajar sedang ditinjau
          </p>
        </div>
      )}

      {open && canSwitch && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1.5 space-y-1 rounded-[6px] border border-[#D9DEE7] bg-white p-2 dark:border-[#343945] dark:bg-[#191C23]">
          <p className="px-2 py-1 text-xs font-medium text-[#626B78] dark:text-[#B1B7C3]">
            Pilih Mode Tampilan
          </p>
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => selectRole(role)}
              className="flex w-full items-center justify-between rounded px-2.5 py-2 text-left text-xs font-medium hover:bg-[#E5E9F0] dark:hover:bg-[#20242D] text-[#20232B] dark:text-[#F3F4F6]"
            >
              <span>{meta[role]?.title || role}</span>
              {role === currentRole && (
                <Check className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />
              )}
            </button>
          ))}
        </div>
      )}

      <TutorVerificationModal
        isOpen={applicationOpen}
        onClose={() => setApplicationOpen(false)}
        defaultType={applicationType}
      />
    </div>
  );
}
