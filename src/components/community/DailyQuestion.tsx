import type { DailyQuestion as DailyQuestionType } from "@/lib/community/types";

interface DailyQuestionProps {
  question: DailyQuestionType;
  answerCount: number;
  hasAnswered: boolean;
}

export default function DailyQuestion({
  question,
  hasAnswered,
}: DailyQuestionProps) {
  return (
    <div className="relative text-center">
      <p className="mb-5 font-serif text-[15px] italic text-ember/80 md:text-base">
        Tonight&rsquo;s question
      </p>

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
