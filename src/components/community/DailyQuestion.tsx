import type { DailyQuestion as DailyQuestionType } from "@/lib/community/types";

interface DailyQuestionProps {
  question: DailyQuestionType;
  answerCount: number;
  hasAnswered: boolean;
}

function formatQuestionDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function DailyQuestion({
  question,
  answerCount,
  hasAnswered,
}: DailyQuestionProps) {
  return (
    <div className="relative text-center">
      <div className="mb-3 inline-flex items-center gap-2.5 font-figtree text-[11px] font-medium uppercase tracking-[0.3em] text-ember opacity-80">
        <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_14px_rgba(245,210,139,0.9)]" />
        {formatQuestionDate(question.active_date)}
        {answerCount > 0 && (
          <>
            <span className="opacity-40">·</span>
            <span>
              {answerCount} {answerCount === 1 ? "voice" : "voices"} tonight
            </span>
          </>
        )}
      </div>

      <h1 className="font-serif mx-auto max-w-[20ch] text-4xl font-normal leading-[1.04] tracking-[-0.015em] text-brand-50 [text-shadow:0_0_60px_rgba(232,184,106,0.15)] md:text-5xl lg:text-[64px]">
        {question.question_text}
      </h1>

      {!hasAnswered && (
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-ember/30 bg-ember/[0.06] px-5 py-2.5 font-serif italic text-ember">
          <span className="campfire-gate-dot h-[7px] w-[7px] rounded-full bg-ember shadow-[0_0_12px_rgba(245,210,139,0.9)]" />
          <span className="text-base md:text-lg">
            Answer first. The circle opens after.
          </span>
        </div>
      )}
    </div>
  );
}
