"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMessage("Please enter an email address.");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrorMessage("Please enter a password.");
      setIsLoading(false);
      return;
    }

    // Save the user's logged-in email into cookie for header display
    document.cookie = `estrella_admin_email=${encodeURIComponent(cleanEmail)}; path=/; max-age=86400`;
    document.cookie = `sb-auth-token=demo-admin-session; path=/; max-age=86400`;

    // Try Supabase Auth as well if configured
    try {
      await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
    } catch (e) {}

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 text-slate-900 font-sans">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/estrella-logo.svg"
            alt="Estrella Logo"
            width={240}
            height={50}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        <div className="text-center">
          <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#00AEF0] bg-sky-50 px-3 py-1 rounded-full inline-block">
            Administration Portal
          </span>

          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            Admin Login
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Enter your email and password to log in to the Estrella CMS.
          </p>
        </div>

        {/* Custom Login Note */}
        <div className="mt-5 p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-slate-700">
          <p className="font-bold text-[#00AEF0] uppercase tracking-wider mb-1">
            🔑 Client / Admin Login:
          </p>
          <p>You can enter <strong>ANY Email &amp; Password</strong> of your choice to log in and manage the Estrella Admin Panel.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Your Email Address
            </label>

            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 outline-none text-slate-900 transition focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100"
              placeholder="e.g. client@gmail.com or your-email@gmail.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 outline-none text-slate-900 transition focus:border-[#00AEF0] focus:ring-2 focus:ring-sky-100"
              placeholder="Enter your password"
            />
          </div>

          {errorMessage && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600 font-medium">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[#00AEF0] px-5 py-3 font-bold text-white transition hover:bg-[#0095ce] shadow-md shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign In to Admin Portal"}
          </button>
        </form>
      </section>
    </main>
  );
}