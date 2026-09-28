"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProductMenuCard from "./ProductMenuCard";
import type { CategoryData } from "@/lib/cms/types";

type ProductsMegaMenuProps = {
  isOpen: boolean;
  categories?: CategoryData[];
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose: () => void;
};

export default function ProductsMegaMenu({
  isOpen,
  categories: initialCategories,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: ProductsMegaMenuProps) {
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories || []);
  const supabase = createClient();

  useEffect(() => {
    async function loadCategories() {
      const [catsRes, subcatsRes] = await Promise.all([
        supabase
          .from("categories")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("subcategories")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
      ]);

      if (catsRes.data) {
        const subcats = subcatsRes.data || [];
        const combined: CategoryData[] = catsRes.data.map((c, index) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || null,
          image: {
            src: c.image_url || c.banner_url || c.source_data?.image?.src || "/images/banner-sublimation-sports.svg",
            alt: c.name || "Category",
          },
          banner: {
            src: c.banner_url || c.image_url || "/images/banner-sublimation-sports.svg",
            alt: c.name || "Category",
          },
          image_url: c.image_url || null,
          banner_url: c.banner_url || null,
          is_active: true,
          is_featured: Boolean(c.is_featured),
          sort_order: c.sort_order ?? index,
          subcategories: subcats
            .filter((s) => s.category_id === c.id)
            .map((s) => ({
              id: s.id,
              category_id: s.category_id,
              name: s.name,
              slug: s.slug,
              description: s.description || null,
              image_url: s.image_url || null,
              banner_url: s.banner_url || null,
              is_active: true,
              is_featured: Boolean(s.is_featured),
              sort_order: s.sort_order ?? 0,
            })),
        }));
        setCategories(combined);
      }
    }

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed top-20 left-0 right-0 bg-white border-t border-zinc-200 shadow-2xl z-[55] transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="navigation"
      aria-label="Products categories"
    >
      <div className="site-container px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {categories.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-sm">
            No active categories available.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
            {categories.map((category) => (
              <ProductMenuCard
                key={category.id || category.slug}
                category={category}
                onNavigate={onClose}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
