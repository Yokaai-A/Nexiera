"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, BookOpenText, CalendarDays, Check, CircleCheck, ExternalLink, Handshake, Landmark, LockKeyhole, MonitorPlay, Rocket, Search, ShieldCheck, UnlockKeyhole, UsersRound, X } from "lucide-react";
import { getCourseById, getStoredCourses, getStoredUser } from "@/src/lib/storage";
import { AcademicCourse } from "@/src/types/course";

export function DetailKelas() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");

  const [course, setCourse] = useState<AcademicCourse | null>(null);
  const [user, setUser] = useState(getStoredUser());
  const [isRegistered, setIsRegistered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const allCourses = getStoredCourses();
    if (courseId) {
      const found = getCourseById(courseId);
      if (found) {
        setCourse(found);
        return;
      }
    }
    // Fallback to first course
    if (allCourses.length > 0) {
      setCourse(allCourses[0]);
    }
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-slate-500">Memuat detail kelas...</p>
        </div>
      </div>
    );
  }

  const isBootcamp = course.type === "BOOTCAMP";
  const isFree = course.pricingModel === "FREE";

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── Breadcrumb Bar ────────────────────────────────────── */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-3.5 text-xs text-slate-500">
          <Link href="/cari-kelas" className="flex items-center gap-1 font-semibold text-blue-600 hover:underline">
            <Search className="h-3.5 w-3.5" aria-hidden="true" /> Katalog Kelas
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400">{course.subjectCategory}</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-slate-800 truncate max-w-xs">{course.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* ── LEFT & CENTER: Course Info & Centralized Access Hub ─ */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100 uppercase tracking-wide">
                  <Landmark className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> {course.university} – {course.subjectCategory}
                </span>
                {isBootcamp ? (
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700 ring-1 ring-cyan-200">
                    <Rocket className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Bootcamp Organisasi
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                    <Handshake className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Peer-Tutoring Mahasiswa
                  </span>
                )}
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <BadgeCheck className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Kurikulum Terverifikasi
                </span>
              </div>

              <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {course.title}
              </h1>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {course.shortDescription}
              </p>

              {/* Stat row */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Jadwal
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> {course.scheduleDate}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Metode &amp; Sesi
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <MonitorPlay className="h-3.5 w-3.5" aria-hidden="true" /> {course.meetingPlatform}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Akses Materi
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <BookOpenText className="h-3.5 w-3.5" aria-hidden="true" /> {course.accessDuration}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sisa Kuota
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                    <UsersRound className="h-3.5 w-3.5" aria-hidden="true" /> {course.availableSeats} Kursi
                  </div>
                </div>
              </div>
            </div>

            {/* ── Centralized Access Hub Links ──────────────────── */}
            <div className="rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                    Centralized Access Hub
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    Ruang Kelas &amp; Notion Study Hub
                  </h2>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                  {isRegistered ? <><UnlockKeyhole className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Akses Aktif</> : <><LockKeyhole className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Khusus Peserta</>}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-600">
                Semua bahan kuliah, latihan ujian, dan link sesi langsung terpusat di sini.
              </p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Notion Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-xl">
                      <BookOpenText className="h-5 w-5 text-slate-600" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Notion Study Hub</h3>
                      <p className="text-[11px] text-slate-500">Catatan rapi, bank soal &amp; silabus</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href={course.materialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                    >
                      Buka Catatan di Notion <ExternalLink className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                {/* Meeting Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                      <MonitorPlay className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {course.meetingPlatform} Room
                      </h3>
                      <p className="text-[11px] text-slate-500">Ruang sesi tatap muka interaktif</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a
                      href={course.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                    >
                      Masuk Link {course.meetingPlatform} <ExternalLink className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Syllabus */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Tentang Program Pembelajaran</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                {course.fullDescription}
              </p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Syarat &amp; Prasyarat
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Fasilitas Peserta
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {course.facilities.map((fac, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-emerald-700 font-medium">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ── Tutors Section (Single vs Multi-tutor) ───────── */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  {isBootcamp ? `Tim Pengajar (${course.tutors.length} Tutor)` : "Profil Tutor Mahasiswa"}
                </h2>
                <span className="text-xs text-blue-600 font-semibold">
                  Diselenggarakan oleh {course.organizerName}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {course.tutors.map((t) => (
                  <div key={t.id} className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-blue-500/20">
                      <Image
                        src={t.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"}
                        alt={t.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{t.name}</h3>
                      <p className="text-xs font-medium text-slate-500 truncate">{t.role}</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verifikasi Kampus BINUS
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT: Registration & Price Sidebar ───────────── */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Biaya Pendaftaran
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                {isFree ? (
                  <span className="text-3xl font-black text-emerald-600">GRATIS</span>
                ) : (
                  <>
                    <span className="text-3xl font-black text-slate-900">
                      Rp {course.priceAmount?.toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs text-slate-400">/ semester</span>
                  </>
                )}
              </div>

              {isRegistered ? (
                <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                  <p className="text-sm font-bold text-emerald-800">
                    <CircleCheck className="mr-1 inline h-4 w-4" aria-hidden="true" /> Kamu Sudah Terdaftar!
                  </p>
                  <p className="mt-1 text-xs text-emerald-600">
                    Akses tautan Notion Study Hub dan ruang video di sebelah kiri.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="mt-6 w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all hover:scale-[1.02]"
                >
                  Daftar Kelas Sekarang <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" />
                </button>
              )}

              <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Penyelenggara:</span>
                  <span className="font-bold text-slate-800">{course.organizerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Universitas:</span>
                  <span className="font-semibold text-slate-800">{course.university}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Format:</span>
                  <span className="font-semibold text-slate-800">Online ({course.meetingPlatform})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Akses Catatan:</span>
                  <span className="font-semibold text-slate-800">Notion Study Hub</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Kuota Tersisa:</span>
                  <span className="font-bold text-blue-600">{course.availableSeats} Mahasiswa</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-3.5 text-[11px] text-slate-500 text-center">
                <ShieldCheck className="mr-1 inline h-4 w-4" aria-hidden="true" /> Jaminan Bimbingan Berintegritas &amp; Sesuai Silabus UTS/UAS
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Registration Modal ───────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Pendaftaran</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                  <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-slate-500">Mata Kuliah:</p>
                <p className="text-sm font-bold text-slate-900">{course.title}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Mahasiswa</label>
                <input
                  type="text"
                  defaultValue={user.fullName}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Mahasiswa</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kampus &amp; Jurusan</label>
                <input
                  type="text"
                  defaultValue={`${user.campus} - ${user.major}`}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500"
                />
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-[11px] text-blue-800">
                Setelah pendaftaran, tautan Notion Study Hub dan link {course.meetingPlatform} akan langsung terbuka.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Konfirmasi &amp; Daftar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
