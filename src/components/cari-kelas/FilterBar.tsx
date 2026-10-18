import { BookOpen, Building2, ChevronDown, GraduationCap, Layers, RotateCcw, Search } from "lucide-react";

export function FilterBar() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 md:px-8">
      <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
            <input
              type="text"
              placeholder="Cari Mata Kuliah: Algorithm, Software Engineering, Database, Kalkulus..."
              className="w-full bg-transparent text-sm text-[#20232B] outline-none placeholder:text-[#626B78]"
            />
          </div>

          {/* 4-Level Responsive Filter Dropdown Hierarchy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Level 1: Kampus */}
            <div className="relative">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] mb-1 block">
                1. Kampus
              </label>
              <div className="flex items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs">
                <Building2 className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
                <span className="flex-1 text-xs text-[#20232B]">Semua Kampus</span>
                <ChevronDown className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
              </div>
            </div>

            {/* Level 2: Kategori Utama */}
            <div className="relative">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] mb-1 block">
                2. Kategori Utama
              </label>
              <div className="flex items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs">
                <Layers className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
                <span className="flex-1 text-xs text-[#20232B]">Semua Kategori Utama</span>
                <ChevronDown className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
              </div>
            </div>

            {/* Level 3: Jurusan */}
            <div className="relative">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] mb-1 block">
                3. Jurusan
              </label>
              <div className="flex items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs">
                <GraduationCap className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
                <span className="flex-1 text-xs text-[#20232B]">Semua Jurusan</span>
                <ChevronDown className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
              </div>
            </div>

            {/* Level 4: Mata Kuliah */}
            <div className="relative">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] mb-1 block">
                4. Mata Kuliah
              </label>
              <div className="flex items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs">
                <BookOpen className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
                <span className="flex-1 text-xs text-[#20232B]">Semua Mata Kuliah</span>
                <ChevronDown className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 border-t border-[#D9DEE7] pt-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-[4px] border border-[#D9DEE7] px-3 py-1.5 text-xs font-medium text-[#20232B] hover:border-[#2457C5]"
            >
              Semua Tipe <ChevronDown className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="rounded-[4px] border border-[#D9DEE7] px-3 py-1.5 text-xs font-medium text-[#20232B] hover:border-[#2457C5]"
            >
              Semua Biaya <ChevronDown className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 text-xs font-semibold text-[#2457C5] hover:bg-[#E5E9F0]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> RESET FILTER
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
