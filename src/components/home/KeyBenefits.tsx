import { BookOpenText, GraduationCap, Target } from "lucide-react";

const BENEFITS = [
  {
    title: "Pemahaman Silabus Terarah",
    desc: "Bimbingan terstruktur yang dirancang khusus mengikuti alur silabus mata kuliah semester berjalan di kampusmu, membantu menguasai konsep sulit dengan lebih cepat.",
    icon: BookOpenText,
    border: "border-blue-100",
  },
  {
    title: "Tutor Sebaya Terpilih",
    desc: "Belajar langsung dengan sesama mahasiswa tingkat atas yang sudah lulus mata kuliah terkait dengan nilai memuaskan dan paham karakter perkuliahan di kampusmu.",
    icon: GraduationCap,
    border: "border-cyan-100",
  },
  {
    title: "Kesiapan UTS & UAS",
    desc: "Latihan pembahasan soal dan pembedahan materi krusial secara intensif untuk memaksimalkan kesiapan menghadapi pekan ujian dan meningkatkan pencapaian IPK.",
    icon: Target,
    border: "border-emerald-100",
  },
];

export function KeyBenefits() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className={`group relative overflow-hidden rounded-2xl border ${b.border} bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform group-hover:scale-105">
              <b.icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {b.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {b.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
