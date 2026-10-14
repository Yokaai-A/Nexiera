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
              className="mb-1.5 block text-xs font-bold text-slate-700"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-xs font-bold text-slate-700"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
              />
              Ingat saya
            </label>
            <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
              Lupa password?
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-8 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all hover:scale-[1.01] disabled:opacity-50"
        >
          {isLoading ? "Memproses..." : "Masuk ke Akun"}
        </button>

        <p className="mt-4 text-center text-xs text-slate-400">
          Demo akun: gunakan email BINUS untuk verifikasi otomatis
        </p>
      </form>
    </AuthLayout>
  );
}
