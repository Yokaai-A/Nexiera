import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    name: "Sains & Teknologi",
    desc: "Kalkulus, Fisika Dasar, Kimia Organik, Pemrograman Dasar, Matematika Diskrit...",
    count: "120+ Kelas",
    icon: "/icons-HomePage/sains-teknologi.png",
  },
  {
    name: "Ekonomi & Bisnis",
    desc: "Pengantar Akuntansi, Ekonomi Mikro/Makro, Manajemen Keuangan, Statistika...",
    count: "98+ Kelas",
    icon: "/icons-HomePage/ekonomi-bisnis.png",
  },
  {
    name: "Sosial & Hukum",
    desc: "Analisis data statistik, Python, Machine Learning dasar, dan visualisasi tabel...",
    count: "85+ Kelas",
    icon: "/icons-HomePage/sosial-hukum.png",
  },
  {
    name: "Kesehatan & Kedokteran",
    desc: "Anatomi, Farmakologi, Biokimia, Keperawatan Dasar...",
    count: "140+ Kelas",
    icon: "/icons-HomePage/Doctor.png",
  },
  {
    name: "Seni, Desain & Arsitektur",
    desc: "Gambar Teknik, Estetika Bentuk, Studio Perancangan, Mekanika Bahan...",
    count: "64+ Kelas",
    icon: "/icons-HomePage/seni.png",
  },
  {
    name: "Pertanian & Peternakan",
    desc: "Agroteknologi, Agronomi, Ilmu Tanah, Genetika Tanaman/Ternak...",
    count: "210+ Tutor",
    icon: "/icons-HomePage/farm.png",
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
          href="/cari-kelas"
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
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <Image
                  src={c.icon}
                  alt={c.name}
                  width={28}
                  height={28}
                  className="object-contain"
                />
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
