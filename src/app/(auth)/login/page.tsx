import type { Metadata } from "next";
import { AuthLayout } from "@/src/components/auth/AuthLayout";

export const metadata: Metadata = {
  title: "Login — Nexiera",
  description: "Masuk ke akun Nexiera Anda.",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

function LoginForm() {
  return (
    <form
      action="/login"
      method="POST"
      className="flex h-full flex-col"
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="login-username"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Username/Email
          </label>
          <input
            id="login-username"
            type="text"
            placeholder=""
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            placeholder=""
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 accent-blue-600"
            />
            Remember me
          </label>
          <a
            href="#"
            className="font-medium text-blue-600 hover:underline"
          >
            Forgot password?
          </a>
        </div>
      </div>

      <button
        type="submit"
        className="mt-auto w-full rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50"
      >
        Login
      </button>
    </form>
  );
}
