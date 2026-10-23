import { redirect } from "next/navigation";

/**
 * Route: /dashboard/student
 * Sesuai Spesifikasi Teknis 2.A:
 * Dashboard Mahasiswa (/dashboard/student) dialihkan langsung ke tampilan utama /dashboard
 */
export default function StudentDashboardRedirect() {
  redirect("/dashboard");
}
