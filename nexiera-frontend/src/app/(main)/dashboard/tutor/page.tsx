"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, PlusCircle, Users2 } from "lucide-react";
import { nexieraApi, type DashboardData } from "@/src/lib/api";
import { useUserStore } from "@/src/store/useUserStore";

const money = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function TutorOverviewPage() {
  const user = useUserStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    nexieraApi
      .dashboard()
      .then((value) => {
        if (active) setData(value);
      })
      .catch((cause) => {
        if (active) {
          setData(null);
          setError(cause instanceof Error ? cause.message : "Ringkasan pengajar gagal dimuat.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const classes = data?.classes || [];
  const activeCount = classes.filter((item) => item.status === "ACTIVE").length;

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2457C5] dark:text-[#78A0FF]">
            Area Pengajar &amp; Penyelenggara
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-[#20232B] dark:text-[#F3F4F6]">
            Ringkasan Pengajar{user.name ? ` · ${user.name}` : ""}
          </h1>
          <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Metrik operasional bimbingan, partisipasi peserta, dan analitik promosi kelas Anda.
          </p>
        </div>
        <Link href="/dashboard/tutor/buat-kelas" className="btn-primary btn-dashboard-action">
          <PlusCircle className="inline h-3.5 w-3.5" />
          Buat Kelas Baru
        </Link>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-[4px] border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          <p>Dashboard gagal memuat data: {error}</p>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-2 font-semibold underline">
            Coba muat ulang
          </button>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Kelas Aktif", loading ? "Memuat..." : data ? activeCount : "—"],
          ["Peserta Terdaftar", loading ? "Memuat..." : data?.students.length ?? "—"],
          ["Total Pendapatan Kotor", loading ? "Memuat..." : data ? money(data.totalRevenue) : "—"],
          ["Rata-Rata CTR Iklan", loading ? "Memuat..." : data ? `${data.adMetrics.ctr.toFixed(2)}%` : "—"],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3]">{label}</p>
            <p className="mt-1.5 break-words text-xl sm:text-2xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
              {value}
            </p>
          </article>
        ))}
      </div>

      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9DEE7] pb-4 dark:border-[#343945]">
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              Kelas yang Dikelola
            </h2>
            <p className="mt-0.5 text-xs text-[#626B78] dark:text-[#B1B7C3]">
              {loading ? "Memuat kelas..." : `${classes.length} kelas aktif dan draft di akun Anda`}
            </p>
          </div>
          <Link
            href="/dashboard/tutor/kelas"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#2457C5] hover:text-[#1D4ED8] dark:text-[#78A0FF]"
          >
            Kelola Semua Kelas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <p className="py-6 text-xs text-[#626B78] dark:text-[#B1B7C3]">Memuat kelas yang Anda kelola...</p>
        ) : error ? (
          <p className="py-6 text-center text-xs text-[#626B78] dark:text-[#B1B7C3]">Data kelas belum tersedia karena dashboard gagal dimuat.</p>
        ) : classes.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              Belum ada kelas yang dibuat.
            </p>
            <p className="mt-1.5 text-xs text-[#626B78] dark:text-[#B1B7C3]">
              Publikasikan kelas bimbingan atau bootcamp pertama Anda untuk mulai menerima peserta.
            </p>
            <Link href="/dashboard/tutor/buat-kelas" className="btn-primary btn-dashboard-action mt-5 inline-flex">
              Buat Kelas Pertama
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#D9DEE7] dark:divide-[#343945]">
            {classes.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#2457C5] dark:text-[#78A0FF]">
                    {item.status || "DRAFT"}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                    {item.startsAt
                      ? new Intl.DateTimeFormat("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(item.startsAt))
                      : "Jadwal belum ditentukan"}
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <Link href="/dashboard/tutor/peserta" className="btn-secondary btn-dashboard-action">
                    <Users2 className="inline h-3.5 w-3.5" />
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
