import { communityPosts } from "@/data/community-posts";
import PostCard from "@/components/community/PostCard";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = {
  title: "Community — The Social Project",
  description:
    "Join the conversation. Share your stories, ask questions, and connect with others who are choosing real over perfect.",
};

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        title="Community"
        subtitle="Real stories from real people choosing connection over convenience. This is your space — share, ask, and show up."
      />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Post prompt */}
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

          {/* Posts */}
          <div className="mt-8 space-y-6">
            {communityPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Load more */}
          <div className="mt-12 text-center">
            <button className="rounded-full border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700">
              Load more posts
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
