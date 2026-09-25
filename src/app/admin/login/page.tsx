"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mountain, LogIn } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      // Demo mode — no auth backend, go straight in.
      router.push("/admin");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--color-cream)] outline-none transition-colors focus:border-[var(--color-teal-600)]";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] px-6 text-[var(--color-cream)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--color-teal-800)]">
            <Mountain className="size-6" strokeWidth={1.5} />
          </span>
          <h1 className="font-display mt-4 text-2xl font-bold tracking-tight">RoamAndRoutes Admin</h1>
          <p className="mt-1 text-sm text-white/50">Sign in to manage your trips and leads.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@roamandroutes.in" className={field} autoComplete="email" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={field} autoComplete="current-password" />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-teal-800)] px-5 py-3 text-sm font-semibold text-[var(--color-cream)] transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            <LogIn className="size-4" />
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {!configured && (
          <p className="mt-5 rounded-xl bg-white/5 p-3 text-center text-xs text-white/50">
            Demo mode — Supabase isn&apos;t configured, so any sign-in opens the admin. Add your Supabase keys to <code>.env</code> to enable real auth.
          </p>
        )}
      </div>
    </main>
  );
}
