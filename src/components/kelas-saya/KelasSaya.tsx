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
      className="inline-flex items-center justify-between rounded-[4px] border border-[#D9DEE7] bg-white px-4 py-2 text-xs font-medium text-[#20232B] hover:bg-[#E5E9F0] transition-colors"
    >
      <span className="inline-flex items-center gap-2">
        <BookOpenText className="h-4 w-4 text-[#2457C5]" aria-hidden="true" />
        <span>Link Catatan</span>
      </span>
      <ExternalLink className="h-3 w-3 text-[#626B78]" aria-hidden="true" />
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
      className="inline-flex items-center justify-between rounded-[4px] border border-[#D9DEE7] bg-white px-4 py-2 text-xs font-medium text-[#20232B] hover:bg-[#E5E9F0] transition-colors"
    >
      <span className="inline-flex items-center gap-2">
        <Video className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
        <span>Link Rekaman Sesi</span>
      </span>
      <ExternalLink className="h-3 w-3 text-[#626B78]" aria-hidden="true" />
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
    <div className="min-h-screen bg-white pb-20">
      <div className="border-b border-[#D9DEE7] bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#2457C5] uppercase">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> Dashboard Peserta
              </span>
              <h1 className="mt-1 text-2xl sm:text-3xl font-semibold text-[#20232B]">
                Kelas Saya
              </h1>
              <p className="mt-1 text-sm text-[#626B78]">
                Kelola jadwal dan akses seluruh link pembelajaran aktif (Live Meeting, Link Catatan, dan Rekaman Sesi).
              </p>
            </div>

            <Link
              href="/cari-kelas"
              className="btn-secondary self-start sm:self-auto"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" /> Tambah Kelas
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-8">
        {courses.length === 0 ? (
          <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#E5E9F0] text-[#20232B] mb-4">
              <BookOpenText className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-[#20232B]">Belum Ada Kelas yang Diikuti</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#626B78] leading-relaxed">
              Kamu belum mendaftar kelas bimbingan atau bootcamp apapun. Jelajahi katalog kelas kuliah untuk menemukan tutor sebaya terbaik.
            </p>
            <div className="mt-6">
              <Link
                href="/cari-kelas"
                className="btn-primary"
              >
                <Search className="h-4 w-4" aria-hidden="true" /> Jelajahi Katalog Kelas
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#20232B]">
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
                    className="nx-card p-6 sm:p-7"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-[10px] font-semibold text-[#2457C5] uppercase tracking-wide">
                            <Layers className="mr-1 inline h-3 w-3" aria-hidden="true" /> {categoryName}
                          </span>
                          <span className="rounded-[4px] border border-[#D9DEE7] bg-white px-2 py-0.5 text-[10px] font-medium text-[#20232B]">
                            <GraduationCap className="mr-1 inline h-3 w-3 text-[#626B78]" aria-hidden="true" /> {majorName}
                          </span>
                          {isBootcamp ? (
                            <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-[10px] font-medium text-[#20232B]">
                              <Rocket className="mr-1 inline h-3 w-3 text-[#2457C5]" aria-hidden="true" /> Bootcamp
                            </span>
                          ) : (
                            <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-[10px] font-medium text-[#20232B]">
                              <Handshake className="mr-1 inline h-3 w-3 text-[#2457C5]" aria-hidden="true" /> Peer-Tutoring
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 text-lg font-semibold text-[#20232B]">
                          {course.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#626B78] line-clamp-2 leading-relaxed">
                          {course.shortDescription}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#626B78]">
                          <span className="inline-flex items-center gap-1.5 font-medium text-[#20232B]">
                            <CalendarDays className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
                            {course.scheduleDate}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[#626B78]">
                            <UserRoundCheck className="h-4 w-4 text-[#626B78]" aria-hidden="true" />
                            {isBootcamp ? `${course.tutors.length} Pengajar (${course.organizerName})` : `Tutor: ${course.tutors[0]?.name || course.organizerName}`}
                          </span>
                        </div>
                      </div>

                      <div className="lg:w-80 shrink-0 border-t border-[#D9DEE7] lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] mb-3">
                          Akses Pembelajaran Langsung
                        </div>

                        <div className="flex flex-col gap-2.5">
                          <a
                            href={course.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between rounded-[4px] bg-[#2457C5] px-4 py-2 text-xs font-medium text-white hover:bg-[#1C48A5] transition-colors"
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
                            className="text-xs font-medium text-[#2457C5] hover:underline inline-flex items-center gap-1"
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

