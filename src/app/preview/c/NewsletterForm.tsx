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
      <div className="c-form-success" role="status">
        <span className="c-fire-dot" aria-hidden="true" />
        You&apos;re in. Check your inbox for a welcome note.
      </div>
    );
  }

  return (
    <div>
      <form className="c-form" onSubmit={handleSubmit}>
        <label htmlFor="c-newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="c-newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={state === "loading"}
          autoComplete="email"
        />
        <button
          type="submit"
          className="c-btn c-btn-line"
          disabled={state === "loading"}
        >
          {state === "loading" ? "Joining…" : "Subscribe"}
        </button>
      </form>
      {state === "error" && <p className="c-form-error">{errorMsg}</p>}
      <p className="c-form-note">No spam &middot; Unsubscribe anytime</p>
    </div>
  );
}
