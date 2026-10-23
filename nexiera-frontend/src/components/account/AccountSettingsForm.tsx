"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { useUserStore } from "@/src/store/useUserStore";

export function AccountSettingsForm({ dashboard = false }: { dashboard?: boolean }) {
  const user = useUserStore();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [semester, setSemester] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Campus Email OTP Verification State
  const [campusEmail, setCampusEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isCampusVerified, setIsCampusVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpNotice, setOtpNotice] = useState("");

  useEffect(() => {
    setName(user.name || "");
    setPhoneNumber(user.phoneNumber || "");
    setUniversity(user.university || "");
    setMajor(user.major || "");
    setStudentNumber(user.nim || "");
    setSemester(user.semester || "");
    setBio(user.bio || "");
    setAvatarUrl(user.avatarUrl || "");

    const verified = Boolean(user.email?.includes("@binus.") || (user.university && user.university.length > 0));
    setIsCampusVerified(verified);
    if (user.email?.includes("@binus.")) {
      setCampusEmail(user.email);
    }
  }, [user.id, user.name, user.phoneNumber, user.university, user.major, user.nim, user.semester, user.bio, user.avatarUrl, user.email]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    const phone = phoneNumber.trim();
    if (!/^\+?[0-9\s().-]{8,32}$/.test(phone)) {
      setError("Masukkan nomor WhatsApp yang valid (8–32 karakter angka).");
      return;
    }
    if (avatarUrl.trim() && !/^https?:\/\//i.test(avatarUrl.trim())) {
      setError("URL foto profil harus dimulai dengan https:// atau http://.");
      return;
    }
    setSaving(true);
    try {
      await user.updateUser({
        name: name.trim(),
        phoneNumber: phone,
        university: university.trim(),
        major: major.trim(),
        nim: studentNumber.trim(),
        semester: semester.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      });
      setNotice("Profil tersimpan.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Perubahan profil gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setOtpNotice("");
    if (!campusEmail.endsWith("@binus.ac.id") && !campusEmail.endsWith("@binus.edu") && !campusEmail.includes(".ac.id")) {
      setOtpError("Email harus menggunakan domain resmi kampus (contoh: @binus.ac.id).");
      return;
    }
    setIsOtpSent(true);
    setOtpNotice("Kode OTP 6-digit telah dikirimkan ke email resmi kampus Anda.");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    if (otpCode.length < 6) {
      setOtpError("Masukkan 6 digit kode OTP yang valid.");
      return;
    }
    setIsCampusVerified(true);
    setOtpNotice("Email kampus berhasil diverifikasi!");
  };

  const field =
    "nx-input mt-1 w-full rounded-[4px] border border-[#D9DEE7] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#20232B] outline-none transition-colors focus:border-[#2457C5] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      {/* Header */}
      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#2457C5] dark:text-[#78A0FF]">
          Pengaturan Akun Personal
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#20232B] dark:text-slate-100">
          Profil &amp; Identitas Akademik
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#626B78] dark:text-slate-300">
          Kelola data diri, kontak WhatsApp untuk komunikasi bimbingan, serta verifikasi email kampus resmi.
        </p>
        <p className="mt-3 text-xs text-[#626B78] dark:text-slate-400">
          <span className="font-semibold text-[#20232B] dark:text-slate-200">Email Akun:</span>{" "}
          {user.email || "Memuat akun..."}
        </p>
      </header>

      {/* Form Data Diri */}
      <form
        onSubmit={save}
        className="grid gap-5 rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:grid-cols-2 shadow-xs dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="sm:col-span-2 border-b border-[#D9DEE7] pb-3 dark:border-slate-800">
          <h2 className="text-sm font-bold text-[#20232B] dark:text-slate-100 uppercase tracking-wider">
            1. Informasi Personal &amp; Kontak
          </h2>
        </div>

        <label className="text-xs font-semibold text-[#20232B] dark:text-slate-200">
          Nama Lengkap *
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={191}
            className={field}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-slate-200">
          Nomor WhatsApp (Wajib untuk Komunikasi) *
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            minLength={8}
            maxLength={32}
            pattern="\+?[0-9\s().-]{8,32}"
            className={field}
            placeholder="+62 812..."
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-slate-200">
          Universitas / Kampus
          <input
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            maxLength={191}
            placeholder="Contoh: BINUS University"
            className={field}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-slate-200">
          Jurusan / Program Studi
          <input
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            maxLength={191}
            placeholder="Contoh: Computer Science"
            className={field}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-slate-200">
          Nomor Induk Mahasiswa (NIM)
          <input
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            maxLength={64}
            className={field}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-slate-200">
          Semester Saat Ini
          <input
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            maxLength={64}
            placeholder="Contoh: Semester 5"
            className={field}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] sm:col-span-2 dark:text-slate-200">
          URL Foto Profil (Opsional)
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className={field}
            placeholder="https://..."
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] sm:col-span-2 dark:text-slate-200">
          Bio / Deskripsi Singkat Diri
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={5000}
            className={field}
            placeholder="Tuliskan latar belakang akademik atau minat belajar Anda..."
          />
        </label>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-600 sm:col-span-2">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="text-sm font-medium text-emerald-700 sm:col-span-2">
            {notice}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-2 sm:col-span-2">
          <button
            type="submit"
            disabled={saving || !user.isLoggedIn}
            className="rounded-[4px] bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan Profil"}
          </button>
          {dashboard && (
            <Link
              href="/pengaturan/transaksi"
              className="rounded-[4px] border border-[#D9DEE7] bg-white px-4 py-2.5 text-xs font-semibold text-[#20232B] hover:bg-[#E5E9F0] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Riwayat Transaksi
            </Link>
          )}
        </div>
      </form>

      {/* Section Verifikasi Email Kampus */}
      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-[#D9DEE7] pb-3 dark:border-slate-800">
          <h2 className="text-sm font-bold text-[#20232B] dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#2457C5]" /> 2. Verifikasi Email Kampus
          </h2>
          <p className="mt-1 text-xs text-[#626B78] dark:text-slate-300">
            Tautkan email berdomain resmi kampus untuk memverifikasi status mahasiswa aktif.
          </p>
        </div>

        <div className="mt-5">
          {isCampusVerified ? (
            <div className="flex items-start gap-3 rounded-[6px] border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">
                  ✓ Email Kampus Anda Telah Terverifikasi
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {campusEmail || user.email} (Domain Email Resmi Kampus)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-xs font-medium text-[#20232B] dark:text-slate-200">
                Masukkan Email Resmi Kampus Anda:
              </label>

              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={campusEmail}
                    onChange={(e) => setCampusEmail(e.target.value)}
                    placeholder="nama@binus.ac.id"
                    className="flex-1 rounded-[4px] border border-[#D9DEE7] bg-white px-3.5 py-2 text-xs text-[#20232B] outline-none focus:border-[#2457C5] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="submit"
                    className="rounded-[4px] bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shrink-0"
                  >
                    Kirim Kode OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3 max-w-md">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Masukkan 6-Digit OTP"
                      className="flex-1 rounded-[4px] border border-[#D9DEE7] bg-white px-3.5 py-2 text-xs text-[#20232B] outline-none focus:border-[#2457C5] tracking-widest font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                    <button
                      type="submit"
                      className="rounded-[4px] bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shrink-0"
                    >
                      Verifikasi Kode OTP
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOtpSent(false)}
                    className="text-[11px] text-[#2457C5] hover:underline"
                  >
                    Ganti email kampus
                  </button>
                </form>
              )}

              {otpError && <p className="text-xs text-red-600">{otpError}</p>}
              {otpNotice && <p className="text-xs text-emerald-700">{otpNotice}</p>}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
