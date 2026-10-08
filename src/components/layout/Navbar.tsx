"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/src/components/ui/Logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Cari Kelas", href: "/cari-kelas" },
  { label: "Buat Kelas", href: "/buat-kelas" },
  { label: "Tentang Kami", href: "/tentang-kami" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? "text-blue-600 underline underline-offset-8"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifikasi"
            className="relative text-slate-600"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <Link
            href="/login"
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}

function BellIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9ZM13.73 21a2 2 0 0 1-3.46 0"
      />
    </svg>
  );
}
