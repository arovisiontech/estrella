"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useToast } from "@/lib/hooks/useToast";
import Toast from "@/components/ui/Toast";
import AddToCartButton from "@/components/products/AddToCartButton";
import SizeChartModal from "@/components/products/SizeChartModal";
import type { Product } from "@/lib/types/product";

type ProductInfoPanelProps = {
  product: Product | any;
};

export default function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  const { message, variant, visible, showToast } = useToast();

  if (!product) return null;

  const rawColors = Array.isArray(product.colors) ? product.colors : [];
  const parsedColors: string[] = rawColors.map((c: any) => (typeof c === "string" ? c : c.label || c.name || String(c)));
  const colorsList = parsedColors.length > 0 ? parsedColors : ["RED", "GREEN", "BLUE", "BLACK"];

  const rawSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const parsedSizes: string[] = rawSizes.map((s: any) => (typeof s === "string" ? s : s.label || s.name || String(s)));
  const sizesList = parsedSizes.length > 0 ? parsedSizes : ["SMALL LEFT", "MEDIUM RIGHT", "LARGE LEFT"];

  const categoryLabel = product.categoryLabel || product.categoryName || product.category || "Products";

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00AEF0]">
        {categoryLabel}
      </p>

      <h1 className="mt-2 text-2xl font-bold text-black sm:text-3xl">{product.name}</h1>

      {product.sku && <p className="mt-1 text-sm font-medium text-zinc-500">SKU: {product.sku}</p>}

      {/* Color selector */}
      {colorsList.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-black">
            Color
            {selectedColor && <span className="ml-1 font-normal text-zinc-500">— {selectedColor}</span>}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {colorsList.map((color, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedColor(color)}
                aria-pressed={selectedColor === color}
                className={cn(
                  "flex h-9 items-center justify-center border px-3.5 text-xs font-semibold uppercase tracking-wider transition rounded-sm",
                  selectedColor === color
                    ? "border-[#00AEF0] bg-[#00AEF0] text-white"
                    : "border-zinc-300 text-black hover:border-black hover:bg-zinc-50"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size selector */}
      {sizesList.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-black">
              Size
              {selectedSize && <span className="ml-1 font-normal text-zinc-500">— {selectedSize}</span>}
            </p>
            <button
              type="button"
              onClick={() => setSizeChartOpen(true)}
              className="text-xs font-medium text-black underline underline-offset-2 transition hover:text-[#00AEF0]"
            >
              Size Guide
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {sizesList.map((size, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                className={cn(
                  "flex h-9 items-center justify-center border px-3.5 text-xs font-semibold uppercase tracking-wider transition rounded-sm",
                  selectedSize === size
                    ? "border-[#00AEF0] bg-[#00AEF0] text-white"
                    : "border-zinc-300 text-black hover:border-black hover:bg-zinc-50"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action */}
      <div className="mt-6">
        <AddToCartButton
          product={product}
          selectedSizeId={selectedSize}
          quantity={1}
          variant="primary"
          label="Add To Inquiry"
          onSuccess={(msg) => showToast(msg, "success")}
          onError={(msg) => showToast(msg, "error")}
        />
      </div>

      <SizeChartModal isOpen={sizeChartOpen} onClose={() => setSizeChartOpen(false)} />
      <Toast message={message} variant={variant} visible={visible} />
    </div>
  );
}
