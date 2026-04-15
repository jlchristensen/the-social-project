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
        .select("*")
        .eq("answer_id", answerId)
        .order("created_at", { ascending: true });

      if (data && data.length > 0) {
        const userIds = [...new Set(data.map((r) => r.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", userIds);

        const profileMap = new Map(
          (profiles ?? []).map((p) => [p.id, p.display_name])
        );

        const mapped: Reply[] = data.map((r) => ({
          id: r.id,
          answer_id: r.answer_id,
          user_id: r.user_id,
          body: r.body,
          is_anonymous: r.is_anonymous,
          created_at: r.created_at,
          display_name: profileMap.get(r.user_id) ?? null,
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
      .select("*")
      .single();

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    if (data) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      const newReply: Reply = {
        id: data.id,
        answer_id: data.answer_id,
        user_id: data.user_id,
        body: data.body,
        is_anonymous: data.is_anonymous,
        created_at: data.created_at,
        display_name: profile?.display_name ?? null,
      };
      setReplies((prev) => [...prev, newReply]);
    }

    setBody("");
    onReplyAdded();
  }

  return (
    <div className="mt-4 border-t border-dashed border-ember/20 pt-4">
      {loadingReplies ? (
        <p className="font-figtree text-xs text-brand-50/50">
          Loading replies…
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {replies.map((reply) => {
            const name = reply.is_anonymous
              ? "Anonymous"
              : reply.display_name || "Community Member";
            return (
              <div key={reply.id} className="flex gap-3">
                <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-brand-300 to-brand-500" />
                <div className="min-w-0 flex-1 font-figtree text-sm leading-relaxed text-brand-50/80">
                  <span className="mr-2 font-serif text-[13px] italic text-ember">
                    {name}
                  </span>
                  <span className="font-figtree text-[11px] uppercase tracking-[0.1em] text-brand-50/45">
                    {timeAgo(reply.created_at)}
                  </span>
                  <p className="mt-0.5 whitespace-pre-line">{reply.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply input */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write back…"
            maxLength={500}
            className="w-full rounded-full border border-brand-50/15 bg-white/[0.03] px-4 py-2.5 font-figtree text-sm text-brand-50 placeholder:italic placeholder:text-brand-50/40 focus:border-ember/50 focus:bg-white/[0.06] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`mt-2 pl-4 font-figtree text-[11px] uppercase tracking-[0.15em] transition-colors ${isAnonymous ? "text-ember" : "text-brand-50/45 hover:text-brand-50/70"}`}
          >
            {isAnonymous ? "Anonymous" : "Reply as you"}
          </button>
        </div>
        <button
          type="submit"
          disabled={!body.trim() || submitting}
          className="self-start rounded-full bg-gradient-to-b from-[#F5D28B] via-ember to-[#C99845] px-4 py-2.5 font-figtree text-sm font-semibold text-brand-900 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {submitting ? "…" : "Send"}
        </button>
      </form>

      {error && (
        <p className="mt-2 font-figtree text-xs text-red-300">{error}</p>
      )}
    </div>
  );
}
