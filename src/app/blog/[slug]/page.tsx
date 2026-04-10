import { blogPosts } from "@/data/blog-posts";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) return { title: "Not Found" };
    return {
      title: `${post.title} — The Social Project`,
      description: post.excerpt,
    };
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <>
      {/* Green header matching other pages */}
      <div className="bg-brand-700 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back to Blog
          </Link>

          <div className="mt-6 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
            {post.category}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-white/60">
            <span>{post.author}</span>
            <span>&middot;</span>
            <span>{post.date}</span>
            <span>&middot;</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand-600 hover:prose-a:text-brand-700 prose-strong:text-slate-900">
            {post.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={i} className="mt-10 mb-4 text-2xl font-bold text-slate-900">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("1. ") || paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").filter(Boolean);
                const isOrdered = paragraph.startsWith("1. ");
                const ListTag = isOrdered ? "ol" : "ul";
                return (
                  <ListTag key={i} className={`my-4 space-y-2 ${isOrdered ? "list-decimal" : "list-disc"} pl-6`}>
                    {items.map((item, j) => (
                      <li key={j} className="text-slate-600">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item
                              .replace(/^\d+\.\s*/, "")
                              .replace(/^-\s*/, "")
                              .replace(
                                /\*\*(.+?)\*\*/g,
                                '<strong class="text-slate-900">$1</strong>'
                              ),
                          }}
                        />
                      </li>
                    ))}
                  </ListTag>
                );
              }
              return (
                <p key={i} className="my-4 leading-relaxed text-slate-600">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-16 border-t border-slate-200 pt-8">
            <Link
              href="/blog"
              className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              &larr; Back to all posts
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
