import type { Metadata } from "next";
import { PromoSlider } from "@/src/components/cari-kelas/PromoSlider";
import { FilterBar } from "@/src/components/cari-kelas/FilterBar";
import { ClassList } from "@/src/components/cari-kelas/ClassList";

export const metadata: Metadata = {
  title: "Cari Kelas — Nexiera",
  description:
    "Temukan bootcamp, tutoring, dan kelas peer-to-peer terbaik dari kampus terkemuka di Indonesia.",
};

export default function CariKelasPage() {
  return (
    <>
      <PromoSlider />
      <FilterBar />
      <ClassList />
    </>
  );
}
