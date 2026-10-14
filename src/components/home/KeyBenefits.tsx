import { BookOpenText, GraduationCap, Target } from "lucide-react";

const BENEFITS = [
  {
    title: "Catatan Notion Rapi",
    tagline: "Notion Study Hub Terpadu",
    desc: "Akses rangkuman rumus, mindmap silabus perkuliahan, bank soal UTS/UAS, dan panduan praktikum lab langsung di Notion kamu.",
    badge: "Notion Study Hub",
    icon: BookOpenText,
    color: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-100",
  },
  {
    title: "Tutor Sebaya Terpilih",
    tagline: "Mahasiswa Berprestasi & Aslab",
    desc: "Diajar langsung oleh mahasiswa peraih nilai A, mantan asisten laboratorium (Aslab), dan alumni yang memahami karakter soal dosen kampusmu.",
    badge: "Terverifikasi Kampus",
    icon: GraduationCap,
    color: "from-cyan-500/10 to-blue-500/10",
    border: "border-cyan-100",
  },
  {
    title: "Fokus Nilai UTS / UAS",
    tagline: "Target IPK Maksimal",
    desc: "Bimbingan terstruktur 100% selaras dengan silabus mata kuliah semester berjalan. Praktis, to-the-point, dan siap hadapi pekan ujian.",
    badge: "Kurikulum Matkul",
    icon: Target,
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-100",
  },
];

export function KeyBenefits() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <div className="grid gap-6 md:grid-cols-3">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className={`group relative overflow-hidden rounded-2xl border ${b.border} bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                <b.icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
                {b.badge}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {b.title}
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
              {b.tagline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {b.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
