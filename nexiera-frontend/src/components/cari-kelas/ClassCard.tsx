import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Handshake,
  MonitorPlay,
  Rocket,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { ApiClass } from "@/src/lib/api";
import { slugify } from "@/src/lib/slug";

import type { AcademicCourse } from "@/src/types/course";

export type ClassItem = ApiClass | AcademicCourse;

export function normalizeCourseToApiClass(item: ApiClass | AcademicCourse): ApiClass {
  if ("courseType" in item && typeof (item as ApiClass).price === "string") {
    return item as ApiClass;
  }
  const ac = item as AcademicCourse;
  const tutor = ac.tutors?.[0];
  return {
    id: ac.id,
    slug: ac.slug,
    title: ac.title,
    bannerUrl: ac.bannerUrl || null,
    shortDescription: ac.shortDescription || null,
    description: ac.fullDescription || ac.shortDescription || "",
    mainCategory: ac.mainCategory || null,
    major: ac.major || null,
    university: ac.university || null,
    courseType: ac.type || "PEER_TUTORING",
    organizerName: ac.organizerName || null,
    organizerLogo: ac.organizerLogo || null,
    price: String(ac.priceAmount || 0),
    currency: "IDR",
    startsAt: ac.scheduleDate || null,
    accessDuration: ac.accessDuration || null,
    maxQuota: ac.maxQuota || null,
    availableSeats: ac.availableSeats ?? ac.maxQuota ?? null,
    requirements: ac.requirements || null,
    facilities: ac.facilities || null,
    meetingPlatform: ac.meetingPlatform || null,
    meetingUrl: ac.meetingUrl || null,
    materialPlatform: ac.materialPlatform || null,
    materialUrl: ac.materialUrl || null,
    recordingUrl: ac.recordingUrl || null,
    tutor: tutor ? { id: tutor.id, name: tutor.name } : undefined,
  };
}

function formatStartDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function ClassCard({ item }: { item: ApiClass | AcademicCourse }) {
  const normalized = normalizeCourseToApiClass(item);
  const isBootcamp = normalized.courseType === "BOOTCAMP";
  const isFree = Number(normalized.price) === 0;
  const tutorName = (isBootcamp ? normalized.tutors?.[0]?.name : undefined)
    ?? normalized.tutor?.name
    ?? normalized.organizerName
    ?? "Tutor";
  const organizerName = normalized.organizerName?.trim() || tutorName;
  const organizerInitials = organizerName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "NX";
  const profileHref = isBootcamp
    ? `/organizers/${slugify(organizerName)}`
    : `/tutors/${slugify(tutorName)}`;
  const startDate = formatStartDate(normalized.startsAt ?? null);
  const availableSeats = normalized.availableSeats ?? normalized.maxQuota;
  const currency = /^[A-Z]{3}$/.test(normalized.currency) ? normalized.currency : "IDR";
  const price = Number(normalized.price);
  const formattedPrice = Number.isFinite(price)
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency, maximumFractionDigits: 0 }).format(price)
    : null;

  const rawApi = item as ApiClass;
  const avatarUrl = isBootcamp
    ? rawApi.organizerLogo || normalized.organizerLogo || rawApi.creator?.avatarUrl || null
    : rawApi.creator?.avatarUrl || rawApi.tutor?.avatarUrl || rawApi.tutors?.[0]?.avatarUrl || null;

  const resolvedAvatar = avatarUrl
    ? avatarUrl.startsWith("/uploads")
      ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${avatarUrl}`
      : avatarUrl
    : null;

  const bannerUrl = normalized.bannerUrl
    ? normalized.bannerUrl.startsWith("/uploads")
      ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${normalized.bannerUrl}`
      : normalized.bannerUrl
    : null;

  return (
    <article className="group flex h-full flex-col rounded-[6px] border border-[#D9DEE7] bg-white p-4 sm:p-5 transition-colors hover:border-[#BAC3D2] dark:border-slate-800 dark:bg-slate-900">
      <div>
        {bannerUrl && (
          <div className="relative mb-3.5 aspect-video w-full overflow-hidden rounded-[4px] border border-[#D9DEE7] bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
            <img
              src={bannerUrl}
              alt={normalized.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <Link href={profileHref} className="group/org flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D9DEE7] bg-[#E5E9F0] dark:border-slate-700 dark:bg-slate-800">
              {resolvedAvatar ? (
                <img
                  src={resolvedAvatar}
                  alt={organizerName}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-bold text-[#2457C5] dark:text-[#78A0FF]" aria-hidden="true">
                  {organizerInitials}
                </span>
              )}
            </div>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[#20232B] transition-colors group-hover/org:text-[#2457C5] dark:text-slate-100">
                {organizerName}
              </span>
              {(normalized.tutor?.headline || normalized.tutor?.major || normalized.tutor?.campus || normalized.university) && (
                <span className="block truncate text-[11px] text-[#626B78] dark:text-slate-400">
                  {[normalized.tutor?.headline, normalized.tutor?.major, normalized.tutor?.campus || normalized.university].filter(Boolean).join(" · ")}
                </span>
              )}
            </span>
          </Link>

          <span className="shrink-0 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-[11px] font-medium text-[#20232B] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {isBootcamp ? <Rocket className="mr-1 inline h-3 w-3 text-[#2457C5]" aria-hidden="true" /> : <Handshake className="mr-1 inline h-3 w-3 text-[#2457C5]" aria-hidden="true" />}
            {isBootcamp ? "Bootcamp" : "Peer-Tutoring"}
          </span>
        </div>

        <div className="mt-3.5 border-t border-[#D9DEE7] pt-3 dark:border-slate-800">
          {normalized.mainCategory && <div className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-slate-400">{normalized.mainCategory}</div>}
          {normalized.major && <div className="text-xs font-medium text-[#2457C5]">{normalized.major}</div>}
          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-[#20232B] transition-colors group-hover:text-[#2457C5] dark:text-slate-100">
            {normalized.title}
          </h3>
          {(normalized.shortDescription || normalized.description) && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#626B78] dark:text-slate-300">
              {normalized.shortDescription || normalized.description}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 px-2.5 py-2 text-[11px] text-[#626B78] dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
          <UserRound className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 truncate">
            {isBootcamp ? "Pengajar:" : "Tutor:"} <Link href={`/tutors/${slugify(tutorName)}`} className="font-medium text-[#20232B] hover:text-[#2457C5] hover:underline dark:text-slate-100">{tutorName}</Link>
          </span>
        </div>

        {(startDate || normalized.meetingPlatform || availableSeats !== null) && (
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/20 p-2.5 text-[11px] text-[#626B78] dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
            {startDate && <div className="flex min-w-0 items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="truncate">{startDate}</span></div>}
            {normalized.meetingPlatform && <div className="flex min-w-0 items-center gap-1.5"><MonitorPlay className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="truncate">{normalized.meetingPlatform}</span></div>}
            {availableSeats !== null && <div className="flex min-w-0 items-center gap-1.5"><UsersRound className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="truncate">Sisa {availableSeats} kuota</span></div>}
          </div>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#D9DEE7] pt-3.5 dark:border-slate-800">
        <div>
          <div className="text-[10px] font-semibold uppercase text-[#626B78] dark:text-slate-400">Biaya kelas</div>
          {isFree ? <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Gratis</span> : <span className="text-sm font-semibold text-[#20232B] dark:text-slate-100">{formattedPrice || "Harga belum tersedia"}</span>}
        </div>
        <Link href={`/detail-kelas?id=${encodeURIComponent(normalized.id)}`} className="inline-flex items-center gap-1 rounded-[4px] bg-[#2563EB] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700">
          Detail kelas <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
