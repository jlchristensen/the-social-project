"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Answer } from "@/lib/community/types";
import ReplyThread from "./ReplyThread";

interface AnswerCardProps {
  answer: Answer;
  isOwn: boolean;
}

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function Flame({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 14 16"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="flameGrad" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#C99845" />
          <stop offset=".6" stopColor="#E8B86A" />
          <stop offset="1" stopColor="#F5D28B" />
        </linearGradient>
      </defs>
      <path
        d="M7 1 C4.5 4 3 5.5 3 9 a4 4 0 0 0 8 0 C11 7 10 6 9 5 C9 7 8 7.5 7 7.5 C7 5 7.5 3 7 1 Z"
        fill="url(#flameGrad)"
      />
    </svg>
  );
}

export default function AnswerCard({ answer, isOwn }: AnswerCardProps) {
  const router = useRouter();
  const [upvoted, setUpvoted] = useState(answer.has_upvoted);
  const [upvoteCount, setUpvoteCount] = useState(answer.upvote_count);
  const [showReplies, setShowReplies] = useState(false);

  const displayName = answer.is_anonymous
    ? "Anonymous"
    : answer.display_name || "Community Member";

  const initial = answer.is_anonymous
    ? "?"
    : (answer.display_name?.[0]?.toUpperCase() ?? "C");

  async function toggleUpvote() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const wasUpvoted = upvoted;
    setUpvoted(!wasUpvoted);
    setUpvoteCount((c) => (wasUpvoted ? c - 1 : c + 1));

    if (wasUpvoted) {
      const { error } = await supabase
        .from("answer_upvotes")
        .delete()
        .eq("answer_id", answer.id)
        .eq("user_id", user.id);

      if (error) {
        setUpvoted(wasUpvoted);
        setUpvoteCount((c) => c + 1);
      }
    } else {
      const { error } = await supabase.from("answer_upvotes").insert({
        answer_id: answer.id,
        user_id: user.id,
      });

      if (error) {
        setUpvoted(wasUpvoted);
        setUpvoteCount((c) => c - 1);
      }
    }
  }

  return (
    <article
      className={`group relative mb-5 break-inside-avoid rounded-[20px] border bg-[radial-gradient(600px_200px_at_10%_-20%,rgba(232,184,106,0.04),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(232,184,106,0.25),inset_0_0_40px_rgba(232,184,106,0.03)] ${
        isOwn
          ? "border-ember/35 shadow-[inset_0_0_40px_rgba(232,184,106,0.05)]"
          : "border-brand-50/10 hover:border-ember/30"
      }`}
    >
      {isOwn && (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-2.5 py-1 font-figtree text-[10px] font-medium uppercase tracking-[0.2em] text-ember">
          Your voice
        </span>
      )}

      {/* Author row */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-ember to-[#C99845] font-serif text-base italic text-brand-900 shadow-[0_0_0_2px_rgba(232,184,106,0.25),0_0_18px_rgba(232,184,106,0.3)]"
          aria-hidden="true"
        >
          {initial}
        </div>
        <div className="leading-tight">
          <p className="font-serif text-[17px] text-brand-50">{displayName}</p>
          <p className="font-figtree text-[11px] uppercase tracking-[0.1em] text-brand-50/55">
            {timeAgo(answer.created_at)}
          </p>
        </div>
      </div>

      {/* Answer body */}
      <p className="mt-4 whitespace-pre-line font-serif text-[19px] leading-[1.5] text-brand-50/95">
        {answer.body}
      </p>

      {/* Engagement bar */}
      <div className="mt-5 flex items-center gap-5 font-figtree text-xs text-brand-50/65">
        <button
          onClick={toggleUpvote}
          className={`group/btn flex items-center gap-2 transition-colors ${upvoted ? "text-ember" : "hover:text-ember"}`}
        >
          <Flame className="h-4 w-[14px]" />
          {upvoteCount > 0 ? upvoteCount : "Resonate"}
        </button>

        <button
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center gap-2 transition-colors hover:text-ember"
        >
          <span className="text-[14px] leading-none">✦</span>
          {answer.reply_count > 0
            ? `${answer.reply_count} ${answer.reply_count === 1 ? "reply" : "replies"}`
            : "Write back"}
        </button>
      </div>

      {showReplies && (
        <ReplyThread
          answerId={answer.id}
          onReplyAdded={() => router.refresh()}
        />
      )}
    </article>
  );
}
