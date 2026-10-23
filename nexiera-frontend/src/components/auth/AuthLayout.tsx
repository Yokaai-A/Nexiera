"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Landmark } from "lucide-react";

function TabToggle() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div className="mx-auto flex w-fit items-center rounded-[4px] border border-[#D9DEE7] bg-white p-0.5">
      <Link
        href="/login"
        className={`rounded-[4px] px-5 py-1.5 text-xs font-medium transition-colors ${
          isLogin ? "bg-[#2457C5] text-white" : "text-[#20232B] hover:bg-[#E5E9F0]"
        }`}
      >
        Login
      </Link>
      <Link
        href="/register"
        className={`rounded-[4px] px-5 py-1.5 text-xs font-medium transition-colors ${
          !isLogin ? "bg-[#2457C5] text-white" : "text-[#20232B] hover:bg-[#E5E9F0]"
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
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center p-4 sm:p-6 bg-white">
      <div className="grid w-full max-w-3xl overflow-hidden rounded-[6px] border border-[#D9DEE7] bg-white md:grid-cols-2">
        <div className="flex flex-col p-8 sm:p-10">
          <TabToggle />
          <div className="mt-6 flex-1 flex flex-col justify-center">{children}</div>
        </div>

        <div className="hidden flex-col items-center justify-center p-8 sm:p-10 md:flex border-l border-[#D9DEE7] bg-[#E5E9F0]/40">
          <div className="text-center">
            <span className="rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-1 text-xs font-medium text-[#20232B] uppercase tracking-wider">
              NEXIERA Akademik
            </span>
            <h2 className="mt-5 text-2xl font-semibold text-[#20232B]">
              {isLogin ? "Selamat Datang Kembali" : "Mulai Belajar Bersama"}
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-[#626B78] max-w-xs mx-auto">
              {isLogin
                ? "Akses tautan catatan belajar, ruang bimbingan mata kuliah, dan persiapan ujianmu."
                : "Tingkatkan pemahaman mata kuliah bersama mahasiswa dan tutor sebaya."}
            </p>

            <div className="mt-6 rounded-[4px] border border-[#D9DEE7] bg-white p-4 text-left text-xs text-[#20232B]">
              <div className="flex items-center gap-2 font-medium text-[#20232B] mb-1">
                <Landmark className="h-3.5 w-3.5 text-[#2457C5]" aria-hidden="true" /> Khusus Mahasiswa Kampus
              </div>
              <p className="text-[11px] text-[#626B78] leading-relaxed">
                Bimbingan terarah spesifik silabus perkuliahan untuk persiapan ujian UTS dan UAS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
