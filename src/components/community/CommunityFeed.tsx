"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Answer } from "@/lib/community/types";
import AnswerCard from "./AnswerCard";

type SortMode = "top" | "new" | "discussed";

/** How often the fire checks for new voices while you sit here. */
const HEARTBEAT_MS = 25_000;

interface CommunityFeedProps {
  answers: Answer[];
  currentUserId: string;
  questionId: string;
}

function sortAnswers(answers: Answer[], mode: SortMode): Answer[] {
  const sorted = [...answers];
  switch (mode) {
    case "top":
      return sorted.sort((a, b) => b.upvote_count - a.upvote_count);
    case "new":
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case "discussed":
      return sorted.sort((a, b) => b.reply_count - a.reply_count);
  }
}

export default function CommunityFeed({
  answers,
  currentUserId,
  questionId,
}: CommunityFeedProps) {
  const router = useRouter();
  const [sortMode, setSortMode] = useState<SortMode>("top");

  // ── The unlock reveal: play the ceremony only right after answering ──
  const [revealing, setRevealing] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("campfire-reveal") === questionId) {
        sessionStorage.removeItem("campfire-reveal");
        setRevealing(true);
        // The class only needs to exist while the animation plays; dropping it
        // after keeps later re-sorts and refreshes from replaying the reveal.
        const timer = window.setTimeout(() => setRevealing(false), 2600);
        return () => window.clearTimeout(timer);
      }
    } catch {
      // Storage unavailable — no ceremony, feed just shows.
    }
  }, [questionId]);

  // ── The live fire: notice when new voices join and pull them in ──
  // The heartbeat only reads the public answer COUNT; actual answers are
  // re-fetched server-side through the gated path, so anonymity redaction
  // is never bypassed.
  const knownIds = useRef<Set<string> | null>(null);
  const [arrivedIds, setArrivedIds] = useState<Set<string>>(new Set());

  if (knownIds.current === null) {
    knownIds.current = new Set(answers.map((a) => a.id));
  } else {
    const fresh = answers.filter((a) => !knownIds.current!.has(a.id));
    if (fresh.length > 0) {
      for (const a of fresh) knownIds.current.add(a.id);
      // Setting state during render is React's sanctioned "derive from props"
      // pattern; it re-renders immediately with the arrival animation applied.
      setArrivedIds(new Set([...arrivedIds, ...fresh.map((a) => a.id)]));
    }
  }

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function heartbeat() {
      const { data, error } = await supabase.rpc("campfire_answer_count", {
        p_question_id: questionId,
      });
      if (cancelled || error || typeof data !== "number") return;
      if (data > (knownIds.current?.size ?? 0)) {
        router.refresh();
      }
    }

    const interval = window.setInterval(heartbeat, HEARTBEAT_MS);

    function onVisible() {
      if (document.visibilityState === "visible") void heartbeat();
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [questionId, router]);

  const ownAnswer = answers.find((a) => a.user_id === currentUserId);
  const otherAnswers = answers.filter((a) => a.user_id !== currentUserId);
  const sortedOthers = sortAnswers(otherAnswers, sortMode);

  const tabs: { key: SortMode; label: string }[] = [
    { key: "top", label: "Most resonant" },
    { key: "new", label: "Latest" },
    { key: "discussed", label: "Most discussed" },
  ];

  /** Stagger the melt so the circle opens card by card, not all at once. */
  function revealStyle(index: number): React.CSSProperties | undefined {
    if (!revealing) return undefined;
    return { animationDelay: `${Math.min(index * 130, 1200)}ms` };
  }

  function cardClass(id: string): string | undefined {
    if (revealing) return "circle-reveal";
    if (arrivedIds.has(id)) return "answer-arrive";
    return undefined;
  }

  return (
    <div>
      {/* Welcome + sort controls */}
      <div
        className={`mb-8 text-center ${revealing ? "circle-reveal" : ""}`}
      >
        <p className="font-serif text-2xl italic text-ember md:text-3xl">
          You&apos;re in. Pull up a log.
        </p>
        <div className="mt-6 inline-flex gap-1 rounded-full border border-brand-50/10 bg-white/[0.04] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSortMode(tab.key)}
              className={`rounded-full px-4 py-2 font-figtree text-[11px] font-medium uppercase tracking-[0.18em] transition-all ${
                sortMode === tab.key
                  ? "bg-ember text-brand-900"
                  : "text-brand-50/60 hover:text-brand-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry of cards (CSS columns) */}
      {answers.length === 0 ? (
        <p className="mt-8 text-center font-figtree text-sm text-brand-50/50">
          No one has spoken yet. You&apos;re the first voice tonight.
        </p>
      ) : (
        <div className="columns-1 gap-5">
          {ownAnswer && (
            <div className={cardClass(ownAnswer.id)} style={revealStyle(1)}>
              <AnswerCard answer={ownAnswer} isOwn />
            </div>
          )}
          {sortedOthers.map((answer, i) => (
            <div
              key={answer.id}
              className={cardClass(answer.id)}
              style={revealStyle(i + 2)}
            >
              <AnswerCard answer={answer} isOwn={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
