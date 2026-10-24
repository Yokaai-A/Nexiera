"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, MessageSquareQuote, Star } from "lucide-react";
import { nexieraApi, type ApiReview } from "@/src/lib/api";
import { useUserStore } from "@/src/store/useUserStore";

export function ReviewSection({ courseId, courseTitle, isRegistered }: {
  courseId: string;
  courseTitle: string;
  isRegistered: boolean;
}) {
  const user = useUserStore();
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadReviews() {
    setLoading(true);
    try {
      const data = await nexieraApi.reviews(courseId);
      setReviews(data.reviews ?? []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ulasan gagal dimuat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadReviews(); }, [courseId]);

  const average = useMemo(() => reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0, [reviews]);
  const counts = [5, 4, 3, 2, 1].map((stars) => reviews.filter((review) => review.rating === stars).length);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!comment.trim() || comment.trim().length < 5) {
      setError("Ulasan minimal 5 karakter.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await nexieraApi.createReview(courseId, { rating, comment: comment.trim() });
      setReviews((current) => [created, ...current]);
      setComment("");
      setNotice("Ulasan berhasil dikirim.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ulasan gagal dikirim.");
    } finally {
      setSaving(false);
    }
  }

  return <section className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:p-8">
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#D9DEE7] pb-5">
      <div><h2 className="flex items-center gap-2 text-base font-bold text-[#20232B]"><MessageSquareQuote className="h-4 w-4 text-[#2457C5]" />Ulasan Mahasiswa Terverifikasi</h2>
        <p className="mt-1 text-xs text-[#626B78]">Ulasan peserta kelas {courseTitle}.</p></div>
      <div className="flex items-center gap-2 rounded border border-[#D9DEE7] bg-[#E5E9F0]/50 px-3 py-1.5">
        <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
        <strong className="text-sm">{reviews.length ? average.toFixed(1) : "—"}</strong>
        <span className="text-xs text-[#626B78]">({reviews.length} ulasan)</span>
      </div>
    </header>

    <div className="mt-6 grid gap-6 md:grid-cols-3">
      <div className="rounded border border-[#D9DEE7] bg-[#E5E9F0]/35 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#626B78]">Rating rata-rata</p>
        <div className="mt-3 flex items-baseline gap-2"><strong className="text-5xl leading-none">{reviews.length ? average.toFixed(1) : "—"}</strong><span className="text-sm text-[#626B78]">/ 5</span></div>
        <div className="mt-3 flex gap-1" aria-label={reviews.length ? `Rating ${average.toFixed(1)} dari 5` : "Belum ada rating"}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= Math.round(average) && reviews.length ? "fill-amber-400 text-amber-500" : "text-slate-300"}`} />)}</div>
        <div className="mt-4 border-t border-[#D9DEE7] pt-3 text-xs text-[#626B78]"><BadgeCheck className="mr-1 inline h-4 w-4 text-emerald-600" />{reviews.length} ulasan terverifikasi</div>
      </div>
      <div className="space-y-2 md:col-span-2">{counts.map((count, index) => {
        const stars = 5 - index;
        const percentage = reviews.length ? Math.round(count / reviews.length * 100) : 0;
        return <div key={stars} className="flex items-center gap-3 text-xs"><span className="w-14 text-[#626B78]">{stars} bintang</span><div className="h-2 flex-1 overflow-hidden rounded bg-[#E5E9F0]"><div className="h-full bg-[#2457C5]" style={{ width: `${percentage}%` }} /></div><span className="w-8 text-right text-[#626B78]">{count}</span></div>;
      })}
        {!loading && reviews.length === 0 && <p className="pt-3 text-xs text-[#626B78]">Belum ada ulasan untuk mata kuliah ini.</p>}
      </div>
    </div>

    {isRegistered && user.isLoggedIn && <form onSubmit={submit} className="mt-6 border-t border-[#D9DEE7] pt-5">
      <h3 className="text-sm font-semibold">Bagikan pengalaman belajar</h3>
      <label className="mt-3 block text-xs text-[#626B78]" htmlFor={`rating-${courseId}`}>Rating</label>
      <select id={`rating-${courseId}`} value={rating} onChange={(event) => setRating(Number(event.target.value))} className="nx-input mt-1 w-full sm:w-40">
        {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} bintang</option>)}
      </select>
      <textarea value={comment} onChange={(event) => setComment(event.target.value)} minLength={5} maxLength={2000} required rows={4} className="nx-input mt-3 w-full resize-y" placeholder="Ceritakan pengalaman Anda mengikuti kelas ini." />
      <button className="btn-primary mt-3" type="submit" disabled={saving}>{saving ? "Mengirim..." : "Kirim ulasan"}</button>
    </form>}
    {notice && <p role="status" className="mt-4 text-xs text-emerald-700">{notice}</p>}
    {error && <p role="alert" className="mt-4 text-xs text-red-600">{error}</p>}
    {loading ? <p className="mt-5 text-xs text-[#626B78]">Memuat ulasan...</p> : reviews.length > 0 && <div className="mt-6 space-y-4 border-t border-[#D9DEE7] pt-5">
      {reviews.map((review) => <article key={review.id} className="border-b border-[#D9DEE7] pb-4 last:border-0"><div className="flex flex-wrap items-center justify-between gap-2"><div><strong className="text-sm">{review.user.name}</strong><p className="text-[11px] text-[#626B78]">{[review.user.university, review.user.major].filter(Boolean).join(" · ") || "Peserta kelas"}</p></div><div className="flex items-center gap-1 text-xs" aria-label={`${review.rating} bintang`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-3 w-3 ${star <= review.rating ? "fill-amber-400 text-amber-500" : "text-slate-300"}`} />)}</div></div><p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#414854]">{review.comment}</p>{review.reply && <p className="mt-3 rounded bg-[#E5E9F0]/50 p-3 text-xs"><strong>Balasan tutor:</strong> {review.reply}</p>}</article>)}
    </div>}
  </section>;
}
