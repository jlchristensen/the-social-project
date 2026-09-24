import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { formatCampfireDate, getDailyQuestion } from "@/lib/campfire";

/**
 * The share card: tonight's question, lit by the fire.
 *
 * This is what shows up in iMessage, Instagram DMs and group chats when
 * someone sends the link. The date lives in the URL (`/og/2026-10-16`) on
 * purpose: chat apps cache preview images by URL, so a fixed `/og` would show
 * whatever question was up the first time anyone shared it, forever. One URL
 * per night means every night gets its own card.
 */

const SIZE = { width: 1200, height: 630 };

const FALLBACK_LINE = "One question, every night.";

async function loadGoogleFont(family: string, text: string) {
  // Asking Google Fonts with `text=` returns a tiny subset containing only the
  // characters we draw. Without a modern user agent it serves a TTF, which is
  // what ImageResponse can read.
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

function questionFontSize(text: string): number {
  if (text.length <= 50) return 68;
  if (text.length <= 80) return 58;
  return 48;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Response("Not found", { status: 404 });
  }

  // Questions are public (logged-out visitors see them), so the anon key with
  // no session is enough. No cookies, so this route stays cacheable.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const result = await getDailyQuestion(supabase, date);
  const question = result.ok ? result.data?.question_text ?? null : null;

  const headline = question ?? FALLBACK_LINE;
  const label = question
    ? `Tonight's question · ${formatCampfireDate(date)}`
    : "The Social Project";
  const footer = "Answer it to see what everyone said";

  const serif = await loadGoogleFont("Instrument+Serif", headline);
  const sans = await loadGoogleFont(
    "Figtree:wght@500",
    `${label}${label.toUpperCase()}${footer}The Social Project`
  );

  // If Google Fonts is unreachable the card still renders, in the default font.
  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 500; style: "normal" }[] = [];
  if (serif) fonts.push({ name: "Instrument Serif", data: serif, weight: 400, style: "normal" });
  if (sans) fonts.push({ name: "Figtree", data: sans, weight: 500, style: "normal" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "64px 96px 56px",
          background:
            "radial-gradient(70% 55% at 50% 100%, rgba(232,184,106,0.28), transparent 70%), linear-gradient(180deg, #08180e 0%, #06160d 45%, #04130a 100%)",
          color: "#eef6f1",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Figtree",
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#e8b86a",
          }}
        >
          {label}
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontFamily: "Instrument Serif",
            fontSize: questionFontSize(headline),
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {headline}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* The campfire mark, same shapes as CampfireMark.tsx, flattened for the renderer */}
          <svg width="64" height="64" viewBox="0 0 32 32">
            <circle cx="16" cy="17" r="14" fill="#e8b86a" fillOpacity="0.14" />
            <path
              d="M16 4.5 C13 8.5 10.8 10.6 10.8 15.2 a5.2 5.2 0 0 0 10.4 0 C21.2 12.4 19.8 10.7 18.3 9 C18.3 11.6 17.1 12.4 16.1 12.4 C16.1 9.4 16.6 7 16 4.5 Z"
              fill="#E8B86A"
            />
            <path
              d="M16 12.6 C14.7 14.4 13.9 15.3 13.9 17.1 a2.1 2.1 0 0 0 4.2 0 C18.1 15.7 17.2 14.5 16 12.6 Z"
              fill="#F5D28B"
            />
            <rect x="8.2" y="23.4" width="15.6" height="2.7" rx="1.35" fill="#8A6435" transform="rotate(9 16 24.75)" />
            <rect x="8.2" y="23.4" width="15.6" height="2.7" rx="1.35" fill="#A87F49" transform="rotate(-9 16 24.75)" />
          </svg>
          <div
            style={{
              display: "flex",
              marginTop: 10,
              fontFamily: "Figtree",
              fontSize: 22,
              color: "rgba(238,246,241,0.6)",
            }}
          >
            {question ? footer : "The Social Project"}
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts,
      headers: {
        // A night's question doesn't change, so let CDNs and chat apps keep it.
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    }
  );
}
