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
import { slugify } from "@/src/lib/slug";

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
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-[4px] bg-[#20232B] border border-[#D9DEE7] px-4 py-3 text-xs font-semibold text-white animate-in fade-in slide-in-from-top-4 duration-200">
          <CircleCheck className="h-4 w-4 text-[#2457C5]" aria-hidden="true" />
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

      <div className="border-b border-[#D9DEE7] bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center gap-2 px-4 sm:px-6 lg:px-8 py-3.5 text-xs text-[#626B78]">
          <Link href="/cari-kelas" className="flex items-center gap-1 font-medium text-[#2457C5] hover:underline">
            <Search className="h-3.5 w-3.5" aria-hidden="true" /> Katalog Kelas
          </Link>
          <span className="text-[#D9DEE7]">/</span>
          <span className="text-[#626B78]">{categoryName}</span>
          <span className="text-[#D9DEE7]">/</span>
          <span className="text-[#626B78]">{majorName}</span>
          <span className="text-[#D9DEE7]">/</span>
          <span className="font-semibold text-[#20232B] truncate max-w-xs">{course.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div className="lg:col-span-2 space-y-6">

            <div className="nx-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2.5 py-1 text-[11px] font-semibold text-[#2457C5] uppercase tracking-wide">
                  <Layers className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> {categoryName}
                </span>
                <span className="rounded-[4px] border border-[#D9DEE7] bg-white px-2.5 py-1 text-[11px] font-medium text-[#20232B]">
                  <GraduationCap className="mr-1 inline h-3.5 w-3.5 text-[#626B78]" aria-hidden="true" /> {majorName}
                </span>
                {isBootcamp ? (
                  <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2.5 py-1 text-[11px] font-medium text-[#20232B]">
                    <Rocket className="mr-1 inline h-3.5 w-3.5 text-[#2457C5]" aria-hidden="true" /> Bootcamp
                  </span>
                ) : (
                  <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2.5 py-1 text-[11px] font-medium text-[#20232B]">
                    <Handshake className="mr-1 inline h-3.5 w-3.5 text-[#2457C5]" aria-hidden="true" /> Peer-Tutoring
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-2xl sm:text-3xl font-semibold text-[#20232B] leading-snug">
                {course.title}
              </h1>
              <p className="mt-2.5 text-sm text-[#626B78] leading-relaxed">
                {course.shortDescription}
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78]">
                    Jadwal
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#20232B]">
                    <CalendarDays className="h-3.5 w-3.5 text-[#626B78]" aria-hidden="true" /> {course.scheduleDate}
                  </div>
                </div>

                <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78]">
                    Sesi Tatap Muka
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#20232B]">
                    <MonitorPlay className="h-3.5 w-3.5 text-[#626B78]" aria-hidden="true" /> {course.meetingPlatform}
                  </div>
                </div>

                <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78]">
                    Masa Akses
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#20232B]">
                    {course.accessDuration}
                  </div>
                </div>

                <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78]">
                    Sisa Kuota
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#2457C5]">
                    <UsersRound className="h-3.5 w-3.5" aria-hidden="true" /> {course.availableSeats} Kursi
                  </div>
                </div>
              </div>
            </div>

            <div className="nx-card p-6 sm:p-8">
              <h2 className="text-base font-semibold text-[#20232B]">Tentang Program Pembelajaran</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#626B78] whitespace-pre-line">
                {course.fullDescription}
              </p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#20232B]">
                    Syarat &amp; Prasyarat
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {course.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#626B78]">
                        <span className="text-[#2457C5] font-semibold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#20232B]">
                    Fasilitas Pembelajaran
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {course.facilities.map((fac, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#20232B] font-medium">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2457C5]" aria-hidden="true" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="nx-card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 border-b border-[#D9DEE7] pb-3">
                <h2 className="text-base font-semibold text-[#20232B]">
                  {isBootcamp ? `Tim Pengajar (${course.tutors.length} Tutor)` : "Profil Tutor Mahasiswa"}
                </h2>
                <Link
                  href={isBootcamp ? `/organizers/${slugify(course.organizerName)}` : `/tutors/${slugify(course.tutors[0]?.name || course.organizerName)}`}
                  className="text-xs text-[#2457C5] font-medium hover:underline"
                >
                  Diselenggarakan oleh {course.organizerName}
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {course.tutors.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tutors/${slugify(t.name)}`}
                    className="group/tutor flex items-center gap-3.5 rounded-[4px] border border-[#D9DEE7] bg-white p-3.5 hover:border-[#2457C5] transition-all"
                  >
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[4px] border border-[#D9DEE7]">
                      <Image
                        src={t.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"}
                        alt={t.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#20232B] group-hover/tutor:text-[#2457C5] transition-colors truncate">{t.name}</h3>
                      <p className="text-xs text-[#626B78] truncate">{t.role}</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[#2457C5]">
                        <BadgeCheck className="h-3 w-3" aria-hidden="true" /> Mahasiswa Terverifikasi
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="nx-card p-6">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#626B78]">
                Biaya Pendaftaran
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                {isFree ? (
                  <span className="text-2xl font-bold text-emerald-700">GRATIS</span>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-[#20232B]">
                      Rp {course.priceAmount?.toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs text-[#626B78]">/ semester</span>
                  </>
                )}
              </div>

              {isRegistered ? (
                <div className="mt-6 space-y-3">
                  <div className="rounded-[4px] border border-emerald-200 bg-emerald-50/60 p-3 text-center">
                    <p className="text-xs font-semibold text-emerald-800">
                      <CircleCheck className="mr-1 inline h-4 w-4" aria-hidden="true" /> Kamu Sudah Terdaftar
                    </p>
                    <p className="mt-1 text-[11px] text-emerald-700">
                      Tautan pembelajaran dapat diakses melalui Dashboard Peserta.
                    </p>
                  </div>
                  <Link
                    href="/kelas-saya"
                    className="btn-primary w-full"
                  >
                    Lihat di Kelas Saya <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="btn-primary w-full mt-6"
                >
                  Daftar Kelas <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}

              <div className="mt-6 space-y-2.5 border-t border-[#D9DEE7] pt-5 text-xs text-[#626B78]">
                <div className="flex items-center justify-between">
                  <span className="text-[#626B78]">Penyelenggara:</span>
                  <Link
                    href={isBootcamp ? `/organizers/${slugify(course.organizerName)}` : `/tutors/${slugify(course.tutors[0]?.name || course.organizerName)}`}
                    className="font-semibold text-[#20232B] hover:text-[#2457C5] transition-colors"
                  >
                    {course.organizerName}
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#626B78]">Universitas:</span>
                  <span className="font-semibold text-[#20232B]">{course.university}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#626B78]">Format:</span>
                  <span className="font-semibold text-[#20232B]">Online ({course.meetingPlatform})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#626B78]">Sisa Kuota:</span>
                  <span className="font-semibold text-[#2457C5]">{course.availableSeats} Mahasiswa</span>
                </div>
              </div>

              <div className="mt-6 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/40 p-3 text-[11px] text-[#626B78] text-center">
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-[#2457C5]" aria-hidden="true" /> Bimbingan Terarah Sesuai Silabus Ujian
              </div>
            </div>
          </div>

        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-3">
              <h3 className="text-sm font-semibold text-[#20232B]">Masuk untuk Mendaftar</h3>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-[#626B78] hover:text-[#20232B]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[4px] bg-[#E5E9F0] text-[#2457C5]">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-3 text-xs text-[#626B78] leading-relaxed">
                Kamu perlu masuk terlebih dahulu untuk mendaftar kelas <b>{course.title}</b>.
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={handleGuestLogin}
                className="btn-primary w-full"
              >
                Masuk Cepat (Akun Mahasiswa BINUS)
              </button>
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="btn-secondary flex-1 text-center"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-secondary flex-1 text-center"
                >
                  Registrasi
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-3">
              <h3 className="text-sm font-semibold text-[#20232B]">Konfirmasi Pendaftaran Kelas</h3>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-[#626B78] hover:text-[#20232B]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleConfirmRegistration} className="mt-4 space-y-3.5">
              <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78]">Mata Kuliah</p>
                <p className="text-sm font-semibold text-[#20232B] mt-0.5">{course.title}</p>
                <p className="text-xs text-[#2457C5] font-medium">{course.university} • {majorName}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#20232B] block mb-1">Nama Mahasiswa</label>
                <input
                  type="text"
                  defaultValue={user.fullName}
                  required
                  className="nx-input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#20232B] block mb-1">Email Mahasiswa</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  required
                  className="nx-input text-xs"
                />
              </div>

              <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/40 p-3 text-[11px] text-[#20232B]">
                Setelah pendaftaran dikonfirmasi, tautan sesi live dan materi belajar akan otomatis tersedia di menu <b>Kelas Saya</b>.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="btn-secondary flex-1"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
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
