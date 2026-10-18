import { BookOpenText, Target, UsersRound } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/src/components/ui/ScrollReveal";

const BENEFITS = [
  {
    number: "01",
    title: "100% Khusus Matkul Kampus",
    desc: "Fokus penuh pada mata kuliah kurikulum akademik kampus agar mahasiswa menemukan bimbingan yang presisi dengan silabus perkuliahan mereka.",
    icon: BookOpenText,
  },
  {
    number: "02",
    title: "Persiapan Ujian & Pemahaman Akademik",
    desc: "Pendalaman konsep fundamental, pembedahan silabus perkuliahan, dan latihan soal terarah untuk persiapan UTS & UAS guna membantu peningkatan IPK dan rasa percaya diri akademis mahasiswa.",
    icon: Target,
  },
  {
    number: "03",
    title: "Tutor Sebaya yang Relevan",
    desc: "Bimbingan oleh mahasiswa tingkat atas berprestasi dan mitra pengajar yang memahami tantangan serta ritme perkuliahan dari pengalaman langsung.",
    icon: UsersRound,
  },
];

export function KeyBenefits() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-12">
      <StaggerContainer
        staggerInterval={100}
        threshold={0.15}
        className="grid gap-6 md:grid-cols-3"
      >
        {BENEFITS.map((b, index) => (
          <StaggerItem key={b.title} index={index} y={24}>
            <div className="nx-card p-6 h-full flex flex-col justify-between transition-all duration-300 hover:border-[#BAC3D2] hover:-translate-y-1">
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
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
