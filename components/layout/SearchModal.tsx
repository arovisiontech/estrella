"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Package, Layers } from "lucide-react";
import { DEFAULT_PRODUCTS } from "@/lib/cms/defaultProducts";
import { DEFAULT_CATEGORIES } from "@/lib/cms/defaultCategories";
import { getProducts } from "@/lib/cms/products";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [productsList, setProductsList] = useState<any[]>(DEFAULT_PRODUCTS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);

      const loadLiveProducts = async () => {
        try {
          const prods = await getProducts();
          if (prods && prods.length > 0) {
            setProductsList(prods);
          }
        } catch {
          // ignore error and keep fallback
        }
      };
      loadLiveProducts();
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Filter products matching search term
  const filteredProducts = productsList.filter((product) => {
    if (product.isActive === false) return false;
    
    // Category filter
    if (selectedCategory !== "all") {
      const prodCategory = (product.category || "").toLowerCase();
      const prodSub = (product.subcategory || "").toLowerCase();
      if (!prodCategory.includes(selectedCategory) && !prodSub.includes(selectedCategory)) {
        return false;
      }
    }

    if (!trimmed) return true;

    const nameMatch = product.name.toLowerCase().includes(trimmed);
    const skuMatch = (product.sku || "").toLowerCase().includes(trimmed);
    const catMatch = (product.categoryLabel || "").toLowerCase().includes(trimmed);
    const subMatch = (product.subcategory || "").toLowerCase().includes(trimmed);
    const tagMatch = Array.isArray(product.tags)
      ? product.tags.some((t: string) => typeof t === "string" && t.toLowerCase().includes(trimmed))
      : false;

    return nameMatch || skuMatch || catMatch || subMatch || tagMatch;
  });

  const matchingCategories = DEFAULT_CATEGORIES.filter((c) =>
    !trimmed ? false : c.name.toLowerCase().includes(trimmed) || c.slug.toLowerCase().includes(trimmed)
  );

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start bg-slate-950/80 backdrop-blur-md px-4 pt-12 sm:pt-20 pb-8 animate-fadeIn font-sans">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Search Panel */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header / Input Field */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
          <Search size={22} className="text-[#00AEF0] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, sportswear, boxing gear, footballs, SKU..."
            className="w-full bg-transparent text-base sm:text-lg text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-white transition"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase text-slate-300 hover:bg-[#00AEF0] hover:text-white transition cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto px-5 py-3 border-b border-slate-800 scrollbar-none bg-slate-950/40">
          <span className="text-xs font-bold text-slate-400 uppercase mr-1 flex items-center gap-1">
            <Layers size={12} /> Filter:
          </span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#00AEF0] text-white shadow-xs"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setSelectedCategory("sportswear")}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition cursor-pointer ${
              selectedCategory === "sportswear"
                ? "bg-[#00AEF0] text-white shadow-xs"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            Sportswears
          </button>
          <button
            onClick={() => setSelectedCategory("boxing")}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition cursor-pointer ${
              selectedCategory === "boxing"
                ? "bg-[#00AEF0] text-white shadow-xs"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            Boxing Equipment
          </button>
          <button
            onClick={() => setSelectedCategory("soccer")}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition cursor-pointer ${
              selectedCategory === "soccer"
                ? "bg-[#00AEF0] text-white shadow-xs"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            Soccer Footballs
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Matching Categories if query exists */}
          {matchingCategories.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Matching Categories
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-[#00AEF0]/20 border border-white/10 hover:border-[#00AEF0]/50 transition group"
                  >
                    <span className="text-sm font-semibold text-white group-hover:text-[#00AEF0]">
                      {cat.name}
                    </span>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-[#00AEF0]" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {trimmed ? `Search Results (${filteredProducts.length})` : "Popular & Featured Products"}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center">
                <Package size={40} className="mx-auto text-slate-600 mb-3" />
                <p className="text-base text-slate-300 font-medium">No products found</p>
                <p className="text-xs text-slate-400 mt-1">
                  Try searching for &quot;sublimation&quot;, &quot;boxing&quot;, &quot;football&quot;, or &quot;gloves&quot;
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00AEF0]/50 transition group"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black border border-white/10">
                      <Image
                        src={product.mainImage?.src || product.main_image_url || "/images/banner-sublimation-sports.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#00AEF0] transition truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        SKU: {product.sku} • {product.subcategory || product.categoryLabel || product.category}
                      </p>
                      {product.price && (
                        <p className="text-xs font-black text-[#00AEF0] mt-1">
                          {product.currency || "PKR"} {Number(product.price).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-slate-400">
          <span>Click any product to view details</span>
          <span className="hidden sm:inline">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
