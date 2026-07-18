"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: { error?: string } = await res.json();

      if (!res.ok) {
        setState("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }

      setState("success");
      setEmail("");
    } catch {
      setState("error");
      setErrorMsg("Could not connect. Please check your internet and try again.");
    }
  };

  if (state === "success") {
    return (
      <div className="a-cta-success" role="status">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        You&apos;re in! Check your inbox for a welcome note.
      </div>
    );
  }

  return (
    <>
      <form className="a-cta-form" onSubmit={handleSubmit}>
        <label className="a-sr-only" htmlFor="a-newsletter-email">
          Email address
        </label>
        <input
          id="a-newsletter-email"
          className="a-cta-input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={state === "loading"}
        />
        <button className="a-btn a-btn-primary" type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Joining..." : "Subscribe"}
        </button>
      </form>
      {state === "error" && <p className="a-cta-error">{errorMsg}</p>}
    </>
  );
}
