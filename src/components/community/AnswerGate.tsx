"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface AnswerGateProps {
  questionId: string;
  isSignedIn: boolean;
  hasAnswered: boolean;
}

export default function AnswerGate({
  questionId,
  isSignedIn,
  hasAnswered,
}: AnswerGateProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  // When already answered (server-rendered), we render nothing here —
  // the feed below takes over.
  if (hasAnswered) return null;

  // ── Signed-out: a simple CTA pair, no second panel ────────────────────
  if (!isSignedIn) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/sign-in"
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#F5D28B] via-ember to-[#C99845] px-6 py-3.5 text-sm font-semibold text-brand-900 shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_10px_30px_-5px_rgba(232,184,106,0.35),0_0_40px_-10px_rgba(232,184,106,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.22)_inset,0_14px_40px_-5px_rgba(232,184,106,0.5),0_0_60px_-8px_rgba(232,184,106,0.7)]"
        >
          <span className="h-2 w-2 rounded-full bg-[#F5D28B] shadow-[0_0_10px_#F5D28B]" />
          Sign in to answer
        </Link>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 rounded-full border border-brand-50/20 px-6 py-3.5 text-sm font-medium text-brand-50 transition-colors hover:border-ember hover:text-ember"
        >
          Create an account
        </Link>
      </div>
    );
  }

  // ── Celebrating: a brief transition line after submit ────────────────
  if (celebrating) {
    return (
      <div className="text-center">
        <p className="font-serif text-2xl italic text-ember">
          You&apos;re in. Pull up a log.
        </p>
        <p className="mt-2 font-figtree text-sm text-brand-50/60">
          Opening the circle…
        </p>
      </div>
    );
  }

  // ── Signed-in, answering: the candle-lit textarea ────────────────────
  const charCount = body.length;
  const isValid = charCount >= 20;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setError(null);
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to answer.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("answers").insert({
      question_id: questionId,
      user_id: user.id,
      body: body.trim(),
      is_anonymous: isAnonymous,
    });

    setLoading(false);

    if (insertError) {
      if (insertError.code === "23505") {
        setError("You've already answered today's question.");
      } else {
        setError(insertError.message);
      }
      return;
    }

    setCelebrating(true);
    setTimeout(() => {
      router.refresh();
    }, 1600);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-[20px] border border-ember/25 bg-[radial-gradient(400px_200px_at_50%_-20%,rgba(232,184,106,0.18),transparent_70%),linear-gradient(180deg,rgba(232,184,106,0.03),rgba(232,184,106,0.01))] p-7 shadow-[inset_0_0_40px_rgba(232,184,106,0.06),0_20px_60px_-30px_rgba(232,184,106,0.22)]"
    >
      <label htmlFor="answer-body" className="sr-only">
        Your answer
      </label>
      <textarea
        id="answer-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share your answer…"
        rows={5}
        maxLength={2000}
        className="w-full resize-none bg-transparent font-serif text-xl leading-relaxed text-brand-50 placeholder:italic placeholder:text-brand-50/40 focus:outline-none md:text-[22px]"
      />

      <div className="mt-4 flex flex-col gap-4 border-t border-dashed border-ember/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex cursor-pointer items-center gap-3 font-figtree text-sm text-brand-50/75">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 accent-ember"
          />
          Speak anonymously
        </label>

        <div className="flex items-center gap-4">
          <span
            className={`font-figtree text-xs transition-colors ${charCount >= 20 ? "text-brand-50/60" : "text-brand-50/35"}`}
          >
            <span className={charCount >= 20 ? "text-ember" : ""}>
              {charCount}
            </span>{" "}
            / 800
          </span>
          <button
            type="submit"
            disabled={!isValid || loading}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#F5D28B] via-ember to-[#C99845] px-6 py-3 font-figtree text-sm font-semibold text-brand-900 shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_10px_30px_-5px_rgba(232,184,106,0.35),0_0_40px_-10px_rgba(232,184,106,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.22)_inset,0_14px_40px_-5px_rgba(232,184,106,0.5),0_0_60px_-8px_rgba(232,184,106,0.7)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <span className="h-2 w-2 rounded-full bg-[#F5D28B] shadow-[0_0_10px_#F5D28B]" />
            {loading ? "Sending…" : "Send sparks"}
          </button>
        </div>
      </div>

      {!isValid && charCount > 0 && (
        <p className="mt-3 font-figtree text-xs text-brand-50/50">
          {20 - charCount} more characters needed
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 font-figtree text-sm text-red-300">
          {error}
        </div>
      )}
    </form>
  );
}
