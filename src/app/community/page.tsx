"use client";

import { useState } from "react";
import { communityPosts } from "@/data/community-posts";
import PostCard from "@/components/community/PostCard";
import PageHeader from "@/components/ui/PageHeader";

function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8">
      {/* Disabled post prompt */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 opacity-50">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
            You
          </div>
          <div className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-400">
            Share something with the community...
          </div>
        </div>
      </div>

      {/* Coming soon card */}
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center md:p-14">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
          <svg
            className="h-7 w-7 text-brand-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          The community is coming soon
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          We&apos;re building a space for real stories, honest questions, and
          people who are choosing connection over convenience. Sign up to be
          part of it from the start.
        </p>

        {submitted ? (
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-50 px-5 py-3 text-sm font-medium text-brand-700">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
            We&apos;ll let you know when the community launches!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-2 rounded-full border border-slate-200 p-1.5 transition-colors focus-within:border-brand-300 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded-full bg-transparent px-5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Notify me
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const hasPosts = communityPosts.length > 0;

  return (
    <>
      <PageHeader
        title="Community"
        subtitle="Real stories from real people choosing connection over convenience. This is your space — share, ask, and show up."
      />
      <section className="py-16 md:py-20">
        {hasPosts ? (
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
                  You
                </div>
                <div className="flex-1 cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-400 transition-colors hover:border-brand-300">
                  Share something with the community...
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-6">
              {communityPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <button className="rounded-full border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700">
                Load more posts
              </button>
            </div>
          </div>
        ) : (
          <ComingSoon />
        )}
      </section>
    </>
  );
}
