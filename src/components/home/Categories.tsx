import Link from "next/link";
import { ArrowRight, Atom, BriefcaseBusiness, HeartPulse, Palette, Scale, Sprout } from "lucide-react";

const CATEGORIES = [
  {
    name: "Sains & Teknologi",
    slug: "Sains & Teknologi",
    desc: "Kalkulus, Fisika Dasar, Kimia Organik, Pemrograman Dasar, Matematika Diskrit, Struktur Data...",
    count: "120+ Kelas",
    icon: Atom,
  },
  {
    name: "Ekonomi & Bisnis",
    slug: "Ekonomi & Bisnis",
    desc: "Pengantar Akuntansi, Ekonomi Mikro/Makro, Manajemen Keuangan, Statistika Bisnis...",
    count: "98+ Kelas",
    icon: BriefcaseBusiness,
  },
  {
    name: "Sosial & Hukum",
    slug: "Sosial & Hukum",
    desc: "Hukum Perdata/Pidana, Analisis Data Sosial, Komunikasi Massa, Hubungan Internasional...",
    count: "85+ Kelas",
    icon: Scale,
  },
  {
    name: "Kesehatan & Kedokteran",
    slug: "Kesehatan & Kedokteran",
    desc: "Anatomi, Farmakologi, Fisiologi, Biokimia Klinis, Keperawatan Medikal Bedah...",
    count: "140+ Kelas",
    icon: HeartPulse,
  },
  {
    name: "Seni, Desain & Arsitektur",
    slug: "Seni Desain & Arsitektur",
    desc: "Gambar Teknik, Estetika Bentuk, Studio Perancangan Arsitektur, Mekanika Bahan...",
    count: "64+ Kelas",
    icon: Palette,
  },
  {
    name: "Pertanian & Peternakan",
    slug: "Pertanian & Peternakan",
    desc: "Agroteknologi, Agronomi, Ilmu Tanah, Genetika Tanaman & Ternak, Nutrisi Pakan...",
    count: "210+ Tutor",
    icon: Sprout,
  },
];

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            Eksplorasi Kurikulum Kampus
          </span>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Kategori Kelas Paling Diminati
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Pilih rumpun keilmuan yang ingin kamu tingkatkan pemahamannya semester ini.
          </p>
        </div>
        <Link
          href="/cari-kelas"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
        >
          Lihat Semua Katalog <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.name}
            href={`/cari-kelas?category=${encodeURIComponent(c.slug)}`}
            className="group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <span className="absolute right-5 top-5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
              {c.count}
            </span>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50/80 group-hover:bg-blue-100 transition-colors">
                <c.icon className="h-5 w-5 text-blue-600" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors pr-14">
                {c.name}
              </h3>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500 line-clamp-3">
              {c.desc}
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              Jelajahi Mata Kuliah <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
