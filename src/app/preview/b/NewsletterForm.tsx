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
      <p className="b-form-success" role="status">
        You’re in! Check your inbox for a welcome note.
      </p>
    );
  }

  return (
    <>
      <form className="b-form" onSubmit={handleSubmit}>
        <label htmlFor="b-email" className="b-visually-hidden">
          Email address
        </label>
        <input
          id="b-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={state === "loading"}
          className="b-input"
        />
        <button type="submit" className="b-btn" disabled={state === "loading"}>
          {state === "loading" ? "Joining…" : "Subscribe"}
        </button>
      </form>
      {state === "error" && (
        <p className="b-form-error" role="alert">
          {errorMsg}
        </p>
      )}
    </>
  );
}
