import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import DailyQuestion from "@/components/community/DailyQuestion";
import AnswerGate from "@/components/community/AnswerGate";
import CommunityFeed from "@/components/community/CommunityFeed";
import type { Answer } from "@/lib/community/types";

export default async function CommunityPage() {
  const supabase = await createClient();

  // Get today's date in UTC for consistency
  const today = new Date().toISOString().split("T")[0];

  // Fetch today's question
  const { data: question } = await supabase
    .from("daily_questions")
    .select("*")
    .eq("active_date", today)
    .single();

  // Check if user is signed in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch answer count (visible to everyone as a teaser)
  let answerCount = 0;
  if (question) {
    const { count } = await supabase
      .from("answers")
      .select("*", { count: "exact", head: true })
      .eq("question_id", question.id);
    answerCount = count ?? 0;
  }

  // Fetch full answers + upvote data (only for signed-in users)
  let answers: Answer[] = [];
  let hasAnswered = false;

  if (question && user) {
    // Check if user has answered
    const { data: ownAnswer } = await supabase
      .from("answers")
      .select("id")
      .eq("question_id", question.id)
      .eq("user_id", user.id)
      .maybeSingle();

    hasAnswered = !!ownAnswer;

    // Only load the full feed if the user has answered (the gate)
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

  // No question for today — show a rest state
  if (!question) {
    return (
      <>
        <PageHeader
          title="Community"
          subtitle="Real stories from real people choosing connection over convenience. This is your space — share, ask, and show up."
        />
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-10 md:p-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
                <svg
                  className="h-7 w-7 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                Today&apos;s question is being crafted
              </h2>
              <p className="mt-3 text-base text-slate-500">
                Check back soon — a new question drops every day.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Community"
        subtitle="Real stories from real people choosing connection over convenience. This is your space — share, ask, and show up."
      />
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-6 lg:px-8 space-y-6">
          {/* The daily question — always visible */}
          <DailyQuestion question={question} answerCount={answerCount} />

          {/* The gate: sign in, answer, or feed */}
          <AnswerGate
            questionId={question.id}
            isSignedIn={!!user}
            hasAnswered={hasAnswered}
          />

          {/* Community feed — only after answering */}
          {hasAnswered && user && (
            <CommunityFeed answers={answers} currentUserId={user.id} />
          )}
        </div>
      </section>
    </>
  );
}
