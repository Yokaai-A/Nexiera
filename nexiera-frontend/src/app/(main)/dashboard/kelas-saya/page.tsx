import { KelasSaya } from "@/src/components/kelas-saya/KelasSaya";

export default function DashboardKelasSayaPage() {
  return <div className="space-y-5"><header className="rounded-[6px] border border-[#D9DEE7] bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-[#2457C5]">Ruang belajar</p><h1 className="mt-2 text-lg font-bold">Kelas saya</h1><p className="mt-1 text-xs text-[#626B78]">Tautan pembelajaran diminta ke backend dan hanya diberikan untuk transaksi PAID.</p></header><KelasSaya /></div>;
}
