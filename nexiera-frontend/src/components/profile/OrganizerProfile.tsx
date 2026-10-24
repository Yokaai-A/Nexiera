"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Building2, Landmark, Rocket, Search } from "lucide-react";
import { nexieraApi, type ApiClass } from "@/src/lib/api";
import { slugify } from "@/src/lib/slug";
import { ClassCard } from "@/src/components/cari-kelas/ClassCard";

export function OrganizerProfile({ slug }: { slug: string }) {
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    nexieraApi.classes().then((all) => {
      if (!active) return;
      setClasses(all.filter((item) => item.courseType === "BOOTCAMP" && slugify(item.organizerName || item.creator?.name || "") === slugify(slug)));
      setLoadError("");
    }).catch((cause) => {
      if (!active) return;
      setClasses([]);
      setLoadError(cause instanceof Error ? cause.message : "Profil penyelenggara gagal dimuat.");
    }).finally(() => { if (active) setLoaded(true); });
    return () => { active = false; };
  }, [slug]);

  const organizer = classes[0];
  const name = organizer?.organizerName || organizer?.creator?.name || "";
  const logo = organizer?.organizerLogo || organizer?.creator?.avatarUrl || null;
  const campus = organizer?.creator?.campus || organizer?.university || "Belum dicantumkan";
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "";

  if (!loaded) return <div className="min-h-screen bg-background flex items-center justify-center p-6"><p className="text-xs text-slate-500">Memuat profil penyelenggara...</p></div>;

  if (!organizer) {
    return <div className="mx-auto max-w-[1180px] px-4 py-20 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#E5E9F0] text-[#2457C5]"><Building2 className="h-6 w-6" aria-hidden="true" /></div>
      <h1 className="text-xl font-bold text-[#20232B]">{loadError ? "Profil Penyelenggara Gagal Dimuat" : "Penyelenggara Tidak Ditemukan"}</h1>
      <p className="mt-2 text-xs text-[#626B78]">{loadError || "Penyelenggara dengan tautan ini tidak memiliki kelas aktif di katalog."}</p>
      <Link href="/cari-kelas" className="btn-primary mt-6"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Kembali ke Katalog Kelas</Link>
    </div>;
  }

  return <div className="min-h-screen bg-white pb-20">
    <div className="border-b border-[#D9DEE7] bg-white"><div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-3 text-xs text-[#626B78] sm:px-6 lg:px-8">
      <Link href="/cari-kelas" className="inline-flex items-center gap-1.5 font-medium text-[#20232B] hover:text-[#2457C5] transition-colors"><ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Kembali ke Katalog Kelas</Link>
      <span className="text-[11px] font-medium">Profil Mitra Penyelenggara</span>
    </div></div>

    <div className="relative h-44 w-full overflow-hidden border-b border-[#D9DEE7] bg-[#E5E9F0] sm:h-56 md:h-64" />
    <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
      <div className="relative -mt-12 mb-4 sm:-mt-14"><div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-[#D9DEE7] bg-white p-2.5 text-xl font-semibold text-[#2457C5] shadow-sm sm:h-28 sm:w-28">
        {logo ? <Image src={logo} alt={name} fill sizes="112px" className="object-contain p-2" /> : initials}
      </div></div>
      <div className="rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:p-8">
        <div className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#D9DEE7] bg-[#E5E9F0]/60 px-3 py-1 text-xs font-semibold text-[#20232B]"><Rocket className="h-3.5 w-3.5 text-[#2457C5]" aria-hidden="true" /> Mitra Bootcamp Akademik</div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#20232B] sm:text-3xl md:text-4xl">{name}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-[#D9DEE7] py-3.5 text-xs font-medium text-[#626B78]">
          <span className="flex items-center gap-1.5 text-[#20232B]"><Landmark className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /> {campus}</span>
          <span className="text-[#D9DEE7]">•</span>
          <span className="flex items-center gap-1.5 font-semibold text-[#2457C5]"><BookOpen className="h-4 w-4" aria-hidden="true" /> {classes.length} Kelas Dibuka</span>
        </div>
        <div className="mt-5"><Link href="/cari-kelas" className="btn-primary"><Search className="h-4 w-4" aria-hidden="true" /> Cari Kelas Lainnya</Link></div>
      </div>
      <div className="mt-10">
        <div className="mb-6 flex items-center justify-between border-b border-[#D9DEE7] pb-3"><div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-[#2457C5]" aria-hidden="true" /><h2 className="text-base font-semibold text-[#20232B]">Kelas yang Dibuka</h2></div><span className="text-xs font-medium text-[#626B78]">{classes.length} Kelas Tersedia</span></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{classes.map((item) => <ClassCard key={item.id} item={item} />)}</div>
      </div>
    </div>
  </div>;
}
