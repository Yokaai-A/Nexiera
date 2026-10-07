import { ClassCard } from "@/src/components/cari-kelas/ClassCard";
import { KELAS } from "@/src/lib/kelas-data";

const PAGES = [1, 2, 3, 4];

export function ClassList() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6">
        <span className="text-xs font-semibold tracking-wider text-blue-600">
          KURIKULUM TERVERIFIKASI
        </span>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Beberapa Kelas Pilihan Untuk Anda.
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {KELAS.map((item, i) => (
          <ClassCard key={i} item={item} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 sm:flex-row">
        <p className="text-sm text-slate-600">
          Menampilkan <span className="font-bold text-slate-900">1 - 6</span> dari{" "}
          <span className="font-bold text-slate-900">84</span> Hasil Kursus
        </p>

        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500">
            ‹
          </button>
          {PAGES.map((p) => (
            <button
              key={p}
              className={`h-8 w-8 rounded-md text-sm font-medium ${
                p === 1
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
          <span className="px-1 text-slate-400">…</span>
          <button className="h-8 w-8 rounded-md border border-slate-200 text-sm font-medium text-slate-600">
            14
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500">
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
