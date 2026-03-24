"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticate } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@plugpass.io");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = authenticate(email, password);
    if (user) {
      // Store session in localStorage (mock)
      localStorage.setItem("plugpass_user", JSON.stringify(user));
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Try demo@plugpass.io / demo123");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
        style={{ animation: "fade-in 0.4s ease-out" }}
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-plug-green text-xl font-bold text-white">
            P
          </div>
          <h1 className="text-2xl font-bold text-plug-navy">Reseller Login</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to manage your devices
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-plug-green focus:ring-2 focus:ring-plug-green/20 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-plug-green focus:ring-2 focus:ring-plug-green/20 focus:outline-none"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-plug-green py-2.5 text-sm font-semibold text-white transition hover:bg-plug-green-dark"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Demo: demo@plugpass.io / demo123
        </p>
      </div>
    </main>
  );
}
