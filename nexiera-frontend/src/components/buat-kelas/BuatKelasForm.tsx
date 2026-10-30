"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpenText,
  Check,
  CircleCheck,
  CreditCard,
  Handshake,
  MonitorPlay,
  Rocket,
  Video,
  X,
} from "lucide-react";
import { getPublicUploadUrl, nexieraApi } from "@/src/lib/api";
import { UNIVERSITY_COURSES } from "@/src/lib/universityCourses";
import { CATEGORIES_DATA } from "@/src/lib/taxonomy";
import { CourseType, MaterialPlatform, MeetingPlatform, PricingModel, Tutor } from "@/src/types/course";

const UNIVERSITY_OPTIONS = [
  "BINUS University",
  "Universitas Indonesia",
  "Universitas Gadjah Mada",
  "Institut Teknologi Bandung",
  "Institut Teknologi Sepuluh Nopember",
  "IPB University",
  "Universitas Padjadjaran",
  "Universitas Brawijaya",
  "Universitas Airlangga",
  "Universitas Diponegoro",
  "Universitas Sebelas Maret",
  "Telkom University",
  "Universitas Hasanuddin",
  "Universitas Negeri Yogyakarta",
  "Universitas Negeri Jakarta",
  "Universitas Multimedia Nusantara",
];
const ALL_MAJORS = Array.from(new Set(Object.values(CATEGORIES_DATA).flatMap((majors) => Object.keys(majors)))).sort((a, b) => a.localeCompare(b, "id"));

function SectionTitle({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-[#2457C5] text-xs font-semibold text-white">
        {num}
      </span>
      <h2 className="text-base font-semibold text-[#20232B]">{label}</h2>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex min-h-8 items-start justify-between gap-2">
        <label className="text-xs font-semibold text-[#20232B]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint && <span className="text-[11px] text-[#626B78]">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-[4px] border border-[#D9DEE7] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#20232B] placeholder:text-[#626B78] outline-none transition-colors focus:border-[#2457C5]";

import { useUserStore } from "@/src/store/useUserStore";

export function BuatKelasForm() {
  const router = useRouter();
  const user = useUserStore();

  const isBootcampUser =
    user.activeRole === "bootcamp" ||
    user.activeRole === "bootcamp_partner" ||
    user.activeViewRole === "bootcamp_partner";
  const isTutorUser =
    user.activeRole === "tutor" || user.activeViewRole === "tutor";

  const defaultType: CourseType = isBootcampUser ? "BOOTCAMP" : "PEER_TUTORING";
  const initialCourse = UNIVERSITY_COURSES.find((course) => course.type === defaultType)!;
  const defaultOrgName = isBootcampUser
    ? user.organizationName || user.name || ""
    : user.name || user.fullName || "";

  const [mainCategory, setMainCategory] = useState<string>(initialCourse.category);
  const [major, setMajor] = useState<string>(user.major || initialCourse.major);
  const [title, setTitle] = useState<string>(initialCourse.title);
  const [tutorGrade, setTutorGrade] = useState<"" | "A" | "A_MINUS" | "B_PLUS">("");
  const [university, setUniversity] = useState<string>(user.university || user.campus || initialCourse.campusTarget || "");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  async function handleBannerUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran banner maksimal 5 MB.");
      return;
    }
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Format file banner harus PNG, JPEG, JPG, atau WebP.");
      return;
    }
    setUploadingBanner(true);
    try {
      const res = await nexieraApi.uploadBanner(file);
      setBannerUrl(res.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengunggah banner.");
    } finally {
      setUploadingBanner(false);
    }
  }

  const [type, setType] = useState<CourseType>(defaultType);
  const [pricingModel, setPricingModel] = useState<PricingModel>(initialCourse.price === 0 ? "FREE" : "PAID");
  const [priceAmount, setPriceAmount] = useState<string>(String(initialCourse.price));

  const [requirements, setRequirements] = useState<string[]>([
    "Mahasiswa aktif jurusan terkait",
    "Membawa laptop & software perkuliahan terpasang",
  ]);
  const [newReq, setNewReq] = useState("");

  const [facilities, setFacilities] = useState<string[]>([
    "Catatan Belajar Lengkap",
    "Bank Soal UTS & UAS beserta Solusi",
    "Sesi Diskusi Interaktif",
  ]);
  const [newFac, setNewFac] = useState("");

  const [scheduleDate, setScheduleDate] = useState("");
  const [accessUntil, setAccessUntil] = useState("");
  const [maxQuota, setMaxQuota] = useState(25);

  const [meetingPlatform, setMeetingPlatform] = useState<MeetingPlatform>("ZOOM");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [materialPlatform, setMaterialPlatform] = useState<MaterialPlatform>("NOTION");
  const [materialUrl, setMaterialUrl] = useState("");
  const [recordingUrl, setRecordingUrl] = useState("");

  const [organizerName, setOrganizerName] = useState(defaultOrgName);
  const universityOptions = Array.from(new Set<string>([
    ...UNIVERSITY_OPTIONS,
    ...UNIVERSITY_COURSES.map((course) => course.campusTarget || ""),
    user.university || "",
    user.campus || "",
  ].filter((campus) => campus.length > 0))).sort((a, b) => a.localeCompare(b, "id"));
  const categoryMajors = Object.keys(CATEGORIES_DATA[mainCategory] || {});
  const majorOptions = categoryMajors.length > 0
    ? Array.from(new Set([...categoryMajors, ...(user.major ? [user.major] : []), ...(major ? [major] : [])])).sort((a, b) => a.localeCompare(b, "id"))
    : Array.from(new Set([...ALL_MAJORS, ...(user.major ? [user.major] : [])])).sort((a, b) => a.localeCompare(b, "id"));
  const [tutors, setTutors] = useState<Tutor[]>([
    {
      id: "tutor-main",
      name: user.name || user.fullName || "",
      role: [user.major, user.university || user.campus].filter(Boolean).join(" · "),
      avatarUrl: user.avatarUrl || "",
    },
  ]);
  const initializedUserId = useRef("");

  useEffect(() => {
    if (!user.isLoggedIn || !user.id || initializedUserId.current === user.id) return;
    initializedUserId.current = user.id;
    setOrganizerName(user.organizationName || user.name || user.fullName || "");
    setTutors([{
      id: "tutor-main",
      name: user.name || user.fullName || "",
      role: user.headline || [user.major, user.university || user.campus].filter(Boolean).join(" · "),
      avatarUrl: user.activeRole === "bootcamp_partner"
        ? user.organizationLogoUrl || user.avatarUrl || ""
        : user.avatarUrl || "",
    }]);
  }, [user.isLoggedIn, user.id, user.university, user.campus, user.major, user.name, user.fullName, user.organizationName, user.headline, user.avatarUrl, user.activeRole, user.organizationLogoUrl]);

  useEffect(() => {
    setType(defaultType);
  }, [defaultType]);

  const handleTypeChange = (newType: CourseType) => {
    if (isBootcampUser && newType !== "BOOTCAMP") return;
    if (isTutorUser && newType !== "PEER_TUTORING") return;
    setType(newType);
    if (newType === "BOOTCAMP") {
      setOrganizerName(user.organizationName || user.name || "");
    } else {
      setOrganizerName(user.name || user.fullName || "");
    }
  };

  const handleAddTutor = () => {
    if (type !== "BOOTCAMP") return;
    const newTutor: Tutor = {
      id: `tutor-${Date.now()}`,
      name: "",
      role: [major, university].filter(Boolean).join(" · "),
      avatarUrl: "",
    };
    setTutors([...tutors, newTutor]);
  };

  const handleUpdateTutor = (index: number, field: keyof Tutor, val: string) => {
    const updated = [...tutors];
    updated[index] = { ...updated[index], [field]: val };
    setTutors(updated);
  };

  const handleRemoveTutor = (index: number) => {
    if (tutors.length > 1) {
      setTutors(tutors.filter((_, i) => i !== index));
    }
  };

  const handleAddRequirement = () => {
    if (newReq.trim()) {
      setRequirements([...requirements, newReq.trim()]);
      setNewReq("");
    }
  };

  const handleRemoveRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleAddFacility = () => {
    if (newFac.trim()) {
      setFacilities([...facilities, newFac.trim()]);
      setNewFac("");
    }
  };

  const handleRemoveFacility = (idx: number) => {
    setFacilities(facilities.filter((_, i) => i !== idx));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim()) {
      alert("Mohon lengkapi nama mata kuliah dan deskripsi singkat.");
      return;
    }
    if (!university.trim() || !major.trim() || !mainCategory.trim()) {
      alert("Pilih kategori, jurusan, dan kampus sebelum menerbitkan kelas.");
      return;
    }
    const numericPrice = Number(priceAmount);
    if (pricingModel === "PAID" && (!priceAmount || !Number.isFinite(numericPrice) || numericPrice <= 0)) {
      alert("Masukkan biaya yang lebih besar dari Rp0 atau pilih Gratis.");
      return;
    }
    if (!Number.isInteger(maxQuota) || maxQuota < 1 || maxQuota > 200) {
      alert("Kuota harus antara 1 sampai 200 peserta.");
      return;
    }
    if (type === "PEER_TUTORING" && !tutorGrade) {
      alert("Pilih nilai yang pernah Anda peroleh untuk mata kuliah ini.");
      return;
    }
    if (!meetingUrl.trim()) {
      alert("Mohon sertakan Link Sesi Live.");
      return;
    }
    if (!bannerUrl) {
      alert("Unggah banner sampul untuk kartu mata kuliah.");
      return;
    }
    const scheduledAt = new Date(scheduleDate);
    if (!scheduleDate || !Number.isFinite(scheduledAt.getTime()) || scheduledAt <= new Date()) {
      alert("Pilih tanggal dan waktu pelaksanaan yang akan datang.");
      return;
    }
    const accessUntilDate = accessUntil ? new Date(`${accessUntil}T23:59:59.999`) : null;
    if (!accessUntilDate || !Number.isFinite(accessUntilDate.getTime()) || accessUntilDate <= new Date()) {
      alert("Pilih tanggal akhir akses pembelajaran yang akan datang.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMsg("");
    try {
      await nexieraApi.createPublishedClass({
        title: title.trim(),
        shortDescription: shortDesc.trim(),
        description: fullDesc.trim() || shortDesc.trim(),
        category: mainCategory,
        mainCategory,
        major: major.trim(),
        campusTarget: university.trim(),
        university: university.trim(),
        courseType: type,
        tutorGrade: type === "PEER_TUTORING" ? tutorGrade : undefined,
        bannerUrl: bannerUrl || undefined,
        price: pricingModel === "PAID" ? numericPrice : 0,
        startsAt: scheduledAt.toISOString(),
        accessUntil: accessUntilDate.toISOString(),
        maxQuota: Number(maxQuota),
        meetingPlatform,
        meetingUrl: meetingUrl.trim(),
        materialPlatform,
        materialUrl: materialUrl.trim() || undefined,
        recordingUrl: recordingUrl.trim() || undefined,
        requirements: requirements.length > 0 ? requirements : ["Mahasiswa aktif"],
        facilities: facilities.length > 0 ? facilities : ["Catatan Belajar"],
      });

      setSuccessMsg("Kelas berhasil dikirim untuk ditinjau admin. Kelas akan tampil di katalog setelah disetujui.");
      window.setTimeout(() => router.push("/dashboard/tutor/kelas"), 1400);
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Kelas gagal disimpan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 nx-card p-6 md:p-10">
      {successMsg && (
        <div className="rounded-[4px] bg-emerald-50 border border-emerald-200 p-4 text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-800">
            <CircleCheck className="h-4 w-4" aria-hidden="true" /> {successMsg}
          </p>
        </div>
      )}
      {submitError && (
        <div role="alert" className="rounded-[4px] border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {submitError}
        </div>
      )}

      <section>
        <SectionTitle num="1" label="Kategori & Akademik" />
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Kategori Utama" required>
            <select value={mainCategory} onChange={(event) => { setMainCategory(event.target.value); setMajor(""); }} className={`${inputCls} cursor-pointer`} required>
              <option value="" disabled>Pilih kategori</option>
              {Object.keys(CATEGORIES_DATA).map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </Field>

          <Field label="Jurusan" required>
            <select value={major} onChange={(event) => setMajor(event.target.value)} className={`${inputCls} cursor-pointer`} required>
              <option value="" disabled>Pilih jurusan</option>
              {majorOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>

          <Field
            label="Nama Mata Kuliah"
            required
            hint="Ketik nama mata kuliah atau topik kelas"
          >
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Contoh: Struktur Data dan Algoritma" className={inputCls} minLength={3} required />
          </Field>

          <Field label="Kampus" required>
            <select value={university} onChange={(event) => setUniversity(event.target.value)} className={`${inputCls} cursor-pointer`} required>
              <option value="" disabled>Pilih kampus</option>
              {universityOptions.map((campus) => <option key={campus} value={campus}>{campus}</option>)}
            </select>
          </Field>

          {type === "PEER_TUTORING" && (
            <Field
              label="Nilai yang Pernah Diperoleh di Mata Kuliah Ini"
              required
              hint={`Kualifikasi untuk ${title}`}
            >
              <select
                value={tutorGrade}
                onChange={(event) => setTutorGrade(event.target.value as typeof tutorGrade)}
                className={`${inputCls} cursor-pointer`}
                required
              >
                <option value="" disabled>Pilih nilai</option>
                <option value="A">A</option>
                <option value="A_MINUS">A-</option>
                <option value="B_PLUS">B+</option>
              </select>
            </Field>
          )}

          <Field label="Tanggal & Waktu Pelaksanaan" required>
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className={inputCls}
              required
              min={(() => {
                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                return now.toISOString().slice(0, 16);
              })()}
            />
          </Field>

          <Field label="Deskripsi Singkat / Rangkuman Materi" required hint="Ditampilkan di kartu katalog" className="md:col-span-2">
            <textarea
              rows={2}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Ringkasan materi perkuliahan, pembahasan latihan soal, dan persiapan menghadapi ujian..."
              className={inputCls + " resize-none"}
              maxLength={500}
              required
            />
          </Field>

          <Field label="Tentang Kelas & Kurikulum Lengkap" hint="Penjelasan komprehensif" className="md:col-span-2">
            <textarea
              rows={4}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Program bimbingan terarah yang dirancang untuk membantu mahasiswa menguasai konsep dasar hingga studi kasus ujian perkuliahan secara sistematis."
              className={inputCls + " resize-none"}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Banner Sampul Kelas (Unggah Langsung)" required hint="Rasio 16:9 · Rekomendasi 1200 × 675 px · Maks. 5 MB">
              <div className="rounded-[4px] border border-dashed border-[#D9DEE7] p-4 bg-slate-50/50">
                {bannerUrl ? (
                  <div className="space-y-3">
                    <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-[4px] border border-[#D9DEE7]">
                      <img
                        src={bannerUrl.startsWith("/uploads") ? getPublicUploadUrl(bannerUrl) : bannerUrl}
                        alt="Preview Banner Kelas"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => bannerInputRef.current?.click()}
                        className="rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-1.5 text-xs font-semibold text-[#20232B] hover:bg-slate-100"
                      >
                        Ganti Banner
                      </button>
                      <button
                        type="button"
                        onClick={() => setBannerUrl("")}
                        className="rounded-[4px] px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Hapus Banner
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <p className="mb-2 max-w-lg text-xs leading-relaxed text-[#626B78]">Gunakan gambar horizontal rasio 16:9 agar pas di kartu kelas. Rekomendasi 1200 × 675 piksel. Format PNG, JPEG, atau WebP; ukuran maksimal 5 MB.</p>
                    <button
                      type="button"
                      disabled={uploadingBanner}
                      onClick={() => bannerInputRef.current?.click()}
                      className="rounded-[4px] border border-[#D9DEE7] bg-white px-3.5 py-2 text-xs font-semibold text-[#20232B] hover:bg-slate-100"
                    >
                      {uploadingBanner ? "Mengunggah..." : "Pilih File Banner (Maks. 5 MB)"}
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  ref={bannerInputRef}
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleBannerUpload}
                />
              </div>
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Syarat & Prasyarat Mahasiswa">
              <div className="space-y-2">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                    <span>• {req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(i)}
                      className="text-red-500 hover:text-red-700 font-bold ml-2"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReq}
                    onChange={(e) => setNewReq(e.target.value)}
                    placeholder="Tambah syarat (misal: Telah mengambil Kalkulus 1)..."
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="shrink-0 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900"
                  >
                    + Tambah
                  </button>
                </div>
              </div>
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Fasilitas Belajar">
              <div className="space-y-2">
                {facilities.map((fac, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-blue-50/60 px-3 py-2 text-xs text-blue-900 font-medium">
                    <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5" aria-hidden="true" /> {fac}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFacility(i)}
                      className="text-red-500 hover:text-red-700 font-bold ml-2"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFac}
                    onChange={(e) => setNewFac(e.target.value)}
                    placeholder="Tambah fasilitas (misal: Bank Soal 5 Tahun Terakhir)..."
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={handleAddFacility}
                    className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    + Tambah
                  </button>
                </div>
              </div>
            </Field>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 pt-6">
        <SectionTitle num="2" label="Link Akses Pembelajaran" />
        <p className="mb-4 text-xs text-slate-500">
          Tautan aktif akan diakses peserta melalui Dashboard Peserta (Kelas Saya). Tautan opsional yang dikosongkan tidak akan di-render sama sekali.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Platform Sesi Live" required>
            <select
              value={meetingPlatform}
              onChange={(e) => setMeetingPlatform(e.target.value as MeetingPlatform)}
              className={inputCls}
            >
              <option value="ZOOM">Zoom Meeting</option>
              <option value="GMEET">Google Meet</option>
              <option value="DISCORD">Discord Community Voice</option>
            </select>
          </Field>

          <Field label="Link Sesi Live (Zoom / Google Meet / Discord)" required>
            <div className="relative">
              <input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://zoom.us/j/... atau https://meet.google.com/..."
                className={`${inputCls} pr-10`}
                required
              />
              <MonitorPlay className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </Field>

          <Field
            label="Link Catatan / Materi"
            hint="Opsional — Kosongkan jika tidak ada"
            className="md:col-span-2"
          >
            <div className="relative">
              <input
                type="url"
                value={materialUrl}
                onChange={(e) => setMaterialUrl(e.target.value)}
                placeholder="https://... (Link dokumen catatan / materi belajar)"
                className={`${inputCls} pr-10`}
              />
              <BookOpenText className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </Field>

          <Field
            label="Link Penyimpanan / Rekaman Sesi"
            hint="Opsional — Untuk peserta yang berhalangan hadir"
            className="md:col-span-2"
          >
            <div className="relative">
              <input
                type="url"
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
                placeholder="https://drive.google.com/... (Link Google Drive / Cloud rekaman video)"
                className={`${inputCls} pr-10`}
              />
              <Video className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </Field>
        </div>
      </section>

      <section className="border-t border-slate-100 pt-6">
        <SectionTitle num="3" label="Penyelenggara & Multi-Tutor" />
        <Field label="Tipe Struktur Kelas" required>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              disabled={isTutorUser}
              onClick={() => handleTypeChange("BOOTCAMP")}
              className={`rounded-[4px] border p-4 text-left transition-colors ${
                type === "BOOTCAMP"
                  ? "border-[#2457C5] bg-[#E5E9F0]/50 text-[#20232B] dark:border-[#2563EB] dark:bg-slate-800 dark:text-slate-100"
                  : "border-[#D9DEE7] bg-white text-[#20232B] hover:bg-[#E5E9F0]/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              } ${isTutorUser ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                  <Rocket className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /> Bootcamp
                </span>
                <span className="text-[11px] font-medium text-[#20232B] bg-white border border-[#D9DEE7] px-2 py-0.5 rounded-[4px] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {isBootcampUser ? "Terkunci: Mitra" : "Multi-Tutor"}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#626B78] dark:text-slate-400">
                Diselenggarakan oleh organisasi / tim dengan dukungan <b>Multi-Tutor</b>.
              </p>
            </button>

            <button
              type="button"
              disabled={isBootcampUser}
              onClick={() => handleTypeChange("PEER_TUTORING")}
              className={`rounded-[4px] border p-4 text-left transition-colors ${
                type === "PEER_TUTORING"
                  ? "border-[#2457C5] bg-[#E5E9F0]/50 text-[#20232B] dark:border-[#2563EB] dark:bg-slate-800 dark:text-slate-100"
                  : "border-[#D9DEE7] bg-white text-[#20232B] hover:bg-[#E5E9F0]/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              } ${isBootcampUser ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                  <Handshake className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /> Peer-Tutoring
                </span>
                <span className="text-[11px] font-medium text-[#20232B] bg-white border border-[#D9DEE7] px-2 py-0.5 rounded-[4px] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {isTutorUser ? "Terkunci: Peer-Tutor" : "Terkunci 1 Tutor"}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#626B78] dark:text-slate-400">
                Diselenggarakan oleh <b>1 Orang Tutor Mahasiswa</b>.
              </p>
            </button>
          </div>
        </Field>

        <div className="mt-5 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/30 p-5 dark:border-slate-800 dark:bg-slate-900/60">
          <Field
            label={type === "BOOTCAMP" ? "Nama Organisasi / Komunitas" : "Nama Tutor Mahasiswa"}
            hint={isBootcampUser || isTutorUser ? "Terkunci otomatis dari profil penyelenggara" : undefined}
            required
          >
            <input
              type="text"
              readOnly={isBootcampUser || isTutorUser}
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              placeholder={type === "BOOTCAMP" ? user.organizationName || user.name || "Nama Organisasi" : user.name || "Nama Mahasiswa"}
              className={`${inputCls} ${
                isBootcampUser || isTutorUser ? "cursor-not-allowed bg-slate-100 dark:bg-slate-800" : ""
              }`}
              required
            />
          </Field>

          <div className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-800">
                {type === "BOOTCAMP" ? "Daftar Tim Pengajar (Multi-Tutor)" : "Profil Pengajar"}
              </label>
              {type === "BOOTCAMP" && (
                <button
                  type="button"
                  onClick={handleAddTutor}
                  className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-700 transition-colors"
                >
                  + Tambah Pengajar
                </button>
              )}
            </div>

            <div className="space-y-3">
              {tutors.map((tutor, idx) => (
                <div key={tutor.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-[4px] border border-[#D9DEE7] bg-white p-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">Nama Tutor #{idx + 1}</label>
                    <input
                      type="text"
                      value={tutor.name}
                      onChange={(e) => handleUpdateTutor(idx, "name", e.target.value)}
                      placeholder="Nama murni tanpa gelar formal"
                      className={inputCls}
                      required
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-semibold text-slate-500">Peran Mahasiswa</label>
                      <input
                        type="text"
                        value={tutor.role}
                        onChange={(e) => handleUpdateTutor(idx, "role", e.target.value)}
                        placeholder={`Mahasiswa ${major} BINUS`}
                        className={inputCls}
                      />
                    </div>
                    {type === "BOOTCAMP" && tutors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTutor(idx)}
                        className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs font-bold text-red-600 hover:bg-red-100"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 pt-6">
        <SectionTitle num="4" label="Kapasitas Kuota & Biaya" />
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Batas Kuota Peserta" required hint="Maksimal 200 peserta">
            <input
              type="number"
              value={maxQuota}
              min={1}
              max={200}
              onChange={(e) => setMaxQuota(Number(e.target.value))}
              className={inputCls}
              required
            />
          </Field>

          <Field label="Akses sampai tanggal" required>
            <>
              <input
                type="date"
                value={accessUntil}
                onChange={(event) => setAccessUntil(event.target.value)}
                min={(() => { const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); return today.toISOString().slice(0, 10); })()}
                className={inputCls}
                required
              />
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#626B78]">Akses berakhir pukul 23.59 pada tanggal yang dipilih.</p>
            </>
          </Field>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Model Biaya" required hint="Menentukan alur pendaftaran">
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                ["FREE", "Gratis", "Peserta dapat mendaftar tanpa pembayaran."],
                ["PAID", "Berbayar", "Peserta membayar melalui checkout."],
              ] as const).map(([value, label, description]) => (
                <button key={value} type="button" aria-pressed={pricingModel === value} onClick={() => setPricingModel(value)} className={`rounded-[4px] border p-3 text-left transition-colors ${pricingModel === value ? "border-[#2457C5] bg-blue-50/60 dark:border-blue-500 dark:bg-blue-950/30" : "border-[#D9DEE7] bg-white hover:bg-slate-50 dark:border-[#343945] dark:bg-[#191C23]"}`}>
                  <span className="block text-sm font-semibold text-[#20232B] dark:text-slate-100">{label}</span>
                  <span className="mt-1 block text-xs text-[#626B78] dark:text-slate-400">{description}</span>
                </button>
              ))}
            </div>
          </Field>

          {pricingModel === "PAID" ? (
            <Field label="Biaya per Peserta" required hint="Pembayaran online akan diminta saat pendaftaran">
              <div className="flex overflow-hidden rounded-[4px] border border-[#D9DEE7] focus-within:border-[#2457C5] dark:border-[#343945]">
                <span className="flex items-center border-r border-[#D9DEE7] bg-slate-50 px-3 text-sm font-semibold text-[#626B78] dark:border-[#343945] dark:bg-[#111318]">Rp</span>
                <input type="text" inputMode="numeric" pattern="[0-9]+" value={priceAmount} onChange={(event) => setPriceAmount(event.target.value.replace(/\D/g, ""))} className="w-full bg-white px-3.5 py-2.5 text-xs text-[#20232B] outline-none dark:bg-[#191C23] dark:text-slate-100" required />
              </div>
            </Field>
          ) : (
            <p className="rounded-[4px] border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">Pendaftaran gratis: peserta langsung terdaftar tanpa diarahkan ke pembayaran.</p>
          )}
        </div>
      </section>

      <div className="pt-4 border-t border-[#D9DEE7] flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || Boolean(successMsg)}
          className="btn-primary px-8 py-3.5 text-sm disabled:opacity-50"
        >
          {isSubmitting ? "Menerbitkan Kelas..." : "Publikasikan Kelas"}
        </button>
      </div>
    </form>
  );
}
