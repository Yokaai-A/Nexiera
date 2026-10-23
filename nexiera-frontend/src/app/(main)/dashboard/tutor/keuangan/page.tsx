"use client";

import { useEffect, useState } from "react";
import { nexieraApi, type DashboardData } from "@/src/lib/api";
import {
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  Percent,
  Wallet,
  X,
} from "lucide-react";

const money = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function KeuanganPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  useEffect(() => {
    let active = true;
    nexieraApi
      .dashboard()
      .then((value) => {
        if (active) setData(value);
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error
              ? cause.message
              : "Ringkasan keuangan gagal dimuat.",
          );
      });
    return () => {
      active = false;
    };
  }, []);

  const transactions = data?.transactions || [];
  const grossRevenue = data?.totalRevenue || 0;
  const platformFee = Math.round(grossRevenue * 0.08); // 8% platform fee
  const pendingBalance = data?.pendingBalance || 0;
  const completedRevenue = data?.completedClassRevenue || 0;

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !accountHolder) return;
    setPayoutSuccess(true);
    setTimeout(() => {
      setIsPayoutModalOpen(false);
      setPayoutSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-[6px] border border-[#D9DEE7] bg-white p-6 dark:border-[#343945] dark:bg-[#191C23]">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2457C5] dark:text-[#78A0FF]">
            <Wallet className="h-4 w-4" /> Manajemen Keuangan &amp; Payout
          </span>
          <h1 className="mt-2 text-lg sm:text-xl font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            Pendapatan &amp; Penarikan Dana
          </h1>
          <p className="mt-1 text-sm text-[#626B78] dark:text-[#B1B7C3]">
            Hasil penjualan bersih bimbingan akademik Anda tanpa dompet internal (transfer langsung ke rekening bank terdaftar).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPayoutModalOpen(true)}
          disabled={completedRevenue <= 0}
          className="btn-primary inline-flex items-center justify-center gap-2 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <ArrowDownToLine className="h-4 w-4" /> Tarik Dana (Payout)
        </button>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-[4px] border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {/* 4 Metric Card Utama Sesuai Spesifikasi Teknis 2.B.3 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Balance</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-1.5 text-lg sm:text-xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {data ? money(pendingBalance) : "—"}
          </p>
          <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Saldo tertahan dari kelas berjalan
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pendapatan Kotor</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1.5 text-lg sm:text-xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {data ? money(grossRevenue) : "—"}
          </p>
          <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Akumulasi seluruh penjualan kelas
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-xs font-semibold uppercase tracking-wider">Komisi Platform (8%)</span>
            <Percent className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />
          </div>
          <p className="mt-1.5 text-lg sm:text-xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {data ? money(platformFee) : "—"}
          </p>
          <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Potongan pemeliharaan platform
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Telah Ditarik / Siap</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1.5 text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {data ? money(completedRevenue) : "—"}
          </p>
          <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Saldo berhasil atau siap transfer bank
          </p>
        </article>
      </div>

      {/* Tabel Transaksi */}
      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 dark:border-[#343945] dark:bg-[#191C23]">
        <h2 className="border-b border-[#D9DEE7] pb-3 text-sm font-semibold text-[#20232B] dark:border-[#343945] dark:text-[#F3F4F6]">
          Riwayat Transaksi Keuangan
        </h2>

        {!data && !error ? (
          <p className="py-8 text-sm text-[#626B78] dark:text-[#B1B7C3]">Memuat transaksi...</p>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              Belum ada riwayat transaksi keuangan.
            </p>
            <p className="mt-1 text-sm text-[#626B78] dark:text-[#B1B7C3]">
              Transaksi peserta yang mendaftar kelas bimbingan Anda akan otomatis tercatat di sini.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#D9DEE7] text-xs font-semibold uppercase tracking-wider text-[#626B78] dark:border-[#343945] dark:text-[#B1B7C3]">
                  <th className="p-3">Mata Kuliah / Kelas</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Status Saldo</th>
                  <th className="p-3 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE7] dark:divide-[#343945]">
                {transactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-[#20242D]/40 transition-colors">
                    <td className="p-3 font-medium text-[#20232B] dark:text-[#F3F4F6]">
                      {item.class.title}
                    </td>
                    <td className="p-3 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                      {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                        new Date(item.createdAt),
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block whitespace-nowrap rounded-[4px] px-2.5 py-1 text-xs font-semibold ${
                          item.status === "PAID"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                            : item.status === "REFUNDED"
                              ? "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                              : "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                        }`}
                      >
                        {item.status === "PAID"
                          ? "PENDING BALANCE"
                          : item.status === "REFUNDED"
                            ? `REFUNDED (${item.refundStatus})`
                            : item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                      {money(Number(item.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 text-xs text-[#626B78] dark:border-[#343945] dark:bg-[#191C23] dark:text-[#B1B7C3]">
        <p className="font-semibold text-[#20232B] dark:text-[#F3F4F6] mb-1">
          Kebijakan Transparansi Keuangan (Tanpa Internal Wallet):
        </p>
        <p>
          Platform NEXIERA tidak menyimpan dana Anda dalam dompet virtual atau voucher. Setiap penarikan dana (_payout_) ditransfer secara langsung ke rekening bank terdaftar setelah jadwal kelas selesai dilaksanakan.
        </p>
      </div>

      {/* Modal Payout Langsung */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-[6px] border border-[#D9DEE7] bg-white p-6 shadow-md dark:border-[#343945] dark:bg-[#191C23]">
            <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-3 dark:border-[#343945]">
              <h3 className="font-bold text-[#20232B] dark:text-[#F3F4F6] flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" /> Pengajuan Tarik Dana (Payout)
              </h3>
              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(false)}
                className="text-[#626B78] hover:text-[#20232B] dark:text-[#B1B7C3] dark:hover:text-[#F3F4F6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {payoutSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <h4 className="font-bold text-lg text-[#20232B] dark:text-[#F3F4F6]">
                  Pengajuan Berhasil Diproses!
                </h4>
                <p className="text-xs text-[#626B78] dark:text-[#B1B7C3] max-w-xs mx-auto">
                  Dana sebesar {money(completedRevenue)} sedang ditransfer langsung ke rekening bank {bankName} {accountNumber}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} className="mt-4 space-y-4">
                <div className="rounded-[4px] border border-blue-100 bg-[#E5E9F0]/40 p-3 text-xs text-[#626B78] dark:border-[#343945] dark:bg-slate-800 dark:text-[#B1B7C3]">
                  Saldo Siap Ditarik: <b className="text-[#20232B] dark:text-[#F3F4F6]">{money(completedRevenue)}</b>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    Nama Bank Tujuan
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="nx-input mt-1 w-full"
                  >
                    <option value="BCA">Bank Central Asia (BCA)</option>
                    <option value="Mandiri">Bank Mandiri</option>
                    <option value="BNI">Bank Negara Indonesia (BNI)</option>
                    <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                    <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 1234567890"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="nx-input mt-1 w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sesuai buku tabungan"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="nx-input mt-1 w-full"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPayoutModalOpen(false)}
                    className="btn-secondary text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-primary text-xs"
                  >
                    Kirim Permintaan Transfer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
