import Link from "next/link";
import { ArrowRight, BadgeCheck, Presentation, Search } from "lucide-react";

const FEATURES = [
  {
    title: "Temukan Kelas",
    desc: "Cari bimbingan mata kuliah sesuai jurusan dan kurikulum kampus dengan jadwal yang fleksibel.",
    cta: "Jelajahi Katalog",
    icon: Search,
  },
  {
    title: "Belajar dari Tutor Sebaya",
    desc: "Belajar bersama mahasiswa senior berprestasi dan mitra penyelenggara yang memahami silabus ujian.",
    cta: "Cari Tutor",
    icon: BadgeCheck,
  },
  {
    title: "Buka Kelas Sendiri",
    desc: "Bagikan pemahaman mata kuliah yang kamu kuasai, bantu teman sebaya, dan bangun reputasi akademik positif.",
    cta: "Mulai Mengajar",
    icon: Presentation,
  },
];

export function WhyNexiera() {
  return (
    <section className="bg-background py-14">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Mengapa Memilih NEXIERA?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
          Platform pembelajaran terarah yang dirancang untuk mendukung mahasiswa menghadapi ujian dan tugas perkuliahan.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white p-6 text-left shadow-xs ring-1 ring-slate-100"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <f.icon className="h-5 w-5 text-blue-600" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {f.desc}
              </p>
              <Link
                href={
                  f.title === "Temukan Kelas"
                    ? "/cari-kelas"
                    : f.title === "Belajar dari Tutor Sebaya"
                      ? "/cari-kelas"
                      : "/buat-kelas"
                }
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
              >
                {f.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
