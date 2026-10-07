import Link from "next/link";

const FEATURES = [
  {
    title: "Temukan Kelas",
    desc: "Cari pembelajaran sesuai kebutuhan spesifik, bidang keahlian kampus, jadwal fleksibel tanpa kantong mahasiswa.",
    cta: "Filter Kebutuhan Studi →",
    // icon: "M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9zM9 12l2 2 4-4",
  },
  {
    title: "Belajar dari Tutor",
    desc: "Temukan tutor sebaya prestatif, asisten laboratorium, alumni berpengalaman, dan pencyelengga kredibel yang terverifikasi identitas kampusnya.",
    cta: "Verifikasi ID Kampus →",
    // icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  {
    title: "Bagikan Keahlian",
    desc: "Buka kelas sendiri, bangun reputasi akademik, perkuat portofolio kepemimpinan, dan dapatkan penghasilan tambahan semester ini bersama teman sebaya.",
    cta: "Mulai Jadi Tutor →",
    // icon: "M12 2v20M2 12h20M5 5l14 14M19 5 5 19",
  },
];

export function WhyNexiera() {
  return (
    <section className="bg-background py-14">
      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* <span className="text-xs font-semibold tracking-wider text-blue-600">
          KEUNGGULAN EKOSISTEM
        </span> */}
        <h2 className="mt-2 text-5xl font-bold text-slate-900">
          Mengapa Memilih NEXIERA?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-slate-500">
          Solusi pembelajaran terpadu yang dirancang khusus untuk mahasiswa dan civitas
          akademika Indonesia.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-100"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                  <path d={f.icon} />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {f.desc}
              </p>
              <Link
                href="#"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                {f.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
