import { redirect } from "next/navigation";

/**
 * Route: /dashboard/settings
 * Sesuai Spesifikasi Teknis 1.A:
 * Pengaturan Bimbingan (/dashboard/settings) khusus di dalam dashboard tutor/mitra
 * untuk pengaturan operasional kelas, jadwal ketersediaan, serta profil publik pengajar/organisasi.
 */
export default function DashboardSettingsRedirect() {
  redirect("/dashboard/tutor/pengaturan");
}
