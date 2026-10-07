import Link from "next/link";
import Image from "next/image";

const STATS = [
  { value: "15.000+", label: "Mahasiswa Aktif" },
  { value: "450+", label: "Tutor Terverifikasi" },
  { value: "4.9 ★", label: "Rata-rata Kepuasan" },
];

export function Hero() {
  return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
            Tingkatkan Prestasi Kuliah Bersama{" "}
            <span className="text-blue-600">Tutor Sebaya</span>{" "}
            Terverifikasi
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-500">
            Temukan bootcamp, tutoring, mentoring, dan berbagai kelas yang sesuai
            dengan kebutuhan belajar, target IPK, dan peningkatan nilai akademik
            kamu bersama tutor sebaya terverifikasi.
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Cari Kelas
              {/* <SearchIcon className="h-4 w-4" /> INI NANTI DIGANTI ICON PNG KALO UDH ADA  */}
            </Link>
            <Link
              href="/tentang-kami"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {/* <StarIcon className="h-4 w-4 text-blue-600" /> */}
              Buat Kelas
            </Link>
          </div>

          <div className="mt-10 flex gap-8 rounded-2xl bg-white p-7 shadow-sm">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-5xl font-bold text-slate-800">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="inline-block w-fit overflow-hidden rounded-[10rem] bg-gradient-to-br from-blue-100 to-blue-300">
            <Image
              src="/landing-main.png"
              alt="Tutor NEXIERA menemukan kelas terbaik"
              width={600}
              height={600}
              loading="eager"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" d="m21 21-4.3-4.3" />
    </svg>
  );
}

function StarIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12 2 15 8l6 .5-4.5 4 1.5 6-6-3.5L6.5 18.5 8 12.5 3.5 8.5 9.5 8z" />
    </svg>
  );
}
