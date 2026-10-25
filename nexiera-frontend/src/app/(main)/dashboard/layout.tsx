import { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardSidebar } from "@/src/components/dashboard/DashboardSidebar";

export const metadata: Metadata = {
  title: "Dashboard — NEXIERA",
  description: "Pusat kendali aktivitas pembelajaran mahasiswa, manajemen kelas peer-tutor, dan performa mitra bootcamp.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111318] pb-20">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-3 items-start">

          <Suspense
            fallback={
              <div className="w-full lg:w-72 h-96 rounded-[6px] border border-[#D9DEE7] dark:border-[#343945] bg-white dark:bg-[#191C23] animate-pulse" />
            }
          >
            <DashboardSidebar />
          </Suspense>


          <main className="flex-1 min-w-0 w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
