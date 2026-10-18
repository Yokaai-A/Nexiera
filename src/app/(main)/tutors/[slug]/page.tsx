import type { Metadata } from "next";
import { TutorProfile } from "@/src/components/profile/TutorProfile";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  return {
    title: `Profil Tutor Sebaya — NEXIERA`,
    description: `Daftar kelas bimbingan dan pendampingan akademik yang diampu oleh tutor mahasiswa di NEXIERA.`,
  };
}

export default async function TutorPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  return <TutorProfile slug={resolvedParams.slug} />;
}
