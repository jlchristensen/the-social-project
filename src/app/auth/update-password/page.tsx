"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Set a new password after a recovery magic-link lands.
 *
 * Flow: reset email link → /auth/callback?next=/auth/update-password → here.
 * Code-based resets (6-digit OTP) stay on /sign-in and never hit this page.
 */
export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(Boolean(data.session));
      setChecking(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Use a password of at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords don’t match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  const inputClasses =
    "w-full rounded-xl border border-brand-50/15 bg-white/[0.04] px-4 py-3 text-brand-50 placeholder:text-brand-50/40 focus:border-ember focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-ember/25 transition-all";

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-24">
        <p className="text-brand-50/60">Checking your reset session…</p>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-24">
        <div className="w-full max-w-md text-center">
          <h1 className="font-display text-3xl text-brand-50 mb-3">
            Reset link expired
          </h1>
          <p className="text-brand-50/70 text-lg leading-relaxed mb-8">
            Request a new code from the sign-in page — you can enter it there
            without needing this link.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex rounded-xl bg-ember px-6 py-3.5 text-sm font-semibold text-brand-900"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-brand-50 mb-3">
            Choose a new password
          </h1>
          <p className="text-brand-50/60 text-lg">
            You’re signed in with a reset link. Pick something you’ll remember.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-brand-100 mb-1.5"
            >
              New password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="block text-sm font-medium text-brand-100 mb-1.5"
            >
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Type it again"
              className={inputClasses}
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-400/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-ember px-4 py-3.5 text-sm font-semibold text-brand-900 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(245,210,139,0.4)] focus:outline-none focus:ring-2 focus:ring-ember/40 focus:ring-offset-2 focus:ring-offset-[#06160d] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? "Saving…" : "Save new password"}
          </button>
        </form>
      </div>
    </div>
  );
}
