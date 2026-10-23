import { Suspense } from "react";
import type { Metadata } from "next";
import { PromoSlider } from "@/src/components/cari-kelas/PromoSlider";
import { CourseCatalog } from "@/src/components/cari-kelas/CourseCatalog";

export const metadata: Metadata = {
  title: "Cari Kelas Akademik & UTS/UAS — Nexiera",
  description:
    "Temukan bootcamp matkul dan peer-tutoring akademik terbaik dari kampus terkemuka di Indonesia.",
};

export default function CariKelasPage() {
  return (
    <>
      <PromoSlider />
      <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Memuat katalog kelas...</div>}>
        <CourseCatalog />
      </Suspense>
    </>
  );
}
