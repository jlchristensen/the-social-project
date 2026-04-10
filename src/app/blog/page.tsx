import { blogPosts } from "@/data/blog-posts";
import BlogCard from "@/components/blog/BlogCard";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = {
  title: "Blog — The Social Project",
  description:
    "Stories, guides, and ideas about human connection, authenticity, and intentional living.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        title="The Blog"
        subtitle="Stories, guides, and ideas to help you connect more deeply, live more authentically, and build the relationships that matter."
      />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
