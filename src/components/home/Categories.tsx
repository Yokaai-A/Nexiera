import Link from "next/link";
import { ArrowRight, Atom, BriefcaseBusiness, HeartPulse, Palette, Scale, Sprout } from "lucide-react";

const CATEGORIES = [
  {
    name: "Sains & Teknologi",
    desc: "Computer Science, Information Systems, Mobile App, Cyber Security, Kalkulus, Fisika Dasar...",
    icon: Atom,
  },
  {
    name: "Ekonomi & Bisnis",
    desc: "Akuntansi, Manajemen Keuangan, Ekonomi Mikro/Makro, Statistika Bisnis...",
    icon: BriefcaseBusiness,
  },
  {
    name: "Sosial & Hukum",
    desc: "Hukum Bisnis, Hukum Perdata, Komunikasi Massa, Hubungan Internasional...",
    icon: Scale,
  },
  {
    name: "Kesehatan & Kedokteran",
    desc: "Anatomi, Farmakologi Dasar, Fisiologi, Biokimia Klinis...",
    icon: HeartPulse,
  },
  {
    name: "Seni & Desain",
    desc: "Desain Komunikasi Visual, Tipografi, Gambar Teknik Arsitektur, Desain Interior...",
    icon: Palette,
  },
  {
    name: "Pertanian & Peternakan",
    desc: "Agroteknologi, Dasar Agronomi, Ilmu Tanah, Nutrisi Ternak...",
    icon: Sprout,
  },
];

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
            Eksplorasi Kurikulum Kampus
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
            Kategori Rumpun Keilmuan
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Pilih rumpun keilmuan yang ingin kamu tingkatkan pemahamannya semester ini.
          </p>
        </div>
        <Link
          href="/cari-kelas"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
        >
          Lihat Semua Katalog <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.name}
            href={`/cari-kelas?category=${encodeURIComponent(c.name)}`}
            className="group relative rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50/80 group-hover:bg-blue-100 transition-colors">
                <c.icon className="h-5 w-5 text-blue-600" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {c.name}
              </h3>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500 line-clamp-2">
              {c.desc}
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              Jelajahi Kelas <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
