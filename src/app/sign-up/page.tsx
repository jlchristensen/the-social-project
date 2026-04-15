"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  const inputClasses =
    "w-full rounded-xl border border-brand-50/15 bg-white/[0.04] px-4 py-3 text-brand-50 placeholder:text-brand-50/40 focus:border-ember focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-ember/25 transition-all";

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-brand-50 mb-3">
            Join the community
          </h1>
          <p className="text-brand-50/60 text-lg">
            Create your account and start connecting.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-brand-100 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="At least 6 characters"
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-brand-100 mb-1.5"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Type your password again"
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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-brand-50/55">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-brand-200 hover:text-ember transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
