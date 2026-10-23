import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/src/components/layout/SmoothScroll";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEXIERA — Platform Edukasi Akademik Kampus",
  description: "Marketplace bimbingan mata kuliah, peer-tutoring, dan persiapan ujian kampus.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${ibmPlexSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-[#20232B] font-sans">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

