import Link from "next/link";

const CATEGORIES = [
  {
    name: "Sains & Teknologi",
    desc: "Kalkulus, FisKalkulus, Fisika Dasar, Kimia Organik, Pemrograman Dasar, Matematika Diskrit…ika Dasar, Kimia Organik, Pemrograman Dasar, Matematika Diskrit",
    count: "120+ Kelas",
  },
  {
    name: "Ekonomi & Bisnis",
    desc: "Pengantar Akuntansi, Ekonomi Mikro/Anatomi, Farmakologi, Biokimia, Keperawatan Dasar…, Manajemen Keuangan, Statistika...",
    count: "98+ Kelas",
  },
  {
    name: "Sosial & Hukum",
    desc: "Analisis data statistik, Python, Machine Learning dasar, danPengantar Akuntansi, Ekonomi Mikro/Makro, Manajemen Keuangan, Statistika… visualisasi tabel...",
    count: "85+ Kelas",
  },
  {
    name: "Kesehatan & Kedokteran",
    desc: "Anatomi, Farmakologi, Biokimia, Gambar Teknik, Estetika Bentuk, Studio Perancangan, Mekanika Bahan... Dasar...",
    count: "140+ Kelas",
  },
  {
    name: "Seni, Desain & Arsitektur",
    desc: "Gambar Teknik, Estetika Bentuk, Studio Analisis data statistik, Python, Machine Learning dasar, dan visualisasi Tableau., Mekaniik Bahan...",
    count: "64+ Kelas",
  },
  {
    name: "Pertanian & Peternakan",
    desc: "Agroteknologi, Agronomi, Ilmu Agroteknologi, Agribisnis, Ilmu Tanah, Genetika Tanaman/Ternak..., Genetika Tanaman/Ternak...",
    count: "210+ Tutor",
  },
];

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="text-xs font-semibold tracking-wider text-blue-600">
            ESPLORASI KURIKULUM
          </span>
          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Kategori Kelas Paling Diminati
          </h2>
        </div>
        <Link
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Lihat Semua Kategori →
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <div
            key={c.name}
            className="relative rounded-xl border border-slate-100 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <span className="absolute right-5 top-4 text-xs text-slate-400">
              {c.count}
            </span>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  viewBox="0 0 24 24"
                >
                  <path d={c.icon} />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {c.name}
              </h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              {c.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
