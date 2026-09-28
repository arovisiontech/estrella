"use client";

import type { Product } from "@/lib/types/product";

type ProductTabsProps = {
  product: Product | any;
};

export default function ProductTabs({ product }: ProductTabsProps) {
  if (!product) return null;

  return (
    <div className="mt-8 border-t border-zinc-200 pt-6">
      {/* Description Header Button matching SS 5 */}
      <div className="flex gap-3">
        <button
          type="button"
          className="px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider border-2 border-[#00AEF0] text-black bg-white shadow-sm"
        >
          Description
        </button>
      </div>

      {/* Description Content */}
      <div className="py-6 space-y-4">
        {product.description ? (
          <div
            className="rich-description prose max-w-none text-sm leading-relaxed text-zinc-800"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        ) : (
          <p className="text-sm text-zinc-600 leading-relaxed">
            {product.shortDescription ||
              `High quality ${product.name} custom engineered for optimal comfort, performance, and long-lasting durability.`}
          </p>
        )}
      </div>
    </div>
  );
}
