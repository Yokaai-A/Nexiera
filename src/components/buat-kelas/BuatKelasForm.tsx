"use client";

import { useState } from "react";

/* ── shared pieces ────────────────────────────────────────────── */

function SectionTitle({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
        {num}
      </span>
      <h2 className="text-base font-semibold text-slate-900">{label}</h2>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const selectCls = inputCls + " appearance-none pr-8";

/* ── form body ────────────────────────────────────────────────── */

export function BuatKelasForm() {
  const [type, setType] = useState<"bootcamp" | "peer">("bootcamp");
  const [model, setModel] = useState<"gratis" | "berbayar">("gratis");

  return (
    <form className="space-y-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 md:p-8">

      {/* ── 1. Program & Kategori Header ──────────────────────── */}
      <section>
        <SectionTitle num="1" label="Program & Kategori Header" />
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Kategori Bidang / Jurusan" required>
            <div className="relative">
              <input type="text" placeholder="Computer Science" className={inputCls} />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">˅</span>
            </div>
          </Field>
          <Field label="Inststitusi / Universitas" required>
            <div className="relative">
              <input type="text" placeholder="Binus University" className={inputCls} />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">˅</span>
            </div>
          </Field>
          <Field label="Nama Bootcamp / Event" required hint="Maksimal 90 karakter">
            <input type="text" placeholder="Nicholas Bootcamp" className={inputCls} />
          </Field>
          <Field label="Deskripsi Singkat / Rangkasan Materi" required hint="60/500">
            <textarea
              rows={2}
              placeholder="Untuk semester 1-4"
              className={inputCls + " resize-none"}
            />
          </Field>
          <Field label="Tentang Bootcamp" required hint="60/1000" className="md:col-span-2">
            <textarea
              rows={4}
              placeholder="Program bimbingan intensif yang dirancang khusus untuk membantu kamu menguasai materi perkuliahan secara terstruktur. Dilengkapi dengan Akses Catatan Rapi for Notion (Notion Study Hub) yang mencakup rangkuman materi, pembahasan latihan soal, hingga persiapan ujian."
              className={inputCls + " resize-none"}
            />
          </Field>
          <Field label="Syarat & Prasyarat" required>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <span className="text-blue-500">+</span> Tambah Syarat &amp; Prasyarat
            </button>
          </Field>
          <Field label="Fasilitas & Metode Belajar" required>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <span className="text-blue-500">+</span> Tambah Fasilitas &amp; Metode Belajar
            </button>
          </Field>
        </div>
      </section>

      {/* ── 2. Detail & Spesifikasi Event ─────────────────────── */}
      <section>
        <SectionTitle num="2" label="Detail & Spesifikasi Event (Metadata Kartu)" />
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Tanggal Pelaksanaan" required>
            <div className="relative">
              <input type="text" placeholder="10 Januari 2026" className={inputCls} />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">📅</span>
            </div>
          </Field>
          <Field label="Format / Tempat Event" required>
            <div className="relative">
              <input type="text" placeholder="Online" className={inputCls} />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🖥</span>
            </div>
          </Field>
          <Field label="Masa Akses Materi" required>
            <div className="relative">
              <input type="text" placeholder="Selamanya (Lifetime Access)" className={inputCls} />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">˅</span>
            </div>
          </Field>
          <div>
            <Field label="Sisa Kuota / Batas Peserta" required>
              <div className="relative">
                <input type="number" value={20} min={0} className={inputCls} />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">👥</span>
              </div>
              <p className="mt-1 text-[11px] text-red-500">
                Akan ditampilkan di badge kartu: <b>Sisa 20 kuota</b>
              </p>
            </Field>
          </div>
        </div>
      </section>

      {/* ── 3. Penyelenggara ───────────────────────────────────── */}
      <section>
        <SectionTitle num="3" label="Penyelenggara" />
        <div className="rounded-xl border border-slate-200 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl">
              👤
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Avatar otomatis atau unggah file foto pengajar.
            </p>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Nama Penyelenggara" required>
              <input type="text" placeholder="Nicholas Aryan" className={inputCls} />
            </Field>
            <Field label="Peran / Identitas Penyelenggara" required>
              <input
                type="text"
                placeholder="Mahasiswa Computer Science"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* ── 4. Tipe Kelas ──────────────────────────────────────── */}
      <section>
        <SectionTitle num="4" label="Tipe Kelas" />
        <Field label="Tipe struktur kelas" required>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("bootcamp")}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                type === "bootcamp"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Bootcamp
            </button>
            <button
              type="button"
              onClick={() => setType("peer")}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                type === "peer"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Peer - Tutoring
            </button>
          </div>
        </Field>
      </section>

      {/* ── 5. Kapasitas & Biaya Pendaftaran ───────────────────── */}
      <section>
        <SectionTitle num="5" label="Kapasitas & Biaya Pendaftaran" />
        <Field label="Model Biaya" required>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setModel("gratis")}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                model === "gratis"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              ✓ Gratis
            </button>
            <button
              type="button"
              onClick={() => setModel("berbayar")}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                model === "berbayar"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              💳 Berbayar
            </button>
          </div>
          {model === "berbayar" && (
            <div className="mt-3">
              <Field label="Harga (Rp)" required>
                <input type="number" placeholder="0" className={inputCls} />
              </Field>
            </div>
          )}
        </Field>
      </section>

      {/* ── actions ────────────────────────────────────────────── */}
      <div className="flex flex-col items-end justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Batal &amp; Kembali
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Publikasikan Kelas <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}
