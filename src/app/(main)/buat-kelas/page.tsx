import type { Metadata } from "next";
import { BuatKelasForm } from "@/src/components/buat-kelas/BuatKelasForm";

export const metadata: Metadata = {
  title: "Buat Kelas — Nexiera",
  description:
    "Isi detail untuk mempublikasikan kelas Anda ke ribuan talenta kampus terakreditasi.",
};

export default function BuatKelasPage() {
  return (
    <>
      <section className="bg-background px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Buat Bootcamp &amp; Tutoring Baru
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Isi detail di bawah ini untuk mempublikasikan kelas Anda ke ribuan
            talenta kampus terakreditasi.
          </p>
        </div>
      </section>

      <section className="bg-background px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          <BuatKelasForm />
        </div>
      </section>
    </>
  );
}
