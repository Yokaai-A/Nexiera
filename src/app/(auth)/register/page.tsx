"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { saveStoredUser } from "@/src/lib/storage";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok.");
      return;
    }

    setIsLoading(true);

    saveStoredUser({
      fullName: fullName || "Mahasiswa BINUS",
      email: email || "student@binus.ac.id",
      isLoggedIn: false, // will become true upon finishing onboarding
    });

    setTimeout(() => {
      router.push("/onboarding");
    }, 500);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <div className="space-y-3.5">
          <div>
            <label
              htmlFor="reg-fullname"
              className="mb-1 block text-xs font-semibold text-[#20232B]"
            >
              Nama Lengkap
            </label>
            <input
              id="reg-fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Muhammad Abyan"
              required
              className="nx-input"
            />
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="mb-1 block text-xs font-semibold text-[#20232B]"
            >
              Email Kampus / Mahasiswa
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@binus.ac.id"
              required
              className="nx-input"
            />
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="mb-1 block text-xs font-semibold text-[#20232B]"
            >
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              className="nx-input"
            />
          </div>

          <div>
            <label
              htmlFor="reg-confirm"
              className="mb-1 block text-xs font-semibold text-[#20232B]"
            >
              Konfirmasi Password
            </label>
            <input
              id="reg-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              required
              className="nx-input"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-6 py-2.5 disabled:opacity-50"
        >
          {isLoading ? "Menyiapkan Onboarding..." : <>Lanjut ke Pemilihan Kampus <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" /></>}
        </button>

        <p className="mt-3 text-center text-xs text-[#626B78]">
          Langkah berikutnya: Memilih Kampus &amp; Jurusan Akademik
        </p>
      </form>
    </AuthLayout>
  );
}
