import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

export function TutorCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-8 py-12 text-white shadow-xl shadow-blue-500/10 md:px-12">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm">
              Program NEXIERA Kampus Mentor
            </span>
            <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-snug sm:text-4xl">
              Punya Keahlian yang Ingin Dibagikan?{" "}
              <br />
              Siap Jadi Tutor Kampus?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-100">
              Mulai buka sesi peer-tutoring matkul, bedah soal ujian, atau bootcamp intensif.
              Bantu teman-teman mahasiswa menguasai materi sulit sekaligus raih reputasi dan
              penghasilan tambahan mandiri setiap pekan.
            </p>
          </div>

          <div className="shrink-0 text-left md:text-right">
            <Link
              href="/buat-kelas"
              className="inline-block rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow-md hover:bg-blue-50 transition-all hover:scale-105"
            >
              Publikasikan Kelas Sekarang <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" />
            </Link>
            <div className="mt-3 text-xs text-blue-100/90 font-medium">
              <BadgeCheck className="mr-1 inline h-4 w-4" aria-hidden="true" /> Gratis registrasi tutor &amp; langsung tayang di katalog
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
