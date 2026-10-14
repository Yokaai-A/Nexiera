import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpenText, Building2, CalendarDays, Handshake, MonitorPlay, Rocket, UsersRound, UserRound, UserRoundCheck } from "lucide-react";
import { AcademicCourse } from "@/src/types/course";

export type ClassItem = AcademicCourse;

export function ClassCard({ item }: { item: AcademicCourse }) {
  const isBootcamp = item.type === "BOOTCAMP";
  const isFree = item.pricingModel === "FREE";

  const categoryName = item.mainCategory || item.subjectCategory || "Sains & Teknologi";
  const majorName = item.major || item.subjectCategory || "Computer Science";

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {isBootcamp ? (
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100 overflow-hidden">
                {item.organizerLogo ? (
                  <Image
                    src={item.organizerLogo}
                    alt={item.organizerName}
                    width={36}
                    height={36}
                    className="object-contain p-1"
                  />
                ) : (
                  <Building2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
                )}
              </div>
            ) : (
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 ring-2 ring-blue-100 overflow-hidden">
                {item.organizerLogo || (item.tutors.length > 0 && item.tutors[0].avatarUrl) ? (
                  <Image
                    src={item.organizerLogo || item.tutors[0].avatarUrl}
                    alt={item.organizerName}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  <UserRound className="h-4 w-4 text-slate-600" aria-hidden="true" />
                )}
              </div>
            )}

            <div className="min-w-0">
              <div className="truncate text-xs font-bold text-slate-800">
                {item.organizerName}
              </div>
              <div className="truncate text-[11px] text-slate-400">
                {item.university}
              </div>
            </div>
          </div>

          {isBootcamp ? (
            <span className="shrink-0 rounded-md bg-cyan-50 px-2 py-0.5 text-[11px] font-semibold text-cyan-700 ring-1 ring-cyan-200/60">
              <Rocket className="mr-1 inline h-3 w-3" aria-hidden="true" /> Bootcamp
            </span>
          ) : (
            <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
              <Handshake className="mr-1 inline h-3 w-3" aria-hidden="true" /> Peer-Tutoring
            </span>
          )}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {categoryName.toUpperCase()}
          </div>
          <div className="text-xs font-semibold text-blue-600">
            {majorName}
          </div>

          <h3 className="mt-1.5 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.shortDescription}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50/80 px-2.5 py-2">
          <UserRoundCheck className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
          <div className="min-w-0 flex-1 text-[11px] text-slate-600">
            {isBootcamp ? (
              <span>
                <strong className="text-slate-800">{item.tutors.length} Pengajar:</strong>{" "}
                {item.tutors.map((t) => t.name).join(", ")}
              </span>
            ) : (
              <span>
                <strong className="text-slate-800">Tutor:</strong>{" "}
                {item.tutors[0]?.name || item.organizerName}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate">{item.scheduleDate}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MonitorPlay className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate">{item.meetingPlatform}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <BookOpenText className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate font-medium text-slate-700">Catatan Belajar</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <UsersRound className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className={`truncate font-semibold ${item.availableSeats <= 5 ? "text-amber-600" : "text-slate-700"}`}>
              Sisa {item.availableSeats} Kuota
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3.5 mt-4">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Biaya Kelas</div>
          {isFree ? (
            <span className="text-sm font-extrabold text-emerald-600">GRATIS</span>
          ) : (
            <span className="text-sm font-extrabold text-slate-900">
              Rp {item.priceAmount?.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        <Link
          href={`/detail-kelas?id=${item.id}`}
          className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
        >
          Detail Kelas <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
