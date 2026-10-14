"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpenText, Check, CircleCheck, CreditCard, Handshake, MonitorPlay, Rocket, X } from "lucide-react";
import { saveNewCourse, getStoredUser } from "@/src/lib/storage";
import { CourseType, MaterialPlatform, MeetingPlatform, PricingModel, Tutor } from "@/src/types/course";

/* ── Section Title ────────────────────────────────────────────── */
function SectionTitle({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-xs font-black text-white shadow-sm shadow-blue-500/20">
        {num}
      </span>
      <h2 className="text-base font-bold text-slate-900">{label}</h2>
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
        <label className="text-xs font-bold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export function BuatKelasForm() {
  const router = useRouter();
  const currentUser = getStoredUser();

  // Form State
  const [category, setCategory] = useState("Computer Science");
  const [university, setUniversity] = useState(currentUser.campus || "BINUS University");
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [type, setType] = useState<CourseType>("BOOTCAMP");
  const [pricingModel, setPricingModel] = useState<PricingModel>("FREE");
  const [priceAmount, setPriceAmount] = useState<number>(50000);

  // Requirements & Facilities list
  const [requirements, setRequirements] = useState<string[]>([
    "Mahasiswa aktif jurusan terkait",
    "Membawa laptop & software perkuliahan terpasang",
  ]);
  const [newReq, setNewReq] = useState("");

  const [facilities, setFacilities] = useState<string[]>([
    "Catatan Rapi Notion Study Hub (Rangkuman Lengkap)",
    "Bank Soal UTS & UAS beserta Solusi",
    "Rekaman Tatap Muka HD & Source Code",
  ]);
  const [newFac, setNewFac] = useState("");

  // Metadata
  const [scheduleDate, setScheduleDate] = useState("10 Februari 2026");
  const [accessDuration, setAccessDuration] = useState("Selamanya (Lifetime Access)");
  const [maxQuota, setMaxQuota] = useState(25);
  const [meetingPlatform, setMeetingPlatform] = useState<MeetingPlatform>("ZOOM");
  const [meetingUrl, setMeetingUrl] = useState("https://zoom.us/j/1234567890");
  const [materialPlatform, setMaterialPlatform] = useState<MaterialPlatform>("NOTION");
  const [materialUrl, setMaterialUrl] = useState("https://notion.so/nexiera/study-hub-materi");

  // Organizer & Multi-Tutors (Section 4 Blueprint)
  const [organizerName, setOrganizerName] = useState(
    type === "BOOTCAMP" ? "Booster Academy" : currentUser.fullName || "Nicholas Aryan"
  );
  const [tutors, setTutors] = useState<Tutor[]>([
    {
      id: "tutor-main",
      name: currentUser.fullName || "Nicholas Aryan",
      role: `Mahasiswa ${currentUser.major || "Computer Science"} ${currentUser.campus || "BINUS"}`,
      avatarUrl: currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    },
  ]);

  // Handlers for Requirements
  const handleAddRequirement = () => {
    if (newReq.trim()) {
      setRequirements([...requirements, newReq.trim()]);
      setNewReq("");
    }
  };
  const handleRemoveRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  // Handlers for Facilities
  const handleAddFacility = () => {
    if (newFac.trim()) {
      setFacilities([...facilities, newFac.trim()]);
      setNewFac("");
    }
  };
  const handleRemoveFacility = (idx: number) => {
    setFacilities(facilities.filter((_, i) => i !== idx));
  };

  // Handlers for Multi-Tutor
  const handleAddTutor = () => {
    const newTutor: Tutor = {
      id: `tutor-${Date.now()}`,
      name: "",
      role: "Teaching Assistant / Co-Mentor",
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

  // Switch type and synchronize organizer defaults
  const handleTypeChange = (newType: CourseType) => {
    setType(newType);
    if (newType === "BOOTCAMP") {
      setOrganizerName("Booster Academy");
    } else {
      setOrganizerName(currentUser.fullName || "Nicholas Aryan");
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim()) {
      alert("Mohon lengkapi nama kelas dan deskripsi singkat.");
      return;
    }

    setIsSubmitting(true);

    const newCourseData = {
      title,
      subjectCategory: category,
      university,
      shortDescription: shortDesc,
      fullDescription: fullDesc || shortDesc,
      type,
      pricingModel,
      priceAmount: pricingModel === "PAID" ? Number(priceAmount) : undefined,
      organizerName,
      organizerLogo: type === "BOOTCAMP" ? "/logo.png" : undefined,
      tutors: tutors.filter((t) => t.name.trim() !== ""),
      meetingPlatform,
      meetingUrl,
      materialPlatform,
      materialUrl,
      scheduleDate,
      accessDuration,
      maxQuota: Number(maxQuota),
      availableSeats: Number(maxQuota),
      requirements: requirements.length > 0 ? requirements : ["Mahasiswa aktif"],
      facilities: facilities.length > 0 ? facilities : ["Catatan Rapi Notion"],
      tags: [category.replace(/\s+/g, ""), type === "BOOTCAMP" ? "Bootcamp" : "PeerTutoring"],
    };

    saveNewCourse(newCourseData);
    setSuccessMsg("Kelas berhasil diterbitkan! Mengalihkan ke katalog...");

    setTimeout(() => {
      router.push("/cari-kelas");
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm md:p-10">
      {successMsg && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-800"><CircleCheck className="h-4 w-4" aria-hidden="true" /> {successMsg}</p>
        </div>
      )}

      {/* ── 1. Program & Kategori Header ──────────────────────── */}
      <section>
        <SectionTitle num="1" label="Program & Kategori Header" />
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Kategori Bidang / Jurusan" required>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Sains & Teknologi">Sains &amp; Teknologi</option>
                <option value="Ekonomi & Bisnis">Ekonomi &amp; Bisnis</option>
                <option value="Sosial & Hukum">Sosial &amp; Hukum</option>
                <option value="Kesehatan & Kedokteran">Kesehatan &amp; Kedokteran</option>
                <option value="Seni Desain & Arsitektur">Seni Desain &amp; Arsitektur</option>
              </select>
            </div>
          </Field>

          <Field label="Institusi / Universitas" required>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="BINUS University"
              className={inputCls}
            />
          </Field>

          <Field label="Nama Kelas / Mata Kuliah" required hint="Maksimal 90 karakter" className="md:col-span-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Algoritma & Pemrograman (COMP6047) - Bedah Soal UTS"
              className={inputCls}
              required
            />
          </Field>

          <Field label="Deskripsi Singkat / Rangkuman Materi" required hint="Ditampilkan di kartu katalog" className="md:col-span-2">
            <textarea
              rows={2}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Ringkasan fokus materi semester 1-4, pembahasan pointer, struct, dan latihan SOCS..."
              className={inputCls + " resize-none"}
              required
            />
          </Field>

          <Field label="Tentang Kelas & Kurikulum Lengkap" required hint="Penjelasan komprehensif" className="md:col-span-2">
            <textarea
              rows={4}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Program bimbingan intensif yang dirancang khusus untuk membantu kamu menguasai materi perkuliahan secara terstruktur. Dilengkapi dengan Akses Catatan Rapi for Notion (Notion Study Hub) yang mencakup rangkuman materi, pembahasan latihan soal, hingga persiapan ujian."
              className={inputCls + " resize-none"}
            />
          </Field>

          {/* Interactive Requirements */}
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

          {/* Interactive Facilities */}
          <div className="md:col-span-2">
            <Field label="Fasilitas & Metode Belajar">
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

      {/* ── 2. Detail & Spesifikasi Event ─────────────────────── */}
      <section className="border-t border-slate-100 pt-6">
        <SectionTitle num="2" label="Detail & Spesifikasi Event (Metadata Kartu)" />
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Tanggal Pelaksanaan" required>
            <input
              type="text"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              placeholder="10 Februari 2026"
              className={inputCls}
            />
          </Field>

          <Field label="Platform Tatap Muka Online" required>
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

          <Field label="Masa Akses Materi" required>
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
            />
            <p className="mt-1 text-[11px] text-blue-600 font-medium">
              Akan ditampilkan di badge kartu: <b>Sisa {maxQuota} Kuota</b>
            </p>
          </Field>
        </div>
      </section>

      {/* ── 3. Centralized Access Hub Links ───────────────────── */}
      <section className="border-t border-slate-100 pt-6">
        <SectionTitle num="3" label="Centralized Access Hub (Notion & Ruang Kelas)" />
        <p className="mb-4 text-xs text-slate-500">
          Peserta yang mendaftar akan mendapatkan akses otomatis ke link Notion Study Hub dan ruang video conference.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Link Catatan Notion Study Hub" required>
            <div className="relative">
              <input
                type="url"
                value={materialUrl}
                onChange={(e) => setMaterialUrl(e.target.value)}
                placeholder="https://notion.so/..."
                className={inputCls}
              />
              <BookOpenText className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </Field>

          <Field label="Link Ruang Video Meeting" required>
            <div className="relative">
              <input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://zoom.us/j/... atau meet.google.com/..."
                className={inputCls}
              />
              <MonitorPlay className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </Field>
        </div>
      </section>

      {/* ── 4. Tipe Kelas & Penyelenggara (Section 4 Blueprint) ─ */}
      <section className="border-t border-slate-100 pt-6">
        <SectionTitle num="4" label="Tipe Struktur Kelas & Penyelenggara" />
        <Field label="Pilih Tipe Struktur Kelas" required>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleTypeChange("BOOTCAMP")}
              className={`rounded-2xl border p-4 text-left transition-all ${
                type === "BOOTCAMP"
                  ? "border-cyan-500 bg-cyan-50/70 text-cyan-900 ring-2 ring-cyan-200"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold"><Rocket className="h-4 w-4" aria-hidden="true" /> Bootcamp</span>
                <span className="text-xs font-semibold text-cyan-700 bg-cyan-100/80 px-2 py-0.5 rounded-full">Mitra / Organisasi</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Diselenggarakan oleh organisasi (misal: Booster Academy) dengan dukungan <b>Multi-Tutor</b>.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("PEER_TUTORING")}
              className={`rounded-2xl border p-4 text-left transition-all ${
                type === "PEER_TUTORING"
                  ? "border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-200"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold"><Handshake className="h-4 w-4" aria-hidden="true" /> Peer-Tutoring</span>
                <span className="text-xs font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">Individu</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Diselenggarakan oleh <b>1 Orang Tutor Mahasiswa</b> peraih nilai A atau Asisten Lab.
              </p>
            </button>
          </div>
        </Field>

        {/* Organizer details based on type */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
          <Field label={type === "BOOTCAMP" ? "Nama Mitra / Organisasi" : "Nama Tutor Mahasiswa"} required>
            <input
              type="text"
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              placeholder={type === "BOOTCAMP" ? "Booster Academy" : "Nama Lengkap Anda"}
              className={inputCls}
            />
          </Field>

          {/* Multi-Tutor Section for Bootcamp */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-800">
                {type === "BOOTCAMP" ? "Daftar Pengajar (Multi-Tutor)" : "Profil Pengajar"}
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
                <div key={tutor.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500">Nama Tutor #{idx + 1}</label>
                    <input
                      type="text"
                      value={tutor.name}
                      onChange={(e) => handleUpdateTutor(idx, "name", e.target.value)}
                      placeholder="Nama Tutor"
                      className={inputCls}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-semibold text-slate-500">Peran / Jabatan Akademik</label>
                      <input
                        type="text"
                        value={tutor.role}
                        onChange={(e) => handleUpdateTutor(idx, "role", e.target.value)}
                        placeholder="Contoh: Asisten Lab AlgoProg BINUS"
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

      {/* ── 5. Kapasitas & Biaya Pendaftaran ───────────────────── */}
      <section className="border-t border-slate-100 pt-6">
        <SectionTitle num="5" label="Model Biaya Pendaftaran" />
        <Field label="Pilih Model Pembiayaan" required>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPricingModel("FREE")}
              className={`rounded-2xl border p-4 text-center font-bold transition-all ${
                pricingModel === "FREE"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Check className="mr-1 inline h-4 w-4" aria-hidden="true" /> Gratis (Akses Terbuka Mahasiswa)
            </button>
            <button
              type="button"
              onClick={() => setPricingModel("PAID")}
              className={`rounded-2xl border p-4 text-center font-bold transition-all ${
                pricingModel === "PAID"
                  ? "border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-200"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <CreditCard className="mr-1 inline h-4 w-4" aria-hidden="true" /> Berbayar (Nominal Terjangkau)
            </button>
          </div>

          {pricingModel === "PAID" && (
            <div className="mt-4">
              <Field label="Nominal Biaya (Rp)" required hint="Contoh: 45000">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={priceAmount}
                    onChange={(e) => setPriceAmount(Number(e.target.value))}
                    min={5000}
                    step={5000}
                    placeholder="45000"
                    className={inputCls + " pl-10"}
                    required
                  />
                </div>
              </Field>
            </div>
          )}
        </Field>
      </section>

      {/* ── Submit Actions ────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
        <button
          type="button"
          onClick={() => router.push("/cari-kelas")}
          className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Batal &amp; Kembali
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {isSubmitting ? "Mempublikasikan..." : <>Publikasikan Kelas Sekarang <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" /></>}
        </button>
      </div>
    </form>
  );
}
