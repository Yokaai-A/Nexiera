"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ImagePlus, ShieldAlert, X } from "lucide-react";
import { nexieraApi } from "@/src/lib/api";

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "class" | "organizer";
  targetId: string;
  targetTitle: string;
  tutorId?: string;
  tutorName?: string;
  defaultCategory?: string;
}

export const VIOLATION_CATEGORIES = [
  { value: "tutor_tidak_hadir", label: "Tutor tidak hadir" },
  { value: "materi_tidak_sesuai", label: "Materi tidak sesuai" },
  { value: "indikasi_penipuan", label: "Indikasi penipuan" },
  { value: "pelanggaran_etika", label: "Pelanggaran etika" },
  { value: "lainnya", label: "Lainnya" },
];

export function ReportModal({ isOpen, onClose, targetType, targetId, targetTitle, tutorId, tutorName, defaultCategory }: ReportModalProps) {
  const [category, setCategory] = useState(defaultCategory || VIOLATION_CATEGORIES[0].value);
  const [reportTarget, setReportTarget] = useState<"CLASS" | "ORGANIZER">(targetType === "class" ? "CLASS" : "ORGANIZER");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [evidence, setEvidence] = useState<File | null>(null);
  if (!isOpen) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanDescription = description.trim();
    if (cleanDescription.length < 10) { setError("Jelaskan laporan minimal 10 karakter."); return; }
    setSaving(true);
    setError("");
    try {
      const evidenceUrl = evidence ? (await nexieraApi.uploadReportEvidence(evidence)).url : undefined;
      await nexieraApi.createReport({
        targetType: reportTarget,
        targetId: reportTarget === "CLASS" ? targetId : (tutorId || targetId),
        category,
        description: cleanDescription,
        evidenceUrl,
        classId: targetType === "class" ? targetId : undefined,
      });
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Laporan gagal dikirim.");
    } finally { setSaving(false); }
  }

  function close() { setSubmitted(false); setDescription(""); setEvidence(null); setError(""); setReportTarget(targetType === "class" ? "CLASS" : "ORGANIZER"); onClose(); }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div role="dialog" aria-modal="true" aria-labelledby="report-title" className="w-full max-w-lg rounded-[6px] border border-[#D9DEE7] bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-3">
        <h3 id="report-title" className="flex items-center gap-2 text-sm font-semibold"><ShieldAlert className="h-4 w-4 text-red-600" />{targetType === "class" ? "Laporkan kelas" : "Laporkan penyelenggara"}</h3>
        <button type="button" onClick={close} aria-label="Tutup" className="text-[#626B78]"><X className="h-4 w-4" /></button>
      </div>
      {submitted ? <div className="py-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h4 className="mt-3 font-semibold">Laporan terkirim</h4>
        <p className="mt-2 text-sm text-[#626B78]">Laporan untuk {targetTitle} sudah tersimpan.</p>
        <button type="button" onClick={close} className="btn-primary mt-5">Tutup</button>
      </div> : <form onSubmit={submit} className="mt-4 space-y-4">
        <p className="rounded border border-[#D9DEE7] bg-[#E5E9F0]/40 p-3 text-sm font-medium">{reportTarget === "CLASS" ? targetTitle : (tutorName || "Tutor kelas")}</p>
        <label className="block text-xs font-semibold">Laporkan
          <select value={reportTarget} onChange={(event) => setReportTarget(event.target.value as "CLASS" | "ORGANIZER")} className="nx-input mt-1 w-full">
            <option value="CLASS">Kelas</option>
            <option value="ORGANIZER" disabled={!tutorId}>Tutor{!tutorId ? " (data tutor tidak tersedia)" : ""}</option>
          </select>
        </label>
        <label className="block text-xs font-semibold">Kategori
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="nx-input mt-1 w-full">
            {VIOLATION_CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold">Deskripsi
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="nx-input mt-1 w-full resize-y" rows={5} minLength={10} maxLength={5000} required placeholder="Jelaskan kejadian secara faktual." />
          <span className="mt-1 block font-normal text-[#626B78]">Minimal 10 karakter.</span>
        </label>
        <label className="block text-xs font-semibold">Bukti foto (opsional)
          <span className="mt-1 flex cursor-pointer items-center gap-2 rounded-[4px] border border-dashed border-[#BAC3D2] bg-[#E5E9F0]/30 px-3 py-3 font-normal text-[#626B78] hover:border-[#2457C5] dark:border-[#343945] dark:bg-[#111318] dark:text-[#B1B7C3]">
            <ImagePlus className="h-4 w-4 text-[#2457C5]" /> {evidence?.name ?? "Pilih PNG, JPG, atau WebP (maks. 2 MB)"}
            <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0] ?? null; if (file && file.size > 2 * 1024 * 1024) { setError("Ukuran bukti maksimal 2 MB."); event.target.value = ""; return; } setError(""); setEvidence(file); }} />
          </span>
        </label>
        <p className="flex gap-2 rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><AlertTriangle className="h-4 w-4 shrink-0" />Laporan akan diteruskan untuk ditinjau.</p>
        {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2"><button type="button" className="btn-secondary flex-1" onClick={close} disabled={saving}>Batal</button><button type="submit" className="btn-primary flex-1" disabled={saving || description.trim().length < 10}>{saving ? "Mengirim..." : "Kirim laporan"}</button></div>
      </form>}
    </div>
  </div>;
}
