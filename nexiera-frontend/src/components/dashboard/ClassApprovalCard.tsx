"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { getPublicUploadUrl, type ApiClass } from "@/src/lib/api";

type Decision = "APPROVE" | "REJECT";

export function ClassApprovalCard({
  item,
  busy,
  note,
  onNoteChange,
  onReview,
}: {
  item: ApiClass;
  busy: boolean;
  note: string;
  onNoteChange: (value: string) => void;
  onReview: (decision: Decision) => void;
}) {
  const [bannerState, setBannerState] = useState<"checking" | "valid" | "invalid">("checking");
  const campus = item.campusTarget || item.university || "";
  const startsAt = item.startsAt ? new Date(item.startsAt) : null;
  const accessUntil = item.accessUntil ? new Date(item.accessUntil) : null;
  const price = Number(item.price);
  const checks = useMemo(() => [
    { label: "Identitas pembuat tersedia", valid: Boolean(item.creator?.fullName || item.creator?.name) && Boolean(item.creator?.email) },
    { label: "Nama, kategori, jurusan, dan kampus terisi", valid: Boolean(item.title.trim() && (item.category || item.mainCategory)?.trim() && item.major?.trim() && campus.trim()) },
    { label: "Deskripsi cukup untuk ditinjau", valid: (item.description?.trim().length || 0) >= 30 },
    { label: "Jadwal dan masa akses masih valid", valid: Boolean(startsAt && Number.isFinite(startsAt.getTime()) && startsAt > new Date() && accessUntil && Number.isFinite(accessUntil.getTime()) && accessUntil > new Date()) },
    { label: "Harga dan kuota masuk akal", valid: Number.isFinite(price) && price >= 0 && (item.maxQuota == null || item.maxQuota > 0) },
  ], [item, campus, startsAt, accessUntil, price]);
  const bannerUrl = item.bannerUrl
    ? item.bannerUrl.startsWith("/uploads") ? getPublicUploadUrl(item.bannerUrl) : item.bannerUrl
    : "";
  const allDataChecksPass = checks.every((check) => check.valid);

  return (
    <article className="space-y-4 rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">Menunggu persetujuan</span>
          <h3 className="mt-2 text-sm font-bold text-[#20232B] dark:text-slate-100">{item.title}</h3>
          <p className="mt-0.5 text-xs text-[#626B78] dark:text-slate-400">Diajukan {item.creator?.fullName || item.creator?.name || "Pengguna"} · {item.creator?.email || "Email tidak tersedia"}</p>
        </div>
        <span className="rounded border border-[#D9DEE7] px-2 py-1 text-[10px] font-semibold uppercase text-[#455166] dark:border-slate-700 dark:text-slate-300">{item.courseType || item.type}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-2 lg:col-span-2">
          <div className="aspect-video overflow-hidden rounded border border-[#D9DEE7] bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
            {bannerUrl ? <img src={bannerUrl} alt={`Banner ${item.title}`} onLoad={() => setBannerState("valid")} onError={() => setBannerState("invalid")} className="h-full w-full object-cover" /> : <p className="flex h-full items-center justify-center text-xs text-red-700">Banner belum tersedia</p>}
          </div>
          <div className={`text-xs font-semibold ${bannerState === "valid" ? "text-emerald-700 dark:text-emerald-300" : bannerState === "invalid" || !bannerUrl ? "text-red-700 dark:text-red-300" : "text-[#626B78] dark:text-slate-400"}`}>
            Banner: {bannerState === "valid" ? "Gambar berhasil dimuat" : bannerState === "invalid" || !bannerUrl ? "Gambar tidak dapat dimuat" : "Memeriksa gambar…"}
          </div>
          {bannerUrl && <a href={bannerUrl} target="_blank" rel="noreferrer" className="text-xs text-[#2457C5] underline dark:text-[#78A0FF]">Buka gambar asli</a>}
        </div>

        <div className="space-y-3 text-xs lg:col-span-3">
          <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
            <p><b>Kategori:</b> {item.category || item.mainCategory || "—"}</p>
            <p><b>Jurusan:</b> {item.major || "—"}</p>
            <p><b>Kampus:</b> {campus || "—"}</p>
            <p><b>Harga:</b> {Number.isFinite(price) ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price) : "Tidak valid"}</p>
            <p><b>Jadwal:</b> {startsAt && Number.isFinite(startsAt.getTime()) ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(startsAt) : "—"}</p>
            <p><b>Akses sampai:</b> {accessUntil && Number.isFinite(accessUntil.getTime()) ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(accessUntil) : "—"}</p>
            <p><b>Kuota:</b> {item.maxQuota ?? "Tidak dibatasi"}</p>
            <p><b>Platform:</b> {item.meetingPlatform || "—"}</p>
          </div>
          <div className="rounded border border-[#D9DEE7] bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
            <p className="font-semibold">Deskripsi kelas</p>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed text-[#455166] dark:text-slate-300">{item.description || "Belum ada deskripsi."}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <p className="break-all"><b>Link sesi:</b> {item.meetingUrl || item.meetingLink || "—"}</p>
            <p className="break-all"><b>Link materi:</b> {item.materialUrl || item.materialLink || "—"}</p>
          </div>
        </div>
      </div>

      <div className="rounded border border-[#D9DEE7] p-3 dark:border-slate-700">
        <p className="text-xs font-semibold">Pemeriksaan kelengkapan awal</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {[
            { label: "Banner bisa dimuat", valid: bannerState === "valid" },
            ...checks,
          ].map((check) => (
            <p key={check.label} className={`flex items-center gap-1.5 text-[11px] ${check.valid ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
              {check.valid ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}{check.label}
            </p>
          ))}
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-[#626B78] dark:text-slate-400">Pemeriksaan ini membantu menemukan data kosong atau banner rusak; admin tetap perlu menilai kewajaran materi dan keaslian pengajuan.</p>
      </div>

      <label className="block text-xs font-semibold">Catatan untuk pembuat (wajib jika ditolak)
        <textarea value={note} onChange={(event) => onNoteChange(event.target.value)} rows={2} maxLength={2000} className="nx-input mt-1 w-full" placeholder="Jelaskan bagian yang perlu diperbaiki atau alasan penolakan" />
      </label>
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" disabled={busy || !note.trim()} onClick={() => onReview("REJECT")} className="inline-flex items-center gap-1.5 rounded px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-300 dark:hover:bg-red-950/30"><X className="h-3.5 w-3.5" />{busy ? "Menyimpan…" : "Tolak dan beri catatan"}</button>
        <button type="button" disabled={busy || bannerState !== "valid" || !allDataChecksPass} onClick={() => onReview("APPROVE")} className="inline-flex items-center gap-1.5 rounded bg-[#2457C5] px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><Check className="h-3.5 w-3.5" />{busy ? "Menyimpan…" : "Setujui & tampilkan"}</button>
      </div>
    </article>
  );
}
