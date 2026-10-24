"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CreditCard,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  Receipt,
  Settings,
  ShieldCheck,
  Star,
  Users2,
  Wallet,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserStore } from "@/src/store/useUserStore";
import { SidebarRoleBox } from "./SidebarRoleBox";

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const studentLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      exact: true,
    },
    {
      label: "Kelas Saya",
      href: "/dashboard/kelas-saya",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      label: "Jadwal Bimbingan",
      href: "/dashboard/jadwal",
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      label: "Riwayat Transaksi & Refund",
      href: "/dashboard/transaksi",
      icon: <Receipt className="h-4 w-4" />,
    },
  ];

  const tutorLinks = [
    {
      label: "Ringkasan Peer-Tutor",
      href: "/dashboard/tutor",
      icon: <BarChart3 className="h-4 w-4" />,
      exact: true,
    },
    {
      label: "Kelola Kelas Bimbingan",
      href: "/dashboard/tutor/kelas",
      icon: <FileCheck2 className="h-4 w-4" />,
    },
    {
      label: "Buat Kelas Bimbingan",
      href: "/dashboard/tutor/buat-kelas",
      icon: <PlusCircle className="h-4 w-4" />,
    },
    {
      label: "Peserta Bimbingan",
      href: "/dashboard/tutor/peserta",
      icon: <Users2 className="h-4 w-4" />,
    },
    {
      label: "Ulasan & Rating",
      href: "/dashboard/tutor/ulasan",
      icon: <Star className="h-4 w-4" />,
    },
    {
      label: "Iklan & Promosi",
      href: "/dashboard/tutor/iklan",
      icon: <Megaphone className="h-4 w-4" />,
    },
    {
      label: "Keuangan & Payout",
      href: "/dashboard/tutor/keuangan",
      icon: <Wallet className="h-4 w-4" />,
    },
  ];

  const bootcampLinks = [
    {
      label: "Ringkasan Mitra Bootcamp",
      href: "/dashboard/tutor",
      icon: <BarChart3 className="h-4 w-4" />,
      exact: true,
    },
    {
      label: "Kelola Program Bootcamp",
      href: "/dashboard/tutor/kelas",
      icon: <FileCheck2 className="h-4 w-4" />,
    },
    {
      label: "Buat Program Bootcamp",
      href: "/dashboard/tutor/buat-kelas",
      icon: <PlusCircle className="h-4 w-4" />,
    },
    {
      label: "Peserta Program",
      href: "/dashboard/tutor/peserta",
      icon: <Users2 className="h-4 w-4" />,
    },
    {
      label: "Ulasan & Rating",
      href: "/dashboard/tutor/ulasan",
      icon: <Star className="h-4 w-4" />,
    },
    {
      label: "Iklan & Promosi",
      href: "/dashboard/tutor/iklan",
      icon: <Megaphone className="h-4 w-4" />,
    },
    {
      label: "Keuangan & Payout",
      href: "/dashboard/tutor/keuangan",
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      label: "Pengaturan Profil Lembaga",
      href: "/dashboard/tutor/pengaturan",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const adminLinks = [
    {
      label: "Tinjauan Admin",
      href: "/dashboard/admin",
      icon: <ShieldCheck className="h-4 w-4" />,
      exact: true,
    },
  ];

  const isTutor = user.activeRole === "tutor" || user.activeViewRole === "tutor";
  const isBootcamp =
    user.activeRole === "bootcamp" ||
    user.activeRole === "bootcamp_partner" ||
    user.activeViewRole === "bootcamp_partner";

  const activeLinks = user.roles.includes("admin")
    ? adminLinks
    : isTutor ? tutorLinks : isBootcamp ? bootcampLinks : studentLinks;

  return (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-5">
      {/* Box Status Role dengan tombol CHANGE */}
      <SidebarRoleBox />

      {/* Navigasi Menu Dashboard */}
      <div className="rounded-[6px] border border-[#D9DEE7] dark:border-[#343945] bg-white dark:bg-[#191C23] p-3">
        <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#626B78] dark:text-[#B1B7C3]">
          Navigasi
        </div>

        <nav className="mt-1 space-y-1">
          {activeLinks.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-[4px] px-3 py-2 text-xs font-medium transition-colors ${
                  active
                    ? "bg-[#2457C5] text-white font-semibold"
                    : "text-[#20232B] dark:text-[#F3F4F6] hover:bg-[#E5E9F0]/60 dark:hover:bg-[#20242D]"
                }`}
              >
                <span className={active ? "text-white" : "text-[#2457C5] dark:text-[#78A0FF]"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
