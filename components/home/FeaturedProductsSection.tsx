import ProductCard from "@/components/products/ProductCard";
import { Reveal, StaggerGroup } from "@/components/motion";
import { getFeaturedProducts } from "@/lib/cms/products";

export default async function FeaturedProductsSection() {
  const products = (await getFeaturedProducts()).slice(0, 5);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="site-container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 sm:text-sm">
            Torque — Ride With Confidence
          </p>

          <h2 className="mt-3 text-3xl leading-tight text-black sm:text-4xl lg:text-[44px]">
            <span className="font-bold">Providing</span>{" "}
            <span className="font-medium">Quality Products</span>{" "}
            <span className="font-bold">For</span>
            <br />
            <span className="font-bold">Every Procedure</span>
          </h2>
        </Reveal>

        <StaggerGroup
          className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 min-[360px]:grid-cols-2 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-5 lg:mt-16"
          variant="small"
        >
          {products.map((product) => (
            <Reveal key={product.id} variant="fadeUp">
              <ProductCard product={product as any} />
            </Reveal>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
