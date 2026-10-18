import Link from "next/link";
import Image from "next/image";
import { Search, SquarePen } from "lucide-react";
import { Reveal } from "@/src/components/ui/ScrollReveal";

export function Hero() {
  return (
    <section className="bg-white pt-12 pb-16 border-b border-[#D9DEE7] overflow-hidden">
      <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-4 sm:px-6 lg:px-8 lg:grid-cols-2">
        <div className="min-w-0">
          <Reveal immediate delay={50} y={12}>
            <p className="text-xs font-semibold tracking-wider text-[#2457C5] uppercase">
              Bimbingan Akademik &amp; Persiapan Ujian Kampus
            </p>
          </Reveal>

          <Reveal immediate delay={150} y={20}>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-[52px] font-bold leading-[1.15] tracking-tight text-[#20232B]">
              Tingkatkan Pemahaman Kuliah Bersama Tutor Sebaya
            </h1>
          </Reveal>

          <Reveal immediate delay={250} y={18}>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#626B78]">
              Temukan bimbingan mata kuliah, peer-tutoring intensif, dan materi terstruktur
              bersama tutor sebaya dari kampusmu untuk menghadapi pekan ujian UTS dan UAS.
            </p>
          </Reveal>

          <Reveal immediate delay={350} y={16}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cari-kelas"
                className="btn-primary"
              >
                <Search className="h-4 w-4" aria-hidden="true" /> Cari kelas
              </Link>
              <Link
                href="/buat-kelas"
                className="btn-secondary"
              >
                <SquarePen className="h-4 w-4" aria-hidden="true" /> Buat kelas
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="flex min-w-0 items-center justify-center lg:justify-end">
          <Reveal immediate delay={200} x={24} y={0} className="w-full max-w-md">
            <div className="flex w-full items-center justify-center overflow-hidden rounded-[6px] border border-[#D9DEE7] bg-white p-6 shadow-sm">
              <Image
                src="/Landing-page-2.jpg"
                alt="Mahasiswa menemukan kelas terbaik di Nexiera"
                width={400}
                height={400}
                priority
                className="max-h-[380px] w-auto rounded-[35%] object-contain transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
