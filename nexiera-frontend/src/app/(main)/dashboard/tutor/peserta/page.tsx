"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, MessageCircle, Search, Users2 } from "lucide-react";
import { nexieraApi } from "@/src/lib/api";

type Participant = Awaited<ReturnType<typeof nexieraApi.tutorParticipants>>[number];

function whatsappUrl(phone: string, name: string, title: string) {
  const digits = phone.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${international}?text=${encodeURIComponent(
    `Halo ${name}, pengajar kelas ${title} di NEXIERA ingin menghubungi Anda.`,
  )}`;
}

export default function DataPesertaPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    nexieraApi
      .tutorParticipants()
      .then((items) => {
        if (active) setParticipants(items);
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error ? cause.message : "Daftar peserta gagal dimuat.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(
    () =>
      participants.filter((item) =>
        [item.user.name, item.user.email, item.user.phoneNumber, item.class.title].some((value) =>
          value.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        ),
      ),
    [participants, search],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 dark:border-[#343945] dark:bg-[#191C23]">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#2457C5] dark:text-[#78A0FF]">
          <Users2 className="h-4 w-4" /> Data Peserta Bimbingan
        </span>
        <h1 className="mt-2 text-lg sm:text-xl font-semibold text-[#20232B] dark:text-[#F3F4F6]">
          Peserta Kelas Anda
        </h1>
        <p className="mt-1 text-sm text-[#626B78] dark:text-[#B1B7C3]">
          Status pendaftaran aktif terkonfirmasi otomatis dari pembayaran Midtrans yang sukses (PAID). Hubungi mahasiswa langsung melalui WhatsApp atau Email.
        </p>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-[4px] border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
        {/* Input Pencarian */}
        <label className="flex items-center gap-2 rounded-[4px] border border-[#D9DEE7] px-3 py-2 bg-white dark:border-[#343945] dark:bg-[#111318]">
          <Search className="h-4 w-4 text-[#626B78] dark:text-[#B1B7C3]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full text-sm outline-none bg-transparent text-[#20232B] dark:text-[#F3F4F6] placeholder:text-[#626B78] dark:placeholder:text-[#777F8D]"
            placeholder="Cari nama, email, nomor WhatsApp, atau mata kuliah..."
          />
        </label>

        {loading ? (
          <p className="py-8 text-sm text-[#626B78] dark:text-[#B1B7C3]">
            Memuat daftar peserta...
          </p>
        ) : visible.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              {participants.length
                ? "Tidak ada peserta yang cocok dengan kata kunci pencarian"
                : "Belum ada mahasiswa yang mendaftar pada kelas ini."}
            </p>
            <p className="mt-1 text-sm text-[#626B78] dark:text-[#B1B7C3]">
              Peserta terdaftar akan muncul otomatis setelah transaksi pembayaran berhasil (PAID).
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#D9DEE7] text-xs font-semibold uppercase tracking-wider text-[#626B78] dark:border-[#343945] dark:text-[#B1B7C3]">
                  <th className="p-3">Mahasiswa</th>
                  <th className="p-3">Kelas Bimbingan</th>
                  <th className="p-3">Status Pendaftaran</th>
                  <th className="p-3">Presensi</th>
                  <th className="p-3 text-right">Kontak Langsung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DEE7] dark:divide-[#343945]">
                {visible.map((item) => {
                  const isPaid = item.status === "PAID";
                  const isRefunded = item.status === "REFUNDED";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-[#20242D]/50 transition-colors"
                    >
                      <td className="p-3">
                        <p className="font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                          {item.user.name}
                        </p>
                        <p className="text-xs text-[#626B78] dark:text-[#B1B7C3]">
                          {item.user.email}
                        </p>
                      </td>
                      <td className="p-3 text-sm font-medium text-[#20232B] dark:text-[#F3F4F6]">
                        {item.class.title}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-block whitespace-nowrap rounded-[4px] px-2.5 py-1 text-xs font-semibold ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                              : isRefunded
                                ? "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                                : "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {isPaid ? "Aktif (PAID)" : isRefunded ? `Refund ${item.refundStatus}` : item.status}
                        </span>
                      </td>
                      <td className="p-3 text-xs font-medium text-[#20232B] dark:text-[#F3F4F6]">
                        {item.presence?.status === "PRESENT" ? "1 Sesi Hadir" : "0/1 Sesi (Terjadwal)"}
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {item.user.phoneNumber ? (
                            <a
                              href={whatsappUrl(
                                item.user.phoneNumber,
                                item.user.name,
                                item.class.title,
                              )}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Hubungi WhatsApp ${item.user.name}`}
                              className="inline-flex items-center gap-1 rounded-[4px] border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition-colors dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          ) : null}
                          {item.user.email ? (
                            <a
                              href={`mailto:${item.user.email}`}
                              aria-label={`Kirim email ke ${item.user.name}`}
                              className="inline-flex items-center gap-1 rounded-[4px] border border-[#D9DEE7] bg-white px-2.5 py-1 text-xs font-medium text-[#2457C5] hover:bg-[#E5E9F0] transition-colors dark:border-[#343945] dark:bg-[#191C23] dark:text-[#78A0FF]"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              <span>Email</span>
                            </a>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
