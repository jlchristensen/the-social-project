"use client";

import { useEffect, useState } from "react";
import { CAMPFIRE_TIME_ZONE } from "@/lib/campfire";

/**
 * Live countdown to midnight on the campfire clock (Central), when tonight's
 * question rolls over. Renders a static fallback until mounted so server and
 * client HTML never disagree.
 */

function secondsUntilCampfireMidnight(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CAMPFIRE_TIME_ZONE,
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(now);

  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  const elapsed = get("hour") * 3600 + get("minute") * 60 + get("second");
  return 24 * 3600 - elapsed;
}

function formatRemaining(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CampfireCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setRemaining(secondsUntilCampfireMidnight());
    const interval = window.setInterval(() => {
      setRemaining(secondsUntilCampfireMidnight());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <p className="font-figtree text-[10px] uppercase tracking-[0.3em] text-brand-100/45 md:text-[11px]">
      The fire goes out in{" "}
      <span
        className="tabular-nums text-ember/90"
        suppressHydrationWarning
      >
        {remaining === null ? "…" : formatRemaining(remaining)}
      </span>
    </p>
  );
}
