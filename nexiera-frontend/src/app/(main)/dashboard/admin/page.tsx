"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, FileText, RefreshCw, ShieldCheck, Upload, X } from "lucide-react";
import { getPrivateFileUrl, getPublicUploadUrl, nexieraApi, type ApiClass, type ApiRoleApplication, type ApiTransaction } from "@/src/lib/api";
import { useUserStore } from "@/src/store/useUserStore";
import { ClassApprovalCard } from "@/src/components/dashboard/ClassApprovalCard";

type PendingRefund = ApiTransaction & { refundAccountName?: string | null; refundAccountNumber?: string | null; refundRequestedAt?: string | null };

export default function AdminReviewPage() {
  const router = useRouter();
  const user = useUserStore();
  const [applications, setApplications] = useState<ApiRoleApplication[]>([]);
  const [pendingClasses, setPendingClasses] = useState<ApiClass[]>([]);
  const [refunds, setRefunds] = useState<PendingRefund[]>([]);
  const [reports, setReports] = useState<Awaited<ReturnType<typeof nexieraApi.adminReports>>>([]);
  const [refundFiles, setRefundFiles] = useState<Record<string, File | undefined>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    const [roleApplications, pendingRefunds, pendingReports, classReviews] = await Promise.all([
      nexieraApi.adminRoleApplications(),
      nexieraApi.adminRefunds(),
      nexieraApi.adminReports(),
      nexieraApi.adminPendingClasses(),
    ]);
    setApplications(roleApplications);
    setRefunds(pendingRefunds);
    setReports(pendingReports);
    setPendingClasses(classReviews);
  }, []);

  useEffect(() => {
    if (!user.isLoggedIn) return;
    if (!user.roles.includes("admin")) {
      router.replace("/dashboard");
      return;
    }
    let active = true;
    void refresh().catch((cause) => {
      if (active) setError(cause instanceof Error ? cause.message : "Data tinjauan gagal dimuat.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [user.isLoggedIn, user.roles, router, refresh]);

  async function reviewRole(application: ApiRoleApplication, decision: "APPROVE" | "REJECT") {
    setBusyId(application.id);
    setError("");
    setNotice("");
    try {
      await nexieraApi.reviewRoleApplication(application.id, { decision, note: notes[application.id] || undefined });
      setNotice(decision === "APPROVE" ? "Pendaftaran peran disetujui dan akses telah dibuka." : "Pendaftaran peran ditolak.");
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Status pendaftaran gagal diperbarui.");
    } finally {
      setBusyId("");
    }
  }

  async function reviewClass(item: ApiClass, decision: "APPROVE" | "REJECT") {
    setBusyId(item.id);
    setError("");
    setNotice("");
    try {
      await nexieraApi.reviewClass(item.id, decision, notes[item.id]?.trim());
      setNotice(decision === "APPROVE" ? `Kelas “${item.title}” disetujui dan tampil di katalog.` : `Kelas “${item.title}” ditolak. Catatan perbaikan sudah dikirim ke pembuat.`);
      setNotes((old) => { const next = { ...old }; delete next[item.id]; return next; });
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Status tinjauan kelas gagal diperbarui.");
    } finally {
      setBusyId("");
    }
  }

  async function reviewRefund(refund: PendingRefund, decision: "APPROVE" | "REJECT") {
    const proofFile = refundFiles[refund.id];
    if (decision === "APPROVE" && !proofFile) {
      setError("Unggah bukti transfer sebelum menyetujui refund.");
      return;
    }
    if (decision === "APPROVE" && !window.confirm("Setujui refund dan cabut akses kelas setelah bukti transfer disimpan?")) return;
    setBusyId(refund.id);
    setError("");
    setNotice("");
    try {
      const proof = decision === "APPROVE" && proofFile
        ? await nexieraApi.uploadRefundProof(proofFile)
        : undefined;
      await nexieraApi.reviewRefund(refund.id, {
        decision,
        note: notes[refund.id] || undefined,
        proofUrl: proof?.url,
      });
      setNotice(decision === "APPROVE" ? "Refund disetujui. Bukti transfer tersimpan dan akses kelas dicabut." : "Pengajuan refund ditolak.");
      setRefundFiles((old) => { const next = { ...old }; delete next[refund.id]; return next; });
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Status refund gagal diperbarui.");
    } finally {
      setBusyId("");
    }
  }

  const field = "nx-input mt-1 w-full";
  const button = "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[4px] px-3 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  if (!user.isLoggedIn || !user.roles.includes("admin")) return null;

  return (
    <div className="space-y-5">
      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 dark:border-[#343945] dark:bg-[#191C23]">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2457C5]"><ShieldCheck className="h-4 w-4" /> Ruang Operasional</p>
        <h1 className="mt-2 text-xl font-bold text-[#20232B] dark:text-slate-100">Tinjauan Admin</h1>
        <p className="mt-1 text-sm text-[#626B78] dark:text-slate-400">Tinjau pengajuan kelas dan peran, tangani laporan, serta selesaikan refund manual.</p>
      </header>

      {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}
      {loading ? <p className="rounded border border-[#D9DEE7] bg-white p-5 text-sm text-[#626B78]">Memuat antrean...</p> : (
        <>
          <section id="persetujuan-kelas" className="scroll-mt-6 space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div><h2 className="text-base font-bold text-[#20232B] dark:text-slate-100">Persetujuan Kelas</h2><p className="text-xs text-[#626B78]">{pendingClasses.length} kelas menunggu tinjauan. Periksa banner, data akademik, dan kewajaran materi sebelum menyetujui.</p></div>
              <button type="button" onClick={() => void refresh().catch((cause) => setError(cause instanceof Error ? cause.message : "Antrean gagal dimuat."))} className={`${button} border border-[#D9DEE7] bg-white text-[#20232B]`}><RefreshCw className="h-3.5 w-3.5" />Muat ulang</button>
            </div>
            {pendingClasses.length === 0 ? <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 text-sm text-[#626B78] dark:border-[#343945] dark:bg-[#191C23]">Tidak ada kelas yang menunggu persetujuan.</div> : pendingClasses.map((item) => <ClassApprovalCard key={item.id} item={item} busy={busyId === item.id} note={notes[item.id] || ""} onNoteChange={(value) => setNotes((old) => ({ ...old, [item.id]: value }))} onReview={(decision) => void reviewClass(item, decision)} />)}
          </section>
          <section className="space-y-3">
            <div><h2 className="text-base font-bold text-[#20232B] dark:text-slate-100">Laporan Kelas</h2><p className="text-xs text-[#626B78]">{reports.filter((report) => !["RESOLVED", "DISMISSED"].includes(report.status)).length} laporan perlu ditangani. Catatan akan tampil pada akun pelapor.</p></div>
            {reports.filter((report) => !["RESOLVED", "DISMISSED"].includes(report.status)).length === 0 ? <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 text-sm text-[#626B78]">Tidak ada laporan aktif.</div> : reports.filter((report) => !["RESOLVED", "DISMISSED"].includes(report.status)).map((report) => <article key={report.id} className="space-y-3 rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]"><div><span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-800">{report.status}</span><h3 className="mt-2 text-sm font-bold">{report.class?.title || `Laporan ${report.targetType}`}</h3><p className="text-xs text-[#626B78]">{report.reporter.fullName} · {report.reporter.email} · {report.category}</p><p className="mt-2 whitespace-pre-wrap text-sm text-[#455166]">{report.description}</p>{report.evidenceUrl && <a href={getPrivateFileUrl(report.evidenceUrl)} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-[#2457C5] underline">Lihat bukti laporan</a>}</div><label className="block text-xs font-semibold">Catatan untuk pelapor<textarea value={notes[report.id] || ""} onChange={(event) => setNotes((old) => ({ ...old, [report.id]: event.target.value }))} rows={2} maxLength={2000} className={field} placeholder="Tulis hasil penanganan atau alasan penutupan" /></label><div className="flex justify-end gap-2"><button type="button" disabled={busyId === report.id} onClick={() => void nexieraApi.reviewReport(report.id, "DISMISSED", notes[report.id]).then(refresh).catch((cause) => setError(cause instanceof Error ? cause.message : "Gagal memperbarui laporan."))} className={`${button} bg-slate-100 text-slate-700 hover:bg-slate-200`}>Tutup laporan</button><button type="button" disabled={busyId === report.id} onClick={() => { setBusyId(report.id); void nexieraApi.reviewReport(report.id, "RESOLVED", notes[report.id]).then(async () => { setNotice("Laporan diselesaikan dan pelapor diberi kabar."); await refresh(); }).catch((cause) => setError(cause instanceof Error ? cause.message : "Gagal memperbarui laporan.")).finally(() => setBusyId("")); }} className={`${button} bg-[#2457C5] text-white hover:bg-blue-700`}>Tandai selesai</button></div></article>)}
          </section>
          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3"><div><h2 className="text-base font-bold text-[#20232B] dark:text-slate-100">Pendaftaran Peran</h2><p className="text-xs text-[#626B78]">{applications.length} pengajuan menunggu verifikasi</p></div><button type="button" onClick={() => void refresh()} className={`${button} border border-[#D9DEE7] bg-white text-[#20232B]`}><RefreshCw className="h-3.5 w-3.5" />Muat ulang</button></div>
            {applications.length === 0 ? <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 text-sm text-[#626B78]">Tidak ada pengajuan peran yang menunggu.</div> : applications.map((application) => (
              <article key={application.id} className="space-y-3 rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
                <div className="flex flex-wrap items-start justify-between gap-2"><div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">Menunggu verifikasi</span><h3 className="mt-2 text-sm font-bold text-[#20232B] dark:text-slate-100">{application.type === "PEER_TUTOR" ? "Peer-Tutor" : "Mitra Bootcamp"} · {application.user?.fullName || "Pengguna"}</h3><p className="mt-0.5 text-xs text-[#626B78]">{application.user?.email}</p></div><a href={getPrivateFileUrl(application.studentProofUrl)} target="_blank" rel="noreferrer" className={`${button} border border-[#D9DEE7] bg-white text-[#2457C5]`}><FileText className="h-3.5 w-3.5" />Lihat bukti mahasiswa aktif</a></div>
                {application.type === "PEER_TUTOR" ? <p className="text-xs text-[#626B78]">{application.campus} · {application.major}</p> : <div className="grid gap-1 text-xs text-[#626B78]"><p><b className="text-[#20232B]">Organisasi:</b> {application.organizationName}</p><p><b className="text-[#20232B]">Email kontak:</b> {application.contactEmail}</p><p>{application.description}</p>{application.logoUrl && <a href={getPublicUploadUrl(application.logoUrl)} target="_blank" rel="noreferrer" className="text-[#2457C5] underline">Lihat logo organisasi</a>}</div>}
                {application.websiteUrl && <a href={application.websiteUrl} target="_blank" rel="noreferrer" className="break-all text-xs text-[#2457C5] underline">{application.websiteUrl}</a>}
                <label className="block text-xs font-semibold">Catatan untuk pemohon<textarea value={notes[application.id] || ""} onChange={(event) => setNotes((old) => ({ ...old, [application.id]: event.target.value }))} rows={2} maxLength={1000} className={field} placeholder="Opsional" /></label>
                <div className="flex flex-wrap justify-end gap-2"><button type="button" disabled={busyId === application.id} onClick={() => void reviewRole(application, "REJECT")} className={`${button} bg-red-50 text-red-700 hover:bg-red-100`}><X className="h-3.5 w-3.5" />Tolak</button><button type="button" disabled={busyId === application.id} onClick={() => void reviewRole(application, "APPROVE")} className={`${button} bg-[#2457C5] text-white hover:bg-blue-700`}><Check className="h-3.5 w-3.5" />{busyId === application.id ? "Menyimpan..." : "Setujui & buka akses"}</button></div>
              </article>
            ))}
          </section>

          <section className="space-y-3">
            <div><h2 className="text-base font-bold text-[#20232B] dark:text-slate-100">Refund Manual</h2><p className="text-xs text-[#626B78]">Transfer dana ke rekening yang diminta sebelum menyetujui refund.</p></div>
            {refunds.length === 0 ? <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-5 text-sm text-[#626B78]">Tidak ada refund yang menunggu tinjauan.</div> : refunds.map((refund) => (
              <article key={refund.id} className="space-y-3 rounded-[6px] border border-[#D9DEE7] bg-white p-4 dark:border-[#343945] dark:bg-[#191C23]">
                <div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="text-sm font-bold text-[#20232B] dark:text-slate-100">{refund.class.title}</h3><p className="mt-0.5 text-xs text-[#626B78]">{refund.user?.fullName} · {refund.user?.email}</p><p className="mt-1 text-xs text-[#626B78]">Nominal: <b className="text-[#20232B]">Rp {Number(refund.amount).toLocaleString("id-ID")}</b></p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">Menunggu tinjauan</span></div>
                <div className="rounded border border-[#D9DEE7] bg-[#F8FAFC] p-3 text-xs text-[#455166]"><p><b>Metode:</b> {refund.refundMethod === "BANK" ? "Transfer bank" : "E-wallet"}</p><p><b>Nama penerima:</b> {refund.refundAccountName}</p><p><b>Nomor rekening / e-wallet:</b> {refund.refundAccountNumber}</p></div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold">Bukti transfer (wajib jika menyetujui; PNG, JPEG, WebP, atau PDF; maks. 2 MB)</p>
                  <label className={`${button} border border-[#D9DEE7] bg-white text-[#2457C5]`}>
                    <Upload className="h-3.5 w-3.5" />{refundFiles[refund.id] ? "Ganti bukti transfer" : "Pilih bukti transfer"}
                    <input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" className="sr-only" onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) {
                        setError("Ukuran bukti transfer maksimal 2 MB.");
                        setRefundFiles((old) => ({ ...old, [refund.id]: undefined }));
                        event.target.value = "";
                        return;
                      }
                      setError("");
                      setRefundFiles((old) => ({ ...old, [refund.id]: file }));
                    }} />
                  </label>
                  {refundFiles[refund.id] && <p className="text-xs font-normal text-emerald-700">{refundFiles[refund.id]?.name}</p>}
                </div>
                <label className="block text-xs font-semibold">Catatan untuk pemohon<textarea value={notes[refund.id] || ""} onChange={(event) => setNotes((old) => ({ ...old, [refund.id]: event.target.value }))} rows={2} maxLength={1000} className={field} placeholder="Opsional" /></label>
                <div className="flex flex-wrap justify-end gap-2"><button type="button" disabled={busyId === refund.id} onClick={() => void reviewRefund(refund, "REJECT")} className={`${button} bg-red-50 text-red-700 hover:bg-red-100`}><X className="h-3.5 w-3.5" />Tolak</button><button type="button" disabled={busyId === refund.id} onClick={() => void reviewRefund(refund, "APPROVE")} className={`${button} bg-[#2457C5] text-white hover:bg-blue-700`}><Upload className="h-3.5 w-3.5" />{busyId === refund.id ? "Memproses..." : "Simpan bukti & setujui"}</button></div>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
