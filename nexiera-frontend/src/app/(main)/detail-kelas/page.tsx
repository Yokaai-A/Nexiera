import { Suspense } from "react";
import type { Metadata } from "next";
import { DetailKelas } from "@/src/components/detail-kelas/DetailKelas";

export const metadata: Metadata = {
  title: "Detail Kelas Akademik & Catatan Belajar — Nexiera",
  description:
    "Detail bimbingan mata kuliah, tautan catatan belajar, dan jadwal tatap muka interaktif.",
};

export default function DetailKelasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Memuat detail kelas...</div>}>
      <DetailKelas />
    </Suspense>
  );
}
