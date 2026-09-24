"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/site";

/**
 * "Send tonight's question to a friend."
 *
 * The question is the best ad we have, and the group chat is where it lands.
 * On phones this opens the native share sheet; on desktop it copies the
 * question and link. The `?ref=share` tag is how sign-ups from shares get
 * counted (see `lib/signupSource.ts`).
 */
export default function ShareQuestion({ question }: { question: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${SITE_URL}/?ref=share`;

    if (navigator.share) {
      try {
        await navigator.share({ text: question, url });
      } catch {
        // They closed the share sheet. Nothing to do.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${question}\n${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard blocked. Rare enough to not need a fallback UI.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 font-figtree text-sm font-medium text-brand-200 transition-colors hover:text-ember"
    >
      {copied ? "Copied. Paste it in the group chat" : "Send tonight's question to a friend"}
      <svg
        className="h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </button>
  );
}
