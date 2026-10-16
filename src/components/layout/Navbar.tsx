"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
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
    <header className="sticky top-0 z-50 border-b border-[#D9DEE7] bg-white">
      <nav className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? "text-[#2457C5] font-semibold"
                      : "text-[#626B78] hover:text-[#20232B]"
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
              <div className="absolute right-0 mt-2 w-80 rounded-[6px] border border-[#D9DEE7] bg-white p-4 z-50">
                <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-2">
                  <h4 className="text-xs font-semibold text-[#20232B] uppercase tracking-wider">
                    Notifikasi Terkini
                  </h4>
                  <span className="text-[11px] text-[#2457C5] font-medium cursor-pointer hover:underline">
                    Tandai dibaca
                  </span>
                </div>
                <div className="mt-3 space-y-2.5">
                  <div className="rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/40 p-2.5 text-xs text-[#20232B]">
                    <p className="font-semibold text-[#2457C5]">
                      <Rocket className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Booster Academy UTS Prep
                    </p>
                    <p className="mt-1 text-[#626B78]">
                      Sesi perdana Algorithm and Programming dibuka hari Sabtu ini via Zoom.
                    </p>
                  </div>
                  <div className="rounded-[4px] border border-[#D9DEE7] bg-white p-2.5 text-xs text-[#20232B]">
                    <p className="font-semibold text-[#20232B]">
                      <Handshake className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" /> Peer-Tutoring ADA
                    </p>
                    <p className="mt-1 text-[#626B78]">
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
                className="flex items-center gap-1.5 rounded-[4px] p-0.5 hover:bg-[#E5E9F0] transition-colors focus:outline-none"
                aria-label="Menu Profil"
              >
                {user.avatarUrl ? (
                  <div className="relative h-8 w-8 overflow-hidden rounded-[4px] border border-[#D9DEE7]">
                    <Image
                      src={user.avatarUrl}
                      alt={user.fullName}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#2457C5] text-xs font-medium text-white">
                    {user.fullName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <ChevronDown className="h-3.5 w-3.5 text-[#626B78]" aria-hidden="true" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-[6px] border border-[#D9DEE7] bg-white p-3 z-50">
                  <div className="border-b border-[#D9DEE7] pb-3 px-2">
                    <p className="text-xs text-[#626B78]">Masuk sebagai</p>
                    <p className="text-sm font-semibold text-[#20232B]">{user.fullName}</p>
                    <p className="text-xs text-[#626B78] truncate">{user.email}</p>
                    <p className="text-xs text-[#2457C5] font-medium mt-0.5">
                      {user.campus} • {user.major}
                    </p>
                  </div>

                  <div className="mt-2 space-y-1">
                    <Link
                      href="/kelas-saya"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-[4px] px-2.5 py-2 text-xs font-medium text-[#20232B] hover:bg-[#E5E9F0] transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /> Dashboard Kelas Saya
                    </Link>
                    <Link
                      href="/buat-kelas"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-[4px] px-2.5 py-2 text-xs font-medium text-[#20232B] hover:bg-[#E5E9F0] transition-colors"
                    >
                      <SquarePen className="h-4 w-4 text-[#626B78]" aria-hidden="true" /> Buat Kelas Baru
                    </Link>
                    <Link
                      href="/onboarding"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-[4px] px-2.5 py-2 text-xs font-medium text-[#20232B] hover:bg-[#E5E9F0] transition-colors"
                    >
                      <GraduationCap className="h-4 w-4 text-[#626B78]" aria-hidden="true" /> Perbarui Kampus &amp; Jurusan
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-[4px] px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
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
                className="btn-secondary"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-primary"
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
