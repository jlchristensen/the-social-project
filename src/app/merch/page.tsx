import { products } from "@/data/products";
import ProductCard from "@/components/merch/ProductCard";
import PageHeader from "@/components/ui/PageHeader";

export const metadata = {
  title: "The Gift Shop — The Social Project",
  description:
    "Wear the mission. Conversation cards, apparel, and goods that spark real connection.",
};

export default function MerchPage() {
  return (
    <>
      <PageHeader
        title="The Gift Shop"
        subtitle="Wear the mission. Every purchase supports the community and sparks conversations that matter."
      />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Products grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Shipping note */}
          <div className="mt-16 rounded-2xl border border-brand-50/10 bg-white/[0.03] p-8 text-center">
            <p className="text-sm font-medium text-brand-50">
              Free shipping on orders over $50
            </p>
            <p className="mt-1 text-sm text-brand-50/55">
              All items ship within 3-5 business days. 100% satisfaction
              guaranteed.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
