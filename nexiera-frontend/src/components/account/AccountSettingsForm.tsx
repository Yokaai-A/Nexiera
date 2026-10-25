"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Camera, X } from "lucide-react";
import { useUserStore } from "@/src/store/useUserStore";
import { getPublicUploadUrl, nexieraApi } from "@/src/lib/api";

export function AccountSettingsForm({ dashboard = false }: { dashboard?: boolean }) {
  const user = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [semester, setSemester] = useState("");
  const [bio, setBio] = useState("");
  const [headline, setHeadline] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setName(user.name || "");
    setPhoneNumber(user.phoneNumber || "");
    setUniversity(user.university || "");
    setMajor(user.major || "");
    setStudentNumber(user.nim || "");
    setSemester(user.semester || "");
    setBio(user.bio || "");
    setHeadline(user.headline || "");
    setAvatarUrl(user.avatarUrl || "");

  }, [user.id, user.name, user.phoneNumber, user.university, user.major, user.nim, user.semester, user.bio, user.headline, user.avatarUrl]);

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto profil maksimal 2 MB.");
      return;
    }
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Format file harus PNG, JPEG, JPG, atau WebP.");
      return;
    }
    setUploadingAvatar(true);
    setError("");
    try {
      const res = await nexieraApi.uploadProfile(file);
      setAvatarUrl(res.url);
      setNotice("Foto profil berhasil diunggah. Klik 'Simpan Perubahan Profil' untuk menyimpan.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal mengunggah foto profil.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    const phone = phoneNumber.trim();
    if (!/^\+?[0-9\s().-]{8,32}$/.test(phone)) {
      setError("Masukkan nomor WhatsApp yang valid (8–32 karakter angka).");
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
        headline: headline.trim(),
        avatarUrl: avatarUrl.trim(),
      });
      setNotice("Profil berhasil disimpan.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Perubahan profil gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "nx-input mt-1 w-full rounded-[4px] border border-[#D9DEE7] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#20232B] outline-none transition-colors focus:border-[#2457C5] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

  return (
    <div className="mx-auto max-w-[900px] space-y-6">

      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#2457C5] dark:text-[#78A0FF]">
          Pengaturan Akun Personal
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#20232B] dark:text-slate-100">
          Profil &amp; Identitas Akademik
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#626B78] dark:text-slate-300">
          Kelola data diri dan informasi akademik. Notifikasi NEXIERA dikirim ke email akun utama.
        </p>
        <p className="mt-3 text-xs text-[#626B78] dark:text-slate-400">
          <span className="font-semibold text-[#20232B] dark:text-slate-200">Email Akun:</span>{" "}
          {user.email || "Memuat akun..."}
        </p>
      </header>


      <form
        onSubmit={save}
        className="grid gap-5 rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:grid-cols-2 shadow-xs dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="sm:col-span-2 border-b border-[#D9DEE7] pb-3 dark:border-slate-800">
          <h2 className="text-sm font-bold text-[#20232B] dark:text-slate-100 uppercase tracking-wider">
            Informasi Personal &amp; Akademik
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
            placeholder="Contoh: Teknik Informatika"
            className={field}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-slate-200">
          Headline Profil
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            maxLength={191}
            placeholder="Contoh: Tutor Teknik Informatika"
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

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-[#20232B] dark:text-slate-200 block mb-2">
            Foto Profil (Unggah Langsung, Maks. 2 MB)
          </label>
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#D9DEE7] bg-slate-100 dark:border-slate-700 dark:bg-slate-800 shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl.startsWith("/uploads") ? getPublicUploadUrl(avatarUrl) : avatarUrl}
                  alt="Foto Profil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">
                  {name ? name.slice(0, 2).toUpperCase() : "NX"}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleAvatarUpload}
              />
              <button
                type="button"
                disabled={uploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#D9DEE7] bg-white px-3.5 py-2 text-xs font-semibold text-[#20232B] hover:bg-[#E5E9F0] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Camera className="h-4 w-4" />
                {uploadingAvatar ? "Mengunggah..." : "Pilih File Foto..."}
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl("")}
                  className="inline-flex items-center gap-1 rounded-[4px] px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <X className="h-3.5 w-3.5" /> Hapus Foto
                </button>
              )}
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-[#626B78] dark:text-slate-400">
            Format yang didukung: PNG, JPEG, JPG, WebP. Maksimal 2 MB. File langsung disimpan di server.
          </p>
        </div>

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


    </div>
  );
}
