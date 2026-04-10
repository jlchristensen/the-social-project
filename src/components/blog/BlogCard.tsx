import Link from "next/link";
import type { BlogPost } from "@/data/blog-posts";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5">
        <div className="mb-4 inline-flex self-start rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          {post.category}
        </div>
        <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-brand-600">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
          {post.excerpt}
        </p>
        <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
          <span>{post.date}</span>
          <span>&middot;</span>
          <span>{post.readTime}</span>
        </div>
      </article>
    </Link>
  );
}
