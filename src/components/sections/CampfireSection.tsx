import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { createClient } from "@/lib/supabase/server";

function Embers() {
  return (
    <div className="campfire-embers" aria-hidden="true">
      <i /><i /><i /><i /><i /><i /><i />
    </div>
  );
}

export default async function CampfireSection() {
  const supabase = await createClient();
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Chicago",
  });

  const { data: question } = await supabase
    .from("daily_questions")
    .select("*")
    .eq("active_date", today)
    .single();

  let answerCount = 0;
  if (question) {
    const { count } = await supabase
      .from("answers")
      .select("*", { count: "exact", head: true })
      .eq("question_id", question.id);
    answerCount = count ?? 0;
  }

  const dateLabel = new Date(`${today}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <section className="bg-brand-50 px-6 pt-12 pb-20 md:pt-16 md:pb-28">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <h2 className="max-w-5xl text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-[0.88] tracking-[-0.02em] text-brand-900">
            Sit down at the{" "}
            <span className="font-display font-normal italic normal-case text-brand-600">
              campfire.
            </span>
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-brand-900/65 md:text-lg">
            One question. Every day. Answer honestly, then see what others
            have to share.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <Link href="/community" className="group mt-12 block md:mt-16">
            <article
              className="relative isolate overflow-hidden rounded-[2rem] text-brand-50 transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_70px_140px_-50px_rgba(0,32,15,0.65),0_0_0_1px_rgba(0,32,15,0.08)]"
              style={{
                background:
                  "radial-gradient(60% 50% at 50% 0%, rgba(245,210,139,0.18), transparent 60%)," +
                  "radial-gradient(70% 60% at 50% 100%, rgba(232,184,106,0.10), transparent 60%)," +
                  "linear-gradient(180deg, #08180e 0%, #06160d 60%, #04130a 100%)",
                boxShadow:
                  "0 60px 120px -50px rgba(0,32,15,0.55), 0 0 0 1px rgba(0,32,15,0.06)",
              }}
            >
              <div className="grain" />
              <Embers />

              {/* Breathing aura behind the question */}
              <div
                className="campfire-aura"
                style={{ top: "42%", width: 680, height: 680 }}
              />

              <div className="relative flex min-h-[28rem] flex-col items-center justify-center px-6 py-20 text-center md:min-h-[32rem] md:px-10 md:py-24">
                {/* Live status pill */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-ember/30 bg-ember/[0.08] px-4 py-2 font-figtree text-[10px] font-medium uppercase tracking-[0.32em] text-ember backdrop-blur-sm md:text-[11px]">
                  <span className="campfire-gate-dot h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_rgba(245,210,139,0.9)]" />
                  {question
                    ? `The fire is lit · ${answerCount} ${
                        answerCount === 1 ? "voice" : "voices"
                      } tonight`
                    : "The fire is quiet tonight"}
                </div>

                {question ? (
                  <>
                    <p className="mt-8 font-serif text-[15px] italic text-ember/80 md:text-base">
                      Tonight&rsquo;s question
                    </p>
                    <h3 className="mt-3 max-w-[22ch] font-serif text-[clamp(2rem,5vw,3.4rem)] leading-[1.06] tracking-[-0.012em] text-brand-50 [text-shadow:0_0_80px_rgba(245,210,139,0.18)]">
                      {question.question_text}
                    </h3>
                  </>
                ) : (
                  <>
                    <p className="mt-8 font-serif text-[15px] italic text-ember/80 md:text-base">
                      Tomorrow&rsquo;s question
                    </p>
                    <h3 className="mt-3 max-w-[22ch] font-serif text-[clamp(2rem,5vw,3.4rem)] leading-[1.06] tracking-[-0.012em] text-brand-50 [text-shadow:0_0_80px_rgba(245,210,139,0.18)]">
                      A new question is being crafted.
                    </h3>
                  </>
                )}

                {/* CTA */}
                <span className="mt-10 inline-flex items-center gap-3 rounded-full bg-ember px-7 py-4 font-figtree text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-900 shadow-[0_0_40px_rgba(245,210,139,0.4)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_56px_rgba(245,210,139,0.55)] md:text-[12px]">
                  Sit down at the fire
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-6-6 6 6-6 6"
                    />
                  </svg>
                </span>

                {/* Foot meta */}
                <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-figtree text-[10px] uppercase tracking-[0.18em] text-brand-50/55 md:text-[11px]">
                  <span>{dateLabel}</span>
                  <span className="hidden h-px w-4 bg-brand-50/30 sm:inline-block" />
                  <span>The fire goes out at midnight</span>
                </div>
              </div>

              <div className="tree-line hidden md:block" aria-hidden="true" />
            </article>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
