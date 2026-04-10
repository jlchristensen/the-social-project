"use client";

import { useState } from "react";
import { blogPosts } from "@/data/blog-posts";
import BlogCard from "@/components/blog/BlogCard";
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
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 md:p-14">
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            The blog is coming soon
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            We&apos;re working on stories, guides, and ideas about human
            connection, authenticity, and intentional living. Be the first to
            know when we publish.
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
              We&apos;ll let you know when the blog launches!
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
    </section>
  );
}

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="The Blog"
        subtitle="Stories, guides, and ideas to help you connect more deeply, live more authentically, and build the relationships that matter."
      />

      {blogPosts.length === 0 ? (
        <ComingSoon />
      ) : (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
