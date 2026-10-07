import Link from "next/link";
import { Logo } from "@/src/components/ui/Logo";

const COLUMNS = [
  {
    title: "KATEGORI",
    links: [
      "Sains & Teknologi",
      "Ekonomi & Bisnis",
      "MIPA & Sains Data",
      "Sosial Humaniora",
      "Seni & Desain",
    ],
  },
  {
    title: "MAHASISWA",
    links: [
      "Cari Teman Belajar",
      "Grup Studi Pod",
      "Bark Catatan Kuliah",
      "Jadwal Mentoring",
      "Pandu Mahasiswa Baru",
    ],
  },
  {
    title: "TUTOR",
    links: [
      "Menjadi Tutor Sebaya",
      "Kalkulator Pendapatan",
      "Standar Komunitas",
      "Verifikasi Sertifikat",
    ],
  },
  {
    title: "PERUSAHAAN & INFO",
    links: [
      "Tentang NEXIERA",
      "Karir & Magang",
      "Pusat Bantuan",
      "Hubungi Kami",
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-100 bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-14 md:grid-cols-6">
        <div className="col-span-2">
          <Link href="/">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
            Marketplace peer-to-peer pembelajaran mahasiswa Indonesia. Tingkatkan
            IPK, bagikan keahlian, dan temukan tutor sebaya terverifikasi di
            kampusmu terkemuka.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
            <span>✓</span> Terverifikasi Kampus ID
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold tracking-wider text-slate-900">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link}>
                  <span className="cursor-pointer text-sm text-slate-500 hover:text-blue-600">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <span className="font-medium text-slate-500">
            JARINGAN MITRA KOLABORASI KAMPUS:
          </span>
          <div className="flex flex-wrap gap-4">
            {["UI Community", "ITB Hub", "UGM Circle", "ITS Peer Network", "UNAIR Study Link"].map(
              (m) => (
                <span key={m} className="hover:text-blue-600">
                  {m}
                </span>
              ),
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <span>© 2025 NEXIERA Indonesia. Hak Cipta Dilindungi.</span>
            <span>Kebijakan Privasi</span>
            <span>Syarat & Ketentuan</span>
            <span>Integritas Akademik</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
