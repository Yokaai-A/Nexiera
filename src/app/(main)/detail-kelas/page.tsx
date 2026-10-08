import type { Metadata } from "next";
import { DetailKelas } from "@/src/components/detail-kelas/DetailKelas";

export const metadata: Metadata = {
  title: "Detail Kelas — Nexiera",
  description:
    "Detail bootcamp, tutoring, dan kelas peer-to-peer dari kampus terkemuka di Indonesia.",
};

export default function DetailKelasPage() {
  return <DetailKelas />;
}
