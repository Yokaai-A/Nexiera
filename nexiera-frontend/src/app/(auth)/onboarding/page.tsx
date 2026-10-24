"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeCheck, Check, ChevronDown, GraduationCap } from "lucide-react";
import { getStoredUser, saveStoredUser } from "@/src/lib/storage";

const CAMPUSES = [
  "BINUS University",
  "Universitas Indonesia (UI)",
  "Institut Teknologi Bandung (ITB)",
  "Universitas Gadjah Mada (UGM)",
  "Institut Teknologi Sepuluh Nopember (ITS)",
];

const MAJORS = [
  "Teknik Informatika",
  "Sistem Informasi",
  "Rekayasa Perangkat Lunak",
  "Sains Data",
  "Keamanan Siber",
  "Teknologi Permainan",
  "Manajemen",
  "Akuntansi",
  "Teknik Industri",
];

export default function OnboardingPage() {
  const router = useRouter();
  const existingUser = getStoredUser();

  const [campus, setCampus] = useState(existingUser.campus || "BINUS University");
  const [major, setMajor] = useState(existingUser.major || "Teknik Informatika");
  const [semester, setSemester] = useState(existingUser.semester || "Semester 3");
  const [nim, setNim] = useState("2601987654");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    saveStoredUser({
      campus,
      major,
      semester,
      isCampusVerified: true,
      isLoggedIn: true,
    });

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div
      className="min-h-[calc(100vh-74px)] flex items-center justify-center p-4 sm:p-6 bg-white"
    >
      <div className="w-full max-w-xl rounded-[6px] border border-[#D9DEE7] bg-white p-8 sm:p-10">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0] text-[#2457C5]">
            <GraduationCap className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#20232B]">
            Lengkapi Profil Akademik
          </h1>
          <p className="mt-2 text-sm text-[#626B78] max-w-md mx-auto">
            Pilih kampus dan jurusan asalmu agar NEXIERA dapat merekomendasikan mata kuliah dan tutor sebaya yang relevan dengan kurikulum semestermu.
          </p>
        </div>

        <form onSubmit={handleFinish} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#20232B]">
              Kampus Asal <span className="text-[#2457C5]">*</span>
            </label>
            <div className="relative">
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full appearance-none rounded-[4px] border border-[#D9DEE7] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20232B] outline-none focus:border-[#2457C5]"
              >
                {CAMPUSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626B78]" aria-hidden="true" />
            </div>
            <p className="mt-1 text-xs text-[#2457C5] font-medium flex items-center gap-1">
              <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> Didukung penuh integrasi modul kurikulum BINUS University
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#20232B]">
              Program Studi / Jurusan <span className="text-[#2457C5]">*</span>
            </label>
            <div className="relative">
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full appearance-none rounded-[4px] border border-[#D9DEE7] bg-white px-3.5 py-2.5 text-sm font-normal text-[#20232B] outline-none focus:border-[#2457C5]"
              >
                {MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626B78]" aria-hidden="true" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#20232B]">
                Tingkat Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full appearance-none rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs font-normal text-[#20232B] outline-none focus:border-[#2457C5]"
              >
                <option value="Semester 1">Semester 1 (Freshman)</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3 (Sophomore)</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5 (Junior)</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7+">Semester 7+ (Senior / Skripsi)</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#20232B]">
                NIM / ID Mahasiswa (Simulasi Verifikasi)
              </label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="2601987654"
                className="w-full rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs text-[#20232B] outline-none focus:border-[#2457C5]"
              />
            </div>
          </div>

          <div className="rounded-[6px] border border-[#D9DEE7] bg-[#E5E9F0]/30 p-3.5 text-xs text-[#20232B]">
            <div className="flex items-center gap-1.5 font-semibold text-[#20232B] mb-1">
              <BadgeCheck className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /> Verifikasi Status Mahasiswa Kampus
            </div>
            <p className="text-xs text-[#626B78]">
              Dengan melengkapi profil, akunmu otomatis mendapatkan status <b>Terverifikasi Mahasiswa BINUS</b> di navbar dan kartu profil tutor.
            </p>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isVerifying ? "Menyimpan & Memverifikasi..." : <>Simpan Profil &amp; Masuk ke Dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
