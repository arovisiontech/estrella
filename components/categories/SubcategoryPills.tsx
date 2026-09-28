"use client";

import Link from "next/link";
import { useState } from "react";

type Subcategory = {
  slug: string;
  name: string;
  count: number;
};

type SubcategoryPillsProps = {
  parentSlug: string;
  subcategories: Subcategory[];
  activeSubcategory?: string;
};

export default function SubcategoryPills({
  parentSlug,
  subcategories,
  activeSubcategory,
}: SubcategoryPillsProps) {
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

  if (subcategories.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="site-container py-5 sm:py-6">
        {/* Scrollable pills container (Matches SS 2) */}
        <div
          ref={setScrollContainer}
          className="flex flex-wrap gap-2.5 sm:gap-3 overflow-x-auto scrollbar-hide sm:flex-nowrap"
        >
          {subcategories.map((subcategory) => {
            const isActive = activeSubcategory === subcategory.slug;
            const href = `/categories/${parentSlug}?subcategory=${subcategory.slug}`;

            return (
              <Link
                key={subcategory.slug}
                href={href}
                className={`flex-shrink-0 whitespace-nowrap rounded-full border-2 px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "border-[#00AEF0] bg-sky-50 text-[#00AEF0] font-bold shadow-xs"
                    : "border-slate-300 bg-white text-slate-800 hover:border-[#00AEF0] hover:bg-sky-50 hover:text-[#00AEF0]"
                }`}
              >
                {subcategory.name} <span className="ml-1 text-xs">({subcategory.count})</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
