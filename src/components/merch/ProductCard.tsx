import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-brand-50/10 bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-ember/30 hover:bg-white/[0.05] hover:shadow-[0_30px_60px_-25px_rgba(232,184,106,0.15)]">
      {/* Image placeholder */}
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-[#04130a]">
        <div className="flex h-full items-center justify-center text-6xl text-brand-50/15">
          <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
          </svg>
        </div>
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-ember px-3 py-1 text-xs font-semibold text-brand-900">
            {product.badge}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-brand-200 uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="mt-1 text-base font-semibold text-brand-50 transition-colors group-hover:text-ember">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-50/65">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-brand-50">
            ${product.price}
          </span>
          <button className="rounded-full bg-ember px-5 py-2 text-xs font-semibold text-brand-900 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(245,210,139,0.4)]">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
