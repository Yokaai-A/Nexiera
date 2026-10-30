"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "./AuthLayout";
import { getBrowserAuthUrl, nexieraApi } from "@/src/lib/api";
import { refreshUser } from "@/src/store/useUserStore";

type AuthFormProps = { mode: "login" | "register" };
const phonePattern = /^\+?[0-9\s().-]{8,32}$/;
const fieldClass = "nx-input mt-1.5 h-11 w-full bg-white px-3 text-sm";

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registrationPendingEmail, setRegistrationPendingEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [showLoginResend, setShowLoginResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setShowLoginResend(false);
    setResendMessage("");
    if (isRegister && !phonePattern.test(phoneNumber.trim())) {
      setError("Masukkan nomor WhatsApp yang valid.");
      return;
    }
    setSubmitting(true);
    try {
      if (isRegister) {
        const result = await nexieraApi.register({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
        });
        if (result.user) {
          await refreshUser();
          router.replace("/dashboard");
          return;
        }
        setRegistrationPendingEmail(email.trim());
        setVerificationUrl(result.verificationUrl || "");
        setSubmitting(false);
        return;
      } else {
        await nexieraApi.login({ email: email.trim(), password });
      }
      await refreshUser();
      router.replace("/dashboard");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Autentikasi gagal. Silakan coba lagi.";
      setError(message);
      setShowLoginResend(!isRegister && /verifikasi email/i.test(message));
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
        {registrationPendingEmail ? <section className="space-y-3 rounded-[6px] border border-blue-200 bg-blue-50 p-4 text-sm text-[#20232B] dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"><h2 className="font-bold">{verificationUrl ? "Verifikasi Akun" : "Periksa email Anda"}</h2><p className="text-xs leading-5 text-[#465166] dark:text-slate-300">{verificationUrl ? <>Buka tautan berikut untuk memverifikasi akun <b>{registrationPendingEmail}</b>.</> : <>Kami mengirim tautan verifikasi ke <b>{registrationPendingEmail}</b>. Verifikasi email sebelum masuk. Tautan berlaku 24 jam.</>}</p>{verificationUrl && <a href={verificationUrl} className="btn-primary flex w-full justify-center">Buka tautan verifikasi</a>}<button type="button" className="btn-secondary w-full justify-center" onClick={() => void nexieraApi.resendVerification(registrationPendingEmail).then((result) => { setResendMessage(result.message); if (result.verificationUrl) setVerificationUrl(result.verificationUrl); }).catch((cause) => setResendMessage(cause instanceof Error ? cause.message : "Gagal mengirim ulang."))}>Kirim ulang tautan</button>{resendMessage && <p role="status" className="text-xs text-[#465166] dark:text-slate-300">{resendMessage}</p>}<Link className="block text-center text-sm font-semibold text-[#2457C5] dark:text-blue-300" href="/login">Kembali ke masuk</Link></section> : <>
        <form onSubmit={(event) => void submit(event)} className="space-y-3.5">
          {isRegister && <label className="block text-[13px] font-semibold text-[#20232B]">Nama lengkap<input name="fullName" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required minLength={2} maxLength={191} className={fieldClass} /></label>}
          <label className="block text-[13px] font-semibold text-[#20232B]">Email<input name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={191} className={fieldClass} placeholder="nama@email.com" /></label>
          {isRegister && <label className="block text-[13px] font-semibold text-[#20232B]">Nomor WhatsApp<input name="phoneNumber" type="tel" autoComplete="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} required minLength={8} maxLength={32} pattern="\+?[0-9\s().-]{8,32}" className={fieldClass} placeholder="+62 812 3456 7890" /></label>}
          <div>
            <label htmlFor="auth-password" className="block text-[13px] font-semibold text-[#20232B]">Password</label>
            <div className="relative mt-1.5">
              <input id="auth-password" name="password" type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} maxLength={72} className={`${fieldClass} pr-12`} placeholder={isRegister ? "Minimal 6 karakter" : "Masukkan password"} />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-[4px] text-[#626B78] transition-colors hover:text-[#2457C5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2457C5]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </div>
          {error && <p role="alert" className="rounded-[4px] border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">{error}</p>}
          {showLoginResend && <div className="rounded-[4px] border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"><p>Belum menerima tautan verifikasi?</p><button type="button" disabled={resending || !email.trim()} onClick={() => { setResending(true); setResendMessage(""); void nexieraApi.resendVerification(email.trim()).then((result) => { setResendMessage(result.message); setVerificationUrl(result.verificationUrl || ""); }).catch((cause) => { const message = cause instanceof Error ? cause.message : "Permintaan kirim ulang gagal."; setResendMessage(/too many requests|throttlerexception/i.test(message) ? "Batas kirim ulang tercapai. Coba lagi setelah 15 menit." : message); }).finally(() => setResending(false)); }} className="mt-2 cursor-pointer font-semibold text-[#2457C5] underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-300">{resending ? "Mengirim ulang..." : "Kirim ulang tautan"}</button>{resendMessage && <p role="status" className="mt-2">{resendMessage} {!verificationUrl && "Jika email belum tiba, periksa folder spam."}</p>}{verificationUrl && <a href={verificationUrl} className="mt-2 inline-block font-semibold text-[#2457C5] underline dark:text-blue-300">Buka tautan verifikasi lokal</a>}</div>}
          <button type="submit" disabled={submitting} className="btn-primary mt-1 h-11 w-full text-sm font-semibold disabled:cursor-wait disabled:opacity-60">
            {submitting ? "Memproses…" : isRegister ? "Buat akun" : "Masuk"}
          </button>
        </form>
        <div className="my-4 flex items-center gap-3 text-[11px] font-medium text-[#8892A0]"><span className="h-px flex-1 bg-[#D9DEE7]" />atau<span className="h-px flex-1 bg-[#D9DEE7]" /></div>
        <a
          href={getBrowserAuthUrl("/auth/google")}
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
                  setEmail("budi@student.com");
                  setPassword("password123");
                }}
                className="flex items-center justify-between rounded border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:bg-[#20242D] dark:text-[#F3F4F6]"
              >
                <div className="flex flex-col text-left">
                  <span className="font-medium">Budi Pratama</span>
                  <span className="text-[10px] text-[#626B78] dark:text-[#9DA4B0]">budi@student.com (Semua Peran Terbuka)</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold uppercase">Demo Evaluasi</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("kevin@student.com");
                  setPassword("password123");
                }}
                className="flex items-center justify-between rounded border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:bg-[#20242D] dark:text-[#F3F4F6]"
              >
                <div className="flex flex-col text-left">
                  <span className="font-medium">Kevin Sanjaya</span>
                  <span className="text-[10px] text-[#626B78] dark:text-[#9DA4B0]">kevin@student.com</span>
                </div>
                <span className="text-[10px] text-[#2457C5] font-semibold uppercase">Peer-Tutor</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("rafi.pratama@student.ac.id");
                  setPassword("password123");
                }}
                className="flex items-center justify-between rounded border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:bg-[#20242D] dark:text-[#F3F4F6]"
              >
                <div className="flex flex-col text-left">
                  <span className="font-medium">Rafi Pratama</span>
                  <span className="text-[10px] text-[#626B78] dark:text-[#9DA4B0]">rafi.pratama@student.ac.id</span>
                </div>
                <span className="text-[10px] text-purple-600 font-semibold uppercase">Mitra Bootcamp</span>
              </button>
            </div>
          </div>
        )}
        </>}
      </div>
    </AuthLayout>
  );
}
