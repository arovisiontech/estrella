import Link from "next/link";
import ProductImageSwitcher from "@/components/products/ProductImageSwitcher";
import type { Product, ProductImage } from "@/lib/types/product";
import type { AdaptedProduct } from "@/lib/cms/types";

type ProductCardProps = {
  product: Product | AdaptedProduct | any;
  priority?: boolean;
};


export default function ProductCard({ product, priority = false }: ProductCardProps) {
  if (!product) return null;

  const extractSrc = (val: any): string => {
    if (!val) return "";
    if (typeof val === "string") return val.trim();
    if (typeof val === "object") {
      return (val.src || val.url || val.image_url || val.imageUrl || "").trim();
    }
    return "";
  };

  const isLegacy = (url: string) =>
    url.startsWith("/images/image 15") ||
    url.startsWith("/images/Products-") ||
    url === "/images/banner.png" ||
    url === "/images/placeholder.png";

  const rawMain =
    extractSrc(product.mainImage) ||
    extractSrc(product.main_image_url) ||
    extractSrc(product.primary_image) ||
    extractSrc(product.source_data?.mainImage) ||
    extractSrc(product.source_data?.primary_image) ||
    "/images/banner-sublimation-sports.svg";

  let rawHover =
    extractSrc(product.hoverImage) ||
    extractSrc(product.hover_image_url) ||
    extractSrc(product.hover_image) ||
    extractSrc(product.source_data?.hoverImage) ||
    extractSrc(product.source_data?.hover_image);

  const rawThumbsList: any[] = [];
  if (Array.isArray(product.thumbnails)) rawThumbsList.push(...product.thumbnails);
  if (Array.isArray(product.galleryImages)) rawThumbsList.push(...product.galleryImages);
  if (Array.isArray(product.gallery_images)) rawThumbsList.push(...product.gallery_images);
  if (Array.isArray(product.source_data?.galleryImages)) rawThumbsList.push(...product.source_data.galleryImages);
  if (Array.isArray(product.source_data?.highlights)) rawThumbsList.push(...product.source_data.highlights);

  // Use product thumbnail alternate view if available, otherwise keep rawMain (smooth zoom on hover)
  if (!rawHover || rawHover === rawMain) {
    const thumbCandidates = rawThumbsList
      .map(extractSrc)
      .filter((src) => src && src !== rawMain && !isLegacy(src));
    if (thumbCandidates.length > 0) {
      rawHover = thumbCandidates[0];
    } else {
      rawHover = rawMain;
    }
  }

  const mainImage: ProductImage = {
    src: rawMain,
    alt: product.mainImage?.alt || product.name || "Product",
  };

  const hoverImage: ProductImage = {
    src: rawHover,
    alt: product.hoverImage?.alt || product.name || "Product",
  };

  const hasRealImage = !isLegacy(rawMain) || !isLegacy(rawHover);

  const seenUrls = new Set<string>();
  const thumbnails: ProductImage[] = [];

  for (const item of rawThumbsList) {
    const src = extractSrc(item);
    if (!src) continue;
    if (hasRealImage && isLegacy(src)) continue;
    if (!seenUrls.has(src)) {
      seenUrls.add(src);
      thumbnails.push({ src, alt: item?.alt || product.name || "Product" });
    }
  }

  return (
    <article className="flex h-full flex-col">
      <ProductImageSwitcher
        href={`/products/${product.slug}`}
        name={product.name || "Product"}
        mainImage={mainImage}
        hoverImage={hoverImage}
        thumbnails={thumbnails}
        priority={priority}
      />

      <div className="mt-4 flex flex-1 flex-col items-center px-1 text-center">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-bold uppercase tracking-wide text-black transition hover:text-[#00AEF0] sm:text-[16px]"
        >
          {product.name}
        </Link>

        {product.sku && <p className="mt-1 text-xs text-zinc-500">SKU: {product.sku}</p>}
      </div>
    </article>
  );
}
