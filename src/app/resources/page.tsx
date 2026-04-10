"use client";

import { useState } from "react";
import { resources, resourceCategories } from "@/data/resources";
import ResourceCard from "@/components/resources/ResourceCard";
import PageHeader from "@/components/ui/PageHeader";

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? resources
      : resources.filter((r) => r.category === activeCategory);

  return (
    <>
      <PageHeader
        title="Resources"
        subtitle="Free tools, guides, and worksheets to help you build real connections and live more authentically."
      />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {resourceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                    : "border-slate-300 text-slate-600 hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
