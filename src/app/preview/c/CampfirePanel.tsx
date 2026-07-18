import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface DailyQuestion {
  id: string;
  question_text: string;
}

async function getTonight(): Promise<{
  question: DailyQuestion | null;
  answerCount: number;
  today: string;
}> {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Chicago",
  });

  try {
    const supabase = await createClient();
    const { data: question } = await supabase
      .from("daily_questions")
      .select("id, question_text")
      .eq("active_date", today)
      .single<DailyQuestion>();

    let answerCount = 0;
    if (question) {
      const { count } = await supabase
        .from("answers")
        .select("*", { count: "exact", head: true })
        .eq("question_id", question.id);
      answerCount = count ?? 0;
    }

    return { question, answerCount, today };
  } catch {
    return { question: null, answerCount: 0, today };
  }
}

export default async function CampfirePanel() {
  const { question, answerCount, today } = await getTonight();

  const dateLabel = new Date(`${today}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <section className="c-campfire" aria-labelledby="campfire-heading">
      <div className="c-frame">
        <p className="c-eyebrow">The Campfire</p>
        <h2 id="campfire-heading" className="c-h2">
          Sit down at the <span className="c-serif">campfire</span>.
        </h2>
        <p className="c-campfire-lede">
          One question. Every day. Answer honestly, then see what others have
          to share.
        </p>

        <Link href="/community" className="c-fire-panel">
          <div className="c-fire-status">
            <span className="c-fire-live">
              <span className="c-fire-dot" aria-hidden="true" />
              {question
                ? `The fire is lit · ${answerCount} ${
                    answerCount === 1 ? "voice" : "voices"
                  } tonight`
                : "The fire is quiet tonight"}
            </span>
            <span className="c-eyebrow">{dateLabel}</span>
          </div>

          <div className="c-fire-body">
            <p className="c-fire-kicker">
              {question ? "Tonight’s question" : "Tomorrow’s question"}
            </p>
            <h3 className="c-fire-question">
              {question
                ? question.question_text
                : "A new question is being crafted."}
            </h3>
            <span className="c-btn c-btn-gold c-fire-cta">
              Sit down at the fire
              <span className="c-arrow" aria-hidden="true">
                &rarr;
              </span>
            </span>
          </div>

          <div className="c-fire-foot">
            <span className="c-eyebrow">One honest answer to join</span>
            <span className="c-eyebrow">The fire goes out at midnight</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
