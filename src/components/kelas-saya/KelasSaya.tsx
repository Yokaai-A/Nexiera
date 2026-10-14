"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  Handshake,
  Layers,
  LayoutDashboard,
  MonitorPlay,
  Rocket,
  Search,
  UserRoundCheck,
  Video,
} from "lucide-react";
import { getRegisteredCourses, getStoredUser } from "@/src/lib/storage";
import { AcademicCourse, UserProfile } from "@/src/types/course";

function LinkCatatanItem({ url }: { url?: string }) {
  if (!url || !url.trim()) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-xs hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/40 transition-all"
    >
      <BookOpenText className="h-4 w-4 text-blue-600" aria-hidden="true" />
      <span>Link Catatan</span>
      <ExternalLink className="h-3 w-3 text-slate-400" aria-hidden="true" />
    </a>
  );
}

function LinkRekamanItem({ url }: { url?: string }) {
  if (!url || !url.trim()) {
    return null;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-xs hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50/40 transition-all"
    >
      <Video className="h-4 w-4 text-purple-600" aria-hidden="true" />
      <span>Link Rekaman Sesi</span>
      <ExternalLink className="h-3 w-3 text-slate-400" aria-hidden="true" />
    </a>
  );
}

export function KelasSaya() {
  const [courses, setCourses] = useState<AcademicCourse[]>([]);
  const [user, setUser] = useState<UserProfile>(getStoredUser());

  useEffect(() => {
    setUser(getStoredUser());
    setCourses(getRegisteredCourses());

    const handleUpdate = () => {
      setUser(getStoredUser());
      setCourses(getRegisteredCourses());
    };

    window.addEventListener("nexiera_registration_update", handleUpdate);
    window.addEventListener("nexiera_auth_update", handleUpdate);
    window.addEventListener("nexiera_course_update", handleUpdate);
    return () => {
      window.removeEventListener("nexiera_registration_update", handleUpdate);
      window.removeEventListener("nexiera_auth_update", handleUpdate);
      window.removeEventListener("nexiera_course_update", handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="border-b border-slate-200/80 bg-white py-8 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard Peserta
              </span>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Kelas Saya
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Kelola jadwal dan akses seluruh link pembelajaran aktif (Live Meeting, Link Catatan, dan Rekaman Sesi).
              </p>
            </div>

            <Link
              href="/cari-kelas"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors self-start sm:self-auto"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" /> Tambah Kelas Kuliah
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {courses.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
              <BookOpenText className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Belum Ada Kelas yang Diikuti</h3>
            <p className="mx-auto mt-2 max-w-md text-xs text-slate-500 leading-relaxed">
              Kamu belum mendaftar kelas bimbingan atau bootcamp apapun. Jelajahi katalog kelas kuliah untuk menemukan tutor sebaya terbaik.
            </p>
            <div className="mt-6">
              <Link
                href="/cari-kelas"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all hover:scale-105"
              >
                <Search className="h-4 w-4" aria-hidden="true" /> Jelajahi Katalog Kelas
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">
                Kelas Aktif ({courses.length})
              </h2>
            </div>

            <div className="grid gap-6">
              {courses.map((course) => {
                const isBootcamp = course.type === "BOOTCAMP";
                const categoryName = course.mainCategory || course.subjectCategory || "Sains & Teknologi";
                const majorName = course.major || "Computer Science";

                return (
                  <div
                    key={course.id}
                    className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs hover:border-blue-200 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                            <Layers className="mr-1 inline h-3 w-3" aria-hidden="true" /> {categoryName}
                          </span>
                          <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700">
                            <GraduationCap className="mr-1 inline h-3 w-3" aria-hidden="true" /> {majorName}
                          </span>
                          {isBootcamp ? (
                            <span className="rounded-md bg-cyan-50 px-2.5 py-0.5 text-[10px] font-bold text-cyan-700">
                              <Rocket className="mr-1 inline h-3 w-3" aria-hidden="true" /> Bootcamp
                            </span>
                          ) : (
                            <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                              <Handshake className="mr-1 inline h-3 w-3" aria-hidden="true" /> Peer-Tutoring
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 text-lg font-bold text-slate-900">
                          {course.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {course.shortDescription}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                            <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            {course.scheduleDate}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-slate-600">
                            <UserRoundCheck className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            {isBootcamp ? `${course.tutors.length} Pengajar (${course.organizerName})` : `Tutor: ${course.tutors[0]?.name || course.organizerName}`}
                          </span>
                        </div>
                      </div>

                      <div className="lg:w-80 shrink-0 border-t border-slate-100 lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Akses Pembelajaran Langsung
                        </div>

                        <div className="flex flex-col gap-2.5">
                          <a
                            href={course.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
                          >
                            <span className="inline-flex items-center gap-2">
                              <MonitorPlay className="h-4 w-4" aria-hidden="true" />
                              Masuk Link {course.meetingPlatform}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>

                          <LinkCatatanItem url={course.materialUrl} />

                          <LinkRekamanItem url={course.recordingUrl} />
                        </div>

                        <div className="mt-4 text-right">
                          <Link
                            href={`/detail-kelas?id=${course.id}`}
                            className="text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
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
    </div>
  );
}
