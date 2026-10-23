"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "./AuthLayout";
import { getApiBaseUrl, getBrowserAuthUrl, nexieraApi } from "@/src/lib/api";
import { refreshUser } from "@/src/store/useUserStore";

type AuthFormProps = { mode: "login" | "register" };
const phonePattern = /^\+?[0-9\s().-]{8,32}$/;
const fieldClass = "nx-input mt-1.5 h-11 w-full bg-white px-3 text-sm";

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (isRegister && !phonePattern.test(phoneNumber.trim())) {
      setError("Masukkan nomor WhatsApp yang valid.");
      return;
    }
    setSubmitting(true);
    try {
      if (isRegister) {
        await nexieraApi.register({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
        });
      } else {
        await nexieraApi.login({ email: email.trim(), password });
      }
      await refreshUser();
      router.replace("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Autentikasi gagal. Silakan coba lagi.");
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-[390px] py-1">
        <header className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2457C5]">Akun NEXIERA</p>
          <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-tight text-[#20232B]">
            {isRegister ? "Buat akun baru" : "Masuk ke akunmu"}
          </h1>
          <p className="mt-2 text-sm leading-5 text-[#626B78]">
            {isRegister ? "Daftar untuk menemukan kelas dan bimbingan yang sesuai." : "Lanjutkan belajar bersama komunitas akademikmu."}
          </p>
        </header>
        <form onSubmit={(event) => void submit(event)} className="space-y-3.5">
          {isRegister && <label className="block text-[13px] font-semibold text-[#20232B]">Nama lengkap<input name="fullName" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required minLength={2} maxLength={191} className={fieldClass} /></label>}
          <label className="block text-[13px] font-semibold text-[#20232B]">Email<input name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={191} className={fieldClass} placeholder="nama@email.com" /></label>
          {isRegister && <label className="block text-[13px] font-semibold text-[#20232B]">Nomor WhatsApp<input name="phoneNumber" type="tel" autoComplete="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} required minLength={8} maxLength={32} pattern="\+?[0-9\s().-]{8,32}" className={fieldClass} placeholder="+62 812 3456 7890" /></label>}
          <label className="block text-[13px] font-semibold text-[#20232B]">Password<input name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} maxLength={72} className={fieldClass} placeholder={isRegister ? "Minimal 6 karakter" : "Masukkan password"} /></label>
          {error && <p role="alert" className="rounded-[4px] border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary mt-1 h-11 w-full text-sm font-semibold disabled:cursor-wait disabled:opacity-60">
            {submitting ? "Memproses…" : isRegister ? "Buat akun" : "Masuk"}
          </button>
        </form>
        <div className="my-4 flex items-center gap-3 text-[11px] font-medium text-[#8892A0]"><span className="h-px flex-1 bg-[#D9DEE7]" />atau<span className="h-px flex-1 bg-[#D9DEE7]" /></div>
        <a
          href={`${getApiBaseUrl()}/auth/google`}
          onClick={(event) => {
            event.preventDefault();
            window.location.assign(getBrowserAuthUrl("/auth/google"));
          }}
          className="btn-secondary h-11 w-full justify-center gap-2.5 bg-white text-sm font-semibold"
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" className="h-[18px] w-[18px]"><path fill="#FFC107" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.9 6.1-15Z"/><path fill="#FF3D00" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z"/><path fill="#4CAF50" d="M12.6 27.7a12 12 0 0 1 0-7.4V15H5.8a20 20 0 0 0 0 18l6.8-5.3Z"/><path fill="#1976D2" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4A20 20 0 0 0 5.8 15l6.8 5.3c1.6-4.8 6.1-8.2 11.4-8.2Z"/></svg>
          {isRegister ? "Daftar dengan Google" : "Masuk dengan Google"}
        </a>
        <p className="mt-5 text-center text-xs text-[#626B78]">
          {isRegister ? "Sudah memiliki akun? " : "Belum memiliki akun? "}
          <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-[#2457C5] hover:underline">
            {isRegister ? "Masuk" : "Daftar"}
          </Link>
        </p>

        {!isRegister && (
          <div className="mt-4 rounded-[6px] border border-[#D9DEE7] bg-[#F8FAFC] p-3 dark:border-[#343945] dark:bg-[#191C23]">
            <p className="text-[11px] font-semibold text-[#626B78] uppercase tracking-wider dark:text-[#B1B7C3]">
              Akun Demo Siap Pakai (1-Klik):
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setEmail("kevin.sanjaya@binus.ac.id");
                  setPassword("password123");
                }}
                className="flex items-center justify-between rounded border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:bg-[#20242D] dark:text-[#F3F4F6]"
              >
                <span className="font-medium">Kevin Sanjaya</span>
                <span className="text-[10px] text-[#2457C5] font-semibold uppercase">Peer-Tutor</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("budi.pratama@binus.ac.id");
                  setPassword("password123");
                }}
                className="flex items-center justify-between rounded border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:bg-[#20242D] dark:text-[#F3F4F6]"
              >
                <span className="font-medium">Budi Pratama</span>
                <span className="text-[10px] text-emerald-600 font-semibold uppercase">Mahasiswa</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@boosteracademy.id");
                  setPassword("password123");
                }}
                className="flex items-center justify-between rounded border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:bg-[#20242D] dark:text-[#F3F4F6]"
              >
                <span className="font-medium">Booster Academy</span>
                <span className="text-[10px] text-purple-600 font-semibold uppercase">Mitra Bootcamp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
