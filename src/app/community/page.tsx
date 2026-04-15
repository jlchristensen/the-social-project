import { createClient } from "@/lib/supabase/server";
import DailyQuestion from "@/components/community/DailyQuestion";
import AnswerGate from "@/components/community/AnswerGate";
import CommunityFeed from "@/components/community/CommunityFeed";
import type { Answer } from "@/lib/community/types";

function Embers() {
  return (
    <div className="campfire-embers" aria-hidden="true">
      <i /><i /><i /><i /><i /><i /><i />
    </div>
  );
}

function DarkPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[28px] bg-[radial-gradient(800px_400px_at_50%_-10%,rgba(232,184,106,0.12),transparent_70%),linear-gradient(180deg,#00200f_0%,#00180a_100%)] px-6 py-12 text-brand-50 shadow-[0_40px_80px_-40px_rgba(0,32,15,0.5),0_0_0_1px_rgba(0,32,15,0.08)] md:px-16 md:py-16 ${className}`}
    >
      <Embers />
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}

export default async function CommunityPage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: question } = await supabase
    .from("daily_questions")
    .select("*")
    .eq("active_date", today)
    .single();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let answerCount = 0;
  if (question) {
    const { count } = await supabase
      .from("answers")
      .select("*", { count: "exact", head: true })
      .eq("question_id", question.id);
    answerCount = count ?? 0;
  }

  let answers: Answer[] = [];
  let hasAnswered = false;

  if (question && user) {
    const { data: ownAnswer } = await supabase
      .from("answers")
      .select("id")
      .eq("question_id", question.id)
      .eq("user_id", user.id)
      .maybeSingle();

    hasAnswered = !!ownAnswer;

    if (hasAnswered) {
      const { data: answersData } = await supabase
        .from("answers")
        .select(
          "*, profiles:user_id(display_name), answer_upvotes(user_id), answer_replies(id)"
        )
        .eq("question_id", question.id)
        .order("created_at", { ascending: false });

      if (answersData) {
        answers = answersData.map((a) => ({
          id: a.id,
          question_id: a.question_id,
          user_id: a.user_id,
          body: a.body,
          is_anonymous: a.is_anonymous,
          created_at: a.created_at,
          display_name:
            (a.profiles as { display_name: string | null })?.display_name ??
            null,
          upvote_count: Array.isArray(a.answer_upvotes)
            ? a.answer_upvotes.length
            : 0,
          reply_count: Array.isArray(a.answer_replies)
            ? a.answer_replies.length
            : 0,
          has_upvoted: Array.isArray(a.answer_upvotes)
            ? a.answer_upvotes.some(
                (u: { user_id: string }) => u.user_id === user.id
              )
            : false,
        }));
      }
    }
  }

  // No question scheduled for today — soft rest state in the campfire panel
  if (!question) {
    return (
      <div className="mx-auto max-w-5xl px-4 pt-28 pb-16 md:px-8 md:pt-32">
        <DarkPanel>
          <div className="relative py-16 text-center">
            <div className="campfire-aura" />
            <p className="relative font-figtree text-[11px] font-medium uppercase tracking-[0.3em] text-ember/80">
              The fire is quiet tonight
            </p>
            <h1 className="relative mt-4 font-serif text-4xl leading-tight text-brand-50 md:text-5xl">
              Today&apos;s question is being crafted.
            </h1>
            <p className="relative mt-4 font-figtree text-brand-50/65">
              Check back soon — a new question drops every day.
            </p>
          </div>
        </DarkPanel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-28 pb-16 md:px-8 md:pt-32">
      {/* The Campfire — question + gate */}
      <DarkPanel>
        <div className="relative">
          <div className="campfire-aura" />
          <div className="relative">
            <DailyQuestion
              question={question}
              answerCount={answerCount}
              hasAnswered={hasAnswered}
            />

            {!hasAnswered && (
              <div className="mt-12">
                <AnswerGate
                  questionId={question.id}
                  isSignedIn={!!user}
                  hasAnswered={hasAnswered}
                />
              </div>
            )}
          </div>
        </div>
      </DarkPanel>

      {/* The circle — only after answering */}
      {hasAnswered && user && (
        <div className="mt-7">
          <DarkPanel>
            <CommunityFeed answers={answers} currentUserId={user.id} />
          </DarkPanel>
        </div>
      )}
    </div>
  );
}
