"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  Handshake,
  Layers,
  LayoutDashboard,
  Mail,
  MessageCircle,
  MonitorPlay,
  Rocket,
  Search,
  UserRoundCheck,
  Video,
  ShieldAlert,
} from "lucide-react";
import { nexieraApi, type ApiClass } from "@/src/lib/api";
import { ReportModal } from "@/src/components/class/ReportModal";

function whatsappUrl(phone: string, name: string, title: string) {
  const digits = phone.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${international}?text=${encodeURIComponent(
    `Halo kak ${name}, saya peserta kelas ${title} di NEXIERA.`,
  )}`;
}

export function KelasSaya() {
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportClass, setReportClass] = useState<ApiClass | null>(null);
  const [reports, setReports] = useState<Array<{ id: string; targetId: string; classId: string | null; status: string; adminNote?: string | null }>>([]);

  useEffect(() => {
    let active = true;

    nexieraApi
      .myClasses()
      .then((data) => {
        if (!active) return;
        setClasses(Array.isArray(data) ? data : (data.enrolled ?? []));
      })
      .catch(() => {
        if (!active) return;
        setClasses([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => { nexieraApi.myReports().then(setReports).catch(() => setReports([])); }, []);

  return (
    <>
    <div className="space-y-4">

      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#2457C5] uppercase dark:text-[#78A0FF]">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Ruang Belajar Peserta
            </span>
            <h1 className="mt-1 text-lg font-bold text-[#20232B] dark:text-[#F3F4F6]">
              Kelas Saya
            </h1>
            <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
              Akses link tatap muka langsung, dokumen catatan materi, dan kontak pengajar kelas terverifikasi.
            </p>
          </div>

          <Link
            href="/cari-kelas"
            className="btn-secondary btn-dashboard-action self-start sm:self-auto"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" /> Tambah Kelas
          </Link>
        </div>
      </header>


      {loading ? (
        <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 text-center dark:border-[#343945] dark:bg-[#191C23]">
          <p className="text-sm text-[#626B78] dark:text-[#B1B7C3]">Memuat data kelas...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 text-center dark:border-[#343945] dark:bg-[#191C23]">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#E5E9F0] text-[#20232B] dark:bg-slate-800 dark:text-[#F3F4F6]">
            <BookOpenText className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            Belum Ada Kelas yang Diikuti
          </h3>
          <p className="mx-auto mt-1.5 max-w-md text-xs text-[#626B78] leading-relaxed dark:text-[#B1B7C3]">
            Kamu belum mendaftar kelas bimbingan atau bootcamp apapun. Jelajahi katalog kelas kuliah untuk menemukan tutor sebaya terbaik.
          </p>
          <div className="mt-4">
            <Link
              href="/cari-kelas"
              className="btn-primary btn-dashboard-action inline-flex items-center"
            >
              <Search className="h-4 w-4" aria-hidden="true" /> Jelajahi Katalog Kelas
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              Kelas Aktif &amp; Terdaftar ({classes.length})
            </h2>
          </div>

          <div className="grid gap-4">
            {classes.map((course) => {
              const isBootcamp = course.courseType === "BOOTCAMP" || course.type === "BOOTCAMP";
              const isCancelled = course.status === "CANCELLED";
              const isAccessExpired = Boolean(course.accessUntil && new Date(course.accessUntil) < new Date());
              const categoryName = course.mainCategory || "Sains & Teknologi";
              const majorName = course.major || "Teknik Informatika";
              const schedule = course.startsAt
                ? new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "short" }).format(
                    new Date(course.startsAt),
                  )
                : isBootcamp ? "Jadwal bootcamp belum ditentukan" : "Jadwal fleksibel";

              return (
                <div
                  key={course.id}
                  className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-xs font-semibold text-[#2457C5] uppercase tracking-wide dark:border-[#343945] dark:bg-slate-800 dark:text-[#78A0FF]">
                          <Layers className="mr-1 inline h-3 w-3" aria-hidden="true" /> {categoryName}
                        </span>
                        <span className="rounded-[4px] border border-[#D9DEE7] bg-white px-2 py-0.5 text-xs font-medium text-[#20232B] dark:border-[#343945] dark:bg-slate-900 dark:text-[#F3F4F6]">
                          <GraduationCap className="mr-1 inline h-3 w-3 text-[#626B78] dark:text-[#B1B7C3]" aria-hidden="true" /> {majorName}
                        </span>
                        {isBootcamp ? (
                          <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-xs font-medium text-[#20232B] dark:border-[#343945] dark:bg-slate-800 dark:text-[#F3F4F6]">
                            <Rocket className="mr-1 inline h-3 w-3 text-[#2457C5] dark:text-[#78A0FF]" aria-hidden="true" /> Bootcamp
                          </span>
                        ) : (
                          <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-xs font-medium text-[#20232B] dark:border-[#343945] dark:bg-slate-800 dark:text-[#F3F4F6]">
                            <Handshake className="mr-1 inline h-3 w-3 text-[#2457C5] dark:text-[#78A0FF]" aria-hidden="true" /> Peer-Tutoring
                          </span>
                        )}
                        {isCancelled && (
                          <span className="rounded-[4px] border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                            Kelas Dibatalkan — Dana Dikembalikan
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 text-base font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                        {course.title}
                      </h3>
                      {course.shortDescription && (
                        <p className="mt-1 text-xs text-[#626B78] line-clamp-2 leading-relaxed dark:text-[#B1B7C3]">
                          {course.shortDescription}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#20232B] dark:text-[#F3F4F6]">
                          <CalendarDays className="h-3.5 w-3.5 text-[#2457C5] dark:text-[#78A0FF]" aria-hidden="true" />
                          {schedule}
                        </span>
                        <span className="rounded-[4px] bg-[#2457C5]/10 px-2 py-0.5 text-[10px] font-semibold text-[#2457C5] dark:text-[#78A0FF]">
                          {isBootcamp ? "Bootcamp" : "Peer-Tutoring"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <UserRoundCheck className="h-4 w-4" aria-hidden="true" />
                          Pengajar: <b>{course.organizerName || course.tutor?.name || "—"}</b>
                        </span>
                      </div>


                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                        <span className="text-[#626B78] dark:text-[#B1B7C3]">Kontak Pengajar:</span>
                        {course.tutor?.phoneNumber ? (
                          <a
                            href={whatsappUrl(course.tutor.phoneNumber, course.tutor.name, course.title)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        ) : null}
                        {course.tutor?.email ? (
                          <a
                            href={`mailto:${course.tutor.email}`}
                            className="inline-flex items-center gap-1 font-medium text-[#2457C5] hover:underline dark:text-[#78A0FF]"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span>Email</span>
                          </a>
                        ) : null}
                      </div>
                    </div>


                    <div className="lg:w-72 shrink-0 border-t border-[#D9DEE7] lg:border-t-0 lg:border-l lg:pl-4 pt-3 lg:pt-0 dark:border-[#343945]">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#626B78] mb-2 dark:text-[#B1B7C3]">
                        Akses Pembelajaran Langsung
                      </div>

                      <div className="flex flex-col gap-2">
                        {isCancelled ? (
                          <div className="rounded-[4px] border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                            Tautan pertemuan dinonaktifkan karena kelas ini telah dibatalkan oleh pengajar.
                          </div>
                        ) : isAccessExpired ? (
                          <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                            Masa akses pembelajaran berakhir pada {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(course.accessUntil!))}.
                          </div>
                        ) : course.meetingUrl ? (
                          <a
                            href={course.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary btn-dashboard-action inline-flex items-center justify-between font-medium"
                          >
                            <span className="inline-flex items-center gap-2">
                              <MonitorPlay className="h-4 w-4" aria-hidden="true" />
                              Masuk Link {course.meetingPlatform || "Live"}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          <p className="text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
                            Tautan sesi belum ditambahkan oleh pengajar.
                          </p>
                        )}

                        {course.materialUrl && !isCancelled && !isAccessExpired && (
                          <a
                            href={course.materialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary btn-dashboard-action inline-flex items-center justify-between font-medium"
                          >
                            <span className="inline-flex items-center gap-2">
                              <BookOpenText className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" aria-hidden="true" />
                              <span>Link Catatan &amp; Materi</span>
                            </span>
                            <ExternalLink className="h-3 w-3 text-[#626B78] dark:text-[#B1B7C3]" aria-hidden="true" />
                          </a>
                        )}

                        {course.recordingUrl && !isCancelled && !isAccessExpired && (
                          <a
                            href={course.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary btn-dashboard-action inline-flex items-center justify-between font-medium"
                          >
                            <span className="inline-flex items-center gap-2">
                              <Video className="h-4 w-4 text-[#626B78] dark:text-[#B1B7C3]" aria-hidden="true" />
                              <span>Link Rekaman Sesi</span>
                            </span>
                            <ExternalLink className="h-3 w-3 text-[#626B78] dark:text-[#B1B7C3]" aria-hidden="true" />
                          </a>
                        )}
                      </div>

                      <div className="mt-3">
                        <Link
                          href={`/detail-kelas?id=${encodeURIComponent(course.id)}`}
                          className="btn-secondary btn-dashboard-action flex w-full items-center justify-center"
                        >
                          Lihat Detail Kelas <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </Link>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <button type="button" onClick={() => setReportClass(course)} className="btn-secondary btn-dashboard-action inline-flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5" /> Laporkan Kelas / Tutor</button>
                        {reports.filter((report) => report.targetId === course.id || report.classId === course.id).slice(0, 1).map((report) => <span key={report.id} className="inline-flex flex-col gap-1 rounded-[4px] border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"><span>Laporan: {({ PENDING_REVIEW: "Menunggu Tinjauan", UNDER_REVIEW: "Sedang Ditinjau", RESOLVED: "Selesai", DISMISSED: "Ditutup", REJECTED: "Ditolak" } as Record<string, string>)[report.status] || report.status}</span>{report.adminNote && <span className="max-w-sm whitespace-pre-wrap font-normal">Catatan admin: {report.adminNote}</span>}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
    {reportClass && <ReportModal isOpen onClose={() => setReportClass(null)} targetType="class" targetId={reportClass.id} targetTitle={reportClass.title} tutorId={reportClass.tutor?.id || reportClass.creator?.id} tutorName={reportClass.tutor?.name || reportClass.creator?.name} />}
    </>
  );
}
