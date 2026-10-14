import { Suspense } from "react";
import type { Metadata } from "next";
import { KelasSaya } from "@/src/components/kelas-saya/KelasSaya";

export const metadata: Metadata = {
  title: "Dashboard Kelas Saya — Nexiera",
  description:
    "Akses ruang sesi langsung, tautan catatan belajar, dan rekaman sesi tatap muka kelas kuliah yang kamu ikuti.",
};

export default function KelasSayaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-slate-500">
          Memuat dashboard kelas...
        </div>
      }
    >
      <KelasSaya />
    </Suspense>
  );
}
