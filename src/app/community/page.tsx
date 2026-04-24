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

/**
 * The Campfire — one continuous immersive experience.
 * On desktop it reads as a wide forest hearth (v1 Hearth);
 * on mobile it tightens into a focused app shell (v2 App Feel).
 * Both share the same data and the same behavior — only the chrome adapts.
 */
export default async function CommunityPage() {
  const supabase = await createClient();
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Chicago",
  });

  const [{ data: question }, { data: { user } }] = await Promise.all([
    supabase
      .from("daily_questions")
      .select("*")
      .eq("active_date", today)
      .single(),
    supabase.auth.getUser(),
  ]);

  let answerCount = 0;
  let answers: Answer[] = [];
  let hasAnswered = false;

  if (question) {
    const [{ count }, ownAnswerRes] = await Promise.all([
      supabase
        .from("answers")
        .select("*", { count: "exact", head: true })
        .eq("question_id", question.id),
      user
        ? supabase
            .from("answers")
            .select("id")
            .eq("question_id", question.id)
            .eq("user_id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);
    answerCount = count ?? 0;
    hasAnswered = !!ownAnswerRes.data;

    if (user && hasAnswered) {
      const { data: answersData } = await supabase
        .from("answers")
        .select("*")
        .eq("question_id", question.id)
        .order("created_at", { ascending: false });

      if (answersData && answersData.length > 0) {
        const userIds = [...new Set(answersData.map((a) => a.user_id))];
        const answerIds = answersData.map((a) => a.id);

        const [{ data: profiles }, { data: upvotes }, { data: replies }] =
          await Promise.all([
            supabase
              .from("profiles")
              .select("id, display_name")
              .in("id", userIds),
            supabase
              .from("answer_upvotes")
              .select("answer_id, user_id")
              .in("answer_id", answerIds),
            supabase
              .from("answer_replies")
              .select("answer_id")
              .in("answer_id", answerIds),
          ]);

        const profileMap = new Map(
          (profiles ?? []).map((p) => [p.id, p.display_name])
        );

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

  // ── Scene background spans the full page (replaces the body's light wash) ──
  const sceneBg =
    "radial-gradient(120% 60% at 50% 0%, rgba(232,184,106,0.10), transparent 60%)," +
    "radial-gradient(80% 50% at 50% 100%, rgba(232,184,106,0.16), transparent 60%)," +
    "linear-gradient(180deg, #08180e 0%, #06160d 30%, #04130a 100%)";

  // No question scheduled — quiet rest state inside the same scene
  if (!question) {
    return (
      <div
        className="relative min-h-screen text-brand-50"
        style={{ background: sceneBg }}
      >
        <div className="grain" />
        <Embers />
        <div className="relative mx-auto max-w-2xl px-5 pt-32 pb-24 text-center md:pt-40">
          <div className="campfire-aura" />
          <p className="relative font-figtree text-[11px] font-medium uppercase tracking-[0.3em] text-ember/80">
            The fire is quiet tonight
          </p>
          <h1 className="relative mt-4 font-serif text-4xl leading-tight text-brand-50 md:text-5xl">
            Today&rsquo;s question is being crafted.
          </h1>
          <p className="relative mt-4 font-figtree text-brand-50/65">
            Check back soon — a new question drops every day.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen text-brand-50"
      style={{ background: sceneBg }}
    >
      {/* Scene atmospherics — span the entire page */}
      <div className="grain" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Embers />
      </div>

      {/* ── The Hero: the question, lit by the fire ── */}
      <section className="relative">
        {/* Aura behind the question */}
        <div
          className="campfire-aura"
          style={{ top: "55%", width: 720, height: 720 }}
        />

        <div className="relative mx-auto max-w-2xl px-5 pt-24 pb-10 text-center md:max-w-3xl md:px-8 md:pt-28 md:pb-14">
          <DailyQuestion
            question={question}
            answerCount={answerCount}
            hasAnswered={hasAnswered}
          />

          {!hasAnswered && (
            <div className="mt-10 md:mt-12">
              <AnswerGate
                questionId={question.id}
                isSignedIn={!!user}
                hasAnswered={hasAnswered}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── The Circle: voices flow as one continuous river ── */}
      {hasAnswered && user && (
        <>
          {/* Soft descent — bridges hero into the circle */}
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-3 px-5 pb-2 md:max-w-3xl">
            <span className="font-figtree text-[10px] uppercase tracking-[0.32em] text-ember/70">
              The circle is open
            </span>
            <span className="block h-12 w-px bg-gradient-to-b from-transparent via-ember/60 to-transparent" />
          </div>

          <section className="relative mx-auto max-w-2xl px-5 pb-32 md:max-w-3xl md:px-8 md:pb-40">
            <CommunityFeed answers={answers} currentUserId={user.id} />
          </section>
        </>
      )}

      {/* Tree-line silhouettes — desktop only, frames the bottom of the scene */}
      <div className="tree-line hidden md:block" aria-hidden="true" />

      {/* Footer note — closes the night */}
      <div className="relative pb-20 text-center font-figtree text-[10px] uppercase tracking-[0.3em] text-brand-100/45 md:text-[11px]">
        The fire goes out at midnight ·{" "}
        <span className="text-ember/80">new question tomorrow</span>
      </div>
    </div>
  );
}
