"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/src/components/auth/AuthLayout";
import { loginUser } from "@/src/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("nicholas.aryan@binus.ac.id");
  const [password, setPassword] = useState("••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    loginUser(email);
    setTimeout(() => {
      router.push("/");
    }, 600);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="login-username"
              className="mb-1.5 block text-xs font-semibold text-[#20232B]"
            >
              Email Kampus / Username
            </label>
            <input
              id="login-username"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@binus.ac.id"
              required
              className="nx-input"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-xs font-semibold text-[#20232B]"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata sandi akun"
              required
              className="nx-input"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-[#626B78] cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded-[2px] border-[#D9DEE7] text-[#2457C5] accent-[#2457C5] cursor-pointer"
              />
              Ingat saya
            </label>
            <span className="font-medium text-[#2457C5] hover:underline cursor-pointer">
              Lupa password?
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-6 py-2.5 disabled:opacity-50"
        >
          {isLoading ? "Memproses..." : "Masuk ke Akun"}
        </button>

        <p className="mt-4 text-center text-xs text-[#626B78]">
          Demo akun: gunakan email BINUS untuk verifikasi otomatis
        </p>
      </form>
    </AuthLayout>
  );
}
