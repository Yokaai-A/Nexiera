import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpenText, Building2, CalendarDays, Handshake, MonitorPlay, Rocket, Star, UsersRound, UserRound, UserRoundCheck } from "lucide-react";
import { AcademicCourse } from "@/src/types/course";

export type ClassItem = AcademicCourse;

export function ClassCard({ item }: { item: AcademicCourse }) {
  const isBootcamp = item.type === "BOOTCAMP";
  const isFree = item.pricingModel === "FREE";

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
      <div>
        {/* Header: Organizer & Type Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {isBootcamp ? (
              // Bootcamp Organizer Logo / Partner
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100 overflow-hidden">
                {item.organizerLogo ? (
                  <Image
                    src={item.organizerLogo}
                    alt={item.organizerName}
                    width={40}
                    height={40}
                    className="object-contain p-1"
                  />
                ) : (
                  <Building2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
                )}
              </div>
            ) : (
              // Peer-Tutoring Tutor Avatar
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 ring-2 ring-blue-100 overflow-hidden">
                {item.organizerLogo || (item.tutors.length > 0 && item.tutors[0].avatarUrl) ? (
                  <Image
                    src={item.organizerLogo || item.tutors[0].avatarUrl}
                    alt={item.organizerName}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <UserRound className="h-4 w-4 text-slate-600" aria-hidden="true" />
                )}
              </div>
            )}

            <div className="min-w-0">
              <div className="truncate text-xs font-bold uppercase tracking-wider text-slate-800">
                {item.organizerName}
              </div>
              <div className="truncate text-[11px] text-slate-400">
                {item.university}
              </div>
            </div>
          </div>

          {/* Badge: Blueprint Section 4 */}
          {isBootcamp ? (
            <span className="shrink-0 rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-700 ring-1 ring-cyan-200/60">
              <Rocket className="mr-1 inline h-3 w-3" aria-hidden="true" /> Bootcamp
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200">
              <Handshake className="mr-1 inline h-3 w-3" aria-hidden="true" /> Peer-Tutoring
            </span>
          )}
        </div>

        {/* Course Title & Subject */}
        <div className="mt-4">
          <div className="text-[11px] font-semibold uppercase text-blue-600 tracking-wide">
            {item.subjectCategory}
          </div>
          <h3 className="mt-1 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">
            {item.shortDescription}
          </p>
        </div>

        {/* Tutors Info (Multi-tutor for Bootcamp) */}
        <div className="mt-3.5 flex items-center gap-2 rounded-lg bg-slate-50/80 px-2.5 py-2">
          <UserRoundCheck className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <div className="min-w-0 flex-1 text-[11px] text-slate-600">
            {isBootcamp ? (
              <span>
                <strong className="text-slate-800">{item.tutors.length} Pengajar:</strong>{" "}
                {item.tutors.map((t) => t.name).join(", ")}
              </span>
            ) : (
              <span>
                <strong className="text-slate-800">Tutor:</strong>{" "}
                {item.tutors[0]?.name || item.organizerName} ({item.tutors[0]?.role || "Mahasiswa"})
              </span>
            )}
          </div>
        </div>

        {/* Metadata Grid */}
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
            <span className="truncate font-medium text-slate-700">Notion Hub</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <UsersRound className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className={`truncate font-semibold ${item.availableSeats <= 5 ? "text-amber-600" : "text-slate-700"}`}>
              Sisa {item.availableSeats} Kuota
            </span>
          </div>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Pricing & Action Button */}
      <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-3.5">
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] leading-none">
            <span className="inline-flex items-center gap-1 font-bold text-slate-800">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
              {item.rating || 4.9}
            </span>
            <span className="text-slate-400">({item.reviewCount || 100})</span>
          </div>
          <Link
            href={`/detail-kelas?id=${item.id}`}
            className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Detail <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
