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
    <section className="bg-white py-14 border-t border-[#D9DEE7]">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#20232B]">
          Mengapa Memilih NEXIERA?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[#626B78]">
          Platform pembelajaran terarah yang dirancang untuk mendukung mahasiswa menghadapi ujian dan tugas perkuliahan.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="nx-card p-6 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#E5E9F0] text-[#20232B]">
                <f.icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#20232B]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#626B78]">
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
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#2457C5] hover:underline"
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
