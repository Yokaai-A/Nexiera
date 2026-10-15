import Link from "next/link";
import { Logo } from "@/src/components/ui/Logo";

const COLUMNS = [
  {
    title: "KATEGORI UTAMA",
    links: [
      { label: "Sains & Teknologi", href: "/cari-kelas?category=Sains%20%26%20Teknologi" },
      { label: "Ekonomi & Bisnis", href: "/cari-kelas?category=Ekonomi%20%26%20Bisnis" },
      { label: "Sosial & Hukum", href: "/cari-kelas?category=Sosial%20%26%20Hukum" },
      { label: "Kesehatan & Kedokteran", href: "/cari-kelas?category=Kesehatan%20%26%20Kedokteran" },
      { label: "Seni & Desain", href: "/cari-kelas?category=Seni%20%26%20Desain" },
    ],
  },
  {
    title: "MAHASISWA & STUDI",
    links: [
      { label: "Cari Kelas Kuliah", href: "/cari-kelas" },
      { label: "Catatan Belajar Mahasiswa", href: "/cari-kelas" },
      { label: "Dashboard Kelas Saya", href: "/kelas-saya" },
      { label: "Tutor Sebaya Terverifikasi", href: "/cari-kelas" },
      { label: "Panduan Mahasiswa Baru", href: "/tentang-kami" },
    ],
  },
  {
    title: "TUTOR & MITRA",
    links: [
      { label: "Publikasikan Kelas", href: "/buat-kelas" },
      { label: "Menjadi Tutor Sebaya", href: "/buat-kelas" },
      { label: "Mitra Organisasi Kampus", href: "/buat-kelas" },
      { label: "Standar Integritas Akademik", href: "/tentang-kami" },
    ],
  },
  {
    title: "TENTANG NEXIERA",
    links: [
      { label: "Visi & Misi 2026", href: "/tentang-kami" },
      { label: "5 Founders BINUS", href: "/tentang-kami" },
      { label: "Komitmen Mahasiswa", href: "/tentang-kami" },
      { label: "Hubungi Tim Support", href: "mailto:support@nexiera.id" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-14 md:grid-cols-6">
        <div className="col-span-2">
          <Link href="/">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
            Platform edukasi akademik &amp; marketplace bimbingan mata kuliah kampus.
            Didirikan tahun <b>2026</b> oleh 5 mahasiswa <b>Universitas Bina Nusantara (BINUS)</b> untuk
            mempersatukan materi studi dan tutor sebaya.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 bg-slate-50/50">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-500">
            © 2026 NEXIERA. Hak Cipta Dilindungi.
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <Link href="/tentang-kami" className="hover:text-blue-600 transition-colors">
              Integritas Akademik
            </Link>
            <Link href="/tentang-kami" className="hover:text-blue-600 transition-colors">
              Syarat &amp; Ketentuan
            </Link>
            <Link href="mailto:support@nexiera.id" className="hover:text-blue-600 transition-colors">
              Bantuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
