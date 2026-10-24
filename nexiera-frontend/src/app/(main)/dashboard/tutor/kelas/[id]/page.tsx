"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, CalendarDays, ExternalLink, Users2, X } from "lucide-react";
import { nexieraApi, type ApiClass } from "@/src/lib/api";

type Participant = Awaited<ReturnType<typeof nexieraApi.tutorParticipants>>[number];

export default function TutorClassDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [item, setItem] = useState<ApiClass | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [refundSummary, setRefundSummary] = useState<{
    eligible: number;
    requested: number;
    failed: number;
    manualRequired: number;
  } | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([nexieraApi.managedClass(id), nexieraApi.tutorParticipants()])
      .then(([classItem, people]) => {
        if (active) {
          setItem(classItem);
          setParticipants(people.filter((person) => person.class.id === classItem.id));
        }
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : "Kelas gagal dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const paid = useMemo(
    () => participants.filter((person) => person.status === "PAID").length,
    [participants],
  );

  async function handleConfirmCancel(e: React.FormEvent) {
    e.preventDefault();
    if (!item || reason.trim().length < 10) {
      setError("Alasan pembatalan minimal 10 karakter.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = await nexieraApi.cancelClass(item.id, reason.trim());
      setRefundSummary({ eligible: result.refunds?.length ?? 0, requested: result.refunds?.filter(r => r.status !== "FAILED").length ?? 0, failed: result.refunds?.filter(r => r.status === "FAILED").length ?? 0, manualRequired: 0 });
      setItem({ ...item, status: "CANCELLED", cancellationReason: reason.trim() });
      setIsCancelModalOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Pembatalan gagal diproses.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 text-xs text-[#626B78] dark:border-[#343945] dark:bg-[#191C23] dark:text-[#B1B7C3]">
        Memuat detail kelas...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <p className="font-semibold text-[#20232B] dark:text-[#F3F4F6]">Kelas tidak ditemukan</p>
        <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
        <Link href="/dashboard/tutor/kelas" className="btn-primary btn-dashboard-action mt-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Manajemen Kelas
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <Link
          href="/dashboard/tutor/kelas"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2457C5] hover:underline dark:text-[#78A0FF]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Daftar Kelas
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-[4px] px-2 py-0.5 text-xs font-semibold uppercase ${
                  item.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : item.status === "CANCELLED"
                      ? "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                      : "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                }`}
              >
                {item.status || "DRAFT"}
              </span>
              <span className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-2 py-0.5 text-xs font-medium text-[#20232B] dark:border-[#343945] dark:bg-slate-800 dark:text-[#F3F4F6]">
                {item.courseType === "BOOTCAMP" ? "Bootcamp" : "Peer-Tutoring"}
              </span>
            </div>
            <h1 className="mt-2 text-lg font-bold text-[#20232B] dark:text-[#F3F4F6]">
              {item.title}
            </h1>
            <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
              <CalendarDays className="mr-1.5 inline h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />
              {item.startsAt
                ? new Intl.DateTimeFormat("id-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                  }).format(new Date(item.startsAt))
                : "Jadwal belum ditentukan"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {item.status !== "CANCELLED" && (
              <>
                <Link
                  href={`/dashboard/tutor/kelas/${encodeURIComponent(item.id)}/edit`}
                  className="btn-secondary btn-dashboard-action"
                >
                  Edit Kelas
                </Link>
                {item.status === "ACTIVE" && (
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="rounded-[4px] border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 transition-colors dark:border-red-800 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    Batalkan Kelas
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-[4px] border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {/* Ringkasan Metrik Kelas */}
      <section className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
          <p className="text-xs font-semibold uppercase text-[#626B78] dark:text-[#B1B7C3]">
            Peserta Berstatus PAID
          </p>
          <p className="mt-2 text-2xl font-bold text-[#20232B] dark:text-[#F3F4F6]">{paid}</p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
          <p className="text-xs font-semibold uppercase text-[#626B78] dark:text-[#B1B7C3]">
            Harga Bimbingan
          </p>
          <p className="mt-2 text-2xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: item.currency || "IDR",
              maximumFractionDigits: 0,
            }).format(Number(item.price))}
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
          <p className="text-xs font-semibold uppercase text-[#626B78] dark:text-[#B1B7C3]">
            Kapasitas Kuota
          </p>
          <p className="mt-2 text-2xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {item.maxQuota ?? "Tidak Dibatasi"}
          </p>
        </article>
      </section>

      {/* Tautan Pembelajaran */}
      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <h2 className="font-semibold text-[#20232B] dark:text-[#F3F4F6]">Tautan Akses Kelas</h2>
        <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
          Tautan tatap muka ini hanya terbuka untuk peserta yang telah lunas (PAID). Jika kelas dibatalkan, tautan dikunci otomatis.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {item.status === "CANCELLED" ? (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              Tautan pertemuan dinonaktifkan (Status: CANCELLED).
            </p>
          ) : item.meetingUrl ? (
            <a
              target="_blank"
              rel="noreferrer"
              href={item.meetingUrl}
              className="btn-primary btn-dashboard-action inline-flex items-center"
            >
              Buka Pertemuan Langsung <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <p className="text-xs text-[#626B78] dark:text-[#B1B7C3]">
              Belum ada tautan pertemuan.
            </p>
          )}

          {item.materialUrl && item.status !== "CANCELLED" && (
            <a
              target="_blank"
              rel="noreferrer"
              href={item.materialUrl}
              className="btn-secondary btn-dashboard-action inline-flex items-center"
            >
              Materi &amp; Catatan <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </section>

      {/* Banner Informasi Pembatalan */}
      {item.status === "CANCELLED" && (
        <section className="rounded-[6px] border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/40">
          <h2 className="font-semibold text-red-800 dark:text-red-300">Kelas Telah Dibatalkan</h2>
          <p className="mt-1 text-xs text-red-700 dark:text-red-300">
            Alasan pembatalan: <i>&quot;{item.cancellationReason || "Tidak dicantumkan"}&quot;</i>
          </p>
          {refundSummary && (
            <p className="mt-2 text-xs text-red-700 dark:text-red-300">
              Pengembalian dana (Auto-Refund 100%): {refundSummary.requested} transaksi diajukan
              pengembalian dana ke payment gateway.
            </p>
          )}
        </section>
      )}

      {/* Modal Konfirmasi Pembatalan Kelas (Auto-Refund 100%) */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-[6px] border border-[#D9DEE7] bg-white p-4 shadow-md dark:border-[#343945] dark:bg-[#191C23]">
            <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-3 dark:border-[#343945]">
              <h3 className="font-bold text-[#20232B] dark:text-[#F3F4F6] flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" /> Konfirmasi Pembatalan Kelas
              </h3>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="text-[#626B78] hover:text-[#20232B] dark:text-[#B1B7C3] dark:hover:text-[#F3F4F6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmCancel} className="mt-4 space-y-4">
              <div className="rounded-[4px] border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 leading-relaxed">
                <b>PERINGATAN AUTO-REFUND 100%:</b>
                <br />
                Membatalkan kelas akan secara permanen mengubah status kelas menjadi <b>CANCELLED</b>, menutup link tatap muka untuk seluruh peserta, dan memicu <b>auto-refund 100%</b> untuk semua transaksi mahasiswa yang bernilai PAID.
              </div>

              <div>
                <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                  Alasan Pembatalan (Wajib disampaikan ke peserta)
                </label>
                <textarea
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Jelaskan alasan mengapa kelas ini harus dibatalkan..."
                  className="nx-input mt-1 w-full"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="btn-secondary btn-dashboard-action"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || reason.trim().length < 10}
                  className="rounded-[4px] bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Memproses..." : "Ya, Batalkan Kelas & Refund"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
