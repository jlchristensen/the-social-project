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

export default function AnswerCard({ answer, isOwn }: AnswerCardProps) {
  const router = useRouter();
  const [upvoted, setUpvoted] = useState(answer.has_upvoted);
  const [upvoteCount, setUpvoteCount] = useState(answer.upvote_count);
  const [showReplies, setShowReplies] = useState(false);

  const displayName = answer.is_anonymous
    ? "Anonymous"
    : answer.display_name || "Community Member";

  const initials = answer.is_anonymous
    ? "?"
    : (answer.display_name?.[0]?.toUpperCase() ?? "C");

  async function toggleUpvote() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Optimistic update
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
      className={`rounded-2xl border bg-white p-6 transition-all ${isOwn ? "border-brand-200 ring-1 ring-brand-100" : "border-slate-200 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5"}`}
    >
      {isOwn && (
        <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          Your answer
        </span>
      )}

      {/* Author row */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${answer.is_anonymous ? "bg-slate-100 text-slate-500" : "bg-brand-100 text-brand-600"}`}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{displayName}</p>
          <p className="text-xs text-slate-400">{timeAgo(answer.created_at)}</p>
        </div>
      </div>

      {/* Answer body */}
      <p className="mt-4 text-base leading-relaxed text-slate-700 whitespace-pre-line">
        {answer.body}
      </p>

      {/* Engagement bar */}
      <div className="mt-5 flex items-center gap-5 border-t border-slate-100 pt-4">
        <button
          onClick={toggleUpvote}
          className={`flex items-center gap-1.5 text-sm transition-colors ${upvoted ? "text-brand-600 font-medium" : "text-slate-400 hover:text-brand-600"}`}
        >
          <svg
            className="h-5 w-5"
            fill={upvoted ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          {upvoteCount > 0 && upvoteCount}
        </button>

        <button
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-brand-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
          {answer.reply_count > 0
            ? `${answer.reply_count} ${answer.reply_count === 1 ? "reply" : "replies"}`
            : "Reply"}
        </button>
      </div>

      {/* Reply thread (expandable) */}
      {showReplies && (
        <ReplyThread
          answerId={answer.id}
          onReplyAdded={() => router.refresh()}
        />
      )}
    </article>
  );
}
