"use client";

import { useState } from "react";

type SortOption = "featured" | "newest" | "price-low" | "price-high" | "name-asc";

type CategoryToolbarProps = {
  productCount: number;
  activeSubcategoryName?: string;
  onSortChange?: (sort: SortOption) => void;
};

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name A–Z" },
];

export default function CategoryToolbar({
  productCount,
  activeSubcategoryName,
  onSortChange,
}: CategoryToolbarProps) {
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    onSortChange?.(value);
  };

  return (
    <div className="mb-8 flex items-center justify-between gap-4 border-b border-zinc-200 pb-6">
      {/* Left side: Product count and category label */}
      <div>
        <p className="text-sm text-zinc-600">
          <span className="font-semibold text-black">{productCount}</span> Product
          {productCount !== 1 ? "s" : ""}
          {activeSubcategoryName && (
            <span className="ml-2 text-zinc-500">• {activeSubcategoryName}</span>
          )}
        </p>
      </div>

      {/* Right side: Sort dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort-select" className="text-sm font-medium text-zinc-700">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          className="rounded-sm border border-zinc-300 bg-white px-3 py-2 text-sm text-black transition hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-0"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
