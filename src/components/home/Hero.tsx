import Link from "next/link";
import Image from "next/image";
import { Search, SquarePen } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-background pt-10 pb-16">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Platform Edukasi &amp; Persiapan Ujian Kampus
          </p>

          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
            Tingkatkan Prestasi Kuliah Bersama{" "}
            <span className="text-blue-600">Tutor Sebaya</span>{" "}
            Terverifikasi
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600">
            Temukan bimbingan mata kuliah, peer-tutoring intensif, dan bootcamp terstruktur
            bersama tutor sebaya dari kampusmu untuk mengamankan nilai UTS/UAS dan pemahaman materi yang mendalam.
          </p>

          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              href="/cari-kelas"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all hover:scale-[1.02]"
            >
              <Search className="h-4 w-4" aria-hidden="true" /> Cari Kelas Kuliah
            </Link>
            <Link
              href="/buat-kelas"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-all hover:scale-[1.02]"
            >
              <SquarePen className="h-4 w-4" aria-hidden="true" /> Buat Kelas Tutor
            </Link>
          </div>
        </div>

        <div className="relative flex min-w-0 items-center justify-center">
          <div className="relative flex w-full max-w-md items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50 to-blue-100/70 p-6 shadow-md ring-1 ring-blue-100">
            <Image
              src="/landing-main.png"
              alt="Ilustrasi Belajar Nexiera"
              width={400}
              height={400}
              priority
              className="max-h-[400px] w-auto object-contain drop-shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
