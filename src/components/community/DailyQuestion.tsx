import type { DailyQuestion as DailyQuestionType } from "@/lib/community/types";

const categoryLabels: Record<string, string> = {
  icebreaker: "Icebreaker",
  reflection: "Reflection",
  connection: "Connection",
  advice: "Advice",
  "hot-take": "Hot Take",
  gratitude: "Gratitude",
  hypothetical: "Hypothetical",
};

const categoryColors: Record<string, string> = {
  icebreaker: "bg-blue-50 text-blue-700",
  reflection: "bg-purple-50 text-purple-700",
  connection: "bg-brand-50 text-brand-700",
  advice: "bg-amber-50 text-amber-700",
  "hot-take": "bg-rose-50 text-rose-700",
  gratitude: "bg-emerald-50 text-emerald-700",
  hypothetical: "bg-indigo-50 text-indigo-700",
};

interface DailyQuestionProps {
  question: DailyQuestionType;
  answerCount: number;
}

export default function DailyQuestion({
  question,
  answerCount,
}: DailyQuestionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center md:p-12">
      <span
        className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase ${categoryColors[question.category] ?? "bg-slate-50 text-slate-600"}`}
      >
        {categoryLabels[question.category] ?? question.category}
      </span>

      <h2 className="font-display mt-6 text-3xl leading-snug tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
        {question.question_text}
      </h2>

      {answerCount > 0 && (
        <p className="mt-6 text-sm text-slate-400">
          {answerCount} {answerCount === 1 ? "person has" : "people have"}{" "}
          answered today
        </p>
      )}
    </div>
  );
}
