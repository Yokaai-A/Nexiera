"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedPhone = phoneNumber.trim();
    if (!/^\+?[0-9\s().-]{8,32}$/.test(normalizedPhone)) {
      setError("Masukkan nomor WhatsApp yang valid.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiFetch("/auth/complete-profile", {
        method: "POST",
        body: JSON.stringify({ phoneNumber: normalizedPhone }),
      });
      router.replace("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Profil gagal disimpan.");
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-5 py-12">
      <form onSubmit={submit} className="w-full rounded-[6px] border border-[#D9DEE7] bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-bold text-[#20232B]">Lengkapi profil</h1>
        <p className="mt-2 text-sm text-[#626B78]">Nomor WhatsApp wajib untuk membuat akun NEXIERA.</p>
        <label htmlFor="profile-phone" className="mt-6 block text-sm font-medium text-[#20232B]">Nomor WhatsApp</label>
        <input
          id="profile-phone"
          type="tel"
          autoComplete="tel"
          minLength={8}
          maxLength={32}
          required
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          className="nx-input mt-2 w-full"
          placeholder="+62 812 3456 7890"
        />
        {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
        <button disabled={saving} className="btn-primary mt-5 w-full disabled:opacity-60">
          {saving ? "Menyimpan…" : "Simpan profil"}
        </button>
      </form>
    </main>
  );
}
