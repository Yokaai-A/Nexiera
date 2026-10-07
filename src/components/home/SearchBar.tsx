import Link from "next/link";

const FILTER_CHIPS = [
  { icon: "", label: "Mobile Legends" },
  { icon: "", label: "Valorant" },
  { icon: "", label: "Free Fire" },
  { icon: "", label: "Dota 2" },
  { icon: "", label: "Clash" },
];

const POPULAR = [
  "Algoritma & Pemrograman",
  "Data Structure",
  "Web Programming",
  "Artificial Intelligence",
];

export function SearchBar() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-lg bg-slate-50 px-4 py-3.5">
            <span className="text-lg text-slate-400"></span>
            <input
              type="text"
              placeholder="Cari kelas, bootcamp, tutoring, atau keahlian akademik..."
              className="w-full bg-transparent text-base text-slate-600 outline-none placeholder:text-slate-400"
            />
          </div>
          <Link
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-blue-700"
          >
            Temukan <span>→</span>
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTER_CHIPS.map((c) => (
            <button
              key={c.label}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <span className="text-blue-600">{c.icon}</span>
              {c.label}
              <span className="text-slate-400">˅</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400">
            POPULER:
          </span>
          {POPULAR.map((p) => (
            <button
              key={p}
              type="button"
              className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
