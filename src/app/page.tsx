import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DailyQuestion from "@/components/community/DailyQuestion";
import AnswerGate from "@/components/community/AnswerGate";
import CommunityFeed from "@/components/community/CommunityFeed";
import CampfireCountdown from "@/components/community/CampfireCountdown";
import StreakBadge from "@/components/community/StreakBadge";
import LockedFeedPreview from "@/components/community/LockedFeedPreview";
import DyingFire from "@/components/community/DyingFire";
import WelcomeBack from "@/components/community/WelcomeBack";
import { getCampfireSnapshot } from "@/lib/campfire";
import { computeStreak } from "@/lib/profileStats";
import { fetchUnreadActivityCounts } from "@/lib/profileActivityFeed";

function Embers() {
  return (
    <div className="campfire-embers" aria-hidden="true">
      <i /><i /><i /><i /><i /><i /><i />
    </div>
  );
}

/**
 * A short scroll below the question, for people who just arrived and have no
 * idea what this is. Two breaths of context, nothing more.
 */
function Whisper() {
  return (
    <section className="relative mx-auto max-w-xl px-6 pb-28 pt-16 text-center md:pt-20">
      <span className="font-figtree text-[10px] font-medium uppercase tracking-[0.32em] text-ember/70">
        What is this?
      </span>
      <p className="mt-6 font-serif text-xl leading-relaxed text-brand-50/85 md:text-2xl">
        Every night, one question gets asked around this fire. Answer it
        honestly, and you&rsquo;ll see what everyone else said.
      </p>
      <p className="mt-4 font-figtree text-sm leading-relaxed text-brand-50/55">
        That&rsquo;s it. That&rsquo;s the whole thing.
      </p>
      <Link
        href="/sign-up"
        className="mt-8 inline-flex items-center gap-2 font-figtree text-sm font-medium text-brand-200 transition-colors hover:text-ember"
      >
        Pull up a seat
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </Link>
    </section>
  );
}

/**
 * The homepage IS the Campfire — opening the site drops you at tonight's
 * question, the same way opening BeReal drops you into today's moment.
 *
 * Three states: signed out (question + gate + blurred circle + whisper),
 * signed in unanswered (question + streak + composer + blurred circle),
 * answered (the circle opens).
 */
export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [snapshot, streak, unreadCounts] = await Promise.all([
    getCampfireSnapshot(supabase, user?.id ?? null),
    user
      ? supabase
          .from("answers")
          .select("created_at")
          .eq("user_id", user.id)
          .then(({ data }) =>
            computeStreak((data ?? []).map((a) => a.created_at))
          )
      : Promise.resolve(0),
    user
      ? fetchUnreadActivityCounts(supabase, user.id)
      : Promise.resolve({ resonates: 0, replies: 0 }),
  ]);

  if (!snapshot.ok) {
    // The read itself failed — surface it rather than rendering the quiet-night
    // state, which would tell every visitor there's no question when there is.
    throw new Error(`Could not load the campfire: ${snapshot.error}`);
  }

  const { question, answerCount, hasAnswered, answers } = snapshot.data;

  // ── Scene background spans the full page ──
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
        {!user && <Whisper />}
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
      <DyingFire />

      {/* ── The Hero: the question, lit by the fire ── */}
      <section className="relative">
        <div
          className="campfire-aura"
          style={{ top: "55%", width: 720, height: 720 }}
        />

        <div className="relative mx-auto max-w-2xl px-5 pt-24 pb-10 text-center md:max-w-3xl md:px-8 md:pt-28 md:pb-14">
          <WelcomeBack counts={unreadCounts} />

          {streak > 0 && (
            <div className="mb-6">
              <StreakBadge streak={streak} />
            </div>
          )}

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

          <div className="mt-10">
            <CampfireCountdown />
          </div>
        </div>
      </section>

      {/* ── Locked: the circle you can't quite see yet ── */}
      {!hasAnswered && (
        <LockedFeedPreview count={answerCount} questionId={question.id} />
      )}

      {/* ── The Circle: voices flow as one continuous river ── */}
      {hasAnswered && user && (
        <>
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-3 px-5 pb-2 md:max-w-3xl">
            <span className="font-figtree text-[10px] uppercase tracking-[0.32em] text-ember/70">
              The circle is open
            </span>
            <span className="block h-12 w-px bg-gradient-to-b from-transparent via-ember/60 to-transparent" />
          </div>

          <section className="relative mx-auto max-w-2xl px-5 pb-32 md:max-w-3xl md:px-8 md:pb-40">
            <CommunityFeed
              answers={answers}
              currentUserId={user.id}
              questionId={question.id}
            />
          </section>
        </>
      )}

      {/* ── The whisper: what is this, for newcomers only ── */}
      {!user && <Whisper />}

      {/* Tree-line silhouettes — desktop only, frames the bottom of the scene */}
      <div className="tree-line hidden md:block" aria-hidden="true" />

      {/* Footer note — closes the night */}
      <div className="relative pb-20 text-center font-figtree text-[10px] uppercase tracking-[0.3em] text-brand-100/45 md:text-[11px]">
        New question <span className="text-ember/80">tomorrow</span>
      </div>
    </div>
  );
}
