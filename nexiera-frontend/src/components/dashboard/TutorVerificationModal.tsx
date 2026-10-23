"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/src/store/useUserStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: "peer_tutor" | "bootcamp_partner";
}

export function TutorVerificationModal({ isOpen, onClose, defaultType = "peer_tutor" }: Props) {
  const user = useUserStore();
  const [type, setType] = useState(defaultType);
  const [studentCardUrl, setStudentCardUrl] = useState("");
  const [transcriptUrl, setTranscriptUrl] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [organizationProofUrl, setOrganizationProofUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { if (isOpen) { setType(defaultType); setSubmitted(user.tutorApplicationStatus === "PENDING"); setError(""); } }, [isOpen, defaultType, user.tutorApplicationStatus]);
  if (!isOpen) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (type === "peer_tutor" && (!studentCardUrl.trim() || !transcriptUrl.trim())) { setError("URL KTM dan transkrip wajib diisi."); return; }
    if (type === "bootcamp_partner" && (!organizationName.trim() || !contactPerson.trim() || !organizationProofUrl.trim())) { setError("Nama organisasi, kontak, dan URL bukti organisasi wajib diisi."); return; }
    setSaving(true);
    try {
      await user.submitTutorApplication({ type, studentCardUrl: studentCardUrl.trim() || undefined, transcriptUrl: transcriptUrl.trim() || undefined, organizationName: organizationName.trim() || undefined, contactPerson: contactPerson.trim() || undefined, organizationProofUrl: organizationProofUrl.trim() || undefined, notes: notes.trim() || undefined });
      setSubmitted(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Pengajuan gagal dikirim."); }
    finally { setSaving(false); }
  }
  const field = "nx-input mt-1 w-full";
  const pending = submitted || user.tutorApplicationStatus === "PENDING";
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div role="dialog" aria-modal="true" className="w-full max-w-xl rounded-[6px] bg-white p-6 shadow-xl">
    <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold">Pengajuan akses tutor</h2><p className="mt-1 text-xs text-[#626B78]">Dokumen dikirim sebagai URL HTTPS yang dapat diakses tim verifikasi.</p></div><button type="button" onClick={onClose} className="text-sm text-[#626B78]">Tutup</button></div>
    {pending ? <div className="mt-5 rounded border border-amber-200 bg-amber-50 p-4"><p className="font-semibold text-amber-900">Pengajuan sedang ditinjau</p><p className="mt-1 text-sm text-amber-800">Status tersimpan pada akun. Hak tutor aktif setelah admin menyetujui pengajuan.</p><button type="button" onClick={onClose} className="btn-primary mt-4">Selesai</button></div> : <form onSubmit={submit} className="mt-5 space-y-4">
      <label className="block text-xs font-semibold">Jenis pengajuan<select value={type} onChange={(e) => setType(e.target.value as typeof type)} className={field}><option value="peer_tutor">Peer tutor</option><option value="bootcamp_partner">Mitra bootcamp</option></select></label>
      {type === "peer_tutor" ? <><label className="block text-xs font-semibold">URL KTM aktif *<input type="url" required value={studentCardUrl} onChange={(e) => setStudentCardUrl(e.target.value)} className={field} placeholder="https://" /></label><label className="block text-xs font-semibold">URL transkrip nilai *<input type="url" required value={transcriptUrl} onChange={(e) => setTranscriptUrl(e.target.value)} className={field} placeholder="https://" /></label></> : <><label className="block text-xs font-semibold">Nama organisasi *<input required maxLength={191} value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} className={field} /></label><label className="block text-xs font-semibold">Kontak penanggung jawab *<input required maxLength={191} value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className={field} /></label><label className="block text-xs font-semibold">URL bukti organisasi *<input type="url" required value={organizationProofUrl} onChange={(e) => setOrganizationProofUrl(e.target.value)} className={field} placeholder="https://" /></label></>}
      <label className="block text-xs font-semibold">Catatan (opsional)<textarea value={notes} onChange={(e) => setNotes(e.target.value)} minLength={notes.trim() ? 20 : undefined} maxLength={5000} rows={3} className={field} /></label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={saving || user.tutorApplicationStatus === "APPROVED"} className="btn-primary w-full">{saving ? "Mengirim..." : "Kirim untuk ditinjau"}</button>
    </form>}
  </div></div>;
}
