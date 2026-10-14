"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CircleCheck,
  GraduationCap,
  Handshake,
  Layers,
  Lock,
  LogOut,
  MonitorPlay,
  Rocket,
  Search,
  ShieldCheck,
  UsersRound,
  X,
} from "lucide-react";
import {
  getCourseById,
  getStoredCourses,
  getStoredUser,
  isCourseRegistered,
  loginUser,
  registerCourse,
} from "@/src/lib/storage";
import { AcademicCourse, UserProfile } from "@/src/types/course";

export function DetailKelas() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");

  const [course, setCourse] = useState<AcademicCourse | null>(null);
  const [user, setUser] = useState<UserProfile>(getStoredUser());
  const [isRegistered, setIsRegistered] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    const allCourses = getStoredCourses();
    let currentCourse: AcademicCourse | undefined;

    if (courseId) {
      currentCourse = getCourseById(courseId);
    }
    if (!currentCourse && allCourses.length > 0) {
      currentCourse = allCourses[0];
    }

    if (currentCourse) {
      setCourse(currentCourse);
      setIsRegistered(isCourseRegistered(currentCourse.id));
    }

    const handleAuthChange = () => {
      setUser(getStoredUser());
    };
    const handleRegChange = () => {
      if (currentCourse) {
        setIsRegistered(isCourseRegistered(currentCourse.id));
      }
    };

    window.addEventListener("nexiera_auth_update", handleAuthChange);
    window.addEventListener("nexiera_registration_update", handleRegChange);
    return () => {
      window.removeEventListener("nexiera_auth_update", handleAuthChange);
      window.removeEventListener("nexiera_registration_update", handleRegChange);
    };
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <p className="text-xs text-slate-500">Memuat detail kelas...</p>
      </div>
    );
  }

  const isBootcamp = course.type === "BOOTCAMP";
  const isFree = course.pricingModel === "FREE";
  const categoryName = course.mainCategory || course.subjectCategory || "Sains & Teknologi";
  const majorName = course.major || "Computer Science";

  const handleCtaClick = () => {
    if (!user.isLoggedIn) {
      setShowAuthModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    registerCourse(course.id);
    setIsRegistered(true);
    setShowConfirmModal(false);

    setToastMessage("Pendaftaran Berhasil!");
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleGuestLogin = () => {
    loginUser("nicholas.aryan@binus.ac.id", "Nicholas Aryan");
    setShowAuthModal(false);
    setShowConfirmModal(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CircleCheck className="h-4 w-4" aria-hidden="true" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:opacity-80"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-3.5 text-xs text-slate-500">
          <Link href="/cari-kelas" className="flex items-center gap-1 font-semibold text-blue-600 hover:underline">
            <Search className="h-3.5 w-3.5" aria-hidden="true" /> Katalog Kelas
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">{categoryName}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500">{majorName}</span>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-slate-800 truncate max-w-xs">{course.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div className="lg:col-span-2 space-y-6">

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 ring-1 ring-blue-100 uppercase tracking-wide">
                  <Layers className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> {categoryName}
                </span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                  <GraduationCap className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> {majorName}
                </span>
                {isBootcamp ? (
                  <span className="rounded-md bg-cyan-50 px-2.5 py-1 text-[11px] font-bold text-cyan-700 ring-1 ring-cyan-200">
                    <Rocket className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Bootcamp
                  </span>
                ) : (
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200">
                    <Handshake className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Peer-Tutoring
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {course.title}
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {course.shortDescription}
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Jadwal
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" /> {course.scheduleDate}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sesi Tatap Muka
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <MonitorPlay className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" /> {course.meetingPlatform}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Masa Akses
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    {course.accessDuration}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sisa Kuota
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                    <UsersRound className="h-3.5 w-3.5" aria-hidden="true" /> {course.availableSeats} Kursi
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <h2 className="text-base font-bold text-slate-900">Tentang Program Pembelajaran</h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 whitespace-pre-line">
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
                    Fasilitas Pembelajaran
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

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900">
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
                        <BadgeCheck className="h-3 w-3" aria-hidden="true" /> Terverifikasi Kampus
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
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
                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-center">
                    <p className="text-xs font-bold text-emerald-800">
                      <CircleCheck className="mr-1 inline h-4 w-4" aria-hidden="true" /> Kamu Sudah Terdaftar!
                    </p>
                    <p className="mt-1 text-[11px] text-emerald-600">
                      Semua tautan pembelajaran dapat diakses melalui Dashboard Peserta.
                    </p>
                  </div>
                  <Link
                    href="/kelas-saya"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all hover:scale-[1.02]"
                  >
                    Lihat di Kelas Saya <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all hover:scale-[1.02]"
                >
                  Daftar Kelas <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}

              <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 text-xs text-slate-600">
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
                  <span className="text-slate-400">Sisa Kuota:</span>
                  <span className="font-bold text-blue-600">{course.availableSeats} Mahasiswa</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-3 text-[11px] text-slate-500 text-center">
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Jaminan Bimbingan Berintegritas &amp; Sesuai Silabus Ujian
              </div>
            </div>
          </div>

        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Masuk untuk Mendaftar</h3>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Lock className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                Kamu perlu masuk terlebih dahulu untuk mendaftar kelas <b>{course.title}</b>.
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Masuk Cepat (Akun Mahasiswa BINUS)
              </button>
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Halaman Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Registrasi
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Konfirmasi Pendaftaran Kelas</h3>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleConfirmRegistration} className="mt-4 space-y-3.5">
              <div className="rounded-2xl bg-slate-50 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mata Kuliah</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{course.title}</p>
                <p className="text-[11px] text-blue-600 font-semibold">{course.university} • {majorName}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Mahasiswa</label>
                <input
                  type="text"
                  defaultValue={user.fullName}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Mahasiswa</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-[11px] text-blue-800">
                Setelah pendaftaran dikonfirmasi, tautan sesi live dan seluruh materi belajar akan otomatis tersedia di menu <b>Kelas Saya</b>.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
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
