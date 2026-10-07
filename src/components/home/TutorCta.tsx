import Link from "next/link";

export function TutorCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="overflow-hidden rounded-3xl bg-blue-600 px-8 py-10 text-white md:px-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
              PROGRAM NEXIERA KAMPUS MENTOR
            </span>
            <h2 className="mt-5 max-w-xl text-3xl font-bold leading-snug">
              Punya Keahlian yang Ingin Dibagikan?{" "}
              <br />
              Siap Jadi Tutor Kampus?
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-100">
              Mulai buka sesi mentoring 1-on-1, workshop studi pod, atau tutoring
              privat ujian. Bantu teman-teman mahasiswa sekaligus raih penghasilan
              mandiri tiap pekan.
            </p>
          </div>

          <div className="shrink-0 text-left md:text-right">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              Daftar Sebagai Tutor →
            </Link>
            <div className="mt-3 text-xs text-blue-100">
              ✓ Gratis registrasi &amp; tanpa biaya langganan
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
