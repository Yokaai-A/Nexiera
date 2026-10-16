import { ClassCard } from "@/src/components/cari-kelas/ClassCard";
import { KELAS } from "@/src/lib/kelas-data";

const PAGES = [1, 2, 3, 4];

export function ClassList() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <span className="text-xs font-semibold tracking-wider text-[#2457C5] uppercase">
          Katalog Pilihan
        </span>
        <h2 className="mt-1 text-2xl font-semibold text-[#20232B]">
          Daftar Kelas Bimbingan Kampus
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {KELAS.map((item, i) => (
          <ClassCard key={i} item={item} />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[6px] border border-[#D9DEE7] bg-white p-4 sm:flex-row">
        <p className="text-sm text-[#626B78]">
          Menampilkan <span className="font-semibold text-[#20232B]">1 - 6</span> dari{" "}
          <span className="font-semibold text-[#20232B]">84</span> Hasil Kelas
        </p>

        <div className="flex items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#D9DEE7] text-[#626B78] hover:bg-[#E5E9F0]">
            ‹
          </button>
          {PAGES.map((p) => (
            <button
              key={p}
              className={`h-8 w-8 rounded-[4px] text-xs font-medium ${
                p === 1
                  ? "bg-[#2457C5] text-white border border-[#2457C5]"
                  : "border border-[#D9DEE7] text-[#20232B] hover:bg-[#E5E9F0]"
              }`}
            >
              {p}
            </button>
          ))}
          <span className="px-1 text-[#626B78]">…</span>
          <button className="h-8 w-8 rounded-[4px] border border-[#D9DEE7] text-xs font-medium text-[#20232B] hover:bg-[#E5E9F0]">
            14
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#D9DEE7] text-[#626B78] hover:bg-[#E5E9F0]">
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
