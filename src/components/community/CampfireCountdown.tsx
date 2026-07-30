"use client";

import { useEffect, useState } from "react";
import { secondsUntilCampfireMidnight } from "@/lib/campfire";

/**
 * Live countdown to midnight on the campfire clock (Central), when tonight's
 * question rolls over. Renders a static fallback until mounted so server and
 * client HTML never disagree.
 */

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
