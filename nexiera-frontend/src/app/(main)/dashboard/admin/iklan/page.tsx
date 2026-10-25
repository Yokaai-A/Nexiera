"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ExternalLink, Megaphone, RefreshCw, X } from "lucide-react";
import { getPublicUploadUrl, nexieraApi, type ApiAd, type ApiUser } from "@/src/lib/api";
import { useUserStore } from "@/src/store/useUserStore";

type PendingAd = ApiAd & { owner: Pick<ApiUser, "id" | "fullName" | "email"> };

export default function AdminAdsPage() {
  const router = useRouter();
  const user = useUserStore();
  const [ads, setAds] = useState<PendingAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    const pendingAds = await nexieraApi.adminPendingAds();
    setAds(pendingAds);
  }, []);

  useEffect(() => {
    if (!user.isLoggedIn) return;
    if (!user.roles.includes("admin")) {
      router.replace("/dashboard");
      return;
    }
    let active = true;
    void refresh()
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : "Pengajuan iklan gagal dimuat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user.isLoggedIn, user.roles, router, refresh]);

  async function review(ad: PendingAd, decision: "APPROVE" | "REJECT") {
    setBusyId(ad.id);
    setError("");
    setNotice("");
    try {
      await nexieraApi.reviewAd(ad.id, decision);
      setNotice(decision === "APPROVE"
        ? "Iklan disetujui. Iklan akan tayang otomatis selama periode aktifnya."
        : "Pengajuan iklan ditolak.");
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Status pengajuan iklan gagal diperbarui.");
    } finally {
      setBusyId("");
    }
  }

  const button = "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[4px] px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  if (!user.isLoggedIn || !user.roles.includes("admin")) return null;

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3 rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2457C5]"><Megaphone className="h-4 w-4" /> Administrasi</p>
          <h1 className="mt-2 text-xl font-bold text-[#20232B] dark:text-slate-100">Manajemen Iklan</h1>
          <p className="mt-1 text-sm text-[#626B78] dark:text-slate-400">Tinjau materi dan tujuan tautan sebelum iklan ditayangkan.</p>
        </div>
        <button type="button" disabled={loading} onClick={() => void refresh().catch((cause) => setError(cause instanceof Error ? cause.message : "Pengajuan iklan gagal dimuat."))} className={`${button} border border-[#D9DEE7] bg-white text-[#20232B]`}><RefreshCw className="h-3.5 w-3.5" />Muat ulang</button>
      </header>

      {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}

      {loading ? (
        <p className="rounded border border-[#D9DEE7] bg-white p-5 text-sm text-[#626B78]">Memuat pengajuan iklan...</p>
      ) : ads.length === 0 ? (
        <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-8 text-center dark:border-[#343945] dark:bg-[#191C23]">
          <Megaphone className="mx-auto h-8 w-8 text-[#9AA3B2]" />
          <h2 className="mt-3 text-sm font-semibold text-[#20232B] dark:text-slate-100">Tidak ada pengajuan menunggu</h2>
          <p className="mt-1 text-xs text-[#626B78]">Pengajuan iklan baru akan muncul di sini.</p>
        </div>
      ) : (
        <section className="space-y-3" aria-label="Pengajuan iklan menunggu tinjauan">
          <p className="text-xs text-[#626B78]">{ads.length} pengajuan menunggu tinjauan</p>
          {ads.map((ad) => {
            const imageUrl = ad.imageUrl.startsWith("http") ? ad.imageUrl : getPublicUploadUrl(ad.imageUrl);
            return (
              <article key={ad.id} className="overflow-hidden rounded-[6px] border border-[#D9DEE7] bg-white dark:border-[#343945] dark:bg-[#191C23]">
                <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">Menunggu tinjauan</span>
                        <h2 className="mt-2 text-base font-bold text-[#20232B] dark:text-slate-100">{ad.title}</h2>
                        <p className="mt-0.5 text-xs text-[#626B78]">{ad.owner.fullName} · {ad.owner.email}</p>
                      </div>
                      <span className="rounded border border-[#D9DEE7] px-2 py-1 text-[11px] font-semibold text-[#455166]">{ad.placement === "HOME_HERO" ? "Banner utama" : "Banner samping"}</span>
                    </div>
                    {ad.subtitle && <p className="whitespace-pre-wrap text-sm text-[#455166] dark:text-slate-300">{ad.subtitle}</p>}
                    <div className="grid gap-2 text-xs text-[#626B78] sm:grid-cols-2">
                      <p><b className="text-[#20232B] dark:text-slate-100">Mulai:</b> {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ad.startsAt))}</p>
                      <p><b className="text-[#20232B] dark:text-slate-100">Selesai:</b> {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ad.endsAt))}</p>
                    </div>
                    <a href={ad.targetUrl} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 break-all text-xs text-[#2457C5] underline"><ExternalLink className="h-3.5 w-3.5 shrink-0" />{ad.targetUrl}</a>
                  </div>
                  <a href={imageUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded border border-[#D9DEE7] bg-[#F8FAFC] dark:border-[#343945] dark:bg-[#111318]">
                    <img src={imageUrl} alt={`Pratinjau iklan ${ad.title}`} className="h-full min-h-40 max-h-56 w-full object-contain" />
                  </a>
                </div>
                <div className="flex justify-end gap-2 border-t border-[#D9DEE7] bg-[#F8FAFC] p-3 dark:border-[#343945] dark:bg-[#15171D]">
                  <button type="button" disabled={busyId === ad.id} onClick={() => void review(ad, "REJECT")} className={`${button} bg-red-50 text-red-700 hover:bg-red-100`}><X className="h-3.5 w-3.5" />{busyId === ad.id ? "Memproses..." : "Tolak"}</button>
                  <button type="button" disabled={busyId === ad.id} onClick={() => void review(ad, "APPROVE")} className={`${button} bg-[#2457C5] text-white hover:bg-blue-700`}><Check className="h-3.5 w-3.5" />{busyId === ad.id ? "Memproses..." : "Setujui & tayangkan"}</button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
