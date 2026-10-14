"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Rocket,
  SquarePen,
  Handshake,
} from "lucide-react";
import { Logo } from "@/src/components/ui/Logo";
import { getStoredUser, logoutUser } from "@/src/lib/storage";
import { UserProfile } from "@/src/types/course";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Cari Kelas", href: "/cari-kelas" },
  { label: "Buat Kelas", href: "/buat-kelas" },
  { label: "Kelas Saya", href: "/kelas-saya" },
  { label: "Tentang Kami", href: "/tentang-kami" },
];

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getStoredUser());

    const handleAuthChange = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("nexiera_auth_update", handleAuthChange);
    return () => {
      window.removeEventListener("nexiera_auth_update", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-6">
        <Link href="/" className="transition-transform hover:scale-105">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-all ${
                    active
                      ? "font-semibold text-blue-600 underline decoration-blue-600 decoration-2 underline-offset-8"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div ref={menuRef} className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              aria-label="Notifikasi"
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setMenuOpen(false);
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl ring-1 ring-black/5 z-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Notifikasi Terkini
                  </h4>
                  <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">
                    Tandai dibaca
                  </span>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="rounded-lg bg-blue-50/60 p-2.5 text-xs text-slate-700">
                    <p className="font-semibold text-blue-700">
                      <Rocket className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Booster Academy UTS Prep
                    </p>
                    <p className="mt-1 text-slate-500">
                      Sesi perdana Algorithm and Programming dibuka hari Sabtu ini via Zoom.
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700">
                    <p className="font-semibold text-slate-800">
                      <Handshake className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Peer-Tutoring ADA
                    </p>
                    <p className="mt-1 text-slate-500">
                      Rizky Pratama menambahkan materi pembelajaran baru.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {user && user.isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  setNotificationOpen(false);
                }}
                className="flex items-center gap-1.5 rounded-full p-0.5 hover:ring-2 hover:ring-blue-400 transition-all focus:outline-none"
                aria-label="Menu Profil"
              >
                {user.avatarUrl ? (
                  <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-blue-500">
                    <Image
                      src={user.avatarUrl}
                      alt={user.fullName}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white ring-2 ring-blue-500">
                    {user.fullName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl ring-1 ring-black/5 z-50">
                  <div className="border-b border-slate-100 pb-3 px-2">
                    <p className="text-xs text-slate-400">Masuk sebagai</p>
                    <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">
                      {user.campus} • {user.major}
                    </p>
                    <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      <BadgeCheck className="h-3 w-3" aria-hidden="true" /> Terverifikasi Mahasiswa BINUS
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <Link
                      href="/kelas-saya"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-blue-600" aria-hidden="true" /> Dashboard Kelas Saya
                    </Link>
                    <Link
                      href="/buat-kelas"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <SquarePen className="h-4 w-4 text-slate-500" aria-hidden="true" /> Buat Kelas Baru
                    </Link>
                    <Link
                      href="/onboarding"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <GraduationCap className="h-4 w-4 text-slate-500" aria-hidden="true" /> Perbarui Kampus &amp; Jurusan
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" /> Keluar (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
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
