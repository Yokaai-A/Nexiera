import Link from "next/link";

export type ClassItem = {
  category: string;
  campus: string;
  badge: string;
  title: string;
  desc: string;
  date: string;
  mode: string;
  duration: string;
  tags: string[];
  rating: string;
  reviews: string;
};

export function ClassCard({ item }: { item: ClassItem }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
            ◎
          </span>
          <div className="leading-tight">
            <div className="font-semibold tracking-wide text-slate-500">
              {item.category}
            </div>
            <div>{item.campus}</div>
          </div>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600">
          ● {item.badge}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
      <p className="mt-1 text-xs text-slate-500">{item.desc}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500">
        <div>📅 {item.date}</div>
        <div>💻 {item.mode}</div>
        <div>⏱ {item.duration}</div>
        <div>🎓 {item.duration === "Tanpa Batas" ? "Tanpa Batas" : "Berbatas"} </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.map((t) => (
          <span
            key={t}
            className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
          >
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link
          href="#"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          Detail <span>→</span>
        </Link>
        <div className="text-xs font-semibold text-slate-700">
          ⭐ {item.rating} <span className="font-normal text-slate-400">({item.reviews})</span>
        </div>
      </div>
    </div>
  );
}
