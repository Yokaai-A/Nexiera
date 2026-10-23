import { redirect } from "next/navigation";

/**
 * Route: /dashboard/iklan
 * Sesuai Spesifikasi Teknis 3.D:
 * Dasbor Pengiklanan (/dashboard/iklan)
 */
export default function DashboardIklanRedirect() {
  redirect("/dashboard/tutor/iklan");
}
