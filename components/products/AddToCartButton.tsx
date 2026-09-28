"use client";

import { cn } from "@/lib/utils/cn";
import { useCart } from "@/lib/cart/CartContext";
import type { Product } from "@/lib/types/product";

type AddToCartButtonProps = {
  product: Product;
  selectedSizeId?: string;
  quantity: number;
  variant?: "primary" | "secondary";
  label?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};

export default function AddToCartButton({
  product,
  selectedSizeId,
  quantity,
  variant = "primary",
  label = "Add to Cart",
  onSuccess,
  onError,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  const outOfStock = product.stockQuantity <= 0;

  const handleClick = () => {
    if (outOfStock) return;

    if (product.sizes.length > 0 && !selectedSizeId) {
      onError?.("Please select a size before adding to cart.");
      return;
    }

    if (quantity <= 0) {
      onError?.("Quantity must be at least 1.");
      return;
    }

    if (quantity > product.stockQuantity) {
      onError?.(`Only ${product.stockQuantity} left in stock.`);
      return;
    }

    const sizeLabel = product.sizes.find((size) => size.id === selectedSizeId)?.label;

    // NOTE: unitPrice here is for cart-display purposes only. Real order
    // totals must always be recalculated server-side from the product
    // record at checkout time — never trust a client-supplied price.
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      size: sizeLabel,
      quantity,
      unitPrice: product.salePrice ?? product.price,
      image: product.mainImage.src,
    });

    onSuccess?.(`Inquiry sent for ${product.name}.`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={outOfStock}
      className={cn(
        "flex min-h-12 w-full flex-1 items-center justify-center px-6 text-sm font-bold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-40 rounded-sm shadow-md",
        variant === "primary"
          ? "bg-[#00AEF0] text-white hover:bg-[#0090c8] hover:shadow-lg"
          : "border border-black text-black hover:bg-black hover:text-white"
      )}
    >
      {outOfStock ? "Out of Stock" : label}
    </button>
  );
}
