import { BookOpenText, Building2, ChevronDown, RotateCcw, Search } from "lucide-react";

const SELECTS = [
  { label: "Semua Kampus", icon: Building2 },
  { label: "Semua Bidang Keahlian", icon: BookOpenText },
];

const DROPDOWNS = ["Baya: Semua Model", "Format: Semua Format", "Tipe: Bootcamp & Peer-Tutoring"];

export function FilterBar() {
  const CampusIcon = SELECTS[0].icon;
  const SubjectIcon = SELECTS[1].icon;

  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 md:px-8">
      <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
            <input
              type="text"
              placeholder="Cari Subjek: Web Programming, AI, Machine Learning, UI/UX..."
              className="w-full bg-transparent text-sm text-[#20232B] outline-none placeholder:text-[#626B78]"
            />
          </div>
          <div className="flex flex-1 items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-sm">
              <CampusIcon className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
              <span className="flex-1 text-sm text-[#20232B]">{SELECTS[0].label}</span>
              <ChevronDown className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-sm">
              <SubjectIcon className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
              <span className="flex-1 text-sm text-[#20232B]">{SELECTS[1].label}</span>
              <ChevronDown className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 border-t border-[#D9DEE7] pt-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {DROPDOWNS.map((d) => (
              <button
                key={d}
                type="button"
                className="rounded-[4px] border border-[#D9DEE7] px-3 py-1.5 text-xs font-medium text-[#20232B] hover:border-[#2457C5]"
              >
                {d} <ChevronDown className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 text-xs font-semibold text-[#2457C5] hover:bg-[#E5E9F0]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> RESET FILTER
            </button>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#20232B]">
            <span className="inline-flex h-4 w-8 items-center rounded-[2px] bg-[#2457C5] px-0.5">
              <span className="h-3 w-3 rounded-[2px] bg-white" />
            </span>
            Sertifikasi Resmi Kampus
          </label>
        </div>
      </div>
    </section>
  );
}
