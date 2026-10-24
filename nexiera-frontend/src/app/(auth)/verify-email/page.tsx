"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nexieraApi } from "@/src/lib/api";
import { AuthLayout } from "@/src/components/auth/AuthLayout";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("Memverifikasi email...");
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) { setMessage("Tautan verifikasi tidak lengkap."); return; }
    void nexieraApi.verifyEmail(token).then(() => { setSuccess(true); setMessage("Email berhasil diverifikasi. Anda sekarang dapat masuk."); }).catch((error) => setMessage(error instanceof Error ? error.message : "Verifikasi email gagal."));
  }, []);
  return <AuthLayout><main className="mx-auto max-w-[390px] rounded-[6px] border border-[#D9DEE7] bg-white p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#2457C5]">NEXIERA</p><h1 className="mt-2 text-xl font-bold">Verifikasi Email</h1><p role="status" className="mt-3 text-sm text-[#626B78]">{message}</p>{success && <Link className="btn-primary mt-5 flex h-11 items-center justify-center" href="/login">Masuk ke akun</Link>}</main></AuthLayout>;
}
