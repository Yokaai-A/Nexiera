"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, Handshake, Landmark, Rocket, Search, UserRound } from "lucide-react";
import { getPublicUploadUrl, nexieraApi, type ApiClass } from "@/src/lib/api";
import { slugify } from "@/src/lib/slug";
import { ClassCard } from "@/src/components/cari-kelas/ClassCard";

export function TutorProfile({ slug }: { slug: string }) {
  const [tutor, setTutor] = useState<{ name: string; role: string; campus: string; major: string; bio: string; avatarUrl: string | null } | null>(null);
  const [tutorCourses, setTutorCourses] = useState<ApiClass[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const all = await nexieraApi.classes();
        if (!active) return;

        const matchingCourses = all.filter((course) => slugify(course.tutor?.name ?? "") === slugify(slug) || course.tutors?.some((person) => slugify(person.name) === slugify(slug)));
        const firstCourse = matchingCourses[0];
        const tutorRecord = firstCourse?.tutors?.find((person) => slugify(person.name) === slugify(slug));
        const campuses = [...new Set(matchingCourses.map((course) => course.university).filter((value): value is string => Boolean(value)))];
        const majors = [...new Set(matchingCourses.map((course) => course.major).filter((value): value is string => Boolean(value)))];
        const titles = [...new Set(matchingCourses.map((course) => course.title))];
        const hasBootcamp = matchingCourses.some((course) => course.courseType === "BOOTCAMP");
        const hasPeerTutoring = matchingCourses.some((course) => course.courseType === "PEER_TUTORING");

        const dynamicProfile = firstCourse
          ? {
              name: tutorRecord?.name ?? firstCourse.tutor?.name ?? "",
              role: tutorRecord?.roleTitle?.trim() || firstCourse.tutor?.headline?.trim() || (hasBootcamp && hasPeerTutoring
                ? "Pengajar Bootcamp & Tutor Sebaya"
                : hasBootcamp
                  ? `Pengajar Bootcamp${majors[0] ? ` ${majors[0]}` : ""}`
                  : `Tutor Sebaya${majors[0] ? ` ${majors[0]}` : ""}`),
              campus: firstCourse.tutor?.university?.trim() || (campuses.length === 1 ? campuses[0] : campuses.length > 1 ? "Beberapa kampus" : "Belum dicantumkan"),
              major: firstCourse.tutor?.major?.trim() || (majors.length === 1 ? majors[0] : majors.length > 1 ? "Beberapa bidang" : "Belum dicantumkan"),
              bio: [
                tutorRecord?.headline?.trim(),
                firstCourse.tutor?.bio?.trim(),
                titles.length > 0 ? `Kelas yang sedang diampu: ${titles.join(", ")}.` : "",
              ].filter(Boolean).join(" "),
              avatarUrl: tutorRecord?.avatarUrl?.trim() || firstCourse.tutor?.avatarUrl?.trim() || null,
            }
          : null;

        setTutor(dynamicProfile);
        setTutorCourses(matchingCourses);
        setLoadError("");
      } catch (cause) {
        if (!active) return;
        setTutor(null);
        setTutorCourses([]);
        setLoadError(cause instanceof Error ? cause.message : "Profil pengajar gagal dimuat.");
      } finally {
        if (active) setLoaded(true);
      }
    };

    const handleUpdate = () => {
      void loadProfile();
    };

    void loadProfile();
    window.addEventListener("nexiera_course_update", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener("nexiera_course_update", handleUpdate);
    };
  }, [slug]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <p className="text-xs text-slate-500">Memuat profil tutor...</p>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="mx-auto max-w-[1180px] px-4 py-20 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#E5E9F0] text-[#2457C5] mb-4">
          <UserRound className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-[#20232B]">{loadError ? "Profil Pengajar Gagal Dimuat" : "Profil Tutor Tidak Ditemukan"}</h1>
        <p className="mt-2 text-xs text-[#626B78]">
          {loadError || "Pengajar dengan tautan ini tidak terdaftar atau belum memiliki kelas aktif di katalog."}
        </p>
        <div className="mt-6">
          <Link
            href="/cari-kelas"
            className="btn-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Kembali ke Katalog Kelas
          </Link>
        </div>
      </div>
    );
  }

  const hasBootcamp = tutorCourses.some((course) => course.courseType === "BOOTCAMP");
  const hasPeerTutoring = tutorCourses.some((course) => course.courseType === "PEER_TUTORING");
  const avatarUrl = tutor.avatarUrl?.startsWith("/uploads")
    ? getPublicUploadUrl(tutor.avatarUrl)
    : tutor.avatarUrl;

  return (
    <div className="min-h-screen bg-white pb-20">

      <div className="border-b border-[#D9DEE7] bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 sm:px-6 lg:px-8 py-3 text-xs text-[#626B78]">
          <Link
            href="/cari-kelas"
            className="inline-flex items-center gap-1.5 font-medium text-[#20232B] hover:text-[#2457C5] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Kembali ke Katalog Kelas
          </Link>
          <span className="text-[11px] font-medium text-[#626B78]">
            Profil Tutor Mahasiswa
          </span>
        </div>
      </div>


      <div className="relative w-full bg-[#E5E9F0] border-b border-[#D9DEE7] overflow-hidden h-36 sm:h-48">
        <div className="absolute inset-0 bg-[#2457C5]/10" />
      </div>


      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">

        <div className="relative -mt-12 sm:-mt-14 mb-4">
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-full border-2 border-white ring-2 ring-[#D9DEE7] bg-[#E5E9F0] text-xl font-semibold text-[#2457C5] shadow-sm overflow-hidden">
            {avatarUrl ? <Image
              src={avatarUrl}
              alt={tutor.name}
              fill
              sizes="112px"
              unoptimized={avatarUrl.includes("/uploads/")}
              className="object-cover"
            /> : tutor.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
          </div>
        </div>


        <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:p-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-3 py-1 text-xs font-semibold text-[#20232B]">
              {hasBootcamp ? <Rocket className="h-3.5 w-3.5 text-[#2457C5]" aria-hidden="true" /> : <Handshake className="h-3.5 w-3.5 text-[#2457C5]" aria-hidden="true" />}
              {hasBootcamp && hasPeerTutoring ? "Pengajar Bootcamp & Tutor Sebaya" : hasBootcamp ? "Pengajar Bootcamp" : "Tutor Sebaya Mahasiswa"}
            </div>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-[#20232B] tracking-tight">
            {tutor.name}
          </h1>
          <p className="mt-1 text-sm sm:text-base font-medium text-[#2457C5]">
            {tutor.role}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-[#626B78] border-y border-[#D9DEE7] py-3.5">
            <span className="flex items-center gap-1.5 text-[#20232B]">
              <Landmark className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /> {tutor.campus}
            </span>
            <span className="text-[#D9DEE7]">•</span>
            <span className="flex items-center gap-1.5 text-[#20232B]">
              <GraduationCap className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /> {tutor.major}
            </span>
            <span className="text-[#D9DEE7]">•</span>
            <span className="flex items-center gap-1.5 font-semibold text-[#2457C5]">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> {tutorCourses.length} Kelas Diampu
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/cari-kelas"
              className="btn-primary"
            >
              <Search className="h-4 w-4" aria-hidden="true" /> Jelajahi Kelas Lainnya
            </Link>
          </div>
        </div>


        <div className="mt-6 rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#20232B]">
            Tentang Tutor
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-[#626B78]">
            {tutor.bio || "Belum ada informasi tambahan yang dicantumkan."}
          </p>
        </div>


        <div className="mt-10">
          <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-3 mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#2457C5]" aria-hidden="true" />
              <h2 className="text-base font-semibold text-[#20232B]">
                Kelas yang Diampu
              </h2>
            </div>
            <span className="text-xs font-medium text-[#626B78]">
              {tutorCourses.length} Kelas Tersedia
            </span>
          </div>

          {tutorCourses.length === 0 ? (
            <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-12 text-center">
              <h3 className="text-sm font-semibold text-[#20232B]">Belum Ada Kelas Aktif</h3>
              <p className="mt-1 text-xs text-[#626B78]">
                Kelas yang diampu akan tampil di sini setelah aktif dan tersedia di katalog.
              </p>
              <Link
                href="/cari-kelas"
                className="mt-4 btn-primary"
              >
                Lihat Katalog Kelas Kuliah
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorCourses.map((c) => (
                <ClassCard key={c.id} item={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
