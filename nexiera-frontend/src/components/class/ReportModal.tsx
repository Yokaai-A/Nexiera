"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, X } from "lucide-react";
import { nexieraApi } from "@/src/lib/api";

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "class" | "organizer";
  targetId: string;
  targetTitle: string;
  defaultCategory?: string;
}

export const VIOLATION_CATEGORIES = [
  { value: "tutor_tidak_hadir", label: "Tutor tidak hadir" },
  { value: "materi_tidak_sesuai", label: "Materi tidak sesuai" },
  { value: "indikasi_penipuan", label: "Indikasi penipuan" },
  { value: "pelanggaran_etika", label: "Pelanggaran etika" },
  { value: "lainnya", label: "Lainnya" },
];

export function ReportModal({ isOpen, onClose, targetType, targetId, targetTitle, defaultCategory }: ReportModalProps) {
  const [category, setCategory] = useState(defaultCategory || VIOLATION_CATEGORIES[0].value);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  if (!isOpen) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanDescription = description.trim();
    if (cleanDescription.length < 10) { setError("Jelaskan laporan minimal 10 karakter."); return; }
    setSaving(true);
    setError("");
    try {
      await nexieraApi.createReport({
        targetType: targetType === "class" ? "CLASS" : "ORGANIZER",
        targetId,
        category,
        description: cleanDescription,
      });
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Laporan gagal dikirim.");
    } finally { setSaving(false); }
  }

  function close() { setSubmitted(false); setDescription(""); setError(""); onClose(); }

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
        <p className="rounded border border-[#D9DEE7] bg-[#E5E9F0]/40 p-3 text-sm font-medium">{targetTitle}</p>
        <label className="block text-xs font-semibold">Kategori
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="nx-input mt-1 w-full">
            {VIOLATION_CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold">Deskripsi
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="nx-input mt-1 w-full resize-y" rows={5} minLength={10} maxLength={5000} required placeholder="Jelaskan kejadian secara faktual." />
          <span className="mt-1 block font-normal text-[#626B78]">Minimal 10 karakter.</span>
        </label>
        <p className="flex gap-2 rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><AlertTriangle className="h-4 w-4 shrink-0" />Laporan akan diteruskan untuk ditinjau.</p>
        {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2"><button type="button" className="btn-secondary flex-1" onClick={close} disabled={saving}>Batal</button><button type="submit" className="btn-primary flex-1" disabled={saving || description.trim().length < 10}>{saving ? "Mengirim..." : "Kirim laporan"}</button></div>
      </form>}
    </div>
  </div>;
}
