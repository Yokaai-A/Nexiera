"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  Percent,
  Wallet,
  AlertCircle,
  X,
} from "lucide-react";
import { nexieraApi, type DashboardData } from "@/src/lib/api";

function money(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function KeuanganTutorPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Form State untuk Payout
  const [bankName, setBankName] = useState("BCA");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const dashboard = await nexieraApi.dashboard();
        setData(dashboard);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data keuangan.");
      }
    }
    load();
  }, []);

  const grossRevenue = data?.totalRevenue ?? 0;
  const platformFee = Math.round(grossRevenue * 0.08); // 8% fee
  const netBalance = data?.netBalance ?? Math.max(0, grossRevenue - platformFee);
  const pendingBalance = data?.pendingBalance ?? 0;
  const completedRevenue = netBalance;
  const transactions = data?.transactions ?? [];

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
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2457C5] dark:text-[#78A0FF]">
            <Wallet className="h-4 w-4" /> Manajemen Keuangan &amp; Payout
          </span>
          <h1 className="mt-1 text-lg font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            Pendapatan &amp; Penarikan Dana
          </h1>
          <p className="mt-0.5 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Hasil penjualan bersih bimbingan akademik Anda tanpa dompet internal (transfer langsung ke rekening bank terdaftar).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPayoutModalOpen(true)}
          disabled={completedRevenue <= 0}
          className="inline-flex items-center justify-center gap-1.5 rounded-[4px] bg-[#2457C5] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <ArrowDownToLine className="h-4 w-4" />
          <span>Tarik Dana (Payout)</span>
        </button>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-[4px] border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {/* 4 Metric Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pendapatan Kotor</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1.5 text-lg font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {data ? money(grossRevenue) : "—"}
          </p>
          <p className="mt-0.5 text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
            Akumulasi transaksi terdaftar
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Komisi Platform (8%)</span>
            <Percent className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />
          </div>
          <p className="mt-1.5 text-lg font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {data ? money(platformFee) : "—"}
          </p>
          <p className="mt-0.5 text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
            Biaya infrastruktur &amp; layanan
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Estimasi Bersih (Net)</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1.5 text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {data ? money(netBalance) : "—"}
          </p>
          <p className="mt-0.5 text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
            Gross dikurangi 8% komisi
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pending Balance</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-1.5 text-lg font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {data ? money(pendingBalance) : "—"}
          </p>
          <p className="mt-0.5 text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
            Saldo tertahan jadwal berjalan
          </p>
        </article>
      </div>

      {/* Tabel Transaksi */}
      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <h2 className="border-b border-[#D9DEE7] pb-2.5 text-sm font-semibold text-[#20232B] dark:border-[#343945] dark:text-[#F3F4F6]">
          Riwayat Transaksi Keuangan
        </h2>

        {!data && !error ? (
          <p className="py-6 text-xs text-[#626B78] dark:text-[#B1B7C3]">Memuat transaksi...</p>
        ) : transactions.length === 0 ? (
          <div className="py-6 text-center">
            <p className="font-semibold text-xs text-[#20232B] dark:text-[#F3F4F6]">
              Belum ada riwayat transaksi keuangan.
            </p>
            <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
              Transaksi peserta yang mendaftar kelas bimbingan Anda akan otomatis tercatat di sini.
            </p>
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-xs">
              <thead>
                <tr className="border-b border-[#D9DEE7] text-[11px] font-semibold uppercase tracking-wider text-[#626B78] dark:border-[#343945] dark:text-[#B1B7C3]">
                  <th className="p-2.5">Mata Kuliah / Kelas</th>
                  <th className="p-2.5">Tanggal</th>
                  <th className="p-2.5">Status Saldo</th>
                  <th className="p-2.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE7] dark:divide-[#343945]">
                {transactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-[#20242D]/40 transition-colors">
                    <td className="p-2.5 font-medium text-[#20232B] dark:text-[#F3F4F6]">
                      {item.class.title}
                    </td>
                    <td className="p-2.5 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                      {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                        new Date(item.createdAt),
                      )}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-[4px] px-2 py-0.5 text-[11px] font-semibold ${
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
                            ? `REFUNDED (${item.refundStatus || "COMPLETED"})`
                            : item.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                      {money(Number(item.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Kebijakan Transparansi Keuangan */}
      <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-3.5 text-xs text-[#626B78] dark:border-[#343945] dark:bg-[#191C23] dark:text-[#B1B7C3]">
        <p className="font-semibold text-[#20232B] dark:text-[#F3F4F6] mb-1">
          Kebijakan Transparansi Keuangan (Tanpa Internal Wallet):
        </p>
        <p>
          Platform NEXIERA tidak menyimpan dana Anda dalam dompet virtual atau voucher. Setiap penarikan dana (<i>payout</i>) ditransfer secara langsung ke rekening bank terdaftar setelah jadwal kelas selesai dilaksanakan.
        </p>
      </div>

      {/* Modal Payout Langsung */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-[6px] border border-[#D9DEE7] bg-white p-4 shadow-lg dark:border-[#343945] dark:bg-[#191C23]">
            <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-2.5 dark:border-[#343945]">
              <h3 className="font-bold text-[#20232B] dark:text-[#F3F4F6] flex items-center gap-2 text-sm">
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
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-semibold text-sm text-[#20232B] dark:text-[#F3F4F6]">
                  Pengajuan Payout Berhasil Dikirim!
                </h4>
                <p className="text-xs text-[#626B78] dark:text-[#B1B7C3]">
                  Dana sebesar <span className="font-bold text-emerald-600">{money(completedRevenue)}</span> sedang diproses transfer ke rekening bank Anda dalam 1x24 jam kerja.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} className="mt-3 space-y-3">
                <div className="rounded-[4px] border border-blue-200 bg-blue-50/70 p-2.5 text-xs text-[#2457C5] dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-[#78A0FF] flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    Dana yang dapat ditarik: <strong className="font-bold">{money(completedRevenue)}</strong> (setelah komisi platform 8%).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    Bank Tujuan
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="mt-1 w-full rounded-[4px] border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
                  >
                    <option value="BCA">Bank Central Asia (BCA)</option>
                    <option value="Mandiri">Bank Mandiri</option>
                    <option value="BNI">Bank Negara Indonesia (BNI)</option>
                    <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                    <option value="CIMB">CIMB Niaga</option>
                    <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 1234567890"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="mt-1 w-full rounded-[4px] border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    Nama Pemilik Rekening (Sesuai Buku Tabungan)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kevin Sanjaya"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="mt-1 w-full rounded-[4px] border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
                  />
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#D9DEE7] pt-3 dark:border-[#343945]">
                  <button
                    type="button"
                    onClick={() => setIsPayoutModalOpen(false)}
                    className="rounded-[4px] border border-[#D9DEE7] px-3 py-1.5 text-xs font-semibold text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:text-[#F3F4F6] dark:hover:bg-[#20242D] transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-[4px] bg-[#2457C5] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors shadow-sm"
                  >
                    Kirim Permintaan Payout
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
