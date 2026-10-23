import Link from "next/link";

export default function TargetMatkulPage() {
  return <section className="rounded-[6px] border border-dashed border-[#BAC3D2] bg-white p-10 text-center"><h1 className="text-xl font-semibold">Belum ada target akademik</h1><p className="mx-auto mt-2 max-w-lg text-sm text-[#626B78]">Target nilai pribadi belum tersimpan di akun. Kelas yang Anda ikuti dapat dilihat melalui daftar kelas.</p><Link href="/dashboard/kelas-saya" className="btn-primary mt-5 inline-flex">Lihat kelas saya</Link></section>;
}
