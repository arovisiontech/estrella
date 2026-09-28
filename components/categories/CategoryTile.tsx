"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { CategoryData } from "@/lib/cms/types";

type CategoryTileProps = {
  category: CategoryData | {
    id: string;
    name: string;
    slug: string;
    image?: { src: string; alt: string };
    image_url?: string | null;
    rowStyle?: "white" | "black";
  };
};

export default function CategoryTile({ category }: CategoryTileProps) {
  const [isHovering, setIsHovering] = useState(false);

  const isBlackStyle = "rowStyle" in category ? category.rowStyle === "black" : false;

  const imageSrc =
    category.image?.src ||
    ("image_url" in category && category.image_url ? category.image_url : null) ||
    "/images/banner-sublimation-sports.svg";

  const imageAlt = category.image?.alt || `${category.name} collection`;

  return (
    <Link href={`/categories/${category.slug}`}>
      <div
        className="group cursor-pointer overflow-hidden"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Image Area */}
        <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-900">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={cn(
              "object-cover transition-transform duration-700 ease-out",
              isHovering ? "scale-110" : "scale-100"
            )}
          />

          {/* Subtle overlay on hover */}
          {isHovering && (
            <div className="absolute inset-0 bg-black/10 transition-opacity duration-700" />
          )}
        </div>

        {/* Info Bar */}
        <div
          className={cn(
            "flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4",
            isBlackStyle
              ? "bg-zinc-900 text-white"
              : "bg-white text-black border-t border-zinc-200"
          )}
        >
          {/* Title */}
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            {category.name}
          </h3>

          {/* View Collection Button */}
          <button
            className={cn(
              "border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide transition-all duration-400 whitespace-nowrap",
              isHovering
                ? "border-red-600 bg-red-600 text-white"
                : isBlackStyle
                  ? "border-white bg-transparent text-white hover:border-red-600 hover:bg-red-600"
                  : "border-black bg-white text-black hover:border-red-600 hover:bg-red-600 hover:text-white"
            )}
          >
            View
          </button>
        </div>
      </div>
    </Link>
  );
}
