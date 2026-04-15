"use client";

import { useState } from "react";
import type { Answer } from "@/lib/community/types";
import AnswerCard from "./AnswerCard";

type SortMode = "top" | "new" | "discussed";

interface CommunityFeedProps {
  answers: Answer[];
  currentUserId: string;
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
}: CommunityFeedProps) {
  const [sortMode, setSortMode] = useState<SortMode>("top");

  const ownAnswer = answers.find((a) => a.user_id === currentUserId);
  const otherAnswers = answers.filter((a) => a.user_id !== currentUserId);
  const sortedOthers = sortAnswers(otherAnswers, sortMode);

  const tabs: { key: SortMode; label: string }[] = [
    { key: "top", label: "Most resonant" },
    { key: "new", label: "Latest" },
    { key: "discussed", label: "Most discussed" },
  ];

  return (
    <div>
      {/* Welcome + sort controls */}
      <div className="mb-8 text-center">
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
          {ownAnswer && <AnswerCard answer={ownAnswer} isOwn />}
          {sortedOthers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} isOwn={false} />
          ))}
        </div>
      )}
    </div>
  );
}
