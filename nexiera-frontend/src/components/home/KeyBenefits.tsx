import { BookOpenText, GraduationCap, Target } from "lucide-react";

const BENEFITS = [
  {
    number: "01",
    title: "Pemahaman Silabus Terarah",
    desc: "Bimbingan terstruktur yang dirancang khusus mengikuti alur silabus mata kuliah semester berjalan di kampusmu, membantu menguasai konsep sulit dengan lebih cepat.",
    icon: BookOpenText,
  },
  {
    number: "02",
    title: "Tutor Sebaya Terpilih",
    desc: "Belajar langsung dengan sesama mahasiswa tingkat atas yang sudah lulus mata kuliah terkait dengan nilai memuaskan dan paham karakter perkuliahan di kampusmu.",
    icon: GraduationCap,
  },
  {
    number: "03",
    title: "Kesiapan UTS & UAS",
    desc: "Latihan pembahasan soal dan pembedahan materi krusial secara intensif untuk memaksimalkan kesiapan menghadapi pekan ujian dan meningkatkan pencapaian IPK.",
    icon: Target,
  },
];

export function KeyBenefits() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid gap-6 md:grid-cols-3">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="nx-card p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-3 mb-4">
                <span className="text-2xl font-bold leading-none text-[#2457C5]">
                  {b.number}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#E5E9F0] text-[#20232B]">
                  <b.icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-[#20232B]">
                {b.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#626B78]">
                {b.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
