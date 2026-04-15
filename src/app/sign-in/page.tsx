"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Enter your email above first.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/auth/callback` }
    );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setResetSent(true);
  }

  const inputClasses =
    "w-full rounded-xl border border-brand-50/15 bg-white/[0.04] px-4 py-3 text-brand-50 placeholder:text-brand-50/40 focus:border-ember focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-ember/25 transition-all";

  if (resetSent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-24">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-brand-200/30 bg-brand-700/40">
            <svg
              className="h-8 w-8 text-brand-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-brand-50 mb-3">
            Check your email
          </h1>
          <p className="text-brand-50/70 text-lg leading-relaxed">
            We sent a password reset link to{" "}
            <span className="font-medium text-brand-100">{email}</span>.
          </p>
          <button
            onClick={() => {
              setResetSent(false);
              setShowReset(false);
            }}
            className="mt-8 inline-block text-sm font-medium text-brand-200 hover:text-ember transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-brand-50 mb-3">
            Welcome back
          </h1>
          <p className="text-brand-50/60 text-lg">
            Sign in to your account to continue.
          </p>
        </div>

        <form
          onSubmit={showReset ? handleResetPassword : handleSignIn}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-brand-100 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClasses}
            />
          </div>

          {!showReset && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-brand-100"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="text-xs text-brand-200 hover:text-ember transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Your password"
                className={inputClasses}
              />
            </div>
          )}

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
            {loading
              ? showReset
                ? "Sending reset link..."
                : "Signing in..."
              : showReset
                ? "Send reset link"
                : "Sign in"}
          </button>

          {showReset && (
            <button
              type="button"
              onClick={() => {
                setShowReset(false);
                setError(null);
              }}
              className="w-full text-sm text-brand-200 hover:text-ember transition-colors"
            >
              Back to sign in
            </button>
          )}
        </form>

        <p className="mt-8 text-center text-sm text-brand-50/55">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-brand-200 hover:text-ember transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
