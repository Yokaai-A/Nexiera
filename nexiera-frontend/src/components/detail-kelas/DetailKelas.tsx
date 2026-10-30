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
  MonitorPlay,
  Rocket,
  ShieldCheck,
  ShieldAlert,
  Star,
  UsersRound,
  X,
  MessageSquare,
  Send,
} from "lucide-react";
import { AcademicCourse } from "@/src/types/course";
import { nexieraApi, type ReviewsData } from "@/src/lib/api";
import { useUserStore } from "@/src/store/useUserStore";
import { ReportModal } from "@/src/components/class/ReportModal";

export function DetailKelas() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const user = useUserStore();

  const [course, setCourse] = useState<AcademicCourse | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileCompletionModal, setShowProfileCompletionModal] = useState(false);
  const [profileCampus, setProfileCampus] = useState("");
  const [profileMajor, setProfileMajor] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);


  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessNotice, setReviewSuccessNotice] = useState<string | null>(null);
  const [reviewErrorNotice, setReviewErrorNotice] = useState<string | null>(null);

  const loadReviews = async (id: string) => {
    try {
      const data = await nexieraApi.reviews(id);
      setReviewsData(data);
    } catch {
      setReviewsData({ averageRating: 0, totalReviews: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, reviews: [] });
    }
  };

  useEffect(() => {
    let active = true;

    if (courseId) {
      nexieraApi
        .classById(courseId)
        .then(async (apiClass) => {
          if (!active) return;
          const organizer = apiClass.organizerName || apiClass.creator?.name || apiClass.tutor?.name || "";
          const converted: AcademicCourse = {
            id: apiClass.id,
            title: apiClass.title,
            mainCategory: apiClass.category || apiClass.mainCategory || "",
            major: apiClass.major || "",
            university: apiClass.campusTarget || apiClass.university || "",
            shortDescription: apiClass.shortDescription || "",
            fullDescription: apiClass.description || "",
            type: apiClass.type || apiClass.courseType || "PEER_TUTORING",
            pricingModel: Number(apiClass.price) === 0 ? "FREE" : "PAID",
            priceAmount: Number(apiClass.price),
            organizerName: organizer,
            organizerLogo: apiClass.organizerLogo || undefined,
            tutors: (apiClass.tutors && apiClass.tutors.length > 0)
              ? apiClass.tutors.map((t) => ({
                  id: t.id,
                  name: t.name,
                  role: t.roleTitle || "",
                  avatarUrl: t.avatarUrl || "",
                }))
              : (apiClass.creator || apiClass.tutor) ? [
                  {
                    id: apiClass.creator?.id || apiClass.tutor?.id || "",
                    name: apiClass.creator?.name || apiClass.tutor?.name || "",
                    role: apiClass.creator?.headline || "",
                    avatarUrl: apiClass.creator?.avatarUrl || apiClass.tutor?.avatarUrl || "",
                  },
                ] : [],
            meetingPlatform: (apiClass.meetingPlatform as any) || "",
            meetingUrl: apiClass.meetingLink || apiClass.meetingUrl || "",
            materialPlatform: (apiClass.materialPlatform as any) || undefined,
            materialUrl: apiClass.materialLink || apiClass.materialUrl || undefined,
            recordingUrl: apiClass.recordingLink || apiClass.recordingUrl || undefined,
            scheduleDate: apiClass.startsAt
              ? new Intl.DateTimeFormat("id-ID", { dateStyle: "full", timeStyle: "short" }).format(
                  new Date(apiClass.startsAt),
                )
              : "",
            accessDuration: apiClass.accessDuration || "",
            accessUntil: apiClass.accessUntil || "",
            maxQuota: apiClass.maxQuota ?? undefined,
            availableSeats: apiClass.availableSeats ?? apiClass.maxQuota ?? null,
            requirements: apiClass.requirements || [],
            facilities: apiClass.facilities || [],
            createdAt: apiClass.createdAt || "",
          };
          setCourse(converted);


          if (user.isLoggedIn) {
            try {
              const myClasses = await nexieraApi.myClasses();
              const enrolledList = Array.isArray(myClasses) ? myClasses : (myClasses.enrolled || []);
              const enrolled = enrolledList.find((c: any) => c.id === apiClass.id || c.slug === apiClass.id);
              if (enrolled && active) {
                setIsRegistered(true);
                if (enrolled.meetingLink || enrolled.meetingUrl) {
                  converted.meetingUrl = enrolled.meetingLink || enrolled.meetingUrl;
                  setCourse({ ...converted });
                }
              }
            } catch {}
          }


          void loadReviews(apiClass.id);
        })
        .catch(() => {
          if (!active) return;
          setCourse(null);
        });
    }
    return () => {
      active = false;
    };
  }, [courseId, user.isLoggedIn]);

  const handleCtaClick = () => {
    if (!user.isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (!user.university?.trim() || !user.major?.trim()) {
      setProfileCampus(user.university || user.campus || "");
      setProfileMajor(user.major || "");
      setProfileSaveError("");
      setShowProfileCompletionModal(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleCompleteStudentProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProfile(true);
    setProfileSaveError("");
    try {
      await user.updateUser({ university: profileCampus.trim(), major: profileMajor.trim() });
      setShowProfileCompletionModal(false);
      setShowConfirmModal(true);
    } catch (cause) {
      setProfileSaveError(cause instanceof Error ? cause.message : "Profil gagal disimpan. Silakan coba lagi.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleConfirmRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    try {

      const res = await nexieraApi.checkout(course.id);
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
      } else if (res.status === "PAID") {
        setIsRegistered(true);
        setShowConfirmModal(false);
        setToastMessage(`Pendaftaran berhasil! Selamat bergabung di kelas ${course.title}.`);
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        setShowConfirmModal(false);
        setToastMessage(res.status === "FAILED"
          ? "Checkout gagal dibuat. Pembayaran belum diterima dan akses kelas belum dibuka. Silakan coba lagi."
          : "Transaksi masih menunggu konfirmasi pembayaran. Akses kelas akan terbuka setelah pembayaran terverifikasi.");
        setTimeout(() => setToastMessage(null), 6000);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Pendaftaran gagal.");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    try {
      setIsSubmittingReview(true);
      setReviewErrorNotice(null);
      await nexieraApi.createReview(course.id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccessNotice("Ulasan Anda berhasil dikirim! Terima kasih atas penilaian Anda.");
      setReviewComment("");
      await loadReviews(course.id);
      setTimeout(() => setReviewSuccessNotice(null), 4000);
    } catch (err) {
      setReviewErrorNotice(err instanceof Error ? err.message : "Gagal mengirim ulasan.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!course) {
    return (
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-xl font-bold text-[#20232B] dark:text-[#F3F4F6]">Kelas Tidak Ditemukan</h1>
        <p className="mt-2 text-sm text-[#626B78] dark:text-[#B1B7C3]">
          Mata kuliah atau kelas bimbingan yang kamu cari mungkin telah berakhir atau dinonaktifkan.
        </p>
        <Link href="/cari-kelas" className="btn-primary mt-6 inline-flex">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const isBootcamp = course.type === "BOOTCAMP";
  const isFree = course.pricingModel === "FREE";
  const isSoldOut = course.availableSeats != null && course.availableSeats <= 0;
  const categoryName = course.mainCategory;
  const majorName = course.major;

  const totalReviews = reviewsData?.totalReviews ?? 0;
  const averageRating = reviewsData?.averageRating ?? 0;
  const distribution = reviewsData?.distribution ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const reviewsList = reviewsData?.reviews ?? [];

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-[#111318] min-h-screen">
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 rounded-[4px] border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 shadow-lg dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          {toastMessage}
        </div>
      )}

      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          <div className="lg:col-span-2 space-y-4">

            <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-[11px] font-semibold text-[#2457C5] uppercase tracking-wide dark:border-[#343945] dark:bg-[#20242D] dark:text-[#78A0FF]">
                  <Layers className="mr-1 inline h-3 w-3" /> {categoryName}
                </span>
                <span className="rounded-[4px] border border-[#D9DEE7] bg-white px-2 py-0.5 text-[11px] font-medium text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]">
                  <GraduationCap className="mr-1 inline h-3 w-3 text-[#626B78] dark:text-[#B1B7C3]" /> {majorName}
                </span>
                {isBootcamp ? (
                  <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-[11px] font-medium text-[#20232B] dark:border-[#343945] dark:bg-[#20242D] dark:text-[#F3F4F6]">
                    <Rocket className="mr-1 inline h-3 w-3 text-[#2457C5] dark:text-[#78A0FF]" /> Bootcamp
                  </span>
                ) : (
                  <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-[11px] font-medium text-[#20232B] dark:border-[#343945] dark:bg-[#20242D] dark:text-[#F3F4F6]">
                    <Handshake className="mr-1 inline h-3 w-3 text-[#2457C5] dark:text-[#78A0FF]" /> Peer-Tutoring
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-xl font-bold text-[#20232B] dark:text-[#F3F4F6] leading-snug">
                {course.title}
              </h1>
              <p className="mt-2 text-xs text-[#626B78] dark:text-[#B1B7C3] leading-relaxed">
                {course.shortDescription}
              </p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 p-2.5 dark:border-[#343945] dark:bg-[#111318]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3]">Jadwal</div>
                  <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    <CalendarDays className="h-3.5 w-3.5 text-[#626B78] dark:text-[#B1B7C3]" /> {course.scheduleDate || "Jadwal belum ditentukan"}
                  </div>
                </div>

                <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 p-2.5 dark:border-[#343945] dark:bg-[#111318]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3]">Sesi Tatap Muka</div>
                  <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    <MonitorPlay className="h-3.5 w-3.5 text-[#626B78] dark:text-[#B1B7C3]" /> {course.meetingPlatform || "Belum ditentukan"}
                  </div>
                </div>

                <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 p-2.5 dark:border-[#343945] dark:bg-[#111318]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3]">Akses sampai</div>
                  <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    {course.accessUntil
                      ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(course.accessUntil))
                      : course.accessDuration || "Belum ditentukan"}
                  </div>
                </div>

                <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 p-2.5 dark:border-[#343945] dark:bg-[#111318]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3]">Sisa Kuota</div>
                  <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#2457C5] dark:text-[#78A0FF]">
                    <UsersRound className="h-3.5 w-3.5" /> {course.availableSeats ?? "—"} Kursi
                  </div>
                </div>
              </div>
            </div>


            <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
              <h2 className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">Tentang Program Pembelajaran</h2>
              <p className="mt-2 text-xs leading-relaxed text-[#626B78] dark:text-[#B1B7C3] whitespace-pre-line">
                {course.fullDescription}
              </p>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#20232B] dark:text-[#F3F4F6]">
                    Syarat &amp; Prasyarat
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {(course.requirements || []).map((req, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                        <span className="text-[#2457C5] dark:text-[#78A0FF] font-semibold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#20232B] dark:text-[#F3F4F6]">
                    Fasilitas Pembelajaran
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {(course.facilities || []).map((fac, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-[#20232B] dark:text-[#F3F4F6] font-medium">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2457C5] dark:text-[#78A0FF]" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>


            <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
              <div className="flex items-center justify-between mb-3 border-b border-[#D9DEE7] pb-2.5 dark:border-[#343945]">
                <h2 className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                  {isBootcamp ? `Tim Pengajar (${(course.tutors || []).length} Pengajar)` : "Profil Tutor Mahasiswa"}
                </h2>
                <span className="text-xs text-[#2457C5] dark:text-[#78A0FF] font-medium">
                  {course.organizerName}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {(course.tutors || []).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 rounded-[4px] border border-[#D9DEE7] bg-white p-3 dark:border-[#343945] dark:bg-[#111318]">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#D9DEE7] dark:border-[#343945]">
                      {t.avatarUrl ? <img src={t.avatarUrl} alt={t.name} className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center bg-[#E5E9F0] text-xs font-semibold text-[#2457C5]">{t.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6] truncate">{t.name}</h3>
                      <p className="text-[11px] text-[#626B78] dark:text-[#B1B7C3] truncate">{t.role}</p>
                      <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-[#2457C5] dark:text-[#78A0FF]">
                        <BadgeCheck className="h-3 w-3" /> Mahasiswa Terverifikasi
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
              <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-3 dark:border-[#343945]">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <h2 className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    Ulasan &amp; Penilaian Peserta ({totalReviews})
                  </h2>
                </div>
              </div>


              {totalReviews > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-6 rounded-[4px] border border-[#D9DEE7] bg-[#FAFAFA] p-4 dark:border-[#343945] dark:bg-[#111318]">
                  <div className="text-center sm:text-left shrink-0">
                    <p className="text-3xl font-extrabold text-[#20232B] dark:text-[#F3F4F6]">
                      {averageRating.toFixed(1)}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-1 my-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(averageRating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
                      Berdasarkan {totalReviews} ulasan
                    </p>
                  </div>

                  <div className="flex-1 w-full space-y-1.5 border-t sm:border-t-0 sm:border-l border-[#D9DEE7] sm:pl-6 pt-3 sm:pt-0 dark:border-[#343945]">
                    {[5, 4, 3, 2, 1].map((ratingNum) => {
                      const count = distribution[ratingNum] || 0;
                      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                      return (
                        <div key={ratingNum} className="flex items-center gap-2 text-xs">
                          <span className="w-4 font-semibold text-[#20232B] dark:text-[#F3F4F6]">{ratingNum}★</span>
                          <div className="h-2 flex-1 rounded-full bg-[#E5E9F0] dark:bg-[#20242D] overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}


              {isRegistered && (
                <form onSubmit={handleSubmitReview} className="mt-4 rounded-[4px] border border-[#2457C5]/30 bg-[#2457C5]/5 p-4 dark:border-[#78A0FF]/30 dark:bg-[#2457C5]/10 space-y-3">
                  <h3 className="text-xs font-semibold text-[#2457C5] dark:text-[#78A0FF] uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" /> Berikan Ulasan Anda Sebagai Peserta
                  </h3>

                  {reviewSuccessNotice && (
                    <p className="rounded-[4px] bg-emerald-100 p-2 text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                      {reviewSuccessNotice}
                    </p>
                  )}

                  {reviewErrorNotice && (
                    <p className="rounded-[4px] bg-red-100 p-2 text-xs text-red-800 dark:bg-red-950 dark:text-red-200">
                      {reviewErrorNotice}
                    </p>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#20232B] dark:text-[#F3F4F6] mb-1">
                      Pilih Rating:
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= reviewRating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-1">
                        {reviewRating} dari 5 Bintang
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#20232B] dark:text-[#F3F4F6] mb-1">
                      Komentar / Pengalaman Belajar:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Bagikan pengalaman Anda mengenai kualitas bimbingan, kejelasan materi, atau interaksi dengan pengajar..."
                      className="w-full rounded-[4px] border border-[#D9DEE7] bg-white p-2 text-xs text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2457C5] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSubmittingReview ? "Mengirim..." : "Kirim Ulasan"}</span>
                  </button>
                </form>
              )}


              <div className="mt-4 divide-y divide-[#D9DEE7] dark:divide-[#343945]">
                {totalReviews === 0 ? (
                  <div className="rounded-[4px] border border-dashed border-[#D9DEE7] p-8 text-center dark:border-[#343945]">
                    <p className="text-xs font-medium text-[#626B78] dark:text-[#B1B7C3]">
                      Belum ada ulasan untuk kelas ini. Jadilah peserta pertama yang memberikan ulasan!
                    </p>
                  </div>
                ) : (
                  reviewsList.map((rev) => (
                    <div key={rev.id} className="py-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-[#E5E9F0] flex items-center justify-center text-[10px] font-bold text-[#20232B] dark:bg-slate-800 dark:text-[#F3F4F6]">
                            {rev.user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                              {rev.user.name}
                            </p>
                            {rev.user.campus && (
                              <p className="text-[10px] text-[#626B78] dark:text-[#B1B7C3]">
                                {rev.user.campus}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= rev.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300 dark:text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {rev.comment && (
                        <p className="text-xs text-[#626B78] dark:text-[#B1B7C3] leading-relaxed pl-8">
                          {rev.comment}
                        </p>
                      )}

                      {rev.reply && (
                        <div className="ml-8 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/45 p-3 dark:border-[#343945] dark:bg-slate-800/50">
                          <p className="text-[10px] font-semibold text-[#2457C5] dark:text-blue-300">
                            Balasan pengajar
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-[#414854] dark:text-[#D1D5DB]">
                            {rev.reply}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>


          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3]">
                Biaya Pendaftaran
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                {isFree ? (
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">GRATIS</span>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
                      Rp {course.priceAmount?.toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs text-[#626B78] dark:text-[#B1B7C3]">per peserta</span>
                  </>
                )}
              </div>

              {isRegistered ? (
                <div className="mt-4 space-y-2.5">
                  <div className="rounded-[4px] border border-emerald-200 bg-emerald-50/70 p-2.5 text-center dark:border-emerald-900/60 dark:bg-emerald-950/40">
                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      <CircleCheck className="mr-1 inline h-3.5 w-3.5" /> Kamu Sudah Terdaftar
                    </p>
                    <p className="mt-0.5 text-[11px] text-emerald-700 dark:text-emerald-400">
                      Tautan sesi dan materi dapat diakses di Kelas Saya.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/kelas-saya"
                    className="flex w-full items-center justify-center gap-1.5 rounded-[4px] bg-[#2457C5] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors"
                  >
                    <span>Lihat di Kelas Saya</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCtaClick}
                  disabled={isSoldOut}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-[4px] bg-[#2457C5] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors shadow-sm disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  <span>{isSoldOut ? "Kuota Penuh" : "Daftar Kelas"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}

              <div className="mt-4 space-y-2 border-t border-[#D9DEE7] pt-3 text-xs text-[#626B78] dark:border-[#343945] dark:text-[#B1B7C3]">
                <div className="flex items-center justify-between">
                  <span>Penyelenggara:</span>
                  <span className="font-semibold text-[#20232B] dark:text-[#F3F4F6]">{course.organizerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Kampus:</span>
                  <span className="font-semibold text-[#20232B] dark:text-[#F3F4F6]">{course.university}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sisa Kuota:</span>
                  <span className="font-semibold text-[#2457C5] dark:text-[#78A0FF]">{course.availableSeats ?? "—"} Mahasiswa</span>
                </div>
              </div>

              <div className="mt-4 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/40 p-2.5 text-[11px] text-[#626B78] dark:border-[#343945] dark:bg-[#111318] dark:text-[#B1B7C3] text-center">
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-[#2457C5] dark:text-[#78A0FF]" /> Bimbingan Terarah Sesuai Kurikulum Akademik
              </div>

              <div className="mt-4 border-t border-[#D9DEE7] pt-3 dark:border-[#343945]">
                <p className="mb-2 text-[11px] text-[#626B78] dark:text-[#B1B7C3]">Menemukan informasi kelas atau tutor yang perlu ditinjau?</p>
                <button
                  type="button"
                  onClick={() => setReportOpen(true)}
                  className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs font-semibold text-[#626B78] transition-colors hover:border-[#D94B4B] hover:bg-red-50/70 hover:text-[#B42318] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457C5] dark:border-[#343945] dark:bg-[#191C23] dark:text-[#B1B7C3] dark:hover:border-red-800 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                >
                  <ShieldAlert className="h-4 w-4 text-[#8B93A1] transition-colors group-hover:text-[#B42318] dark:group-hover:text-red-300" />
                  Laporkan Kelas / Tutor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} targetType="class" targetId={course.id} targetTitle={course.title} tutorId={course.tutors?.[0]?.id} tutorName={course.tutors?.[0]?.name} />


      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
            <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-2.5 dark:border-[#343945]">
              <h3 className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">Masuk untuk Mendaftar</h3>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-[#626B78] hover:text-[#20232B] dark:text-[#B1B7C3] dark:hover:text-[#F3F4F6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#E5E9F0] text-[#2457C5] dark:bg-[#20242D] dark:text-[#78A0FF]">
                <Lock className="h-4 w-4" />
              </div>
              <p className="mt-2 text-xs text-[#626B78] dark:text-[#B1B7C3] leading-relaxed">
                Kamu perlu masuk terlebih dahulu untuk mendaftar kelas <b>{course.title}</b>.
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href={`/login?redirect=${encodeURIComponent(`/detail-kelas?id=${course.id}`)}`}
                className="flex-1 rounded-[4px] bg-[#2457C5] px-3 py-1.5 text-center text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors"
              >
                Masuk (Login)
              </Link>
              <Link
                href="/register"
                className="flex-1 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-1.5 text-center text-xs font-semibold text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6] dark:hover:bg-[#20242D] transition-colors"
              >
                Daftar Akun
              </Link>
            </div>
          </div>
        </div>
      )}


      {showProfileCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleCompleteStudentProfile} className="w-full max-w-md rounded-[6px] border border-[#D9DEE7] bg-white p-5 shadow-lg dark:border-[#343945] dark:bg-[#191C23]">
            <div className="flex items-start justify-between gap-4 border-b border-[#D9DEE7] pb-3 dark:border-[#343945]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#2457C5] dark:text-[#78A0FF]">Lengkapi Profil Akademik</p>
                <h2 className="mt-1 text-sm font-bold text-[#20232B] dark:text-[#F3F4F6]">Sebelum mendaftar kelas</h2>
              </div>
              <button type="button" onClick={() => setShowProfileCompletionModal(false)} aria-label="Tutup" className="text-[#626B78] hover:text-[#20232B] dark:text-[#B1B7C3] dark:hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#626B78] dark:text-[#B1B7C3]">Lengkapi kampus dan program studi di profil utama Anda. Data akan tersimpan di profil dan digunakan untuk pendaftaran kelas.</p>
            <label className="mt-4 block text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              Kampus / Universitas *
              <input required maxLength={191} value={profileCampus} onChange={(event) => setProfileCampus(event.target.value)} placeholder="Contoh: BINUS University" className="nx-input mt-1 w-full" />
            </label>
            <label className="mt-3 block text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              Program Studi / Jurusan *
              <input required maxLength={191} value={profileMajor} onChange={(event) => setProfileMajor(event.target.value)} placeholder="Contoh: Teknik Informatika" className="nx-input mt-1 w-full" />
            </label>
            {profileSaveError && <p role="alert" className="mt-3 rounded-[4px] border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">{profileSaveError}</p>}
            <div className="mt-5 flex gap-2">
              <button type="button" disabled={savingProfile} onClick={() => setShowProfileCompletionModal(false)} className="btn-secondary flex-1">Nanti</button>
              <button type="submit" disabled={savingProfile || !profileCampus.trim() || !profileMajor.trim()} className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50">{savingProfile ? "Menyimpan..." : "Simpan & Lanjut Daftar"}</button>
            </div>
          </form>
        </div>
      )}


      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
            <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-2.5 dark:border-[#343945]">
              <h3 className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">Konfirmasi Pendaftaran Kelas</h3>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-[#626B78] hover:text-[#20232B] dark:text-[#B1B7C3] dark:hover:text-[#F3F4F6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRegistration} className="mt-3 space-y-3">
              <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 p-2.5 dark:border-[#343945] dark:bg-[#111318]">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3]">Mata Kuliah</p>
                <p className="text-xs font-bold text-[#20232B] dark:text-[#F3F4F6] mt-0.5">{course.title}</p>
                <p className="text-[11px] text-[#2457C5] dark:text-[#78A0FF] font-medium">{course.university} • {majorName}</p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#20232B] dark:text-[#F3F4F6] block mb-1">Nama Mahasiswa</label>
                <input
                  type="text"
                  value={user.fullName || user.name}
                  required
                  readOnly
                  className="w-full rounded-[4px] border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#20232B] dark:text-[#F3F4F6] block mb-1">Email Mahasiswa</label>
                <input
                  type="email"
                  value={user.email}
                  required
                  readOnly
                  className="w-full rounded-[4px] border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
                />
              </div>

              <p className="text-[10px] leading-relaxed text-[#626B78] dark:text-[#B1B7C3]">
                Nama dan email mengikuti akun yang sedang login dan tidak dapat diubah di sini.
              </p>

              <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/40 p-2.5 text-[11px] text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]">
                Setelah pendaftaran dikonfirmasi, tautan sesi live dan materi belajar akan langsung tersedia di menu <b>Kelas Saya</b>.
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 rounded-[4px] border border-[#D9DEE7] px-3 py-1.5 text-xs font-semibold text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:text-[#F3F4F6] dark:hover:bg-[#20242D] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-[4px] bg-[#2457C5] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors shadow-sm"
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
