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

  if (hasAnswered) return null;

  if (!isSignedIn) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50">
          <svg
            className="h-6 w-6 text-brand-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </div>
        <p className="mt-4 text-base font-medium text-slate-900">
          Share your voice
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to answer today&apos;s question and see what others think.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-block rounded-full bg-brand-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Sign in to answer
        </Link>
      </div>
    );
  }

  if (celebrating) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
          <svg
            className="h-7 w-7 text-brand-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold text-brand-900">
          Your voice has been added
        </p>
        <p className="mt-2 text-sm text-brand-700/70">
          Here&apos;s what everyone else thinks...
        </p>
      </div>
    );
  }

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
    }, 1800);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <label htmlFor="answer-body" className="sr-only">
        Your answer
      </label>
      <textarea
        id="answer-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Share your answer..."
        rows={4}
        maxLength={2000}
        className="w-full resize-none rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
      />

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={isAnonymous}
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${isAnonymous ? "bg-brand-600" : "bg-slate-200"}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform ${isAnonymous ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
          <span className="text-sm text-slate-500">
            {isAnonymous ? "Posting anonymously" : "Posting as you"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-xs ${charCount >= 20 ? "text-slate-400" : "text-slate-300"}`}
          >
            {charCount}/2000
          </span>
          <button
            type="submit"
            disabled={!isValid || loading}
            className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sharing..." : "Share answer"}
          </button>
        </div>
      </div>

      {!isValid && charCount > 0 && (
        <p className="mt-3 text-xs text-slate-400">
          {20 - charCount} more characters needed
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </form>
  );
}
