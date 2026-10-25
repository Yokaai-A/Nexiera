"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  Settings,
} from "lucide-react";
import { Logo } from "@/src/components/ui/Logo";
import { applyTheme, getInitialTheme, Theme } from "@/src/lib/theme";
import { getPublicUploadUrl, nexieraApi } from "@/src/lib/api";
import { refreshUser, useUserStore } from "@/src/store/useUserStore";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Cari Kelas", href: "/cari-kelas" },
  { label: "Tentang Kami", href: "/tentang-kami" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore();
  const [theme, setTheme] = useState<Theme>("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarUrl = user.avatarUrl?.startsWith("/uploads")
    ? getPublicUploadUrl(user.avatarUrl)
    : user.avatarUrl;
  const userInitials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "NX";

  useEffect(() => {
    if (user.isLoggedIn) {
      nexieraApi.notifications().then(setNotifications).catch(() => null);
    }
  }, [user.isLoggedIn]);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme: Theme }>;
      if (customEvent.detail?.theme) setTheme(customEvent.detail.theme);
    };

    window.addEventListener("nexiera_theme_change", handleThemeChange);
    return () => {
      window.removeEventListener("nexiera_theme_change", handleThemeChange);
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

  const handleLogout = async () => {
    await nexieraApi.logout().catch(() => undefined);
    await refreshUser();
    setMenuOpen(false);
    router.replace("/login");
  };

  const isAdmin = user.roles.includes("admin");
  const dashboardHref = isAdmin
    ? "/dashboard/admin"
    : user.role === "tutor" || user.role === "bootcamp" || user.role === "bootcamp_partner"
      ? "/dashboard/tutor"
      : "/dashboard";
  const dashboardLabel = isAdmin ? "Tinjauan Admin" : "Dashboard";

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#D9DEE7] bg-white dark:border-[#343945] dark:bg-[#111318]">
      <nav className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-7 md:flex h-[68px]">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href} className="relative flex items-center h-full">
                <Link
                  href={link.href}
                  className={`inline-flex items-center text-sm font-medium transition-colors ${
                    active
                      ? "font-semibold text-[#2457C5] underline decoration-2 underline-offset-4 dark:text-[#78A0FF]"
                      : "text-[#626B78] hover:text-[#20232B] dark:text-[#B1B7C3] dark:hover:text-[#F3F4F6]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div ref={menuRef} className="flex items-center gap-2.5">

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
            title={theme === "dark" ? "Mode terang" : "Mode gelap"}
            className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#D9DEE7] bg-white text-[#626B78] transition-colors hover:bg-[#E5E9F0] hover:text-[#20232B] dark:border-[#343945] dark:bg-[#191C23] dark:text-[#B1B7C3] dark:hover:bg-[#20242D] dark:hover:text-[#F3F4F6]"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>


          {user.isLoggedIn && (
            <div className="relative">
              <button
                type="button"
                aria-label="Notifikasi"
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setMenuOpen(false);
                }}
                className="relative flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#D9DEE7] bg-white text-[#626B78] transition-colors hover:bg-[#E5E9F0] hover:text-[#20232B] dark:border-[#343945] dark:bg-[#191C23] dark:text-[#B1B7C3] dark:hover:bg-[#20242D] dark:hover:text-[#F3F4F6]"
              >
                <BellIcon className="h-4 w-4" />
                {notifications.some((n) => !n.isRead) && (
                  <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-white dark:ring-[#111318]" />
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-[6px] border border-[#D9DEE7] bg-white p-4 z-50 dark:border-[#343945] dark:bg-[#191C23] shadow-lg">
                  <div className="flex items-center justify-between border-b border-[#D9DEE7] pb-2 dark:border-[#343945]">
                    <h4 className="text-xs font-semibold text-[#20232B] dark:text-[#F3F4F6] uppercase tracking-wider">
                      Notifikasi Terkini
                    </h4>
                    <button
                      type="button"
                      onClick={async () => {
                        await nexieraApi.markAllNotificationsRead().catch(() => null);
                        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                      }}
                      className="text-xs text-[#2457C5] dark:text-[#78A0FF] font-medium cursor-pointer hover:underline"
                    >
                      Tandai dibaca
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#D9DEE7] dark:divide-[#343945]">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id} className={`py-2.5 text-xs ${n.isRead ? "opacity-75" : "font-medium"}`}>
                          <p className="font-semibold text-[#20232B] dark:text-[#F3F4F6]">{n.title}</p>
                          <p className="text-[#626B78] dark:text-[#B1B7C3] mt-0.5">{n.message}</p>
                          {n.linkUrl && (
                            <Link
                              href={n.linkUrl}
                              onClick={() => setNotificationOpen(false)}
                              className="text-[11px] text-[#2457C5] dark:text-[#78A0FF] hover:underline mt-1 inline-block"
                            >
                              Buka tautan &rarr;
                            </Link>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="py-5 text-center text-xs text-[#626B78] dark:text-[#B1B7C3]">
                        Belum ada notifikasi baru.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}


          {user.isLoggedIn && (
            <Link
              href={dashboardHref}
              className="hidden items-center gap-1.5 rounded-[4px] border border-[#2457C5] bg-transparent px-2.5 py-1.5 text-xs font-semibold text-[#2457C5] transition-colors hover:bg-[#2457C5]/10 dark:border-[#78A0FF] dark:text-[#78A0FF] dark:hover:bg-[#78A0FF]/15 sm:inline-flex"
            >
              <LayoutDashboard className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{dashboardLabel}</span>
            </Link>
          )}


          {user.isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  setNotificationOpen(false);
                }}
                className="flex items-center gap-1.5 rounded-[4px] border border-[#D9DEE7] bg-white px-2 py-1 text-xs font-medium text-[#20232B] transition-colors hover:bg-[#E5E9F0] focus:outline-none dark:border-[#343945] dark:bg-[#191C23] dark:text-[#F3F4F6] dark:hover:bg-[#20242D]"
                aria-label="Menu Profil"
              >
                {avatarUrl ? (
                  <div className="relative h-6 w-6 overflow-hidden rounded-[2px] border border-[#D9DEE7] dark:border-[#343945]">
                    <Image
                      src={avatarUrl}
                      alt={user.name}
                      fill
                      sizes="24px"
                      unoptimized={avatarUrl.includes("/uploads/")}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-[2px] border border-[#D9DEE7] bg-slate-100 text-[10px] font-semibold text-[#20232B] dark:border-[#343945] dark:bg-slate-800 dark:text-[#F3F4F6]">
                    {userInitials}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate">
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown className="h-3 w-3 text-[#626B78] dark:text-[#B1B7C3]" aria-hidden="true" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-72 max-w-[calc(100vw-1rem)] rounded-[6px] border border-[#D9DEE7] bg-white p-3 dark:border-[#343945] dark:bg-[#191C23]">
                  <div className="flex items-center gap-3 border-b border-[#D9DEE7] px-2 pb-3 dark:border-[#343945]">
                    {avatarUrl ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[4px] border border-[#D9DEE7] dark:border-[#343945]">
                        <Image src={avatarUrl} alt="" fill sizes="40px" unoptimized={avatarUrl.includes("/uploads/")} className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-[#D9DEE7] bg-slate-100 text-xs font-semibold text-[#20232B] dark:border-[#343945] dark:bg-slate-800 dark:text-[#F3F4F6]">
                        {userInitials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3]">Profil akun</p>
                      <p className="mt-0.5 truncate text-sm font-semibold leading-5 text-[#20232B] dark:text-[#F3F4F6]">{user.name}</p>
                      <p className="truncate text-xs leading-5 text-[#626B78] dark:text-[#B1B7C3]">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-center gap-2 border-b border-[#D9DEE7] px-2 py-2.5 dark:border-[#343945]">
                    <span className="shrink-0 rounded-[4px] bg-[#F0F4FC] px-2 py-1 text-[11px] font-semibold text-[#2457C5] dark:bg-[#2457C5]/15 dark:text-[#78A0FF]">
                      {user.role === "tutor"
                        ? "Peer-Tutor"
                        : user.role === "bootcamp" || user.role === "bootcamp_partner"
                          ? "Mitra Bootcamp"
                          : "Mahasiswa"}
                    </span>
                    {user.university && (
                      <span className="min-w-0 truncate text-[11px] text-[#626B78] dark:text-[#B1B7C3]">
                        {user.university}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    <Link
                      href={dashboardHref}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-[4px] px-2.5 py-1.5 text-xs font-medium text-[#20232B] hover:bg-[#E5E9F0] dark:text-[#F3F4F6] dark:hover:bg-[#20242D] transition-colors"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-[#2457C5] dark:text-[#78A0FF]" aria-hidden="true" />
                      {dashboardLabel}
                    </Link>
                    <Link
                      href="/pengaturan"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-[4px] px-2.5 py-1.5 text-xs font-medium text-[#20232B] hover:bg-[#E5E9F0] dark:text-[#F3F4F6] dark:hover:bg-[#20242D] transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5 text-[#626B78] dark:text-[#B1B7C3]" aria-hidden="true" />
                      Pengaturan Akun
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-[4px] px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                      Keluar (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-1.5 text-xs font-medium text-[#20232B] transition-colors hover:bg-[#E5E9F0] dark:border-[#343945] dark:bg-[#191C23] dark:text-[#F3F4F6] dark:hover:bg-[#20242D]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-[4px] border border-[#2457C5] bg-transparent px-3 py-1.5 text-xs font-semibold text-[#2457C5] transition-colors hover:bg-[#2457C5]/10 dark:border-[#78A0FF] dark:text-[#78A0FF] dark:hover:bg-[#78A0FF]/15"
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
