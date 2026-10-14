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
  "Computer Science",
  "Information Systems",
  "Software Engineering",
  "Data Science",
  "Cyber Security",
  "Game Application and Technology",
  "Business Management",
  "Accounting & Finance",
  "Industrial Engineering",
];

export default function OnboardingPage() {
  const router = useRouter();
  const existingUser = getStoredUser();

  const [campus, setCampus] = useState(existingUser.campus || "BINUS University");
  const [major, setMajor] = useState(existingUser.major || "Computer Science");
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
      className="min-h-[calc(100vh-74px)] flex items-center justify-center p-4 sm:p-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/bg-auth.png')",
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-md p-8 sm:p-10 shadow-2xl ring-1 ring-slate-200/80">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 shadow-inner">
            <GraduationCap className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Lengkapi Profil Akademik
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            Pilih kampus dan jurusan asalmu agar NEXIERA dapat merekomendasikan mata kuliah dan tutor sebaya yang relevan dengan kurikulum semestermu.
          </p>
        </div>

        <form onSubmit={handleFinish} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              Kampus Asal <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {CAMPUSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
            <p className="mt-1 text-[11px] text-blue-600 font-medium">
              <Check className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Didukung penuh integrasi modul kurikulum BINUS University
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              Program Studi / Jurusan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                Tingkat Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
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
              <label className="mb-1.5 block text-xs font-bold text-slate-700">
                NIM / ID Mahasiswa (Simulasi Verifikasi)
              </label>
              <input
                type="text"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="2601987654"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-3.5 text-xs text-emerald-800">
            <div className="flex items-center gap-2 font-bold mb-0.5">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Verifikasi Status Mahasiswa Kampus
            </div>
            <p className="text-[11px] text-emerald-700/90">
              Dengan melengkapi profil, akunmu otomatis mendapatkan badge <b>Terverifikasi Mahasiswa BINUS</b> di navbar dan kartu profil tutor.
            </p>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {isVerifying ? "Menyimpan & Memverifikasi..." : <>Simpan Profil &amp; Masuk ke Dashboard <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
