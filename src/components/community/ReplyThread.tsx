"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Reply } from "@/lib/community/types";

interface ReplyThreadProps {
  answerId: string;
  onReplyAdded: () => void;
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

export default function ReplyThread({
  answerId,
  onReplyAdded,
}: ReplyThreadProps) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(true);
  const [body, setBody] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReplies() {
      const supabase = createClient();
      const { data } = await supabase
        .from("answer_replies")
        .select("*, profiles:user_id(display_name)")
        .eq("answer_id", answerId)
        .order("created_at", { ascending: true });

      if (data) {
        const mapped: Reply[] = data.map((r) => ({
          id: r.id,
          answer_id: r.answer_id,
          user_id: r.user_id,
          body: r.body,
          is_anonymous: r.is_anonymous,
          created_at: r.created_at,
          display_name: (r.profiles as { display_name: string | null })
            ?.display_name ?? null,
        }));
        setReplies(mapped);
      }
      setLoadingReplies(false);
    }

    fetchReplies();
  }, [answerId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be signed in to reply.");
      setSubmitting(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("answer_replies")
      .insert({
        answer_id: answerId,
        user_id: user.id,
        body: body.trim(),
        is_anonymous: isAnonymous,
      })
      .select("*, profiles:user_id(display_name)")
      .single();

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    if (data) {
      const newReply: Reply = {
        id: data.id,
        answer_id: data.answer_id,
        user_id: data.user_id,
        body: data.body,
        is_anonymous: data.is_anonymous,
        created_at: data.created_at,
        display_name: (data.profiles as { display_name: string | null })
          ?.display_name ?? null,
      };
      setReplies((prev) => [...prev, newReply]);
    }

    setBody("");
    onReplyAdded();
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      {loadingReplies ? (
        <p className="text-xs text-slate-400">Loading replies...</p>
      ) : (
        <div className="space-y-3">
          {replies.map((reply) => {
            const name = reply.is_anonymous
              ? "Anonymous"
              : reply.display_name || "Community Member";
            const initial = reply.is_anonymous
              ? "?"
              : (reply.display_name?.[0]?.toUpperCase() ?? "C");

            return (
              <div key={reply.id} className="flex gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${reply.is_anonymous ? "bg-slate-100 text-slate-400" : "bg-brand-50 text-brand-600"}`}
                >
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-slate-900">
                      {name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {timeAgo(reply.created_at)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600 whitespace-pre-line">
                    {reply.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply input */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a reply..."
            maxLength={500}
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-300 focus:bg-white focus:outline-none transition-colors"
          />
          <div className="mt-2 flex items-center gap-2 pl-4">
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`text-xs transition-colors ${isAnonymous ? "text-brand-600 font-medium" : "text-slate-400 hover:text-slate-600"}`}
            >
              {isAnonymous ? "Anonymous" : "Reply as you"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={!body.trim() || submitting}
          className="self-start rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "..." : "Reply"}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
