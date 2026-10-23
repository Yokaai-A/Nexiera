import { Suspense } from "react";
import type { Metadata } from "next";
import { OrganizerProfile } from "@/src/components/profile/OrganizerProfile";

export const metadata: Metadata = {
  title: "Profil Penyelenggara — NEXIERA",
  description: "Daftar seluruh mata kuliah dan bootcamp akademik yang diselenggarakan di NEXIERA.",
};

interface PageProps {
  searchParams: Promise<{ slug?: string }> | { slug?: string };
}

async function OrganizerPageContent({ searchParams }: PageProps) {
  const resolved = await Promise.resolve(searchParams);
  const slug = resolved?.slug || "booster-academy";
  return <OrganizerProfile slug={slug} />;
}

export default function ProfilPenyelenggaraPage(props: PageProps) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#626B78]">Memuat profil penyelenggara...</div>}>
      <OrganizerPageContent {...props} />
    </Suspense>
  );
}
