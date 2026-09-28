"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CategoryData } from "@/lib/cms/types";

type ProductMenuCardProps = {
  category: CategoryData;
  onNavigate?: () => void;
};

export default function ProductMenuCard({ category, onNavigate }: ProductMenuCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    onNavigate?.();
  };

  const imageSrc = category.image?.src || category.image_url || "/images/banner-sublimation-sports.svg";
  const imageAlt = category.image?.alt || `${category.name} collection`;

  return (
    <div
      className="flex flex-col group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={`/categories/${category.slug}`} onClick={handleClick} className="block cursor-pointer">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-zinc-900 aspect-square mb-2.5 rounded-sm">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Overlay on Hover */}
          {isHovering && (
            <div className="absolute inset-0 bg-[#00AEF0]/10 transition-opacity duration-300" />
          )}
        </div>

        {/* Category Name */}
        <h3 className="text-xs sm:text-sm font-bold uppercase text-black text-center tracking-wide group-hover:text-[#00AEF0] transition-colors">
          {category.name}
        </h3>
      </Link>
    </div>
  );
}
