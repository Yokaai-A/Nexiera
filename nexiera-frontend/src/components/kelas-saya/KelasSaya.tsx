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
} from "lucide-react";
import { nexieraApi, type ApiClass } from "@/src/lib/api";

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

  useEffect(() => {
    let active = true;

    nexieraApi
      .myClasses()
      .then((items) => {
        if (!active) return;
        setClasses(items);
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

  return (
    <div className="space-y-6">
      {/* Header Ruang Belajar */}
      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 dark:border-[#343945] dark:bg-[#191C23]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#2457C5] uppercase dark:text-[#78A0FF]">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Ruang Belajar Peserta
            </span>
            <h1 className="mt-2 text-2xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
              Kelas Saya
            </h1>
            <p className="mt-1 text-sm text-[#626B78] dark:text-[#B1B7C3]">
              Akses link tatap muka langsung, dokumen catatan materi, dan kontak pengajar kelas terverifikasi.
            </p>
          </div>

          <Link
            href="/cari-kelas"
            className="btn-secondary self-start sm:self-auto"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" /> Tambah Kelas
          </Link>
        </div>
      </header>

      {/* Konten Daftar Kelas */}
      {loading ? (
        <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-12 text-center dark:border-[#343945] dark:bg-[#191C23]">
          <p className="text-sm text-[#626B78] dark:text-[#B1B7C3]">Memuat data kelas...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-12 text-center dark:border-[#343945] dark:bg-[#191C23]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#E5E9F0] text-[#20232B] mb-4 dark:bg-slate-800 dark:text-[#F3F4F6]">
            <BookOpenText className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            Belum Ada Kelas yang Diikuti
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#626B78] leading-relaxed dark:text-[#B1B7C3]">
            Kamu belum mendaftar kelas bimbingan atau bootcamp apapun. Jelajahi katalog kelas kuliah untuk menemukan tutor sebaya terbaik.
          </p>
          <div className="mt-6">
            <Link
              href="/cari-kelas"
              className="btn-primary inline-flex items-center gap-2"
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
              const isBootcamp = course.courseType === "BOOTCAMP";
              const isCancelled = course.status === "CANCELLED";
              const categoryName = course.mainCategory || "Sains & Teknologi";
              const majorName = course.major || "Computer Science";
              const schedule = course.startsAt
                ? new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "short" }).format(
                    new Date(course.startsAt),
                  )
                : "Jadwal Fleksibel";

              return (
                <div
                  key={course.id}
                  className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:p-7 dark:border-[#343945] dark:bg-[#191C23]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
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

                      <h3 className="mt-3 text-lg font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                        {course.title}
                      </h3>
                      {course.shortDescription && (
                        <p className="mt-1 text-sm text-[#626B78] line-clamp-2 leading-relaxed dark:text-[#B1B7C3]">
                          {course.shortDescription}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#20232B] dark:text-[#F3F4F6]">
                          <CalendarDays className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" aria-hidden="true" />
                          {schedule}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <UserRoundCheck className="h-4 w-4" aria-hidden="true" />
                          Pengajar: <b>{course.organizerName || course.tutor.name}</b>
                        </span>
                      </div>

                      {/* Kontak Langsung WhatsApp & Email Tutor */}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                        <span className="text-[#626B78] dark:text-[#B1B7C3]">Kontak Pengajar:</span>
                        {course.tutor.phoneNumber ? (
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
                        {course.tutor.email ? (
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

                    {/* Akses Pembelajaran Langsung (Diproteksi) */}
                    <div className="lg:w-80 shrink-0 border-t border-[#D9DEE7] lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0 dark:border-[#343945]">
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#626B78] mb-3 dark:text-[#B1B7C3]">
                        Akses Pembelajaran Langsung
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {isCancelled ? (
                          <div className="rounded-[4px] border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                            Tautan pertemuan dinonaktifkan karena kelas ini telah dibatalkan oleh pengajar.
                          </div>
                        ) : course.meetingUrl ? (
                          <a
                            href={course.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center justify-between text-xs font-medium"
                          >
                            <span className="inline-flex items-center gap-2">
                              <MonitorPlay className="h-4 w-4" aria-hidden="true" />
                              Masuk Link {course.meetingPlatform || "Live"}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          <p className="text-xs text-[#626B78] dark:text-[#B1B7C3]">
                            Link tatap muka belum ditambahkan oleh pengajar.
                          </p>
                        )}

                        {course.materialUrl && !isCancelled && (
                          <a
                            href={course.materialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary inline-flex items-center justify-between text-xs font-medium"
                          >
                            <span className="inline-flex items-center gap-2">
                              <BookOpenText className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" aria-hidden="true" />
                              <span>Link Catatan &amp; Materi</span>
                            </span>
                            <ExternalLink className="h-3 w-3 text-[#626B78] dark:text-[#B1B7C3]" aria-hidden="true" />
                          </a>
                        )}

                        {course.recordingUrl && !isCancelled && (
                          <a
                            href={course.recordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary inline-flex items-center justify-between text-xs font-medium"
                          >
                            <span className="inline-flex items-center gap-2">
                              <Video className="h-4 w-4 text-[#626B78] dark:text-[#B1B7C3]" aria-hidden="true" />
                              <span>Link Rekaman Sesi</span>
                            </span>
                            <ExternalLink className="h-3 w-3 text-[#626B78] dark:text-[#B1B7C3]" aria-hidden="true" />
                          </a>
                        )}
                      </div>

                      <div className="mt-4 text-right">
                        <Link
                          href={`/detail-kelas?id=${encodeURIComponent(course.id)}`}
                          className="text-xs font-medium text-[#2457C5] hover:underline inline-flex items-center gap-1 dark:text-[#78A0FF]"
                        >
                          Lihat Silabus &amp; Detail <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </Link>
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
  );
}
