"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Plus, Minus, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useToast } from "@/lib/hooks/useToast";
import { useCart } from "@/lib/cart/CartContext";
import Toast from "@/components/ui/Toast";
import AddToCartButton from "@/components/products/AddToCartButton";
import SizeChartModal from "@/components/products/SizeChartModal";
import type { Product } from "@/lib/types/product";

type ProductInfoPanelProps = {
  product: Product | any;
};

export default function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const rawColors = Array.isArray(product?.colors) ? product.colors : [];
  const parsedColors: string[] = rawColors.map((c: any) => (typeof c === "string" ? c : c.label || c.name || String(c)));
  const colorsList = parsedColors.length > 0 ? parsedColors : ["RED", "GREEN", "BLUE", "BLACK"];

  const rawSizes = Array.isArray(product?.sizes) ? product.sizes : [];
  const parsedSizes: string[] = rawSizes.map((s: any) => (typeof s === "string" ? s : s.label || s.name || String(s)));
  const sizesList = parsedSizes.length > 0 ? parsedSizes : ["SMALL LEFT", "MEDIUM RIGHT", "LARGE LEFT"];

  const [selectedSize, setSelectedSize] = useState<string>(sizesList[0] || "Standard");
  const [selectedColor, setSelectedColor] = useState<string>(colorsList[0] || "Default");
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  const { message, variant, visible, showToast } = useToast();
  const { itemCount } = useCart();

  if (!product) return null;

  const categoryLabel = product.categoryLabel || product.categoryName || product.category || "Products";

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Estrella International Team,\n\nI am interested in inquiring about:\n• Product: ${product.name}\n• SKU: ${product.sku || "N/A"}\n• Color: ${selectedColor}\n• Size: ${selectedSize}\n• Quantity: ${quantity} units\n\nPlease share wholesale pricing and production timeline.`
    );
    window.open(`https://wa.me/923000000000?text=${text}`, "_blank");
  };

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
            {selectedColor && <span className="ml-1 font-semibold text-[#00AEF0]">— {selectedColor}</span>}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {colorsList.map((color, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedColor(color)}
                aria-pressed={selectedColor === color}
                className={cn(
                  "flex h-9 items-center justify-center border px-3.5 text-xs font-semibold uppercase tracking-wider transition rounded-sm cursor-pointer",
                  selectedColor === color
                    ? "border-[#00AEF0] bg-[#00AEF0] text-white shadow-xs"
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
              {selectedSize && <span className="ml-1 font-semibold text-[#00AEF0]">— {selectedSize}</span>}
            </p>
            <button
              type="button"
              onClick={() => setSizeChartOpen(true)}
              className="text-xs font-medium text-black underline underline-offset-2 transition hover:text-[#00AEF0] cursor-pointer"
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
                  "flex h-9 items-center justify-center border px-3.5 text-xs font-semibold uppercase tracking-wider transition rounded-sm cursor-pointer",
                  selectedSize === size
                    ? "border-[#00AEF0] bg-[#00AEF0] text-white shadow-xs"
                    : "border-zinc-300 text-black hover:border-black hover:bg-zinc-50"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity / Number selector */}
      <div className="mt-6">
        <p className="text-sm font-medium text-black mb-2">
          Number of Pieces / Quantity
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-zinc-300 rounded-sm bg-white overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-zinc-600 hover:bg-zinc-100 hover:text-black transition cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus size={15} />
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center text-sm font-bold text-black border-x border-zinc-200 py-2 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 text-zinc-600 hover:bg-zinc-100 hover:text-black transition cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            (Custom bulk orders supported)
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <AddToCartButton
          product={product}
          selectedSizeId={selectedSize}
          selectedColor={selectedColor}
          quantity={quantity}
          variant="primary"
          label="Add to Cart"
          onSuccess={(msg) => showToast(msg, "success")}
          onError={(msg) => showToast(msg, "error")}
        />

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-900 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider rounded-sm transition shadow-sm"
          >
            <ShoppingCart size={15} />
            View Inquiry Cart ({itemCount})
          </Link>

          <button
            type="button"
            onClick={handleWhatsAppDirect}
            className="flex items-center justify-center gap-1.5 px-4 py-3 border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold uppercase tracking-wider rounded-sm transition shadow-sm cursor-pointer whitespace-nowrap"
            title="Direct WhatsApp Inquiry"
          >
            <MessageSquare size={15} />
            WhatsApp
          </button>
        </div>
      </div>

      <SizeChartModal isOpen={sizeChartOpen} onClose={() => setSizeChartOpen(false)} />
      <Toast message={message} variant={variant} visible={visible} />
    </div>
  );
}
