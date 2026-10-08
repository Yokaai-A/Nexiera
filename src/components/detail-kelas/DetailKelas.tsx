"use client";

import Link from "next/link";
import { useState } from "react";

/* ── small helpers ─────────────────────────────────────────────── */

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-xs text-blue-700">
      {children}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5 0a9 9 0 1 1-9-9 9 9 0 0 1 9 9z" />
    </svg>
  );
}

/* ── main component ────────────────────────────────────────────── */

export function DetailKelas() {
  const [univ, setUniv] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-background">

      {/* ── breadcrumb bar ────────────────────────────────────── */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-6 py-3 text-xs text-slate-500">
          <Link href="/cari-kelas" className="flex items-center gap-1 text-blue-600 hover:underline">
            <span>🔍</span> Cari Kelas
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">Bootcamp Nicholas</span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* ── header card ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-blue-700">
                  🏛 BINUS UNIVERSITY – COMPUTER SCIENCE
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                  ✓ Verifikasi Resmi Kampus
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-slate-900">
                Booster Bootcamp
              </h1>
              <p className="mt-1 text-sm text-slate-500">Untuk semester 1 – 4</p>
            </div>
          </div>

          {/* stat row */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-[10px] font-semibold tracking-wider text-slate-400">
                DURASI
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-800">
                <span>📅</span> Selamanya
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-[10px] font-semibold tracking-wider text-slate-400">
                METODE
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-800">
                <span>📓</span> Notion
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-[10px] font-semibold tracking-wider text-slate-400">
                TINGKAT
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-800">
                <span>📊</span> Semester 1 – 4
              </div>
            </div>
          </div>
        </div>

        {/* ── main content: two columns ────────────────────────── */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* ── LEFT COLUMN ───────────────────────────────────── */}
          <div className="space-y-8">

            {/* Tentang Bootcamp */}
            <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-600 text-sm text-white">
                  📄
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Tentang Bootcamp
                </h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                Program bimbingan intensif yang dirancang khusus untuk membantu kamu
                menguasai materi perkuliahan secara terstruktur. Dilengkapi dengan
                Akses Catatan Rapi via Notion (Notion Study Hub) yang mencakup
                rangkuman materi, pembahasan latihan soal, hingga persiapan ujian.
              </p>
            </section>

            {/* Yang akan anda pelajari */}
            <section>
              <h2 className="text-base font-bold text-slate-900">
                📚 Yang akan anda pelajari
              </h2>
              <div className="mt-4 space-y-4">
                {[
                  {
                    bold: "Algorithm and Programming",
                    rest: ": Fondasi logika pemrograman, struktur kontrol, dan sintaks dasar.",
                  },
                  {
                    bold: "Algorithm Design and Analysis",
                    rest: ": Analisis kompleksitas (Big-O), efisiensi algoritma, dan strategi pemecahan masalah.",
                  },
                  {
                    bold: "Software Engineering",
                    rest: ": Prinsip rekayasa perangkat lunak, metodologi pengembangan, dan arsitektur sistem.",
                  },
                  {
                    bold: "Computational Physics",
                    rest: ": Pemodelan dan pemecahan masalah fisika menggunakan pendekatan komputasi.",
                  },
                ].map((item) => (
                  <div key={item.bold} className="flex gap-3">
                    <CheckIcon />
                    <p className="text-sm leading-relaxed text-slate-700">
                      <span className="font-semibold text-slate-900">{item.bold}</span>
                      {item.rest}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Syarat & Prasyarat */}
            <section>
              <h2 className="text-base font-bold text-slate-900">
                📋 Syarat &amp; Prasyarat
              </h2>
              <div className="mt-4 flex gap-3">
                <CheckIcon />
                <p className="text-sm leading-relaxed text-slate-700">
                  <span className="font-semibold text-slate-900">
                    Status Mahasiswa Aktif:
                  </span>{" "}
                  Mahasiswa semester 1–4 aktif di Universitas Bina Nusantara
                  Sejabodetabek dan sedang menjalankan mata kuliah yang akan
                  dipejam dari bootcamp ini.
                </p>
              </div>
            </section>

            {/* Fasilitas & Metode Belajar */}
            <section>
              <h2 className="text-base font-bold text-slate-900">
                🛠 Fasilitas &amp; Metode Belajar:
              </h2>
              <div className="mt-4 space-y-4">
                {[
                  {
                    bold: "Notion Academic Hub",
                    rest: ": Akses catatan kuliah yang rapi, cheatsheet, serta rangkuman formula/konsep penting.",
                  },
                  {
                    bold: "Pembahasan Soal & Studi Kasus",
                    rest: ": Latihan soal UTS/UAS dan bedah studi kasus yang sering keluar dalam perkuliahan.",
                  },
                  {
                    bold: "Persiapan Praktikum & Tugas",
                    rest: ": Bimbingan pemahaman logika dasar untuk menyelesaikan tugas perkuliahan.",
                  },
                ].map((item) => (
                  <div key={item.bold} className="flex gap-3">
                    <CheckIcon />
                    <p className="text-sm leading-relaxed text-slate-700">
                      <span className="font-semibold text-slate-900">{item.bold}</span>
                      {item.rest}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ── RIGHT COLUMN: registration card ──────────────── */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

              {/* Deadline */}
              <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3">
                <div>
                  <div className="text-[10px] font-semibold tracking-wider text-red-500">
                    BATAS PENDAFTARAN
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-900">
                    25 Nov 2024
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-500">Kuota Tersis</div>
                  <div className="text-sm font-bold text-slate-900">
                    240 / 300 Mahasiswa
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: "80%" }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Kuota Tersisa</span>
                  <span>240 / 300</span>
                </div>
              </div>

              {/* Biaya */}
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <div className="text-[10px] font-semibold tracking-wider text-slate-400">
                  BIAYA PROGRAM
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900">GRATIS</span>
                  <span className="text-sm text-slate-400 line-through">
                    Rp 45.000
                  </span>
                  <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    ✓
                  </span>
                </div>
                <p className="mt-2 text-[11px] italic leading-relaxed text-slate-400">
                  *Didana penuh melalui insiatif riset kolaboratif Binus Computer
                  Science dengan Fakultas UI.
                </p>

                <div className="mt-4 text-[11px] font-semibold tracking-wider text-slate-400">
                  BENEFIT TERMASUK:
                </div>
                <div className="mt-2 flex gap-2 text-sm text-slate-700">
                  <span className="text-emerald-600">✓</span>
                  Akses Notion Selamanya
                </div>
              </div>

              {/* Form */}
              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Universitas
                  </label>
                  <div className="relative">
                    <select
                      value={univ}
                      onChange={(e) => setUniv(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Pilih Perguruan Tinggi Aida…</option>
                      <option value="binus">Binus University</option>
                      <option value="ui">Universitas Indonesia</option>
                      <option value="ugm">UGM</option>
                      <option value="itb">ITB</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      ˅
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Nomor Induk Mahasiswa (NIM){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Contoh: 2166728192"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email pribadi Anda…"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* CTA buttons */}
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <span>👤</span> Daftar Sekarang (Gratis)
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <span>📌</span> Simpan ke Wishlist
                </button>

                {/* Footer links */}
                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                  <span>Ada Pertanyaan?</span>
                  <span className="flex items-center gap-1 font-medium text-blue-600">
                    <span>📞</span> PIC Mahasiswa
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <span>💬</span> Discord Komunitas
                  </span>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
