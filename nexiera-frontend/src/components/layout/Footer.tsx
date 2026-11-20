"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/src/components/ui/Logo";
import { getUserSnapshot, refreshUser } from "@/src/store/useUserStore";

type Access = "login" | "tutor";

interface FooterLink {
  label: string;
  href: string;
  access?: Access;
}

const TUTOR_CREATE_CLASS_HREF = "/dashboard/tutor/buat-kelas";

const COLUMNS: { title: string; links: FooterLink[] }[] = [
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
      { label: "Dashboard Kelas Saya", href: "/dashboard/kelas-saya", access: "login" },
      { label: "Tutor Sebaya Terverifikasi", href: "/cari-kelas" },
      { label: "Panduan Mahasiswa Baru", href: "/tentang-kami" },
    ],
  },
  {
    title: "TUTOR & MITRA",
    links: [
      { label: "Publikasikan Kelas", href: TUTOR_CREATE_CLASS_HREF, access: "tutor" },
      { label: "Menjadi Tutor Sebaya", href: TUTOR_CREATE_CLASS_HREF, access: "tutor" },
      { label: "Mitra Organisasi Kampus", href: TUTOR_CREATE_CLASS_HREF, access: "tutor" },
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
  const router = useRouter();

  async function handleGatedClick(event: MouseEvent<HTMLAnchorElement>, link: FooterLink) {
    if (!link.access) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    await refreshUser();
    const user = getUserSnapshot();
    if (!user.isLoggedIn) {
      router.push("/login");
      return;
    }
    const isVerifiedTutor = user.roles.includes("tutor") || user.roles.includes("bootcamp_partner");
    if (link.access === "tutor" && !isVerifiedTutor) {
      router.push("/dashboard?notice=tutor-required");
      return;
    }
    router.push(link.href);
  }

  return (
    <footer className="mt-20 border-t border-[#D9DEE7] bg-white">
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-10 px-4 sm:px-6 lg:px-8 py-14 md:grid-cols-6">
        <div className="col-span-2">
          <Link href="/">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#626B78]">
            Platform edukasi akademik &amp; marketplace bimbingan mata kuliah kampus.
            Didirikan tahun <b>2026</b> oleh 5 mahasiswa <b>Universitas Bina Nusantara (BINUS)</b> untuk
            mempersatukan materi studi dan tutor sebaya.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold tracking-wider text-[#20232B] uppercase">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={(event) => void handleGatedClick(event, link)}
                    className="text-xs font-medium text-[#626B78] hover:text-[#2457C5] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[#D9DEE7] bg-white">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-4 sm:px-6 lg:px-8 py-5 text-xs text-[#626B78] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[#626B78]">
            © 2026 NEXIERA. Hak Cipta Dilindungi.
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-[#626B78]">
            <Link href="/tentang-kami" className="hover:text-[#2457C5] transition-colors">
              Integritas Akademik
            </Link>
            <Link href="/tentang-kami" className="hover:text-[#2457C5] transition-colors">
              Syarat &amp; Ketentuan
            </Link>
            <Link href="mailto:support@nexiera.id" className="hover:text-[#2457C5] transition-colors">
              Bantuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
