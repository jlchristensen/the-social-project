import type { Resource } from "@/data/resources";

const typeLabels: Record<string, string> = {
  guide: "Guide",
  worksheet: "Worksheet",
  video: "Video",
  book: "Book List",
};

export default function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <a
      href={resource.link}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5"
    >
      <div className="flex items-start justify-between">
        <span className="text-3xl">{resource.icon}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {typeLabels[resource.type]}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 transition-colors group-hover:text-brand-600">
        {resource.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {resource.description}
      </p>
      <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700">
        Get resource
        <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </a>
  );
}
