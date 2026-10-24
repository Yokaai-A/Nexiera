"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { nexieraApi } from "@/src/lib/api";

export function RefundRequestModal({ transactionId, className, onClose, onSubmitted }: { transactionId: string; className: string; onClose: () => void; onSubmitted: () => void }) {
  const [method, setMethod] = useState<"BANK" | "EWALLET">("BANK");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    try { await nexieraApi.requestRefund(transactionId, { method, accountName, accountNumber }); onSubmitted(); onClose(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Pengajuan refund gagal."); }
    finally { setSaving(false); }
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <form onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="refund-title" className="w-full max-w-md space-y-4 rounded-[6px] border border-[#D9DEE7] bg-white p-5 shadow-lg dark:border-[#343945] dark:bg-[#191C23]">
      <header className="flex items-center justify-between border-b border-[#D9DEE7] pb-3 dark:border-[#343945]"><div><h2 id="refund-title" className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">Ajukan Refund</h2><p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">{className}</p></div><button type="button" onClick={onClose} aria-label="Tutup" className="text-[#626B78]"><X className="h-4 w-4" /></button></header>
      <label className="block text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">Metode penerimaan<select className="nx-input mt-1 w-full" value={method} onChange={(e) => setMethod(e.target.value as "BANK" | "EWALLET")}><option value="BANK">Transfer rekening bank</option><option value="EWALLET">E-wallet</option></select></label>
      <label className="block text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">Nama pemilik rekening<input className="nx-input mt-1 w-full" required minLength={2} maxLength={100} value={accountName} onChange={(e) => setAccountName(e.target.value)} /></label>
      <label className="block text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">{method === "BANK" ? "Nomor rekening" : "Nomor e-wallet"}<input className="nx-input mt-1 w-full" required minLength={5} maxLength={64} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} /></label>
      <p className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/40 p-3 text-xs text-[#626B78] dark:border-[#343945] dark:bg-[#111318] dark:text-[#B1B7C3]">Pengajuan akan ditinjau oleh tim NEXIERA. Akses kelas dihentikan setelah refund disetujui.</p>
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2"><button type="button" onClick={onClose} disabled={saving} className="btn-secondary flex-1">Batal</button><button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? "Mengirim…" : "Kirim pengajuan"}</button></div>
    </form>
  </div>;
}
