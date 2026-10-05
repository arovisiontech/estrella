"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { ProductImage } from "@/lib/types/product";
import { getImageKey } from "@/lib/cms/types";

const MAX_VISIBLE_THUMBS = 3;

type ProductImageSwitcherProps = {
  href: string;
  name: string;
  mainImage?: ProductImage;
  hoverImage?: ProductImage;
  thumbnails?: ProductImage[];
  priority?: boolean;
};

export default function ProductImageSwitcher({
  href,
  name,
  mainImage,
  hoverImage,
  thumbnails = [],
  priority = false,
}: ProductImageSwitcherProps) {
  const [hovering, setHovering] = useState(false);
  const [activeThumb, setActiveThumb] = useState<string | null>(null);

  const extractSrc = (img: any): string => {
    if (!img) return "/images/banner-sublimation-sports.svg";
    if (typeof img === "string" && img.trim().length > 0) return img.trim();
    if (typeof img === "object") {
      const src = img.src || img.url || img.image_url;
      if (typeof src === "string" && src.trim().length > 0) return src.trim();
    }
    return "/images/banner-sublimation-sports.svg";
  };

  const safeMain: ProductImage = {
    src: extractSrc(mainImage),
    alt: mainImage?.alt || name || "Product",
  };

  const safeHover: ProductImage = hoverImage
    ? { src: extractSrc(hoverImage), alt: hoverImage.alt || safeMain.alt }
    : safeMain;

  const rawThumbs: ProductImage[] = Array.isArray(thumbnails)
    ? thumbnails
        .map((t: any) => {
          if (!t) return null;
          if (typeof t === "string" && t.trim().length > 0) {
            return { src: t.trim(), alt: name || "Product" };
          }
          if (typeof t === "object") {
            const src = t.src || t.url || t.image_url;
            if (typeof src === "string" && src.trim().length > 0) {
              return { src: src.trim(), alt: t.alt || name || "Product" };
            }
          }
          return null;
        })
        .filter((t): t is ProductImage => t !== null)
    : [];

  const seenThumbKeys = new Set<string>();
  const safeThumbs: ProductImage[] = [];
  for (const t of rawThumbs) {
    const key = getImageKey(t.src) || t.src;
    if (!seenThumbKeys.has(key)) {
      seenThumbKeys.add(key);
      safeThumbs.push(t);
    }
  }

  const visibleThumbs = safeThumbs.slice(0, MAX_VISIBLE_THUMBS);
  const extraCount = Math.max(0, safeThumbs.length - MAX_VISIBLE_THUMBS);
  const nextThumb = safeThumbs[MAX_VISIBLE_THUMBS];

  const currentMainSrc = activeThumb || safeMain.src;
  const hasDistinctHover = !activeThumb && safeHover.src !== safeMain.src;

  return (
    <div>
      <Link
        href={href}
        aria-label={`View ${name}`}
        className="group/image relative block aspect-[3/4] w-full overflow-hidden rounded-sm bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEF0]"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Main Primary Image */}
        <div className="absolute inset-0">
          <Image
            src={currentMainSrc}
            alt={safeMain.alt || name || "Product image"}
            fill
            unoptimized
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={cn(
              "object-cover transition-transform duration-700 ease-out",
              hovering && "scale-[1.05]"
            )}
          />
        </div>

        {/* Hover Secondary Image Overlay */}
        {hasDistinctHover && (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-in-out pointer-events-none",
              hovering ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={safeHover.src}
              alt={safeHover.alt || name || "Product hover image"}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className={cn(
                "object-cover transition-transform duration-700 ease-out",
                hovering && "scale-[1.05]"
              )}
            />
          </div>
        )}
      </Link>

      {visibleThumbs.length > 0 && (
        <div
          aria-label={`${name} color options`}
          className="mt-3 flex justify-center gap-2"
        >
          {visibleThumbs.map((thumb, index) => {
            const isSelected = activeThumb === thumb.src || (!activeThumb && thumb.src === safeMain.src);
            return (
              <Link
                key={thumb.src + index}
                href={href}
                aria-label={`View ${name}`}
                onMouseEnter={() => setActiveThumb(thumb.src)}
                onMouseLeave={() => setActiveThumb(null)}
                className={cn(
                  "relative h-10 w-10 shrink-0 overflow-hidden rounded-sm border transition sm:h-12 sm:w-12",
                  isSelected
                    ? "border-[#00AEF0] ring-1 ring-[#00AEF0]"
                    : "border-zinc-200 hover:border-[#00AEF0]"
                )}
              >
                <Image
                  src={thumb.src}
                  alt={thumb.alt || ""}
                  fill
                  unoptimized
                  sizes="48px"
                  className="object-cover"
                />
              </Link>
            );
          })}

          {extraCount > 0 && nextThumb && (
            <Link
              href={href}
              aria-label={`View ${name}, ${extraCount} more color${extraCount > 1 ? "s" : ""}`}
              onMouseEnter={() => setActiveThumb(nextThumb.src)}
              onMouseLeave={() => setActiveThumb(null)}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-zinc-200 transition hover:border-[#00AEF0] sm:h-12 sm:w-12"
            >
              <Image
                src={nextThumb.src}
                alt=""
                fill
                unoptimized
                sizes="48px"
                className="object-cover opacity-40"
              />
              <span className="relative text-[10px] font-semibold text-black sm:text-xs">
                +{extraCount}
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
