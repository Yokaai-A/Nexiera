"use client";

import { useEffect, useMemo, useState } from "react";
import { nexieraApi, type ApiReview } from "@/src/lib/api";

type ReviewRow = ApiReview & { classId: string; classTitle: string };
export default function TutorUlasanPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [search, setSearch] = useState("");
  const [replyId, setReplyId] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await nexieraApi.myClasses();
        const owned = Array.isArray(data) ? data : (data.created ?? []);
        const lists = await Promise.all(owned.map(async (item) => {
          const rd = await nexieraApi.reviews(item.id);
          return (rd.reviews ?? []).map((review) => ({ ...review, classId: item.id, classTitle: item.title }));
        }));
        if (active) setReviews(lists.flat());
      } catch (cause) { if (active) setError(cause instanceof Error ? cause.message : "Ulasan gagal dimuat."); }
      finally { if (active) setLoading(false); }
    }
    void load(); return () => { active = false; };
  }, []);
  const filtered = useMemo(() => reviews.filter((item) => [item.user.name, item.comment ?? "", item.classTitle].some((value) => value.toLocaleLowerCase().includes(search.toLocaleLowerCase()))), [reviews, search]);
  const avg = reviews.length ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length : 0;
  async function submitReply(event: React.FormEvent<HTMLFormElement>, item: ReviewRow) {
    event.preventDefault(); if (reply.trim().length < 2) { setError("Balasan minimal 2 karakter."); return; }
    setSaving(true); setError("");
    try { const updated = await nexieraApi.replyToReview(item.classId, item.id, reply.trim()); setReviews((current) => current.map((review) => review.id === item.id ? { ...review, reply: updated.reply } : review)); setReply(""); setReplyId(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Balasan gagal disimpan."); }
    finally { setSaving(false); }
  }
  return <div className="space-y-4">
    <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-[#2457C5]">Ulasan kelas</p><h1 className="mt-2 text-lg font-bold">Ulasan peserta</h1><p className="mt-1 text-xs text-[#626B78]">{reviews.length} ulasan · rating rata-rata {reviews.length ? avg.toFixed(1) : "—"}</p></header>
    {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}
    <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-4"><input value={search} onChange={(e) => setSearch(e.target.value)} className="nx-input w-full" placeholder="Cari nama, isi ulasan, atau kelas" />
      {loading ? <p className="py-6 text-xs text-[#626B78]">Memuat ulasan...</p> : filtered.length === 0 ? <div className="py-6 text-center"><p className="font-semibold">{reviews.length ? "Tidak ada ulasan yang cocok" : "Belum ada ulasan"}</p><p className="mt-1 text-xs text-[#626B78]">Ulasan peserta kelas Anda akan tampil di sini.</p></div> : <div className="mt-4 space-y-3">{filtered.map((item) => <article key={item.id} className="rounded border border-[#D9DEE7] p-4"><div className="flex flex-wrap justify-between gap-2"><div><h2 className="font-semibold">{item.user.name}</h2><p className="text-xs text-[#626B78]">{item.classTitle} · {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(item.createdAt))}</p></div><span className="text-xs text-amber-600">{item.rating} / 5</span></div><p className="mt-3 whitespace-pre-wrap text-xs">{item.comment}</p>{item.reply ? <p className="mt-3 rounded bg-[#E5E9F0]/50 p-3 text-xs"><strong>Balasan:</strong> {item.reply}</p> : replyId === item.id ? <form onSubmit={(e) => void submitReply(e, item)} className="mt-3"><textarea value={reply} onChange={(e) => setReply(e.target.value)} minLength={2} maxLength={2000} required rows={3} className="nx-input w-full" /><button disabled={saving} className="btn-primary btn-dashboard-action mt-2">{saving ? "Menyimpan..." : "Kirim balasan"}</button><button type="button" onClick={() => setReplyId("")} className="btn-secondary btn-dashboard-action ml-2 mt-2">Batal</button></form> : <button type="button" onClick={() => setReplyId(item.id)} className="mt-3 text-xs font-semibold text-[#2457C5]">Balas ulasan</button>}</article>)}</div>}
    </section>
  </div>;
}
