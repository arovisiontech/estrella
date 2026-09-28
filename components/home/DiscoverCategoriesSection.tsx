"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface DiscoverCategoryItem {
  id: string;
  name: string;
  subtitle?: string;
  image: string;
  link: string;
  is_active?: boolean;
}

export const defaultDiscoverCategories: DiscoverCategoryItem[] = [
  {
    id: "cat-1",
    name: "CASUAL WEAR",
    subtitle: "Polo Shirts & T-Shirts Collection",
    image: "/images/discover-categories/category-1.svg",
    link: "/categories/casual-wear",
    is_active: true,
  },
  {
    id: "cat-2",
    name: "SPORTSWEARS",
    subtitle: "Custom Sublimation Teamwear",
    image: "/images/discover-categories/category-2.svg",
    link: "/categories/sportswear",
    is_active: true,
  },
  {
    id: "cat-3",
    name: "SURGICAL INSTRUMENTS",
    subtitle: "CE & ISO Certified Medical Tools",
    image: "/images/discover-categories/category-3.svg",
    link: "/categories/surgical-instruments",
    is_active: true,
  },
];

export default function DiscoverCategoriesSection() {
  const [categories, setCategories] = useState<DiscoverCategoryItem[]>(defaultDiscoverCategories);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const loadCategories = useCallback(async () => {
    try {
      const cached = localStorage.getItem("estrella_discover_categories");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategories(parsed.filter((item: DiscoverCategoryItem) => item.is_active !== false));
          return;
        }
      }

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map((c: any, idx: number): DiscoverCategoryItem => ({
          id: c.id,
          name: c.name || `Category ${idx + 1}`,
          subtitle: c.description || undefined,
          image: c.image_url || c.banner_url || defaultDiscoverCategories[idx % defaultDiscoverCategories.length].image,
          link: `/categories/${c.slug}`,
          is_active: true,
        }));
        setCategories(mapped);
      } else {
        setCategories(defaultDiscoverCategories);
      }
    } catch {
      setCategories(defaultDiscoverCategories);
    }
  }, [supabase]);

  useEffect(() => {
    loadCategories();

    const handleUpdate = () => {
      const cached = localStorage.getItem("estrella_discover_categories");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed.filter((item: DiscoverCategoryItem) => item.is_active !== false));
          }
        } catch {}
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("estrella_discover_categories_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("estrella_discover_categories_updated", handleUpdate);
    };
  }, [loadCategories]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-100 relative overflow-hidden">
      <div className="site-container">
        
        {/* Section Title (Screenshot 1 Match) */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight">
            DISCOVER OUR CATEGORIES
          </h2>
        </div>

        {/* Carousel Container with Flanking Overlay Left/Right Navigation Buttons */}
        <div className="relative px-4 sm:px-8">
          
          {/* Left Flanking Overlay Arrow Button */}
          <button
            onClick={scrollLeft}
            aria-label="Previous categories"
            className="absolute left-0 top-1/2 z-30 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-all duration-300 hover:bg-[#00AEF0] hover:scale-110 focus:outline-none"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Scrollable Categories Grid */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none scroll-smooth py-4 px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group relative flex-none w-[320px] sm:w-[380px] lg:w-[440px] flex flex-col items-center"
              >
                <Link href={cat.link || "/categories"} className="w-full block">
                  {/* Category Image Card Container */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-slate-100 border border-slate-200 shadow-sm transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:border-[#00AEF0]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                      unoptimized
                    />
                  </div>

                  {/* Category Name & Title Below Card */}
                  <div className="mt-5 text-center px-2">
                    <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight group-hover:text-[#00AEF0] transition-colors leading-tight">
                      {cat.name}
                    </h3>
                    {cat.subtitle && (
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                        {cat.subtitle}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Right Flanking Overlay Arrow Button */}
          <button
            onClick={scrollRight}
            aria-label="Next categories"
            className="absolute right-0 top-1/2 z-30 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-all duration-300 hover:bg-[#00AEF0] hover:scale-110 focus:outline-none"
          >
            <ChevronRight size={24} />
          </button>

        </div>

      </div>
    </section>
  );
}
