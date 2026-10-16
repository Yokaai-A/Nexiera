import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TutorCta() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-14 border-t border-[#D9DEE7]">
      <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-8 md:p-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#2457C5] uppercase">
              Program Pengajar &amp; Tutor Sebaya
            </span>
            <h2 className="mt-3 max-w-xl text-2xl sm:text-3xl font-semibold text-[#20232B] leading-snug">
              Punya Keahlian yang Ingin Dibagikan? Buka Kelas Bimbinganmu Sendiri.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#626B78]">
              Mulai buka sesi peer-tutoring mata kuliah, bedah soal ujian, atau bootcamp bersama teman-teman kampus. Bantu sesama mahasiswa menguasai materi sulit sekaligus bangun portofolio akademikmu.
            </p>
          </div>

          <div className="shrink-0 text-left md:text-right">
            <Link
              href="/buat-kelas"
              className="btn-primary"
            >
              Buat kelas <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="mt-2.5 text-xs text-[#626B78]">
              Registrasi tutor terbuka untuk seluruh mahasiswa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
