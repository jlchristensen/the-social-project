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
  // Use US Central time so the question matches the user's day, not UTC
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Chicago",
  });

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
      // Fetch answers, upvotes, and replies separately to avoid join issues
      const { data: answersData } = await supabase
        .from("answers")
        .select("*")
        .eq("question_id", question.id)
        .order("created_at", { ascending: false });

      if (answersData && answersData.length > 0) {
        // Get display names for all answer authors
        const userIds = [...new Set(answersData.map((a) => a.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", userIds);

        const profileMap = new Map(
          (profiles ?? []).map((p) => [p.id, p.display_name])
        );

        // Get upvote counts and whether current user upvoted
        const answerIds = answersData.map((a) => a.id);
        const { data: upvotes } = await supabase
          .from("answer_upvotes")
          .select("answer_id, user_id")
          .in("answer_id", answerIds);

        const { data: replies } = await supabase
          .from("answer_replies")
          .select("answer_id")
          .in("answer_id", answerIds);

        const upvotesByAnswer = new Map<string, string[]>();
        for (const u of upvotes ?? []) {
          const list = upvotesByAnswer.get(u.answer_id) ?? [];
          list.push(u.user_id);
          upvotesByAnswer.set(u.answer_id, list);
        }

        const replyCountByAnswer = new Map<string, number>();
        for (const r of replies ?? []) {
          replyCountByAnswer.set(
            r.answer_id,
            (replyCountByAnswer.get(r.answer_id) ?? 0) + 1
          );
        }

        answers = answersData.map((a) => {
          const voters = upvotesByAnswer.get(a.id) ?? [];
          return {
            id: a.id,
            question_id: a.question_id,
            user_id: a.user_id,
            body: a.body,
            is_anonymous: a.is_anonymous,
            created_at: a.created_at,
            display_name: profileMap.get(a.user_id) ?? null,
            upvote_count: voters.length,
            reply_count: replyCountByAnswer.get(a.id) ?? 0,
            has_upvoted: voters.includes(user.id),
          };
        });
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
