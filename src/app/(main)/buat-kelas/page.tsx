import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { BuatKelasForm } from "@/src/components/buat-kelas/BuatKelasForm";

export const metadata: Metadata = {
  title: "Publikasi Kelas Akademik — Nexiera",
  description:
    "Buka kelas bimbingan mata kuliah, peer-tutoring, atau bootcamp akademik untuk mahasiswa kampus.",
};

export default function BuatKelasPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      <section className="border-b border-[#D9DEE7] py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="inline-flex items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-3 py-1 text-xs font-medium text-[#20232B]">
            <GraduationCap className="h-3.5 w-3.5 text-[#2457C5]" aria-hidden="true" /> Portal Pengajar &amp; Tutor Kampus
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-semibold text-[#20232B]">
            Publikasikan Kelas Bimbingan
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#626B78]">
            Lengkapi formulir terstruktur di bawah ini untuk mempublikasikan bimbingan mata kuliah, tautan catatan belajar, dan jadwal sesi perkuliahan.
          </p>
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <BuatKelasForm />
        </div>
      </section>
    </div>
  );
}
