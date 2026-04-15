"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function CTASection() {
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

      const data = await res.json();

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

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-[#e4efe8] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] px-8 py-20 text-center md:px-20 md:py-28">
          {/* Layered backgrounds */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-900" />
          <div
            aria-hidden
            className="float-slow absolute -top-32 left-1/2 -z-10 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-brand-500/30 blur-[120px]"
          />
          <div
            aria-hidden
            className="float-slow absolute -bottom-40 right-0 -z-10 h-[26rem] w-[26rem] rounded-full bg-brand-200/15 blur-[100px]"
            style={{ animationDelay: "-5s" }}
          />
          <div className="grain" />

          <div className="relative mx-auto max-w-2xl">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-brand-200/50" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-200">
                Newsletter
              </p>
              <span className="h-px w-10 bg-brand-200/50" />
            </div>

            <h2 className="mt-8 text-4xl leading-[1.02] tracking-[-0.02em] text-white md:text-[3.6rem]">
              Ready to connect{" "}
              <span className="font-display font-normal italic text-brand-200">
                for real
              </span>
              ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              Join our community and get weekly inspiration, resources, and
              stories delivered to your inbox. No spam, just genuine content.
            </p>

            {state === "success" ? (
              <div className="mt-12 inline-flex items-center gap-3 rounded-full border border-brand-200/40 bg-brand-200/15 px-6 py-3.5 text-brand-100 backdrop-blur-md">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                You&apos;re in! Check your inbox for a welcome note.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-12 flex max-w-lg flex-col gap-2 rounded-full border border-white/15 bg-white/[0.06] p-2 backdrop-blur-md transition-colors duration-300 focus-within:border-white/40 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={state === "loading"}
                  className="flex-1 rounded-full bg-transparent px-6 py-3 text-sm text-white placeholder-white/40 outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-700 transition-all duration-300 hover:bg-brand-50 hover:shadow-[0_18px_40px_-15px_rgba(0,0,0,0.5)] disabled:opacity-60 disabled:hover:bg-white"
                >
                  {state === "loading" ? (
                    <>
                      <svg
                        className="h-3.5 w-3.5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Joining...
                    </>
                  ) : (
                    <>
                      Subscribe
                      <svg
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}

            {state === "error" && (
              <p className="mt-4 text-sm text-red-300">{errorMsg}</p>
            )}

            <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.24em] text-white/40">
              No spam · Unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
