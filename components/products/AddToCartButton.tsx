"use client";

import { cn } from "@/lib/utils/cn";
import { useCart } from "@/lib/cart/CartContext";
import type { Product } from "@/lib/types/product";

type AddToCartButtonProps = {
  product: Product | any;
  selectedSizeId?: string;
  selectedColor?: string;
  quantity: number;
  variant?: "primary" | "secondary";
  label?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};

export default function AddToCartButton({
  product,
  selectedSizeId,
  selectedColor,
  quantity = 1,
  variant = "primary",
  label = "Add to Cart",
  onSuccess,
  onError,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  // For B2B / OEM custom manufacturing inquiry, products are manufactured to order
  const isAvailable = product?.isActive !== false;

  const handleClick = () => {
    if (!isAvailable) {
      onError?.("This product is currently inactive.");
      return;
    }

    const safeQty = Math.max(1, quantity || 1);

    // Resolve size label
    let sizeLabel = selectedSizeId;
    if (!sizeLabel && Array.isArray(product?.sizes) && product.sizes.length > 0) {
      const first = product.sizes[0];
      sizeLabel = typeof first === "string" ? first : first.label || first.name || first.id;
    }

    // Resolve color label
    let colorLabel = selectedColor;
    if (!colorLabel && Array.isArray(product?.colors) && product.colors.length > 0) {
      const first = product.colors[0];
      colorLabel = typeof first === "string" ? first : first.name || first.label || String(first);
    }

    const imgSrc =
      product.mainImage?.src ||
      (typeof product.mainImage === "string" ? product.mainImage : null) ||
      product.main_image_url ||
      product.image ||
      product.galleryImages?.[0]?.src ||
      "/images/banner-sublimation-sports.svg";

    addItem({
      productId: product.id || String(product.sku || "product"),
      slug: product.slug || "",
      name: product.name || "Custom Product",
      sku: product.sku || "",
      size: sizeLabel || "Standard",
      color: colorLabel || "Default",
      quantity: safeQty,
      unitPrice: product.salePrice ?? product.price ?? 0,
      image: imgSrc,
    });

    onSuccess?.(`Added ${product.name} to Inquiry Cart!`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isAvailable}
      className={cn(
        "flex min-h-12 w-full flex-1 items-center justify-center px-6 text-sm font-bold uppercase tracking-wider transition rounded-sm shadow-md cursor-pointer",
        variant === "primary"
          ? "bg-[#00AEF0] text-white hover:bg-[#0090c8] hover:shadow-lg active:scale-[0.99]"
          : "border border-black text-black hover:bg-black hover:text-white"
      )}
    >
      {label}
    </button>
  );
}
