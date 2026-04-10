import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white transition-all hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5">
      {/* Image placeholder */}
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-slate-100">
        <div className="flex h-full items-center justify-center text-6xl text-slate-300">
          <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
          </svg>
        </div>
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          {product.category}
        </p>
        <h3 className="mt-1 text-base font-semibold text-slate-900 transition-colors group-hover:text-brand-600">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            ${product.price}
          </span>
          <button className="rounded-full bg-brand-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
