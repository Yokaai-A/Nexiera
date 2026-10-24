"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Receipt } from "lucide-react";
import { nexieraApi, type ApiTransaction } from "@/src/lib/api";
import { RefundRequestModal } from "@/src/components/transactions/RefundRequestModal";

function label(status: ApiTransaction["refundStatus"] | undefined) {
  if (!status) return null;
  return (
    {
      NOT_REQUESTED: "Belum diminta",
      PENDING_REVIEW: "Menunggu tinjauan",
      PROCESSING: "Diproses penyedia pembayaran",
      REFUNDED: "Selesai",
      REJECTED: "Pengajuan ditolak",
      COMPLETED: "Selesai",
      FAILED: "Gagal",
      MANUAL_REQUIRED: "Menunggu transfer manual",
    } as const
  )[status];
}

export default function RiwayatTransaksiPage() {
  const [items, setItems] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRefund, setSelectedRefund] = useState<ApiTransaction | null>(null);

  useEffect(() => {
    let active = true;
    nexieraApi
      .transactions()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error ? cause.message : "Transaksi gagal dimuat.",
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
    <main className="min-h-screen bg-white dark:bg-[#111318] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[960px] space-y-5">
        <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 sm:p-6 dark:border-[#343945] dark:bg-[#191C23]">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2457C5] hover:underline dark:text-[#78A0FF]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Dashboard
          </Link>
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2457C5] dark:text-[#78A0FF]">
              <Receipt className="h-4 w-4" /> Riwayat Transaksi &amp; Refund
            </span>
            <h1 className="mt-1 text-lg sm:text-xl font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              Riwayat Pembayaran &amp; Pengembalian Dana
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#626B78] dark:text-[#B1B7C3]">
              Status berasal dari transaksi pembayaran Midtrans. Pengembalian dana kelas yang dibatalkan dikirim langsung ke metode pembayaran asal.
            </p>
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

        <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 sm:p-6 dark:border-[#343945] dark:bg-[#191C23]">
          {loading ? (
            <p className="py-8 text-xs text-[#626B78] dark:text-[#B1B7C3]">
              Memuat transaksi...
            </p>
          ) : items.length === 0 ? (
            <div className="py-12 text-center">
              <h2 className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                Belum ada transaksi
              </h2>
              <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                Transaksi kelas Anda akan dicatat di sini.
              </p>
              <Link
                href="/dashboard"
                className="mt-4 inline-flex items-center gap-1.5 rounded-[4px] border border-[#2457C5] bg-transparent px-3 py-1.5 text-xs font-semibold text-[#2457C5] hover:bg-[#2457C5]/10 dark:border-[#78A0FF] dark:text-[#78A0FF] dark:hover:bg-[#78A0FF]/15"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Dashboard
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D9DEE7] text-[11px] font-semibold uppercase tracking-wider text-[#626B78] dark:border-[#343945] dark:text-[#B1B7C3]">
                    <th className="p-3">Kelas Bimbingan</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Pembayaran</th>
                    <th className="p-3">Refund</th>
                    <th className="p-3 text-right">Jumlah</th><th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9DEE7] dark:divide-[#343945]">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-[#20242D]/40 transition-colors"
                    >
                      <td className="p-3">
                        <Link
                          href={`/detail-kelas?id=${encodeURIComponent(item.class.id)}`}
                          className="font-medium text-[#20232B] hover:text-[#2457C5] dark:text-[#F3F4F6] dark:hover:text-[#78A0FF] inline-flex items-center gap-1"
                        >
                          {item.class.title}
                          <ExternalLink className="h-3 w-3 text-[#626B78] dark:text-[#B1B7C3]" />
                        </Link>
                        {item.class.status === "CANCELLED" && (
                          <span className="ml-2 inline-block rounded-[3px] border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                            Dibatalkan
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-[#626B78] dark:text-[#B1B7C3]">
                        {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                          new Date(item.createdAt),
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block whitespace-nowrap rounded-[4px] px-2 py-0.5 text-[11px] font-semibold ${
                            item.status === "PAID"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                              : item.status === "REFUNDED" || item.status === "FAILED" || item.status === "CANCELLED"
                                ? "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                                : "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                          }`}
                        >
                          {({ PENDING: "Menunggu Pembayaran", PAID: "PAID", FAILED: "Pembayaran Gagal", CANCELLED: "Dibatalkan", REFUNDED: "REFUNDED" } as const)[item.status]}
                        </span>
                      </td>
                      <td className="p-3 text-[#626B78] dark:text-[#B1B7C3]">
                        {label(item.refundStatus)}
                      </td>
                      <td className="p-3 text-right font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: item.currency || "IDR",
                          maximumFractionDigits: 0,
                        }).format(Number(item.amount))}
                      </td>
                      <td className="p-3 text-right">{item.status === "PAID" && Number(item.amount) > 0 && (!item.refundStatus || item.refundStatus === "NOT_REQUESTED") && <button type="button" onClick={() => setSelectedRefund(item)} className="inline-flex cursor-pointer whitespace-nowrap rounded-[4px] border border-[#2457C5] bg-[#2457C5]/5 px-2.5 py-1.5 text-[11px] font-semibold text-[#2457C5] transition-colors hover:bg-[#2457C5] hover:text-white dark:border-[#78A0FF] dark:bg-[#78A0FF]/10 dark:text-[#AFC4FF] dark:hover:bg-[#2457C5] dark:hover:text-white">Ajukan Refund</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        {selectedRefund && <RefundRequestModal transactionId={selectedRefund.id} className={selectedRefund.class.title} onClose={() => setSelectedRefund(null)} onSubmitted={() => setItems((old) => old.map((item) => item.id === selectedRefund.id ? { ...item, refundStatus: "PENDING_REVIEW" } : item))} />}
      </div>
    </main>
  );
}
