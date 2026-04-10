import type { CommunityPost } from "@/data/community-posts";

const tagColors: Record<string, string> = {
  Story: "bg-blue-50 text-blue-700",
  Community: "bg-brand-50 text-brand-700",
  "Digital Wellness": "bg-purple-50 text-purple-700",
  Question: "bg-amber-50 text-amber-700",
  Authenticity: "bg-rose-50 text-rose-700",
};

export default function PostCard({ post }: { post: CommunityPost }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5">
      {/* Author row */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
          {post.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{post.author}</p>
          <p className="text-xs text-slate-400">{post.date}</p>
        </div>
        <span
          className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ${tagColors[post.tag] ?? "bg-slate-50 text-slate-600"}`}
        >
          {post.tag}
        </span>
      </div>

      {/* Content */}
      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        {post.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">
        {post.content}
      </p>

      {/* Engagement */}
      <div className="mt-6 flex items-center gap-6 border-t border-slate-100 pt-4 text-xs text-slate-400">
        <button className="flex items-center gap-1.5 transition-colors hover:text-brand-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          {post.likes}
        </button>
        <button className="flex items-center gap-1.5 transition-colors hover:text-brand-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
          {post.comments}
        </button>
        <button className="ml-auto transition-colors hover:text-brand-600">
          Share
        </button>
      </div>
    </article>
  );
}
