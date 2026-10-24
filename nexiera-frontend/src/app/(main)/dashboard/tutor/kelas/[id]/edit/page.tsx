"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { nexieraApi, type ApiClass } from "@/src/lib/api";

const localDateTime = (value: string | null) =>
  value
    ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : "";
const inputClass = "nx-input mt-1 w-full";

export default function EditKelasPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [item, setItem] = useState<ApiClass | null>(null);
  const [startsAt, setStartsAt] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleBannerUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file banner maksimal 5 MB.");
      return;
    }
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Format gambar banner harus PNG, JPEG, JPG, atau WebP.");
      return;
    }
    setUploadingBanner(true);
    setError("");
    try {
      const res = await nexieraApi.uploadBanner(file);
      if (item) setItem({ ...item, bannerUrl: res.url });
      setNotice("Banner berhasil diunggah. Klik 'Simpan Perubahan' untuk menyimpan.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal mengunggah banner.");
    } finally {
      setUploadingBanner(false);
    }
  }

  useEffect(() => {
    let active = true;
    nexieraApi
      .managedClass(id)
      .then((value) => {
        if (!active) return;
        setItem(value);
        setStartsAt(localDateTime(value.startsAt ?? null));
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : "Kelas tidak ditemukan.");
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!item) return;
    setSaving(true);
    setError("");
    setNotice("");
    const date = new Date(startsAt);
    const amount = Number(item.price);
    const quota = item.maxQuota ? Number(item.maxQuota) : undefined;
    if (!Number.isFinite(date.getTime()) || date <= new Date()) {
      setError("Jadwal pelaksanaan harus berada di masa depan.");
      setSaving(false);
      return;
    }
    if (!Number.isSafeInteger(amount) || amount < 0) {
      setError("Harga bimbingan harus berupa bilangan bulat IDR.");
      setSaving(false);
      return;
    }
    try {
      const updated = await nexieraApi.updateClass(id, {
        title: item.title.trim(),
        shortDescription: item.shortDescription || undefined,
        description: item.description.trim(),
        mainCategory: item.mainCategory || undefined,
        major: item.major || undefined,
        university: item.university || undefined,
        courseType: item.courseType,
        organizerName: item.organizerName || undefined,
        bannerUrl: item.bannerUrl || undefined,
        price: amount,
        startsAt: date.toISOString(),
        maxQuota: quota,
        requirements: item.requirements || [],
        facilities: item.facilities || [],
        meetingPlatform: item.meetingPlatform || undefined,
        meetingUrl: item.meetingUrl || undefined,
        materialPlatform: item.materialPlatform || undefined,
        materialUrl: item.materialUrl || undefined,
        recordingUrl: item.recordingUrl || undefined,
        driveUrl: item.driveUrl || undefined,
      });
      setItem(updated);
      setNotice("Perubahan kelas berhasil disimpan.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Perubahan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    setSaving(true);
    setError("");
    try {
      await nexieraApi.publishClass(id);
      router.push(`/dashboard/tutor/kelas/${encodeURIComponent(id)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Kelas gagal dipublikasikan.");
    } finally {
      setSaving(false);
    }
  }

  if (!item) {
    return (
      <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 text-xs text-[#626B78] dark:border-[#343945] dark:bg-[#191C23] dark:text-[#B1B7C3]">
        {error || "Memuat formulir kelas..."}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <Link
          href={`/dashboard/tutor/kelas/${encodeURIComponent(id)}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2457C5] hover:underline dark:text-[#78A0FF]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Detail Kelas
        </Link>
        <h1 className="mt-3 text-lg font-bold text-[#20232B] dark:text-[#F3F4F6]">
          Edit Kelas Bimbingan
        </h1>
        <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
          Status saat ini: <b className="uppercase">{item.status || "DRAFT"}</b>
        </p>
      </header>

      <form
        onSubmit={save}
        className="grid gap-3 rounded-[6px] border border-[#D9DEE7] bg-white p-4 sm:grid-cols-2 dark:border-[#343945] dark:bg-[#191C23]"
      >
        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6] sm:col-span-2">
          Nama Mata Kuliah / Kelas
          <input
            required
            minLength={3}
            maxLength={191}
            value={item.title}
            onChange={(e) => setItem({ ...item, title: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6] sm:col-span-2">
          Ringkasan Materi (Singkat)
          <input
            value={item.shortDescription || ""}
            onChange={(e) => setItem({ ...item, shortDescription: e.target.value })}
            className={inputClass}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6] sm:col-span-2">
          Deskripsi &amp; Kurikulum
          <textarea
            required
            minLength={10}
            rows={5}
            value={item.description}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
            className={inputClass}
          />
        </label>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6] block mb-2">
            Banner Sampul Kelas (Unggah Langsung, Maks. 5 MB)
          </label>
          <div className="rounded-[4px] border border-dashed border-[#D9DEE7] p-4 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50">
            {item.bannerUrl ? (
              <div className="space-y-3">
                <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-[4px] border border-[#D9DEE7] dark:border-slate-700">
                  <img
                    src={item.bannerUrl.startsWith("/uploads") ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${item.bannerUrl}` : item.bannerUrl}
                    alt="Banner Kelas"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-1.5 text-xs font-semibold text-[#20232B] hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    Ganti Banner
                  </button>
                  <button
                    type="button"
                    onClick={() => setItem({ ...item, bannerUrl: null })}
                    className="rounded-[4px] px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    Hapus Banner
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <p className="text-xs text-[#626B78] dark:text-slate-400 mb-2">Unggah file banner representatif untuk kelas ini.</p>
                <button
                  type="button"
                  disabled={uploadingBanner}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-[4px] border border-[#D9DEE7] bg-white px-3.5 py-2 text-xs font-semibold text-[#20232B] hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {uploadingBanner ? "Mengunggah..." : "Pilih File Banner (Maks. 5 MB)"}
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleBannerUpload}
            />
          </div>
        </div>

        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
          Kategori Utama
          <input
            value={item.mainCategory || ""}
            onChange={(e) => setItem({ ...item, mainCategory: e.target.value })}
            className={inputClass}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
          Jurusan
          <input
            value={item.major || ""}
            onChange={(e) => setItem({ ...item, major: e.target.value })}
            className={inputClass}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
          Kampus
          <input
            value={item.university || ""}
            onChange={(e) => setItem({ ...item, university: e.target.value })}
            className={inputClass}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
          Harga (IDR)
          <input
            type="number"
            min="0"
            step="1"
            required
            value={item.price}
            onChange={(e) => setItem({ ...item, price: e.target.value })}
            className={inputClass}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
          Jadwal Pelaksanaan
          <input
            type="datetime-local"
            required
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
          Kapasitas Kuota
          <input
            type="number"
            min="1"
            step="1"
            value={item.maxQuota ?? ""}
            onChange={(e) =>
              setItem({ ...item, maxQuota: e.target.value ? Number(e.target.value) : null })
            }
            className={inputClass}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
          Platform Pertemuan
          <select
            value={item.meetingPlatform || "ZOOM"}
            onChange={(e) => setItem({ ...item, meetingPlatform: e.target.value })}
            className={inputClass}
          >
            <option value="ZOOM">Zoom</option>
            <option value="GMEET">Google Meet</option>
            <option value="DISCORD">Discord</option>
          </select>
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6] sm:col-span-2">
          URL Link Pertemuan Langsung
          <input
            type="url"
            required
            value={item.meetingUrl || ""}
            onChange={(e) => setItem({ ...item, meetingUrl: e.target.value })}
            className={inputClass}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6] sm:col-span-2">
          URL Materi &amp; Catatan Kuliah
          <input
            type="url"
            value={item.materialUrl || ""}
            onChange={(e) => setItem({ ...item, materialUrl: e.target.value })}
            className={inputClass}
          />
        </label>

        <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6] sm:col-span-2">
          URL Rekaman Sesi (Google Drive / Cloud)
          <input
            type="url"
            value={item.recordingUrl || ""}
            onChange={(e) => setItem({ ...item, recordingUrl: e.target.value })}
            className={inputClass}
          />
        </label>

        {error && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400 sm:col-span-2">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="text-xs text-emerald-700 dark:text-emerald-400 sm:col-span-2">
            {notice}
          </p>
        )}

        <div className="flex flex-wrap gap-2 sm:col-span-2 pt-2">
          <button type="submit" disabled={saving} className="btn-primary btn-dashboard-action">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          {item.status === "DRAFT" && (
            <button
              type="button"
              disabled={saving}
              onClick={() => void publish()}
              className="btn-secondary btn-dashboard-action"
            >
              Publikasikan Draft
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
