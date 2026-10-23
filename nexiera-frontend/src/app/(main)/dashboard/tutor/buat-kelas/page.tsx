"use client";

import { GraduationCap } from "lucide-react";
import { BuatKelasForm } from "@/src/components/buat-kelas/BuatKelasForm";
import { useUserStore } from "@/src/store/useUserStore";

export default function DashboardBuatKelasPage() {
  const user = useUserStore();
  const isBootcamp =
    user.activeRole === "bootcamp" ||
    user.activeRole === "bootcamp_partner" ||
    user.activeViewRole === "bootcamp_partner";

  return (
    <div className="space-y-6">
      <div className="rounded-[6px] border border-[#D9DEE7] dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs">
        <span className="rounded-[4px] bg-[#E5E9F0]/60 dark:bg-[#2563EB]/10 text-[#2457C5] dark:text-[#78A0FF] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
          {isBootcamp ? "Portal Mitra Bootcamp" : "Portal Peer-Tutor"}
        </span>
        <h1 className="mt-2 text-2xl font-bold text-[#20232B] dark:text-slate-100">
          Buat Kelas Baru
        </h1>
        <p className="mt-1 text-xs text-[#626B78] dark:text-slate-300">
          Publikasikan bimbingan mata kuliah, tautan catatan belajar, jadwal live meeting, dan kuota peserta.
        </p>
      </div>

      <div className="rounded-[6px] border border-[#D9DEE7] dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <BuatKelasForm />
      </div>
    </div>
  );
}
