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
    <div className="bg-background min-h-screen pb-20">
      <section className="px-6 py-10">
        <div className="mx-auto max-w-4xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
            <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" /> Portal Tutor &amp; Mitra Edukasi Kampus
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Publikasi Kelas Bimbingan &amp; Bootcamp
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            Isi formulir terstruktur di bawah ini untuk mempublikasikan bimbingan mata kuliah,
            catatan Notion, dan jadwal bimbingan Anda ke ribuan mahasiswa kampus terverifikasi.
          </p>
        </div>
      </section>

      <section className="px-6">
        <div className="mx-auto max-w-4xl">
          <BuatKelasForm />
        </div>
      </section>
    </div>
  );
}
