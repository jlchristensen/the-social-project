"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Sign in + password reset.
 *
 * Reset matches the mobile app: email a 6-digit recovery code, then verify it
 * here and set a new password. Magic-link recovery still works via
 * /auth/callback → /auth/update-password when the email contains a link.
 */

type Mode = "signIn" | "resetRequest" | "resetVerify";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function goTo(next: Mode) {
    setMode(next);
    setError(null);
    setNotice(null);
  }

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

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim()) {
      setError("Enter your email first.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    // Same as mobile: send a recovery OTP. Also pass a redirect so if the
    // email template includes a magic link, it lands on the update-password page.
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/auth/update-password")}`,
      }
    );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setNotice(`We emailed a 6-digit code to ${email.trim()}.`);
    setCode("");
    setPassword("");
    setMode("resetVerify");
  }

  async function handleResetVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!code.trim() || !password) {
      setError("Enter the code and a new password.");
      return;
    }

    if (password.length < 6) {
      setError("Use a password of at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "recovery",
    });

    if (verifyError) {
      setLoading(false);
      setError(verifyError.message);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

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

  const heading =
    mode === "signIn"
      ? "Welcome back"
      : mode === "resetRequest"
        ? "Reset your password"
        : "Enter your code";

  const subcopy =
    mode === "signIn"
      ? "Sign in to your account to continue."
      : mode === "resetRequest"
        ? "Enter your email and we'll send you a 6-digit code."
        : `Check your email for the 6-digit code we sent to ${email.trim()}, then choose a new password.`;

  const onSubmit =
    mode === "signIn"
      ? handleSignIn
      : mode === "resetRequest"
        ? handleResetRequest
        : handleResetVerify;

  const cta =
    loading
      ? mode === "signIn"
        ? "Signing in..."
        : mode === "resetRequest"
          ? "Sending code..."
          : "Updating password..."
      : mode === "signIn"
        ? "Sign in"
        : mode === "resetRequest"
          ? "Send reset code"
          : "Set new password";

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-brand-50 mb-3">{heading}</h1>
          <p className="text-brand-50/60 text-lg leading-relaxed">{subcopy}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {mode !== "resetVerify" && (
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
          )}

          {mode === "resetVerify" && (
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-brand-100 mb-1.5"
              >
                6-digit code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
                maxLength={6}
                placeholder="123456"
                className={`${inputClasses} tracking-[0.35em] text-center text-lg`}
              />
            </div>
          )}

          {mode !== "resetRequest" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-brand-100"
                >
                  {mode === "resetVerify" ? "New password" : "Password"}
                </label>
                {mode === "signIn" && (
                  <button
                    type="button"
                    onClick={() => goTo("resetRequest")}
                    className="text-xs text-brand-200 hover:text-ember transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={
                  mode === "resetVerify" ? "new-password" : "current-password"
                }
                placeholder={
                  mode === "resetVerify"
                    ? "Choose a new password"
                    : "Your password"
                }
                minLength={mode === "resetVerify" ? 6 : undefined}
                className={inputClasses}
              />
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-400/30 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {notice && (
            <div className="rounded-xl bg-ember/10 border border-ember/30 px-4 py-3 text-sm text-ember">
              {notice}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-ember px-4 py-3.5 text-sm font-semibold text-brand-900 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(245,210,139,0.4)] focus:outline-none focus:ring-2 focus:ring-ember/40 focus:ring-offset-2 focus:ring-offset-[#06160d] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {cta}
          </button>

          {mode === "resetVerify" && (
            <button
              type="button"
              onClick={() => goTo("resetRequest")}
              className="w-full text-sm text-brand-200 hover:text-ember transition-colors"
            >
              Didn&apos;t get it? Send a new code
            </button>
          )}

          {mode !== "signIn" && (
            <button
              type="button"
              onClick={() => goTo("signIn")}
              className="w-full text-sm text-brand-200 hover:text-ember transition-colors"
            >
              Back to sign in
            </button>
          )}
        </form>

        {mode === "signIn" && (
          <p className="mt-8 text-center text-sm text-brand-50/55">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-brand-200 hover:text-ember transition-colors"
            >
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
