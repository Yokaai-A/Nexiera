const SELECTS = [
  { label: "Semua Kampus", icon: "🏛" },
  { label: "Semua Bidang Keahlian", icon: "📚" },
];

const DROPDOWNS = ["Baya: Semua Model", "Format: Semua Format", "Tipe: Bootcamp & Peer-Tutoring"];

export function FilterBar() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Cari Subjek: Web Programming, AI, Machine Learning, UI/UX..."
              className="w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-1 items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
              <span>{SELECTS[0].icon}</span>
              <span className="flex-1 text-sm text-slate-600">{SELECTS[0].label}</span>
              <span className="text-xs text-slate-400">˅</span>
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
              <span>{SELECTS[1].icon}</span>
              <span className="flex-1 text-sm text-slate-600">{SELECTS[1].label}</span>
              <span className="text-xs text-slate-400">˅</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {DROPDOWNS.map((d) => (
              <button
                key={d}
                type="button"
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                {d} ˅
              </button>
            ))}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
            >
              ↻ RESET FILTER
            </button>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
            <span className="inline-flex h-5 w-9 items-center rounded-full bg-blue-600 px-0.5">
              <span className="h-4 w-4 rounded-full bg-white" />
            </span>
            Sertifikasi Resmi Kampus
          </label>
        </div>
      </div>
    </section>
  );
}
