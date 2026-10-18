import Link from "next/link";
import { ArrowRight, Atom, BriefcaseBusiness, HeartPulse, Palette, Scale, Sprout } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/src/components/ui/ScrollReveal";

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
    <section className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-12 border-t border-[#D9DEE7]">
      <Reveal y={16} threshold={0.15}>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#2457C5] uppercase">
              Eksplorasi Kurikulum Kampus
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-semibold text-[#20232B]">
              Kategori Rumpun Keilmuan
            </h2>
            <p className="mt-1.5 text-sm text-[#626B78]">
              Pilih rumpun keilmuan yang ingin kamu tingkatkan pemahamannya semester ini.
            </p>
          </div>
          <Link
            href="/cari-kelas"
            className="text-sm font-medium text-[#2457C5] hover:underline flex items-center gap-1.5 shrink-0"
          >
            Lihat Semua Katalog <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>

      <StaggerContainer
        staggerInterval={70}
        threshold={0.1}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {CATEGORIES.map((c, index) => (
          <StaggerItem key={c.name} index={index} y={20}>
            <Link
              href={`/cari-kelas?category=${encodeURIComponent(c.name)}`}
              className="nx-card p-5 block group h-full transition-all duration-300 hover:border-[#BAC3D2] hover:-translate-y-1"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-[#E5E9F0] text-[#20232B] group-hover:bg-[#2457C5] group-hover:text-white transition-colors duration-200">
                  <c.icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-[#20232B] group-hover:text-[#2457C5] transition-colors duration-200">
                  {c.name}
                </h3>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#626B78] line-clamp-2">
                {c.desc}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#2457C5]">
                Jelajahi Kelas <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
