import type { Metadata } from "next";
import { AuthLayout } from "@/src/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Register — Nexiera",
  description: "Daftar akun baru di Nexiera.",
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}

function RegisterForm() {
  return (
    <form
      action="/register"
      method="POST"
      className="flex h-full flex-col"
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="reg-fullname"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Full Name
          </label>
          <input
            id="reg-fullname"
            type="text"
            placeholder=""
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="reg-email"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            placeholder=""
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="reg-password"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            placeholder=""
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="reg-confirm"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Confirm Password
          </label>
          <input
            id="reg-confirm"
            type="password"
            placeholder=""
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-auto w-full rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
      >
        Register
      </button>
    </form>
  );
}
