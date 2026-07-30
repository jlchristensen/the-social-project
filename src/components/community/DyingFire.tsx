"use client";

import { useEffect, useState } from "react";
import { secondsUntilCampfireMidnight } from "@/lib/campfire";

/**
 * The dying fire — as midnight closes in, the scene itself darkens.
 *
 * In the final two hours a vignette creeps in from the edges and the embers
 * fade (via a body attribute the CSS reads), so the deadline is something you
 * feel before you read it. Renders nothing outside the window.
 */

/** The fire starts visibly dying this many seconds before midnight. */
const DYING_WINDOW_S = 2 * 3600;

/** How dark the vignette gets at the stroke of midnight. */
const MAX_DIMNESS = 0.55;

export default function DyingFire() {
  const [dimness, setDimness] = useState(0);

  useEffect(() => {
    function update() {
      const remaining = secondsUntilCampfireMidnight();
      if (remaining > DYING_WINDOW_S) {
        setDimness(0);
        return;
      }
      const progress = 1 - remaining / DYING_WINDOW_S;
      setDimness(progress * MAX_DIMNESS);
    }

    update();
    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dimness > 0) {
      document.body.setAttribute("data-fire-dying", "true");
    } else {
      document.body.removeAttribute("data-fire-dying");
    }
    return () => document.body.removeAttribute("data-fire-dying");
  }, [dimness]);

  if (dimness === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-[3000ms]"
      style={{
        opacity: dimness,
        background:
          "radial-gradient(120% 90% at 50% 45%, transparent 30%, rgba(1, 8, 4, 0.9) 100%)",
      }}
    />
  );
}
