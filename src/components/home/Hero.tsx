import Link from "next/link";
import Image from "next/image";
import { Search, Star, SquarePen } from "lucide-react";
import { CountUpNumber } from "./CountUpNumber";

const STATS = [
  { value: 15000, suffix: "+", label: "Mahasiswa Aktif" },
  { value: 450, suffix: "+", label: "Tutor Terverifikasi" },
  { value: 4.9, decimals: 1, label: "Rata-rata Kepuasan" },
];

export function Hero() {
  return (
    <section className="bg-background pt-6 pb-10">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:gap-12">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            Platform Edukasi Akademik &amp; UTS/UAS No. 1
          </div>

          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
            Tingkatkan Prestasi Kuliah Bersama{" "}
            <span className="text-blue-600">Tutor Sebaya</span>{" "}
            Terverifikasi
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600">
            Temukan bimbingan mata kuliah kampus, peer-tutoring intensif, dan bootcamp terstruktur
            bersama tutor sebaya berprestasi dari kampusmu untuk mengamankan nilai UTS/UAS dan IPK impian.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cari-kelas"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all hover:scale-[1.02]"
            >
              <Search className="h-4 w-4" aria-hidden="true" /> Cari Kelas Kuliah
            </Link>
            <Link
              href="/buat-kelas"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all hover:scale-[1.02]"
            >
              <SquarePen className="h-4 w-4" aria-hidden="true" /> Buat Kelas Tutor
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:gap-6 sm:p-6">
            {STATS.map((s) => (
              <div key={s.label} className="min-w-0 text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-black text-slate-800 sm:text-3xl">
                  <CountUpNumber value={s.value} suffix={"suffix" in s ? s.suffix : ""} decimals={"decimals" in s ? s.decimals : 0} />
                  {s.label === "Rata-rata Kepuasan" && <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-label="bintang" />}
                </div>
                <div className="mt-1 text-xs font-medium leading-snug text-slate-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden min-w-0 justify-center lg:flex">
          <div className="relative w-full max-w-lg">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-blue-200/50 via-cyan-100/40 to-blue-300/30 blur-2xl -z-10" />
            <div className="overflow-hidden rounded-[40px] bg-gradient-to-b from-blue-100 to-blue-200/70 p-6 shadow-xl ring-1 ring-blue-200/60">
              <Image
                src="/landing-main.png"
                alt="Tutor NEXIERA menemukan kelas terbaik"
                width={550}
                height={550}
                priority
                className="h-auto w-full object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
