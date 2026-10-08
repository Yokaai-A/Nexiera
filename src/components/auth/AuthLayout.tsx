"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function TabToggle({ mode }: { mode: "login" | "register" }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div className="mx-auto flex w-fit items-center rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
      <button
        type="button"
        onClick={() => (isLogin ? undefined : (window.location.href = "/login"))}
        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
          isLogin ? "bg-slate-100 text-slate-800" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => (!isLogin ? undefined : (window.location.href = "/register"))}
        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
          !isLogin ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Register
      </button>
    </div>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div
      className="h-[calc(100vh-4rem)] overflow-hidden"
      style={{
        backgroundImage: "url('/bg-auth.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex h-full items-center justify-center px-4 py-6">
        <div className="grid w-full max-w-3xl overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200 md:grid-cols-2">

          {/* LEFT — form panel */}
          <div className="flex flex-col bg-white p-8 md:p-10">
            <TabToggle mode={isLogin ? "login" : "register"} />

            <div className="mt-8 flex-1">{children}</div>
          </div>

          {/* RIGHT — welcome panel */}
          <div
            className="hidden flex-col items-center justify-center p-8 md:flex"
            style={{
              background: "linear-gradient(160deg, #1e40af 0%, #3b82f6 60%, #2563eb 100%)",
            }}
          >
            <h2 className="text-center text-4xl font-bold text-white md:text-5xl">
              {isLogin ? "Welcome Back!" : "Get Started!"}
            </h2>
            <p className="mt-3 text-center text-lg font-semibold text-blue-100">
              {isLogin ? "Ready To Learn?" : "Ready To Teach?"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
