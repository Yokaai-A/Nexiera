"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/src/store/useUserStore";

export default function DashboardTutorPengaturanPage() {
  const user = useUserStore();
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationLogoUrl, setOrganizationLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => { setName(user.name || ""); setHeadline(user.headline || ""); setBio(user.bio || ""); setLocation(user.location || ""); setCoverUrl(user.coverUrl || ""); setAvatarUrl(user.avatarUrl || ""); setOrganizationName(user.organizationName || ""); setOrganizationLogoUrl(user.organizationLogoUrl || ""); }, [user.id, user.name, user.headline, user.bio, user.location, user.coverUrl, user.avatarUrl, user.organizationName, user.organizationLogoUrl]);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setNotice("");
    for (const value of [coverUrl, avatarUrl, organizationLogoUrl]) if (value.trim() && !/^https?:\/\//i.test(value.trim())) { setError("URL gambar harus menggunakan http:// atau https://."); return; }
    setSaving(true);
    try { await user.updateUser({ name: name.trim(), headline: headline.trim(), bio: bio.trim(), location: location.trim(), coverUrl: coverUrl.trim() || undefined, avatarUrl: avatarUrl.trim() || undefined, organizationName: organizationName.trim(), organizationLogoUrl: organizationLogoUrl.trim() || undefined }); setNotice("Profil tersimpan."); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Profil gagal disimpan."); }
    finally { setSaving(false); }
  }
  const field = "nx-input mt-1 w-full";
  return <div className="space-y-5"><header className="rounded-[6px] border border-[#D9DEE7] bg-white p-6"><p className="text-xs font-semibold uppercase tracking-wide text-[#2457C5]">Profil tutor</p><h1 className="mt-2 text-2xl font-bold">Profil publik</h1><p className="mt-1 text-sm text-[#626B78]">Data ini disimpan pada akun tutor dan digunakan pada kelas yang Anda kelola.</p></header>
    <form onSubmit={save} className="grid gap-4 rounded-[6px] border border-[#D9DEE7] bg-white p-6 sm:grid-cols-2">
      <label className="text-xs font-semibold">Nama tampilan<input required maxLength={191} value={name} onChange={(e) => setName(e.target.value)} className={field} /></label>
      <label className="text-xs font-semibold">Headline<input maxLength={191} value={headline} onChange={(e) => setHeadline(e.target.value)} className={field} /></label>
      <label className="text-xs font-semibold">Lokasi<input maxLength={191} value={location} onChange={(e) => setLocation(e.target.value)} className={field} /></label>
      <label className="text-xs font-semibold">Nama organisasi (opsional)<input maxLength={191} value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} className={field} /></label>
      <label className="text-xs font-semibold">URL foto profil<input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className={field} placeholder="https://" /></label>
      <label className="text-xs font-semibold">URL logo organisasi<input type="url" value={organizationLogoUrl} onChange={(e) => setOrganizationLogoUrl(e.target.value)} className={field} placeholder="https://" /></label>
      <label className="text-xs font-semibold sm:col-span-2">URL cover<input type="url" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className={field} placeholder="https://" /></label>
      <label className="text-xs font-semibold sm:col-span-2">Bio<textarea maxLength={5000} rows={5} value={bio} onChange={(e) => setBio(e.target.value)} className={field} /></label>
      {error && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{error}</p>}{notice && <p role="status" className="text-sm text-emerald-700 sm:col-span-2">{notice}</p>}
      <div className="sm:col-span-2"><button type="submit" disabled={saving || !user.isLoggedIn} className="btn-primary">{saving ? "Menyimpan..." : "Simpan profil"}</button></div>
    </form>
  </div>;
}
