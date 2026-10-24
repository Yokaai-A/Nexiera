"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, GraduationCap, Rocket, Upload, X } from "lucide-react";
import { useUserStore } from "@/src/store/useUserStore";
import { nexieraApi } from "@/src/lib/api";

const UNIVERSITY_OPTIONS = [
  "BINUS University", "Universitas Indonesia", "Institut Teknologi Bandung",
  "Universitas Gadjah Mada", "Institut Teknologi Sepuluh Nopember", "IPB University",
  "Universitas Airlangga", "Universitas Padjadjaran", "Universitas Diponegoro",
  "Universitas Brawijaya", "Telkom University", "Universitas Negeri Jakarta",
  "Universitas Sebelas Maret", "Universitas Hasanuddin", "Universitas Sumatera Utara",
  "Universitas Pendidikan Indonesia", "Universitas Negeri Yogyakarta", "Universitas Sriwijaya",
  "Universitas Negeri Surabaya", "Universitas Negeri Malang",
];
const MAJOR_OPTIONS = [
  "Teknik Informatika", "Ilmu Komputer", "Sistem Informasi", "Teknologi Informasi",
  "Rekayasa Perangkat Lunak", "Teknik Komputer", "Sains Data", "Statistika", "Matematika",
  "Teknik Elektro", "Teknik Industri", "Akuntansi", "Manajemen", "Ekonomi", "Hukum",
  "Kedokteran", "Psikologi", "Desain Komunikasi Visual", "Ilmu Komunikasi", "Pendidikan",
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: "peer_tutor" | "bootcamp_partner";
}

export function TutorVerificationModal({ isOpen, onClose, defaultType = "peer_tutor" }: Props) {
  const router = useRouter();
  const user = useUserStore();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const studentProofInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState(defaultType);
  const [campus, setCampus] = useState("");
  const [major, setMajor] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [organizationWebsiteUrl, setOrganizationWebsiteUrl] = useState("");
  const [studentProofUrl, setStudentProofUrl] = useState("");
  const [studentProofName, setStudentProofName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingStudentProof, setUploadingStudentProof] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setType(defaultType);
      setCampus(user.campus || user.university || "");
      setMajor(user.major || "");
      setError("");
      setSuccess(false);
    }
  }, [isOpen, defaultType, user.campus, user.university, user.major]);

  if (!isOpen) return null;

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran logo maksimal 2 MB.");
      return;
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Format logo harus PNG, JPEG, atau WebP.");
      return;
    }
    setUploadingLogo(true);
    setError("");
    try {
      const result = await nexieraApi.uploadProfile(file);
      setLogoUrl(result.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Logo gagal diunggah.");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleStudentProofUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran bukti mahasiswa aktif maksimal 2 MB.");
      return;
    }
    if (!["image/png", "image/jpeg", "image/webp", "application/pdf"].includes(file.type)) {
      setError("Bukti harus berupa foto PNG/JPEG/WebP atau dokumen PDF.");
      return;
    }
    setUploadingStudentProof(true);
    setError("");
    try {
      const result = await nexieraApi.uploadBootcampStudentProof(file);
      setStudentProofUrl(result.url);
      setStudentProofName(file.name);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Bukti mahasiswa aktif gagal diunggah.");
    } finally {
      setUploadingStudentProof(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (type === "peer_tutor" && (!campus.trim() || !major.trim() || !studentProofUrl)) {
      setError("Universitas, jurusan, dan bukti mahasiswa aktif wajib dilengkapi.");
      return;
    }
    if (type === "bootcamp_partner" && (!organizationName.trim() || !contactEmail.trim() || !logoUrl || !notes.trim() || !studentProofUrl)) {
      setError("Nama organisasi, email kontak, logo, deskripsi, dan bukti mahasiswa aktif wajib dilengkapi.");
      return;
    }
    setSaving(true);
    try {
      await user.submitTutorApplication({
        type,
        organizationName: organizationName.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        organizationProofUrl: logoUrl.trim() || undefined,
        organizationWebsiteUrl: organizationWebsiteUrl.trim() || undefined,
        studentProofUrl: studentProofUrl || undefined,
        notes: notes.trim() || undefined,
        ...(type === "peer_tutor"
          ? {
              campus: campus.trim(),
              major: major.trim(),
            }
          : {}),
      });

      setSuccess(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Pendaftaran gagal diproses.");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "nx-input mt-1 w-full rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs sm:text-sm text-[#20232B] outline-none transition-colors focus:border-[#2457C5] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
  const campusOptions = campus && !UNIVERSITY_OPTIONS.includes(campus) ? [campus, ...UNIVERSITY_OPTIONS] : UNIVERSITY_OPTIONS;
  const majorOptions = major && !MAJOR_OPTIONS.includes(major) ? [major, ...MAJOR_OPTIONS] : MAJOR_OPTIONS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div role="dialog" aria-modal="true" className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-[6px] border border-[#D9DEE7] bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#2457C5]/10 text-[#2457C5] dark:bg-[#78A0FF]/10 dark:text-[#78A0FF]">
              {type === "peer_tutor" ? <GraduationCap className="h-5 w-5" /> : <Rocket className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#20232B] dark:text-slate-100">
                {type === "peer_tutor" ? "Daftar Jadi Peer-Tutor" : "Daftar Kemitraan Mitra Bootcamp"}
              </h2>
              <p className="text-xs text-[#626B78] dark:text-slate-400">
              {type === "peer_tutor" ? "Lengkapi profil akademik dan bukti mahasiswa aktif untuk ditinjau admin." : "Lengkapi data organisasi dan bukti mahasiswa aktif penanggung jawab."}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-[#626B78] hover:text-[#20232B] dark:text-slate-400 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="mt-5 rounded-[4px] border border-amber-200 bg-amber-50 p-5 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
            <CheckCircle2 className="mx-auto h-8 w-8 text-amber-700 dark:text-amber-400" />
            <h3 className="mt-2 text-sm font-bold text-amber-900 dark:text-amber-300">
              Pengajuan Terkirim · Menunggu Verifikasi
            </h3>
            <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">
              Berkas Anda sudah diterima. Akses {type === "peer_tutor" ? "Peer-Tutor" : "Mitra Bootcamp"} akan dibuka setelah admin meninjau dan menyetujui pengajuan.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/dashboard");
              }}
              className="mt-4 rounded-[4px] bg-[#2457C5] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Kembali ke Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3.5">
            <label className="block text-xs font-semibold text-[#20232B] dark:text-slate-200">
              Pilihan Peran Pengajar
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className={field}
              >
                <option value="peer_tutor">Peer-Tutor (Bimbingan Mata Kuliah Mandiri)</option>
                <option value="bootcamp_partner">Mitra Bootcamp (Lembaga / Penyelenggara)</option>
              </select>
            </label>

            {type === "peer_tutor" ? (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-[#20232B] dark:text-slate-200">
                    Asal Kampus / Universitas *
                    <select
                      required
                      value={campus}
                      onChange={(e) => setCampus(e.target.value)}
                      className={`${field} max-h-48 cursor-pointer overflow-y-auto`}
                    >
                      <option value="" disabled>Pilih kampus / universitas</option>
                      {campusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                  <label className="block text-xs font-semibold text-[#20232B] dark:text-slate-200">
                    Program Studi / Jurusan *
                    <select
                      required
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      className={`${field} max-h-48 cursor-pointer overflow-y-auto`}
                    >
                      <option value="" disabled>Pilih program studi / jurusan</option>
                      {majorOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                </div>

                <div className="min-w-0 text-xs font-semibold text-[#20232B] dark:text-slate-200">
                  <label htmlFor="peer-tutor-student-proof-upload">Bukti Mahasiswa Aktif * (Foto KTM, Screenshot SIAKAD, atau KRS aktif; maks. 2 MB)</label>
                  <input
                    ref={studentProofInputRef}
                    id="peer-tutor-student-proof-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    className="sr-only"
                    onChange={handleStudentProofUpload}
                  />
                  <div className="mt-1.5 flex min-w-0 flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                    <button
                      type="button"
                      onClick={() => studentProofInputRef.current?.click()}
                      disabled={uploadingStudentProof}
                      className="inline-flex max-w-full shrink-0 cursor-pointer items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs font-semibold text-[#20232B] transition-colors hover:border-[#2457C5] hover:bg-[#E5E9F0] disabled:cursor-wait disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#78A0FF]"
                    >
                      <Upload className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{uploadingStudentProof ? "Mengunggah bukti..." : studentProofUrl ? "Ganti bukti" : "Pilih bukti mahasiswa aktif"}</span>
                    </button>
                    <p className="min-w-0 break-all text-[11px] font-normal leading-4 text-[#626B78] dark:text-slate-400">
                      {studentProofUrl ? `${studentProofName} berhasil diunggah.` : "Bukti mahasiswa aktif wajib diunggah."}
                    </p>
                  </div>
                </div>

              </>
            ) : (
              <>
                <label className="block text-xs font-semibold text-[#20232B] dark:text-slate-200">
                  Nama Lembaga / Organisasi Bootcamp *
                  <input
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Contoh: Booster Academy Indonesia"
                    className={field}
                  />
                </label>

                <label className="block text-xs font-semibold text-[#20232B] dark:text-slate-200">
                  Email Kontak Resmi Lembaga *
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="partnership@lembaga.id"
                    className={field}
                  />
                </label>

                <div className="min-w-0 text-xs font-semibold text-[#20232B] dark:text-slate-200">
                  <label htmlFor="bootcamp-logo-upload">Logo Lembaga * (PNG/JPEG/WebP, maksimal 2 MB)</label>
                  <input
                    ref={logoInputRef}
                    id="bootcamp-logo-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={handleLogoUpload}
                  />
                  <div className="mt-1.5 flex min-w-0 flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="inline-flex max-w-full shrink-0 cursor-pointer items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs font-semibold text-[#20232B] transition-colors hover:border-[#2457C5] hover:bg-[#E5E9F0] disabled:cursor-wait disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#78A0FF]"
                    >
                      <Upload className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{uploadingLogo ? "Mengunggah logo..." : logoUrl ? "Ganti logo" : "Pilih file logo"}</span>
                    </button>
                    <p className="min-w-0 text-[11px] font-normal leading-4 text-[#626B78] dark:text-slate-400">
                      {logoUrl ? "Logo berhasil diunggah." : "Logo wajib diunggah sebelum mendaftar."}
                    </p>
                  </div>
                </div>
              </>
            )}

            <label className="block text-xs font-semibold text-[#20232B] dark:text-slate-200">
              {type === "bootcamp_partner" ? "Deskripsi Singkat Organisasi *" : "Catatan Pengalaman & Keahlian (Opsional)"}
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                required={type === "bootcamp_partner"}
                placeholder={type === "bootcamp_partner" ? "Ceritakan fokus dan kegiatan organisasi secara singkat." : "Tuliskan pengalaman mengajar atau ringkasan kurikulum..."}
                className={field + " resize-none"}
              />
            </label>

            {type === "bootcamp_partner" && (
              <>
                <label className="block text-xs font-semibold text-[#20232B] dark:text-slate-200">
                  Tautan Media Sosial / Website Resmi Organisasi (Opsional)
                  <input
                    type="url"
                    value={organizationWebsiteUrl}
                    onChange={(event) => setOrganizationWebsiteUrl(event.target.value)}
                    placeholder="https://organisasi.id atau https://instagram.com/organisasi"
                    className={field}
                  />
                </label>

                <div className="min-w-0 text-xs font-semibold text-[#20232B] dark:text-slate-200">
                  <label htmlFor="bootcamp-student-proof-upload">Bukti Mahasiswa Aktif Penanggung Jawab * (Foto KTM, Screenshot SIAKAD, atau KRS aktif; maks. 2 MB)</label>
                  <input
                    ref={studentProofInputRef}
                    id="bootcamp-student-proof-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    className="sr-only"
                    onChange={handleStudentProofUpload}
                  />
                  <div className="mt-1.5 flex min-w-0 flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                    <button
                      type="button"
                      onClick={() => studentProofInputRef.current?.click()}
                      disabled={uploadingStudentProof}
                      className="inline-flex max-w-full shrink-0 cursor-pointer items-center gap-2 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs font-semibold text-[#20232B] transition-colors hover:border-[#2457C5] hover:bg-[#E5E9F0] disabled:cursor-wait disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#78A0FF]"
                    >
                      <Upload className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{uploadingStudentProof ? "Mengunggah bukti..." : studentProofUrl ? "Ganti bukti" : "Pilih bukti mahasiswa aktif"}</span>
                    </button>
                    <p className="min-w-0 break-all text-[11px] font-normal leading-4 text-[#626B78] dark:text-slate-400">
                      {studentProofUrl ? `${studentProofName} berhasil diunggah.` : "Bukti mahasiswa aktif wajib diunggah."}
                    </p>
                  </div>
                </div>
              </>
            )}

            {error && (
              <p role="alert" className="rounded-[4px] border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || uploadingLogo || uploadingStudentProof}
              className="mt-2 w-full rounded-[4px] bg-[#2457C5] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Memproses Pendaftaran..." : "Konfirmasi & Buka Akses Peran"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
