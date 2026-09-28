import ProductCard from "@/components/products/ProductCard";
import Reveal from "@/components/ui/Reveal";
import type { Product } from "@/lib/types/product";

type RelatedProductsProps = {
  products: Product[];
};

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-zinc-200 py-16 sm:py-20">
      <div className="site-container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 sm:text-sm">
            Torque — Ride With Confidence
          </p>

          <h2 className="mt-3 text-3xl leading-tight text-black sm:text-4xl">
            <span className="font-bold">Providing</span>{" "}
            <span className="font-medium">Quality Products</span>{" "}
            <span className="font-bold">For</span>
            <br />
            <span className="font-bold">Every Procedure</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 min-[360px]:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
          {products.map((product) => (
            <Reveal key={product.id}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
