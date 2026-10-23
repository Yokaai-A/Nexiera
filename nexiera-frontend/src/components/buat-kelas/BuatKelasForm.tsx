"use client";

import { useState, useMemo } from "react";
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
import { getStoredUser } from "@/src/lib/storage";
import { nexieraApi } from "@/src/lib/api";
import { CATEGORIES_DATA } from "@/src/lib/mockData";
import { CourseType, MaterialPlatform, MeetingPlatform, PricingModel, Tutor } from "@/src/types/course";

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
      <div className="mb-1.5 flex items-center justify-between">
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
  const currentUser = getStoredUser();
  const user = useUserStore();

  const isBootcampUser =
    user.activeRole === "bootcamp" ||
    user.activeRole === "bootcamp_partner" ||
    user.activeViewRole === "bootcamp_partner";
  const isTutorUser =
    user.activeRole === "tutor" || user.activeViewRole === "tutor";

  const defaultType: CourseType = isBootcampUser ? "BOOTCAMP" : "PEER_TUTORING";
  const defaultOrgName = isBootcampUser
    ? user.organizationName || "Booster Academy"
    : user.name || currentUser.fullName || "Kevin Sanjaya";

  const [mainCategory, setMainCategory] = useState("Sains & Teknologi");
  const [major, setMajor] = useState("Computer Science");
  const [title, setTitle] = useState("");
  const [university, setUniversity] = useState(user.university || currentUser.campus || "BINUS University");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");

  const availableMajors = useMemo(() => {
    return CATEGORIES_DATA[mainCategory] ? Object.keys(CATEGORIES_DATA[mainCategory]) : [];
  }, [mainCategory]);

  const [type, setType] = useState<CourseType>(defaultType);
  const [pricingModel, setPricingModel] = useState<PricingModel>("FREE");
  const [priceAmount, setPriceAmount] = useState<number>(50000);

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

  const [scheduleDate, setScheduleDate] = useState("10 Februari 2026");
  const [accessDuration, setAccessDuration] = useState("Selamanya (Lifetime Access)");
  const [maxQuota, setMaxQuota] = useState(25);

  const [meetingPlatform, setMeetingPlatform] = useState<MeetingPlatform>("ZOOM");
  const [meetingUrl, setMeetingUrl] = useState("https://zoom.us/j/1234567890");
  const [materialPlatform, setMaterialPlatform] = useState<MaterialPlatform>("NOTION");
  const [materialUrl, setMaterialUrl] = useState(""); // Opsional
  const [recordingUrl, setRecordingUrl] = useState(""); // Opsional

  const [organizerName, setOrganizerName] = useState(defaultOrgName);
  const [tutors, setTutors] = useState<Tutor[]>([
    {
      id: "tutor-main",
      name: user.name || currentUser.fullName || "Kevin Sanjaya",
      role: `Mahasiswa ${user.major || currentUser.major || "Computer Science"} ${user.university || currentUser.campus || "BINUS"}`,
      avatarUrl: user.avatarUrl || currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    },
  ]);

  const handleCategoryChange = (newCat: string) => {
    setMainCategory(newCat);
    const majors = CATEGORIES_DATA[newCat] ? Object.keys(CATEGORIES_DATA[newCat]) : [];
    if (majors.length > 0) {
      setMajor(majors[0]);
    }
  };

  const handleTypeChange = (newType: CourseType) => {
    if (isBootcampUser && newType !== "BOOTCAMP") return;
    if (isTutorUser && newType !== "PEER_TUTORING") return;
    setType(newType);
    if (newType === "BOOTCAMP") {
      setOrganizerName(user.organizationName || "Booster Academy");
    } else {
      setOrganizerName(user.name || currentUser.fullName || "Kevin Sanjaya");
    }
  };

  const handleAddTutor = () => {
    if (type !== "BOOTCAMP") return;
    const newTutor: Tutor = {
      id: `tutor-${Date.now()}`,
      name: "",
      role: `Mahasiswa ${major} ${university}`,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
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
    if (!meetingUrl.trim()) {
      alert("Mohon sertakan Link Sesi Live.");
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
        mainCategory,
        major,
        university,
        courseType: type,
        organizerName,
        price: pricingModel === "PAID" ? Number(priceAmount) : 0,
        startsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        accessDuration,
        maxQuota: Number(maxQuota),
        meetingPlatform,
        meetingUrl: meetingUrl.trim(),
        materialPlatform,
        materialUrl: materialUrl.trim() || undefined,
        recordingUrl: recordingUrl.trim() || undefined,
        requirements: requirements.length > 0 ? requirements : ["Mahasiswa aktif"],
        facilities: facilities.length > 0 ? facilities : ["Catatan Belajar"],
      });

      setSuccessMsg("Kelas berhasil diterbitkan. Mengalihkan ke katalog...");
      window.setTimeout(() => router.push("/cari-kelas"), 900);
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
            <select
              value={mainCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={inputCls}
              required
            >
              {Object.keys(CATEGORIES_DATA).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Jurusan" required>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className={inputCls}
              required
            >
              {availableMajors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Nama Mata Kuliah"
            required
            hint="Tanpa kode matkul internal"
            className="md:col-span-2"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Algorithm and Programming"
              className={inputCls}
              required
            />
          </Field>

          <Field label="Institusi / Universitas" required>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="BINUS University"
              className={inputCls}
              required
            />
          </Field>

          <Field label="Tanggal Pelaksanaan" required>
            <input
              type="text"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              placeholder="10 Februari 2026"
              className={inputCls}
              required
            />
          </Field>

          <Field label="Deskripsi Singkat / Rangkuman Materi" required hint="Ditampilkan di kartu katalog" className="md:col-span-2">
            <textarea
              rows={2}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Ringkasan materi perkuliahan, pembahasan latihan soal, dan persiapan menghadapi ujian..."
              className={inputCls + " resize-none"}
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
                className={inputCls}
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
                className={inputCls}
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
                className={inputCls}
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
              placeholder={type === "BOOTCAMP" ? "Booster Academy" : user.name || currentUser.fullName || "Nama Mahasiswa"}
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
          <Field label="Masa Akses Pembelajaran" required>
            <select
              value={accessDuration}
              onChange={(e) => setAccessDuration(e.target.value)}
              className={inputCls}
            >
              <option value="Selamanya (Lifetime Access)">Selamanya (Lifetime Access)</option>
              <option value="1 Semester Aktif">1 Semester Aktif</option>
              <option value="Hingga Pekan UAS Selesai">Hingga Pekan UAS Selesai</option>
            </select>
          </Field>

          <Field label="Batas Kuota Peserta" required>
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
        </div>

        <div className="mt-5">
          <Field label="Model Pembiayaan" required>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPricingModel("FREE")}
                className={`rounded-[4px] border p-4 text-left transition-colors ${
                  pricingModel === "FREE"
                    ? "border-[#2457C5] bg-[#E5E9F0]/50 text-[#20232B]"
                    : "border-[#D9DEE7] bg-white text-[#20232B] hover:bg-[#E5E9F0]/30"
                }`}
              >
                <span className="text-sm font-semibold text-emerald-700">GRATIS</span>
                <p className="mt-1 text-xs text-[#626B78]">
                  Terbuka bebas bagi seluruh mahasiswa.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPricingModel("PAID")}
                className={`rounded-[4px] border p-4 text-left transition-colors ${
                  pricingModel === "PAID"
                    ? "border-[#2457C5] bg-[#E5E9F0]/50 text-[#20232B]"
                    : "border-[#D9DEE7] bg-white text-[#20232B] hover:bg-[#E5E9F0]/30"
                }`}
              >
                <span className="text-sm font-semibold text-[#20232B]">BERBAYAR</span>
                <p className="mt-1 text-xs text-[#626B78]">
                  Biaya partisipasi terjangkau.
                </p>
              </button>
            </div>
          </Field>

          {pricingModel === "PAID" && (
            <div className="mt-4">
              <Field label="Nominal Biaya (Rp)" required>
                <input
                  type="number"
                  value={priceAmount}
                  onChange={(e) => setPriceAmount(Number(e.target.value))}
                  min={5000}
                  step={5000}
                  className={inputCls}
                />
              </Field>
            </div>
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
