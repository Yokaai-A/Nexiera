"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Building2, Calendar, Landmark, Rocket, Search } from "lucide-react";
import { AcademicCourse } from "@/src/types/course";
import { getStoredCourses } from "@/src/lib/storage";
import { getCoursesByOrganizer, getOrganizerData, OrganizerProfileData } from "@/src/lib/slug";
import { ClassCard } from "@/src/components/cari-kelas/ClassCard";

export function OrganizerProfile({ slug }: { slug: string }) {
  const [courses, setCourses] = useState<AcademicCourse[]>([]);
  const [organizer, setOrganizer] = useState<OrganizerProfileData | null>(null);
  const [organizerCourses, setOrganizerCourses] = useState<AcademicCourse[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const all = getStoredCourses();
    setCourses(all);
    const org = getOrganizerData(slug, all);
    setOrganizer(org);
    setOrganizerCourses(getCoursesByOrganizer(slug, all));
    setLoaded(true);

    const handleUpdate = () => {
      const updatedAll = getStoredCourses();
      setCourses(updatedAll);
      setOrganizer(getOrganizerData(slug, updatedAll));
      setOrganizerCourses(getCoursesByOrganizer(slug, updatedAll));
    };

    window.addEventListener("nexiera_course_update", handleUpdate);
    return () => {
      window.removeEventListener("nexiera_course_update", handleUpdate);
    };
  }, [slug]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <p className="text-xs text-slate-500">Memuat profil penyelenggara...</p>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="mx-auto max-w-[1180px] px-4 py-20 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#E5E9F0] text-[#2457C5] mb-4">
          <Building2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-[#20232B]">Penyelenggara Tidak Ditemukan</h1>
        <p className="mt-2 text-xs text-[#626B78]">
          Profil penyelenggara dengan tautan ini tidak terdaftar atau belum menerbitkan kelas.
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

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Breadcrumb Bar */}
      <div className="border-b border-[#D9DEE7] bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 sm:px-6 lg:px-8 py-3 text-xs text-[#626B78]">
          <Link
            href="/cari-kelas"
            className="inline-flex items-center gap-1.5 font-medium text-[#20232B] hover:text-[#2457C5] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Kembali ke Katalog Kelas
          </Link>
          <span className="text-[11px] font-medium text-[#626B78]">
            Profil Mitra Penyelenggara
          </span>
        </div>
      </div>

      {/* 1. [Atas] Cover Banner Header (Visual latar belakang murni tanpa overlay teks) */}
      <div className="relative w-full bg-[#E5E9F0] border-b border-[#D9DEE7] overflow-hidden h-44 sm:h-56 md:h-64">
        <Image
          src={organizer.coverImage || "/banner-cari-kelas.png"}
          alt={organizer.name}
          fill
          priority
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black/15 shadow-[inset_0_0_32px_rgba(0,0,0,0.3)]"
        />
      </div>

      {/* Main Container Berlatar Putih */}
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        {/* 2. [Tengah/Batas] Logo Box (Menumpang rapi di batas banner & card) */}
        <div className="relative -mt-12 sm:-mt-14 mb-4">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-[6px] border border-[#D9DEE7] bg-white p-2.5 shadow-sm overflow-hidden flex items-center justify-center">
            <Image
              src={organizer.logo}
              alt={organizer.name}
              fill
              sizes="112px"
              className="object-contain p-2"
            />
          </div>
        </div>

        {/* 3. [Bawah Logo - Dalam Container Putih 5 Baris Terstruktur] */}
        <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:p-8">
          {/* Baris 1: Badge Tipe Penyelenggara */}
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-3 py-1 text-xs font-semibold text-[#20232B]">
              <Rocket className="h-3.5 w-3.5 text-[#2457C5]" aria-hidden="true" /> Mitra Bootcamp Akademik
            </div>
          </div>

          {/* Baris 2: Nama Penyelenggara / Bootcamp */}
          <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-[#20232B] tracking-tight">
            {organizer.name}
          </h1>

          {/* Baris 3: Tagline / Deskripsi Ringkas */}
          <p className="mt-2 text-sm sm:text-base text-[#626B78] max-w-3xl leading-relaxed">
            {organizer.tagline}
          </p>

          {/* Baris 4: Baris Metadata 3 Poin Terstruktur dengan Ikon/Pemisah yang Jelas */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-[#626B78] border-y border-[#D9DEE7] py-3.5">
            <span className="flex items-center gap-1.5 text-[#20232B]">
              <Landmark className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /> {organizer.campus}
            </span>
            <span className="text-[#D9DEE7]">•</span>
            <span className="flex items-center gap-1.5 text-[#20232B]">
              <Calendar className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /> Berdiri Sejak {organizer.establishedYear}
            </span>
            <span className="text-[#D9DEE7]">•</span>
            <span className="flex items-center gap-1.5 font-semibold text-[#2457C5]">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> {organizerCourses.length} Mata Kuliah Dibuka
            </span>
          </div>

          {/* Baris 5: Tombol Aksi Utama */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/cari-kelas"
              className="btn-primary"
            >
              <Search className="h-4 w-4" aria-hidden="true" /> Cari Kelas Lainnya
            </Link>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-6 rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#20232B]">
            Tentang {organizer.name}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-[#626B78]">
            {organizer.description}
          </p>
        </div>

        {/* Courses Grid Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-3 mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#2457C5]" aria-hidden="true" />
              <h2 className="text-base font-semibold text-[#20232B]">
                Seluruh Mata Kuliah &amp; Bootcamp yang Dibuka
              </h2>
            </div>
            <span className="text-xs font-medium text-[#626B78]">
              {organizerCourses.length} Kelas Tersedia
            </span>
          </div>

          {organizerCourses.length === 0 ? (
            <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-12 text-center">
              <h3 className="text-sm font-semibold text-[#20232B]">Belum Ada Kelas Aktif</h3>
              <p className="mt-1 text-xs text-[#626B78]">
                Penyelenggara ini belum membuka kelas untuk periode semester ini.
              </p>
              <Link
                href="/cari-kelas"
                className="mt-4 btn-primary"
              >
                Lihat Katalog Utama
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizerCourses.map((c) => (
                <ClassCard key={c.id} item={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
