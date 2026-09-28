import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/lib/types/product";

type CategoryProductGridProps = {
  products: Product[];
};

export default function CategoryProductGrid({ products }: CategoryProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="col-span-full py-12 text-center">
        <p className="text-lg text-zinc-600">No products available in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-6 sm:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
