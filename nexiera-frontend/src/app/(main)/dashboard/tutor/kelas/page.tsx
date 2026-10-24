"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, PlusCircle, Users2, FileCheck2 } from "lucide-react";
import { nexieraApi, type ApiClass } from "@/src/lib/api";

export default function KelolaKelasPage() {
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    nexieraApi
      .myClasses()
      .then((data) => {
        if (active) setClasses(Array.isArray(data) ? data : (data.created ?? []));
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error ? cause.message : "Daftar kelas gagal dimuat.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#2457C5] dark:text-[#78A0FF]">
            <FileCheck2 className="h-4 w-4" /> Manajemen Kelas Bimbingan
          </span>
          <h1 className="mt-2 text-lg font-bold text-[#20232B] dark:text-[#F3F4F6]">
            Kelas yang Anda Kelola
          </h1>
          <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Kelola jadwal, link tatap muka, materi kurikulum, serta status publikasi bimbingan akademik Anda.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/buat-kelas"
          className="btn-primary btn-dashboard-action inline-flex items-center"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Buat Kelas Baru</span>
        </Link>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-[4px] border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {/* Konten Daftar Kelas */}
      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        {loading ? (
          <p className="py-6 text-xs text-[#626B78] dark:text-[#B1B7C3]">Memuat data kelas...</p>
        ) : classes.length === 0 ? (
          <div className="py-6 text-center">
            <p className="font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              Belum ada kelas yang dibuat.
            </p>
            <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
              Buka bimbingan pertamamu untuk mulai berbagi ilmu dan mendapatkan penghasilan.
            </p>
            <Link
              href="/dashboard/tutor/buat-kelas"
              className="btn-primary btn-dashboard-action mt-5 inline-flex items-center"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Buat Kelas Pertama</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map((item) => {
              const isCancelled = item.status === "CANCELLED";
              const isBootcamp = item.courseType === "BOOTCAMP";

              return (
                <article
                  key={item.id}
                  className="flex flex-col gap-3 rounded-[6px] border border-[#D9DEE7] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#343945] dark:bg-[#111318]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-xs font-semibold text-[#2457C5] uppercase dark:border-[#343945] dark:bg-slate-800 dark:text-[#78A0FF]">
                        {isBootcamp ? "BOOTCAMP" : "PEER-TUTORING"}
                      </span>
                      <span
                        className={`rounded-[4px] px-2 py-0.5 text-xs font-semibold ${
                          item.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                            : isCancelled
                              ? "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                              : "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {item.status || "DRAFT"}
                      </span>
                    </div>

                    <h2 className="mt-2 text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                      {item.major || "Jurusan belum dicantumkan"} ·{" "}
                      {item.university || "Kampus belum dicantumkan"}
                    </p>
                    <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                      <CalendarDays className="mr-1 inline h-3.5 w-3.5 text-[#2457C5] dark:text-[#78A0FF]" />
                      {item.startsAt
                        ? new Intl.DateTimeFormat("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(item.startsAt))
                        : "Jadwal belum ditentukan"}{" "}
                      · Kuota: {item.maxQuota ?? "Tidak Dibatasi"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <Link
                      href="/dashboard/tutor/peserta"
                      className="btn-secondary btn-dashboard-action inline-flex items-center"
                    >
                      <Users2 className="h-3.5 w-3.5" />
                      Peserta
                    </Link>
                    <Link
                      href={`/dashboard/tutor/kelas/${encodeURIComponent(item.id)}`}
                      className="btn-primary btn-dashboard-action"
                    >
                      Kelola
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
