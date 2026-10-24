"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  Eye,
  Megaphone,
  MousePointerClick,
  Percent,
  PlusCircle,
  Upload,
  CheckCircle2,
  Table as TableIcon,
} from "lucide-react";
import { nexieraApi, type ApiAd } from "@/src/lib/api";

const placements: Array<{ value: ApiAd["placement"]; label: string }> = [
  { value: "HOME_HERO", label: "Banner Utama Beranda / Hero Carousel (3:1)" },
  { value: "SIDE_MARGIN", label: "Side Margin Banner Kiri/Kanan (1:3.75)" },
];

const AD_PRICING_TABLE = [
  {
    placementCode: "HOME_HERO" as const,
    slot: "Banner Utama Beranda / Hero Carousel",
    dimension: "1200 x 400 px (3:1)",
    placement: "Beranda, area utama",
    reach: "25.000+ Mahasiswa / Minggu",
    price: "Rp 150.000 / minggu",
    weeklyPrice: 150000,
    status: "Tersedia",
  },
  {
    placementCode: "SIDE_MARGIN" as const,
    slot: "Side Margin Banner Kiri/Kanan",
    dimension: "160 x 600 px (1:3.75)",
    placement: "Sisi kiri atau kanan halaman yang menyediakan banner samping",
    reach: "35.000+ Impresi Terlihat",
    price: "Rp 90.000 / minggu",
    weeklyPrice: 90000,
    status: "Tersedia",
  },
];

const toLocalDateTime = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const money = (amount: number) => new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
}).format(amount);

export default function PengiklananPage() {
  const [ads, setAds] = useState<ApiAd[]>([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [placement, setPlacement] = useState<ApiAd["placement"]>("HOME_HERO");
  const [imageUrl, setImageUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [startsAt, setStartsAt] = useState(() => toLocalDateTime(new Date()));
  const [endsAt, setEndsAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    try {
      setAds(await nexieraApi.myAds());
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Iklan gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const metrics = useMemo(
    () =>
      ads.reduce(
        (sum, ad) => ({
          impressions: sum.impressions + ad.impressions,
          clicks: sum.clicks + ad.clicks,
        }),
        { impressions: 0, clicks: 0 },
      ),
    [ads],
  );

  const ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
  const getRental = (startValue: string, endValue: string, placementValue: ApiAd["placement"]) => {
    const start = new Date(startValue).getTime();
    const end = new Date(endValue).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
    const weeks = Math.max(1, Math.ceil((end - start) / WEEK_MS));
    const slot = AD_PRICING_TABLE.find((item) => item.placementCode === placementValue);
    return slot ? { weeks, total: slot.weeklyPrice * weeks } : null;
  };
  const totalInvestment = ads.reduce((sum, ad) => {
    const rental = getRental(ad.startsAt, ad.endsAt, ad.placement);
    return sum + (rental?.total ?? 0);
  }, 0);
  const estimate = getRental(startsAt, endsAt, placement);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file banner maksimal 5 MB.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      const res = await nexieraApi.uploadBanner(file);
      setImageUrl(res.url);
      setNotice("Gambar banner berhasil diunggah.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah banner.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    const start = new Date(startsAt);
    const end = new Date(endsAt);
    if (!title.trim() || !subtitle.trim()) {
      setError("Judul dan deskripsi wajib diisi.");
      return;
    }
    if (!imageUrl.trim()) {
      setError("Gambar banner wajib diunggah.");
      return;
    }
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
      setError("Waktu selesai harus setelah waktu mulai.");
      return;
    }
    if (start < new Date(Date.now() - 60_000)) {
      setError("Waktu mulai tidak boleh di masa lalu.");
      return;
    }
    setSaving(true);
    try {
      await nexieraApi.createAd({
        title: title.trim(),
        subtitle: subtitle.trim(),
        placement,
        imageUrl: imageUrl.trim(),
        targetUrl: targetUrl.trim(),
        startsAt: start.toISOString(),
        endsAt: end.toISOString(),
      });
      setTitle("");
      setSubtitle("");
      setImageUrl("");
      setTargetUrl("");
      setEndsAt("");
      setNotice("Iklan berhasil didaftarkan sebagai pure image banner dan langsung aktif.");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Iklan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2457C5] dark:text-[#78A0FF]">
          <Megaphone className="h-4 w-4" /> Promosi Mandiri &amp; Self-Serve Ads
        </span>
        <h1 className="mt-1 text-lg font-semibold text-[#20232B] dark:text-[#F3F4F6]">
          Analitik &amp; Manajemen Iklan
        </h1>
        <p className="mt-0.5 text-xs text-[#626B78] dark:text-[#B1B7C3]">
          Pantau impresi aktual, total klik, serta rasio konversi (CTR) banner kelas bimbingan Anda di katalog NEXIERA.
        </p>
      </header>

      {/* 4 Metric Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Tayang</span>
            <Eye className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />
          </div>
          <p className="mt-1 text-lg font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {loading || error ? "—" : metrics.impressions.toLocaleString("id-ID")}
          </p>
          <p className="mt-0.5 text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
            Frekuensi banner dilihat pada penempatan iklan
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Klik</span>
            <MousePointerClick className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1 text-lg font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {loading || error ? "—" : metrics.clicks.toLocaleString("id-ID")}
          </p>
          <p className="mt-0.5 text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
            Interaksi klik langsung ke kelas
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Rata-Rata CTR</span>
            <Percent className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-1 text-lg font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {loading || error ? "—" : `${ctr.toFixed(2)}%`}
          </p>
          <p className="mt-0.5 text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
            Efektivitas (Klik / Tayang × 100%)
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Investasi Iklan</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1 text-lg font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {loading || error
              ? "—"
              : new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(totalInvestment)}
          </p>
          <p className="mt-0.5 text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
            Akumulasi biaya sewa {ads.length} banner
          </p>
        </article>
      </div>

      {/* Ad Rental Pricing Table (Katalog Tarif Sewa Slot Promosi) */}
      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <div className="flex items-center gap-2 border-b border-[#D9DEE7] pb-2.5 dark:border-[#343945]">
          <TableIcon className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />
          <h2 className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            Katalog Tarif Sewa Slot Iklan &amp; Promosi (Ad Pricing Table)
          </h2>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs">
            <thead>
              <tr className="border-b border-[#D9DEE7] text-[11px] font-semibold uppercase tracking-wider text-[#626B78] dark:border-[#343945] dark:text-[#B1B7C3]">
                <th className="p-2.5">Slot Iklan</th>
                <th className="p-2.5">Ukuran / Rasio</th>
                <th className="p-2.5">Posisi Penempatan</th>
                <th className="p-2.5">Jangkauan Audiens</th>
                <th className="p-2.5">Tarif Sewa</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DEE7] dark:divide-[#343945]">
              {AD_PRICING_TABLE.map((row) => (
                <tr key={row.slot} className="hover:bg-slate-50/60 dark:hover:bg-[#20242D]/40 transition-colors">
                  <td className="p-2.5 font-semibold text-[#20232B] dark:text-[#F3F4F6]">{row.slot}</td>
                  <td className="p-2.5 text-[#626B78] dark:text-[#B1B7C3]">{row.dimension}</td>
                  <td className="p-2.5 text-[#626B78] dark:text-[#B1B7C3]">{row.placement}</td>
                  <td className="p-2.5 font-medium text-emerald-600 dark:text-emerald-400">{row.reach}</td>
                  <td className="p-2.5 font-bold text-[#20232B] dark:text-[#F3F4F6]">{row.price}</td>
                  <td className="p-2.5">
                    <span className="inline-flex items-center gap-1 rounded-[4px] bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {error && (
        <p role="alert" className="rounded-[4px] border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {notice && (
        <p role="status" className="rounded-[4px] border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          {notice}
        </p>
      )}

      {/* Formulir Pasang Iklan */}
      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <h2 className="text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">Pasang Iklan Baru (Pure Image)</h2>
        <p className="mt-0.5 text-xs text-[#626B78] dark:text-[#B1B7C3]">
          Banner ditampilkan murni sebagai kontainer gambar (tanpa badge &quot;Sponsor&quot;, tanpa dark gradient overlay, dan tanpa teks overlay).
        </p>

        <form onSubmit={submit} className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            Nama Kampanye Iklan
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              maxLength={191}
              placeholder="Contoh: Promo Kelas Kalkulus Semester Ganjil"
              className="mt-1 w-full rounded-[4px] border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
            />
          </label>

          <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            Penempatan Slot Banner
            <select
              value={placement}
              onChange={(event) => setPlacement(event.target.value as ApiAd["placement"])}
              className="mt-1 w-full rounded-[4px] border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
            >
              {placements.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6] sm:col-span-2">
            Catatan Internal / Keterangan Iklan
            <textarea
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              required
              maxLength={2000}
              rows={2}
              placeholder="Keterangan target bimbingan kelas..."
              className="mt-1 w-full rounded-[4px] border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
            />
          </label>

          {/* Upload Banner Direct */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6] mb-1">
              Upload File Banner (Maks. 5MB, format PNG/JPG/WebP)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-1.5 text-xs font-semibold text-[#20232B] hover:bg-[#E5E9F0] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6] dark:hover:bg-[#20242D] transition-colors">
                <Upload className="h-3.5 w-3.5" />
                <span>{uploading ? "Mengunggah..." : "Pilih File Gambar"}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {imageUrl && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-sm">
                  ✓ Gambar siap: {imageUrl}
                </span>
              )}
            </div>
          </div>

          <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            URL Tujuan (Tautan Kelas / Detail)
            <input
              type="text"
              value={targetUrl}
              onChange={(event) => setTargetUrl(event.target.value)}
              required
              className="mt-1 w-full rounded-[4px] border border-[#D9DEE7] bg-white px-2.5 py-1.5 text-xs text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
              placeholder="/cari-kelas atau tautan kelas"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              Mulai Tayang
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(event) => setStartsAt(event.target.value)}
                required
                className="mt-1 w-full rounded-[4px] border border-[#D9DEE7] bg-white px-2 py-1.5 text-xs text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
              />
            </label>
            <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              Selesai Tayang
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(event) => setEndsAt(event.target.value)}
                required
                className="mt-1 w-full rounded-[4px] border border-[#D9DEE7] bg-white px-2 py-1.5 text-xs text-[#20232B] dark:border-[#343945] dark:bg-[#111318] dark:text-[#F3F4F6]"
              />
            </label>
          </div>

          <div className="sm:col-span-2 pt-1">
            {estimate && (
              <p className="mb-3 rounded-[4px] border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-[#1D4ED8] dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200" aria-live="polite">
                Estimasi Biaya: {money(estimate.total)} ({estimate.weeks} Minggu)
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#2457C5] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors shadow-sm disabled:opacity-50"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>{saving ? "Menyimpan..." : "Pasang Iklan Sekarang"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Daftar Iklan Aktif */}
      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
        <h2 className="border-b border-[#D9DEE7] pb-2.5 text-sm font-semibold text-[#20232B] dark:border-[#343945] dark:text-[#F3F4F6]">
          Daftar Iklan Anda
        </h2>

        {loading ? (
          <p className="py-6 text-xs text-[#626B78] dark:text-[#B1B7C3]">Memuat data iklan...</p>
        ) : error ? (
          <p className="py-6 text-center text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Daftar iklan tidak dapat dimuat.
          </p>
        ) : ads.length === 0 ? (
          <div className="py-6 text-center">
            <p className="font-semibold text-xs text-[#20232B] dark:text-[#F3F4F6]">
              Kamu belum memiliki iklan aktif.
            </p>
            <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
              Pasang banner promosi untuk meningkatkan pendaftaran kelas bimbingan Anda.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#D9DEE7] dark:divide-[#343945]">
            {ads.map((ad) => (
              <article
                key={ad.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase text-[#2457C5] dark:text-[#78A0FF]">
                    {placements.find((item) => item.value === ad.placement)?.label || ad.placement}
                  </p>
                  <h3 className="mt-0.5 text-sm font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    {ad.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                    {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                      new Date(ad.startsAt),
                    )}{" "}
                    –{" "}
                    {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                      new Date(ad.endsAt),
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-[#2457C5] dark:text-[#78A0FF]" />
                    <b>{ad.impressions}</b> Tayang
                  </span>
                  <span className="flex items-center gap-1">
                    <MousePointerClick className="h-3.5 w-3.5 text-emerald-600" />
                    <b>{ad.clicks}</b> Klik
                  </span>
                  <span
                    className={`rounded-[4px] px-2 py-0.5 text-[11px] font-semibold ${
                      ad.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                    }`}
                  >
                    {ad.status === "ACTIVE" ? "Aktif" : "Dihentikan"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
