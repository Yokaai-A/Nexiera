"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { useUserStore } from "@/src/store/useUserStore";
import { TutorVerificationModal } from "./TutorVerificationModal";

export function TutorAccessGate() {
  const user = useUserStore();
  const [open, setOpen] = useState(false);
  const pending = user.tutorApplicationStatus === "PENDING";
  const rejected = user.tutorApplicationStatus === "REJECTED";
  return <div className="mx-auto max-w-3xl rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:p-8">
    <span className="inline-flex items-center gap-2 rounded border border-[#D9DEE7] bg-[#E5E9F0]/50 px-3 py-1 text-xs font-semibold"><GraduationCap className="h-4 w-4 text-[#2457C5]" />Akses pengajar</span>
    <h1 className="mt-4 text-2xl font-bold">Akun ini belum memiliki akses tutor</h1>
    <p className="mt-2 text-sm leading-relaxed text-[#626B78]">Pengguna baru mendapat role mahasiswa. Ajukan verifikasi dengan dokumen yang tersimpan di URL aman; administrator akan meninjau sebelum akses tutor diberikan.</p>
    {pending && <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Pengajuan Anda sedang ditinjau.</p>}
    {rejected && <p className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">Pengajuan sebelumnya ditolak. Anda dapat memperbarui data dan mengirim ulang.</p>}
    {user.tutorApplicationData?.submittedAt && <p className="mt-2 text-xs text-[#626B78]">Pengajuan terakhir: {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(user.tutorApplicationData.submittedAt))}</p>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" disabled={pending || user.tutorApplicationStatus === "APPROVED"} onClick={() => setOpen(true)} className="btn-primary">{pending ? "Menunggu verifikasi" : rejected ? "Ajukan ulang" : "Ajukan verifikasi tutor"}</button><Link href="/dashboard" className="btn-secondary">Kembali ke dashboard</Link></div>
    <TutorVerificationModal isOpen={open} onClose={() => setOpen(false)} />
  </div>;
}
