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
    { key: "top", label: "Top" },
    { key: "new", label: "New" },
    { key: "discussed", label: "Discussed" },
  ];

  return (
    <div>
      {/* Sort tabs */}
      <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSortMode(tab.key)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              sortMode === tab.key
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Answer list */}
      <div className="mt-6 space-y-4">
        {ownAnswer && <AnswerCard answer={ownAnswer} isOwn />}
        {sortedOthers.map((answer) => (
          <AnswerCard key={answer.id} answer={answer} isOwn={false} />
        ))}
      </div>

      {answers.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            No answers yet. Be the first to share your thoughts.
          </p>
        </div>
      )}
    </div>
  );
}
