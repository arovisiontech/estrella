"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CategoryData } from "@/lib/cms/types";

type CategorySidebarProps = {
  currentCategorySlug: string;
  currentSubcategorySlug?: string;
  categories?: CategoryData[];
};

export default function CategorySidebar({
  currentCategorySlug,
  currentSubcategorySlug,
  categories = [],
}: CategorySidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string>(currentCategorySlug);

  return (
    <aside className="hidden lg:block w-full lg:w-64 xl:w-72 2xl:w-80 shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Categories heading (SS 3 & SS 4 Match) */}
        <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
          CATEGORIES
        </h2>

        {/* Categories list */}
        <nav className="space-y-1">
          {categories.map((category) => {
            const isCurrentCategory = category.slug === currentCategorySlug;
            const isExpanded = expandedCategory === category.slug;
            const subcats = category.subcategories || [];

            return (
              <div key={category.id || category.slug}>
                {/* Category heading row */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/categories/${category.slug}`}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wide transition-all ${
                      isCurrentCategory
                        ? "bg-sky-50 text-[#00AEF0]"
                        : "text-slate-900 hover:bg-slate-50 hover:text-[#00AEF0]"
                    }`}
                  >
                    {category.name}
                  </Link>

                  {subcats.length > 0 && (
                    <button
                      onClick={() =>
                        setExpandedCategory(
                          isExpanded ? "" : category.slug
                        )
                      }
                      className="p-2 text-slate-500 hover:text-slate-900 transition"
                      aria-label={`Expand ${category.name}`}
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          isExpanded || isCurrentCategory ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Subcategories - show if category is expanded or is current (SS 3 & SS 4 Match) */}
                {(isExpanded || isCurrentCategory) && subcats.length > 0 && (
                  <div className="mt-1 space-y-1 border-l-2 border-slate-200 pl-4 py-1">
                    {subcats.map((subcategory) => {
                      const isCurrentSubcategory =
                        isCurrentCategory &&
                        currentSubcategorySlug === subcategory.slug;

                      return (
                        <Link
                          key={subcategory.id || subcategory.slug}
                          href={`/categories/${category.slug}?subcategory=${subcategory.slug}`}
                          className={`block rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                            isCurrentSubcategory
                              ? "font-bold text-[#00AEF0] bg-sky-50"
                              : "text-slate-600 hover:text-[#00AEF0] hover:bg-slate-50"
                          }`}
                        >
                          • {subcategory.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
