"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Landmark } from "lucide-react";

function TabToggle() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div className="mx-auto flex w-fit items-center rounded-full bg-slate-100 p-1 shadow-inner">
      <Link
        href="/login"
        className={`rounded-full px-6 py-2 text-xs font-bold transition-all ${
          isLogin ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
        }`}
      >
        Login
      </Link>
      <Link
        href="/register"
        className={`rounded-full px-6 py-2 text-xs font-bold transition-all ${
          !isLogin ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
        }`}
      >
        Register
      </Link>
    </div>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div
      className="min-h-[calc(100vh-74px)] flex items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/bg-auth.png')",
      }}
    >
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-slate-200/80 md:grid-cols-2">
        {/* LEFT — form panel */}
        <div className="flex flex-col p-8 sm:p-10">
          <TabToggle />
          <div className="mt-6 flex-1 flex flex-col justify-center">{children}</div>
        </div>

        {/* RIGHT — welcome panel */}
        <div
          className="hidden flex-col items-center justify-center p-10 md:flex relative overflow-hidden"
          style={{
            background: "linear-gradient(150deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)",
          }}
        >
          <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-blue-400/20 blur-2xl" />
          <div className="relative text-center">
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-blue-200 uppercase tracking-widest backdrop-blur-sm">
              NEXIERA Academic Hub
            </span>
            <h2 className="mt-6 text-3xl font-black text-white sm:text-4xl">
              {isLogin ? "Welcome Back!" : "Gabung Komunitas!"}
            </h2>
            <p className="mt-3 text-sm font-medium text-blue-100 max-w-xs mx-auto leading-relaxed">
              {isLogin
                ? "Akses kembali catatan Notion, ruang bimbingan matkul, dan jadwal ujianmu."
                : "Tingkatkan IPK bersama ratusan mahasiswa & tutor sebaya terverifikasi."}
            </p>

            <div className="mt-8 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10 text-left text-xs text-blue-50">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <Landmark className="h-3.5 w-3.5" aria-hidden="true" /> Khusus Civitas Kampus
              </div>
              <p className="text-[11px] text-blue-100/80">
                100% bimbingan spesifik mata kuliah (AlgoProg, ADA, Software Engineering, dll.) untuk persiapan UTS &amp; UAS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
