"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/useUserStore";
import { nexieraApi } from "@/src/lib/api";

type ImageField = "logo" | "cover";

export default function DashboardTutorPengaturanPage() {
  const router = useRouter();
  const user = useUserStore();
  const isBootcamp = user.activeRole === "bootcamp" || user.activeRole === "bootcamp_partner" || user.activeViewRole === "bootcamp_partner";
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationLogoUrl, setOrganizationLogoUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [uploading, setUploading] = useState<ImageField | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setHeadline(user.headline || "");
    setBio(user.bio || "");
    setLocation(user.location || "");
    setCoverUrl(user.coverUrl || "");
    setOrganizationName(user.organizationName || "");
    setOrganizationLogoUrl(user.organizationLogoUrl || "");
    setContactEmail(user.contactEmail || "");
  }, [user.id, user.headline, user.bio, user.location, user.coverUrl, user.organizationName, user.organizationLogoUrl, user.contactEmail]);

  useEffect(() => {
    if (user.isLoggedIn && !isBootcamp) router.replace("/dashboard/pengaturan");
  }, [user.isLoggedIn, isBootcamp, router]);

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>, field: ImageField) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const isCover = field === "cover";
    if (file.size > (isCover ? 5 : 2) * 1024 * 1024) {
      setError(`Ukuran ${isCover ? "cover" : "foto/logo"} maksimal ${isCover ? 5 : 2} MB.`);
      return;
    }
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Format gambar harus PNG, JPEG, atau WebP.");
      return;
    }
    setError("");
    setUploading(field);
    try {
      const result = isCover
        ? await nexieraApi.uploadBanner(file)
        : await nexieraApi.uploadProfile(file);
      if (field === "logo") setOrganizationLogoUrl(result.url);
      if (field === "cover") setCoverUrl(result.url);
      setNotice("Gambar berhasil diunggah. Simpan profil untuk menerapkan perubahan.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gambar gagal diunggah.");
    } finally {
      setUploading(null);
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);
    try {
      await user.updateUser({
        organizationName: organizationName.trim(),
        contactEmail: contactEmail.trim(),
        headline: headline.trim(),
        bio: bio.trim(),
        location: location.trim(),
        coverUrl: coverUrl.trim(),
        organizationLogoUrl: organizationLogoUrl.trim(),
      });
      setNotice("Profil tersimpan.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Profil gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  const field = "nx-input mt-1 block w-full min-w-0";
  const fileControl = (label: string, fieldName: ImageField, inputRef: RefObject<HTMLInputElement | null>, hasImage: boolean) => (
    <div className="min-w-0 text-xs font-semibold">
      <span className="block">{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => void handleImageUpload(event, fieldName)}
      />
      <button
        type="button"
        disabled={uploading !== null}
        onClick={() => inputRef.current?.click()}
        className="mt-1 inline-flex items-center gap-1.5 rounded-[4px] border border-[#D9DEE7] bg-white px-3 py-2 text-xs font-medium text-[#20232B] hover:bg-[#E5E9F0] disabled:opacity-50"
      >
        <Upload className="h-3.5 w-3.5" />
        {uploading === fieldName ? "Mengunggah..." : hasImage ? "Ganti gambar" : "Pilih gambar"}
      </button>
      <p className="mt-1 text-[11px] font-normal text-[#626B78]">{fieldName === "cover" ? "PNG/JPEG/WebP, maksimal 5 MB." : "PNG/JPEG/WebP, maksimal 2 MB."}</p>
    </div>
  );

  if (!isBootcamp) return null;

  return (
    <div className="space-y-5">
      <header className="rounded-[6px] border border-[#D9DEE7] bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#2457C5]">Profil lembaga</p>
        <h1 className="mt-2 text-lg font-bold">Profil publik lembaga</h1>
        <p className="mt-1 text-xs text-[#626B78]">Kelola informasi dan media publik organisasi bootcamp Anda.</p>
      </header>
      <form onSubmit={save} className="grid min-w-0 gap-4 rounded-[6px] border border-[#D9DEE7] bg-white p-4 md:grid-cols-2">
        <label className="block min-w-0 text-xs font-semibold">Nama Lembaga / Organisasi<input required maxLength={191} value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} className={field} /></label>
        <label className="block min-w-0 text-xs font-semibold">Pengelola / Penanggung Jawab<input value={user.name || user.fullName || ""} readOnly className={`${field} cursor-not-allowed bg-[#F4F6F9]`} /></label>
        <label className="block min-w-0 text-xs font-semibold">Tagline Lembaga<input maxLength={191} value={headline} onChange={(e) => setHeadline(e.target.value)} className={field} /></label>
        <label className="block min-w-0 text-xs font-semibold">Email Kontak Lembaga<input type="email" required maxLength={191} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={field} /></label>
        <label className="block min-w-0 text-xs font-semibold">Lokasi Lembaga<input maxLength={191} value={location} onChange={(e) => setLocation(e.target.value)} className={field} /></label>
        {fileControl("Logo Lembaga", "logo", logoInputRef, Boolean(organizationLogoUrl))}
        <div className="min-w-0 md:col-span-2">{fileControl("Cover / Banner Lembaga", "cover", coverInputRef, Boolean(coverUrl))}</div>
        <label className="block min-w-0 text-xs font-semibold md:col-span-2">Deskripsi Lembaga<textarea maxLength={5000} rows={5} value={bio} onChange={(e) => setBio(e.target.value)} className={field} /></label>
        {error && <p role="alert" className="text-xs text-red-600 md:col-span-2">{error}</p>}
        {notice && <p role="status" className="text-xs text-emerald-700 md:col-span-2">{notice}</p>}
        <div className="md:col-span-2"><button type="submit" disabled={saving || uploading !== null || !user.isLoggedIn} className="btn-primary btn-dashboard-action">{saving ? "Menyimpan..." : "Simpan profil"}</button></div>
      </form>
    </div>
  );
}
