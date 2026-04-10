import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = {
  title: "About — The Social Project",
  description:
    "We're on a mission to ignite human connection and inspire authenticity. Learn our story.",
};

const values = [
  {
    title: "People Over Platforms",
    description:
      "Technology should bring us together, not replace togetherness. We use digital tools to inspire offline connection.",
  },
  {
    title: "Authenticity Over Performance",
    description:
      "We believe the world needs more real people, not more personal brands. Being yourself is always enough.",
  },
  {
    title: "Progress Over Perfection",
    description:
      "Building better social habits is a practice, not a destination. We celebrate small wins and honest effort.",
  },
  {
    title: "Inclusion Over Exclusion",
    description:
      "Connection is a universal need. Our community is open to everyone regardless of background, personality type, or social comfort level.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About The Social Project"
        subtitle="We started The Social Project because we noticed something: in a world more &ldquo;connected&rdquo; than ever, people feel lonelier than ever. We wanted to do something about it."
      />

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Our Story
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
            <p>
              It started with a simple observation: the most meaningful moments in
              our lives don&apos;t happen on screens. They happen across dinner
              tables, on long walks, in honest conversations where someone says
              &ldquo;me too.&rdquo;
            </p>
            <p>
              Yet somewhere along the way, we traded depth for convenience. We
              replaced phone calls with likes, gatherings with group chats, and
              vulnerability with curated feeds. We became experts at performing
              connection without actually experiencing it.
            </p>
            <p>
              The Social Project exists to reverse that trend. We&apos;re building
              a community, a resource library, and a movement that helps people —
              especially young adults navigating post-college life — rediscover
              the power of genuine human connection.
            </p>
            <p>
              We don&apos;t have all the answers. But we believe that showing up,
              being real, and choosing people over pixels is a pretty good place
              to start.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gradient-to-b from-brand-50 via-brand-100/40 to-brand-50/30 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              What We Believe
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              These values guide everything we create, share, and build.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-200 bg-white p-8"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Join the movement
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Whether you&apos;re an extrovert looking for deeper connections or an
            introvert taking your first steps — you belong here.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/community"
              className="w-full rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 sm:w-auto"
            >
              Join the Community
            </Link>
            <Link
              href="/resources"
              className="w-full rounded-full border border-slate-300 px-8 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700 sm:w-auto"
            >
              Explore Resources
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
