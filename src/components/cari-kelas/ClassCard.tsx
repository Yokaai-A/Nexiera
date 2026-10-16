import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpenText, Building2, CalendarDays, Handshake, MonitorPlay, Rocket, UsersRound, UserRound, UserRoundCheck } from "lucide-react";
import { AcademicCourse } from "@/src/types/course";
import { slugify } from "@/src/lib/slug";

export type ClassItem = AcademicCourse;

export function ClassCard({ item }: { item: AcademicCourse }) {
  const isBootcamp = item.type === "BOOTCAMP";
  const isFree = item.pricingModel === "FREE";

  const categoryName = item.mainCategory || item.subjectCategory || "Sains & Teknologi";
  const majorName = item.major || item.subjectCategory || "Computer Science";

  const profileHref = isBootcamp
    ? `/organizers/${slugify(item.organizerName)}`
    : `/tutors/${slugify(item.tutors[0]?.name || item.organizerName)}`;

  return (
    <div className="group flex h-full flex-col rounded-[6px] border border-[#D9DEE7] bg-white p-5 hover:border-[#BAC3D2] transition-colors">
      <div>
        <div className="flex items-start justify-between gap-3">
          <Link href={profileHref} className="flex items-center gap-2.5 group/org">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0] overflow-hidden">
              {item.organizerLogo || (item.tutors.length > 0 && item.tutors[0].avatarUrl) ? (
                <Image
                  src={item.organizerLogo || item.tutors[0].avatarUrl}
                  alt={item.organizerName}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              ) : isBootcamp ? (
                <Building2 className="h-4 w-4 text-[#20232B]" aria-hidden="true" />
              ) : (
                <UserRound className="h-4 w-4 text-[#20232B]" aria-hidden="true" />
              )}
            </div>

            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-[#20232B] group-hover/org:text-[#2457C5] transition-colors">
                {item.organizerName}
              </div>
              <div className="truncate text-[11px] text-[#626B78]">
                {item.university}
              </div>
            </div>
          </Link>

          {isBootcamp ? (
            <span className="shrink-0 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-[11px] font-medium text-[#20232B]">
              <Rocket className="mr-1 inline h-3 w-3 text-[#2457C5]" aria-hidden="true" /> Bootcamp
            </span>
          ) : (
            <span className="shrink-0 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-[11px] font-medium text-[#20232B]">
              <Handshake className="mr-1 inline h-3 w-3 text-[#2457C5]" aria-hidden="true" /> Peer-Tutoring
            </span>
          )}
        </div>

        <div className="mt-3.5 border-t border-[#D9DEE7] pt-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78]">
            {categoryName.toUpperCase()}
          </div>
          <div className="text-xs font-medium text-[#2457C5]">
            {majorName}
          </div>

          <h3 className="mt-1 text-base font-semibold text-[#20232B] group-hover:text-[#2457C5] transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="mt-1 text-xs text-[#626B78] line-clamp-2 leading-relaxed">
            {item.shortDescription}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 px-2.5 py-1.5">
          <UserRoundCheck className="h-3.5 w-3.5 shrink-0 text-[#626B78]" aria-hidden="true" />
          <div className="min-w-0 flex-1 text-[11px] text-[#626B78]">
            {isBootcamp ? (
              <span>
                <strong className="text-[#20232B] font-medium">{item.tutors.length} Pengajar:</strong>{" "}
                {item.tutors.map((t, idx) => (
                  <span key={t.id || t.name}>
                    <Link
                      href={`/tutors/${slugify(t.name)}`}
                      className="hover:text-[#2457C5] hover:underline"
                    >
                      {t.name}
                    </Link>
                    {idx < item.tutors.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
            ) : (
              <span>
                <strong className="text-[#20232B] font-medium">Tutor:</strong>{" "}
                <Link
                  href={`/tutors/${slugify(item.tutors[0]?.name || item.organizerName)}`}
                  className="hover:text-[#2457C5] hover:underline"
                >
                  {item.tutors[0]?.name || item.organizerName}
                </Link>
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/20 p-2.5 text-[11px] text-[#626B78]">
          <div className="flex items-center gap-1.5 truncate">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#626B78]" aria-hidden="true" />
            <span className="truncate">{item.scheduleDate}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MonitorPlay className="h-3.5 w-3.5 shrink-0 text-[#626B78]" aria-hidden="true" />
            <span className="truncate">{item.meetingPlatform}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <BookOpenText className="h-3.5 w-3.5 shrink-0 text-[#626B78]" aria-hidden="true" />
            <span className="truncate font-medium text-[#20232B]">Catatan Belajar</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <UsersRound className="h-3.5 w-3.5 shrink-0 text-[#626B78]" aria-hidden="true" />
            <span className={`truncate font-medium ${item.availableSeats <= 5 ? "text-amber-700" : "text-[#20232B]"}`}>
              Sisa {item.availableSeats} Kuota
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#D9DEE7] pt-3.5 mt-4">
        <div>
          <div className="text-[10px] uppercase font-semibold text-[#626B78]">Biaya Kelas</div>
          {isFree ? (
            <span className="text-sm font-semibold text-emerald-700">GRATIS</span>
          ) : (
            <span className="text-sm font-semibold text-[#20232B]">
              Rp {item.priceAmount?.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        <Link
          href={`/detail-kelas?id=${item.id}`}
          className="inline-flex items-center gap-1 rounded-[4px] bg-[#2457C5] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1C48A5] transition-colors"
        >
          Detail Kelas <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
