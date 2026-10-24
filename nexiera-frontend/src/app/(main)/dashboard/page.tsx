"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ExternalLink,
  Mail,
  MessageCircle,
  MonitorPlay,
  Search,
  Video,
} from "lucide-react";
import { nexieraApi, type DashboardData } from "@/src/lib/api";
import { useUserStore } from "@/src/store/useUserStore";

function dateText(value: string | null, isBootcamp = false) {
  return value
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : isBootcamp ? "Jadwal bootcamp belum ditentukan" : "Jadwal belum ditentukan";
}

function whatsappUrl(phone: string, name: string, title: string) {
  const digits = phone.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${international}?text=${encodeURIComponent(
    `Halo kak ${name}, saya mahasiswa bimbingan kelas ${title} di NEXIERA.`,
  )}`;
}

export default function DashboardOverviewPage() {
  const router = useRouter();
  const user = useUserStore();
  const fullGreeting = user.name ? `HALO, ${user.name.toLocaleUpperCase("id-ID")}` : "HALO";
  const [typedGreeting, setTypedGreeting] = useState(fullGreeting);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedGreeting(fullGreeting);
      return;
    }

    let characterIndex = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;
    setTypedGreeting("");

    const animate = () => {
      if (!deleting && characterIndex <= fullGreeting.length) {
        setTypedGreeting(fullGreeting.slice(0, characterIndex));
        characterIndex += 1;
        timeout = setTimeout(animate, 85);
        return;
      }

      if (!deleting) {
        timeout = setTimeout(() => {
          deleting = true;
          animate();
        }, 1800);
        return;
      }

      if (characterIndex >= 0) {
        setTypedGreeting(fullGreeting.slice(0, characterIndex));
        characterIndex -= 1;
        timeout = setTimeout(animate, 42);
        return;
      }

      deleting = false;
      characterIndex = 0;
      timeout = setTimeout(animate, 500);
    };

    timeout = setTimeout(animate, 150);
    return () => clearTimeout(timeout);
  }, [fullGreeting]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    nexieraApi
      .dashboard()
      .then((value) => {
        if (active) {
          setData(value);
          if (value.role === "TUTOR") router.replace("/dashboard/tutor");
        }
      })
      .catch((cause) => {
        if (active) {
          setData(null);
          setError(cause instanceof Error ? cause.message : "Dashboard gagal dimuat.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey, router]);

  const classes = Array.from(new Map((data?.classes || []).map((item) => [item.id, item])).values());
  const transactions = data?.transactions || [];
  const attendedSessions = classes.length;

  return (
    <div className="space-y-4">
      {/* Header Sapaan Mahasiswa */}
      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <h1
          aria-label={fullGreeting}
          aria-live="off"
          className="min-h-[38px] text-2xl font-bold tracking-wide text-[#20232B] dark:text-[#F3F4F6] sm:min-h-[42px] sm:text-3xl"
        >
          {typedGreeting}<span aria-hidden="true" className="ml-0.5 inline-block h-6 border-l-2 border-[#2457C5] align-middle motion-safe:animate-pulse dark:border-[#78A0FF] sm:h-7" />
        </h1>
        <p className="mt-1 text-xs text-xs leading-relaxed text-[#626B78] dark:text-[#B1B7C3]">
          Selamat datang di dashboard akademik mahasiswa. Akses jadwal bimbingan, link tatap muka langsung, dan materi perkuliahan aktifmu.
        </p>
      </header>

      {error && (
        <div role="alert" className="rounded-[6px] border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <p>Data dashboard gagal dimuat: {error}</p>
          <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-3 font-semibold underline">
            Coba muat ulang
          </button>
        </div>
      )}

      {data?.role === "TUTOR" ? (
        <p className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 text-xs text-[#626B78] dark:border-[#343945] dark:bg-[#191C23] dark:text-[#B1B7C3]">
          Membuka dashboard pengajar...
        </p>
      ) : (
      <>

      {/* 3 Kartu Metrik Utama */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Kelas Diikuti", value: loading ? "—" : classes.length },
          { label: "Total Sesi Dihadiri", value: loading ? "—" : `${attendedSessions} Sesi` },
          { label: "Total Transaksi", value: loading ? "—" : transactions.length },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3]">
              {item.label}
            </p>
            <p className="mt-1.5 text-xl sm:text-2xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
              {item.value}
            </p>
          </article>
        ))}
      </div>

      {/* Section Kelas yang Sedang Diikuti */}
      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9DEE7] pb-3.5 dark:border-[#343945]">
          <div>
            <h2 className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              <BookOpen className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />
              Kelas yang Sedang Diikuti
            </h2>
            <p className="mt-0.5 text-xs text-[#626B78] dark:text-[#B1B7C3]">
              Tautan meeting tatap muka dan kontak pengajar untuk bimbingan terverifikasi.
            </p>
          </div>
          <Link
            href="/dashboard/kelas-saya"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#2457C5] hover:underline dark:text-[#78A0FF]"
          >
            Buka ruang belajar <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <p className="py-6 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Memuat data kelas...
          </p>
        ) : error ? (
          <div role="alert" className="py-6 text-center">
            <p className="text-xs font-semibold text-red-700 dark:text-red-300">Kelas tidak dapat dimuat: {error}</p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="btn-secondary btn-dashboard-action mt-4">
              Coba muat ulang
            </button>
          </div>
        ) : classes.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              Belum ada kelas yang diikuti
            </p>
            <p className="mt-1.5 text-xs text-[#626B78] dark:text-[#B1B7C3]">
              Kelas terdaftar akan muncul setelah pendaftaran dan status transaksi berhasil diverifikasi (PAID).
            </p>
            <Link
              href="/cari-kelas"
              className="btn-primary btn-dashboard-action mt-5 inline-flex items-center"
            >
              <Search className="h-3.5 w-3.5" />
              Cari Kelas Bimbingan
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#D9DEE7] dark:divide-[#343945]">
            {classes.slice(0, 5).map((item) => {
              const isCancelled = item.status === "CANCELLED";
              const isBootcamp = item.courseType === "BOOTCAMP" || item.type === "BOOTCAMP";
              const hasMeeting = Boolean(item.meetingUrl && !isCancelled);

              return (
                <article
                  key={item.id}
                  className="flex flex-col gap-2.5 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#2457C5] dark:border-[#343945] dark:bg-slate-800 dark:text-[#78A0FF]">
                        {isBootcamp ? "Bootcamp" : "Peer-Tutoring"}
                      </span>
                      {isCancelled && (
                        <span className="rounded-[4px] border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                          Kelas Dibatalkan — Dana Dikembalikan
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1.5 text-[13px] font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
                      <CalendarDays className="mr-1.5 inline h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />
                      {dateText(item.startsAt ?? null, isBootcamp)} <span className="rounded-[4px] bg-[#2457C5]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#2457C5] dark:text-[#78A0FF]">{isBootcamp ? "Bootcamp" : "Peer-Tutoring"}</span> · Pengajar: <b>{item.tutor?.name ?? item.creator?.name ?? "—"}</b>
                    </p>

                    {/* Kontak Langsung WhatsApp & Email Tutor */}
                    <div className="mt-2 flex items-center gap-2.5 text-[11px]">
                      <span className="text-[#626B78] dark:text-[#B1B7C3]">Kontak Tutor:</span>
                      {item.tutor?.phoneNumber ? (
                        <a
                          href={whatsappUrl(item.tutor.phoneNumber, item.tutor.name ?? "", item.title)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      ) : null}
                      {item.tutor?.email ? (
                        <a
                          href={`mailto:${item.tutor.email}`}
                          className="inline-flex items-center gap-1 font-medium text-[#2457C5] hover:underline dark:text-[#78A0FF]"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          <span>Email</span>
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {/* Aksi Pembelajaran */}
                  <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                    {hasMeeting ? (
                      <a
                        href={item.meetingUrl!}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary btn-dashboard-action font-medium inline-flex items-center"
                      >
                        <MonitorPlay className="h-3.5 w-3.5" />
                        Masuk Sesi {item.meetingPlatform || "Live"}
                      </a>
                    ) : isCancelled ? (
                      <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                        Link Pertemuan Dikunci
                      </span>
                    ) : null}

                    {item.materialUrl && !isCancelled && (
                      <a
                        href={item.materialUrl}
                        target="_blank"
                        rel="noreferrer"
                      className="btn-secondary btn-dashboard-action font-medium inline-flex items-center"
                      >
                        Materi <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    <Link
                      href={`/detail-kelas?id=${encodeURIComponent(item.id)}`}
                      className="btn-secondary btn-dashboard-action font-medium"
                    >
                      Detail
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      </>
      )}
    </div>
  );
}
