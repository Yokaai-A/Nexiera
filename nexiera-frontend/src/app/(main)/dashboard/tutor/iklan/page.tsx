"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Megaphone, MousePointerClick, PlusCircle, DollarSign, Percent } from "lucide-react";
import { nexieraApi, type ApiAd } from "@/src/lib/api";

const placements: Array<{ value: ApiAd["placement"]; label: string }> = [
  { value: "HOME_HERO", label: "Banner Utama Beranda (3:1)" },
  { value: "CLASS_CATALOG", label: "Banner Katalog Kelas (3:1)" },
  { value: "DASHBOARD", label: "Banner Dashboard Mahasiswa (3:1)" },
];

const toLocalDateTime = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

export default function PengiklananPage() {
  const [ads, setAds] = useState<ApiAd[]>([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [placement, setPlacement] = useState<ApiAd["placement"]>("CLASS_CATALOG");
  const [imageUrl, setImageUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [startsAt, setStartsAt] = useState(() => toLocalDateTime(new Date()));
  const [endsAt, setEndsAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  // Biaya sewa slot promosi mandiri: estimasi Rp 50.000 per slot iklan aktif
  const totalInvestment = ads.length * 50000;

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
    <div className="space-y-6">
      {/* Header */}
      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 dark:border-[#343945] dark:bg-[#191C23]">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#2457C5] dark:text-[#78A0FF]">
          <Megaphone className="h-4 w-4" /> Promosi Mandiri &amp; Self-Serve Ads
        </span>
        <h1 className="mt-2 text-lg sm:text-xl font-semibold text-[#20232B] dark:text-[#F3F4F6]">
          Analitik &amp; Manajemen Iklan
        </h1>
        <p className="mt-1 text-sm text-[#626B78] dark:text-[#B1B7C3]">
          Pantau impresi aktual, total klik, serta rasio konversi (CTR) banner kelas bimbingan Anda di katalog NEXIERA.
        </p>
      </header>

      {/* 4 Metric Card Performa Banner Sesuai Spesifikasi Teknis 2.B.4 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tayang (Impressions)</span>
            <Eye className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />
          </div>
          <p className="mt-1.5 text-xl sm:text-2xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {loading || error ? "—" : metrics.impressions.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Frekuensi banner dilihat di katalog
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Klik (Clicks)</span>
            <MousePointerClick className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1.5 text-xl sm:text-2xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {loading || error ? "—" : metrics.clicks.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Interaksi klik langsung ke kelas
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-xs font-semibold uppercase tracking-wider">Rata-Rata CTR</span>
            <Percent className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-1.5 text-xl sm:text-2xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {loading || error ? "—" : `${ctr.toFixed(2)}%`}
          </p>
          <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Efektivitas (Klik / Tayang × 100%)
          </p>
        </article>

        <article className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
          <div className="flex items-center justify-between text-[#626B78] dark:text-[#B1B7C3]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Investasi Iklan</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-1.5 text-xl sm:text-2xl font-bold text-[#20232B] dark:text-[#F3F4F6]">
            {loading || error
              ? "—"
              : new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(totalInvestment)}
          </p>
          <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
            Akumulasi sewa {ads.length} slot banner
          </p>
        </article>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-[4px] border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      {notice && (
        <p
          role="status"
          className="rounded-[4px] border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {notice}
        </p>
      )}

      {/* Formulir Pasang Iklan */}
      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 dark:border-[#343945] dark:bg-[#191C23]">
        <h2 className="font-semibold text-[#20232B] dark:text-[#F3F4F6]">Pasang Iklan Baru (Pure Image)</h2>
        <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
          Banner ditampilkan murni sebagai kontainer gambar (tanpa badge &quot;Sponsor&quot;, tanpa dark gradient overlay, dan tanpa teks overlay).
        </p>

        <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            Nama Kampanye Iklan
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              maxLength={191}
              placeholder="Contoh: Promo Kelas Kalkulus Semester Ganjil"
              className="nx-input mt-1 w-full"
            />
          </label>

          <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            Penempatan Slot Banner
            <select
              value={placement}
              onChange={(event) => setPlacement(event.target.value as ApiAd["placement"])}
              className="nx-input mt-1 w-full"
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
              className="nx-input mt-1 w-full"
            />
          </label>

          <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            URL Gambar Banner (Rasio 3:1)
            <input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              required
              className="nx-input mt-1 w-full"
              placeholder="https://... (URL aset gambar bersih)"
            />
          </label>

          <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            URL Tujuan (Tautan Kelas / Detail)
            <input
              type="url"
              value={targetUrl}
              onChange={(event) => setTargetUrl(event.target.value)}
              required
              className="nx-input mt-1 w-full"
              placeholder="https://... atau /detail-kelas?id=..."
            />
          </label>

          <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            Waktu Mulai Tayang
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
              required
              className="nx-input mt-1 w-full"
            />
          </label>

          <label className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6]">
            Waktu Selesai Tayang
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(event) => setEndsAt(event.target.value)}
              required
              className="nx-input mt-1 w-full"
            />
          </label>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary inline-flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              {saving ? "Menyimpan..." : "Pasang Iklan Sekarang"}
            </button>
          </div>
        </form>
      </section>

      {/* Daftar Iklan Aktif */}
      <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 dark:border-[#343945] dark:bg-[#191C23]">
        <h2 className="border-b border-[#D9DEE7] pb-4 font-semibold text-[#20232B] dark:border-[#343945] dark:text-[#F3F4F6]">
          Daftar Iklan Anda
        </h2>

        {loading ? (
          <p className="py-8 text-sm text-[#626B78] dark:text-[#B1B7C3]">Memuat data iklan...</p>
        ) : error ? (
          <p className="py-8 text-center text-sm text-[#626B78] dark:text-[#B1B7C3]">
            Daftar iklan tidak dapat dimuat.
          </p>
        ) : ads.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-semibold text-[#20232B] dark:text-[#F3F4F6]">
              Kamu belum memiliki iklan aktif.
            </p>
            <p className="mt-1 text-sm text-[#626B78] dark:text-[#B1B7C3]">
              Pasang banner promosi untuk meningkatkan pendaftaran kelas bimbingan Anda.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#D9DEE7] dark:divide-[#343945]">
            {ads.map((ad) => (
              <article
                key={ad.id}
                className="flex flex-wrap items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase text-[#2457C5] dark:text-[#78A0FF]">
                    {placements.find((item) => item.value === ad.placement)?.label || ad.placement}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-[#20232B] dark:text-[#F3F4F6]">
                    {ad.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                    {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                      new Date(ad.startsAt),
                    )}{" "}
                    –{" "}
                    {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                      new Date(ad.endsAt),
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-6 text-xs text-[#626B78] dark:text-[#B1B7C3]">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-[#2457C5] dark:text-[#78A0FF]" />
                    <b>{ad.impressions}</b> Tayang
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MousePointerClick className="h-4 w-4 text-emerald-600" />
                    <b>{ad.clicks}</b> Klik
                  </span>
                  <span
                    className={`rounded-[4px] px-2 py-0.5 font-semibold ${
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
