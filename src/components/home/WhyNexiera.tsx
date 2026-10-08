import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  {
    title: "Temukan Kelas",
    desc: "Cari pembelajaran sesuai kebutuhan spesifik, bidang keahlian kampus, jadwal fleksibel tanpa kantong mahasiswa.",
    cta: "Filter Kebutuhan Studi →",
    icon: "/icons-HomePage/kelas.png",
  },
  {
    title: "Belajar dari Tutor",
    desc: "Temukan tutor sebaya prestatif, asisten laboratorium, alumni berpengalaman, dan pencyelengga kredibel yang terverifikasi identitas kampusnya.",
    cta: "Verifikasi ID Kampus →",
    icon: "/icons-HomePage/BelajarDariTutor.png",
  },
  {
    title: "Bagikan Keahlian",
    desc: "Buka kelas sendiri, bangun reputasi akademik, perkuat portofolio kepemimpinan, dan dapatkan penghasilan tambahan semester ini bersama teman sebaya.",
    cta: "Mulai Jadi Tutor →",
    icon: "/icons-HomePage/ahli.png",
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
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Image
                  src={f.icon}
                  alt={f.title}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {f.desc}
              </p>
              <Link
                href={
                  f.title === "Temukan Kelas"
                    ? "/cari-kelas"
                    : f.title === "Belajar dari Tutor"
                      ? "/cari-kelas"
                      : "/register"
                }
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
