import type { Metadata } from "next";
import { OrganizerProfile } from "@/src/components/profile/OrganizerProfile";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  return {
    title: `Profil Penyelenggara — NEXIERA`,
    description: `Daftar seluruh mata kuliah dan bootcamp akademik yang diselenggarakan di NEXIERA.`,
  };
}

export default async function OrganizerPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  return <OrganizerProfile slug={resolvedParams.slug} />;
}
