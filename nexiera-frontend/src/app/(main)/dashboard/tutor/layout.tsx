"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/src/store/useUserStore";
import { TutorAccessGate } from "@/src/components/dashboard/TutorAccessGate";

export default function TutorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-[#626B78] dark:text-slate-400">
        Memeriksa hak akses portal pengajar...
      </div>
    );
  }

  const isVerifiedOrganizer =
    user.hasRole("tutor") ||
    user.hasRole("bootcamp") ||
    user.hasRole("bootcamp_partner") ||
    user.role === "tutor" ||
    user.role === "bootcamp";

  if (!isVerifiedOrganizer) {
    return <TutorAccessGate />;
  }

  return <>{children}</>;
}
