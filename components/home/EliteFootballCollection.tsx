"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface FootballItem {
  id: string;
  name: string;
  category: string;
  image: string;
  link?: string;
  is_active?: boolean;
}

export const defaultFootballs: FootballItem[] = [
  {
    id: "fb-1",
    name: "Hybrid Soccer Balls",
    category: "Professional Match Ball",
    image: "/images/footballs/football-1.jpg",
    link: "/categories/soccer-footballs",
    is_active: true,
  },
  {
    id: "fb-2",
    name: "Stingo Sports Thermo Football",
    category: "Thermo Bonded Match Ball",
    image: "/images/footballs/football-2.jpg",
    link: "/categories/soccer-footballs",
    is_active: true,
  },
  {
    id: "fb-3",
    name: "Estrella Pro Training Ball",
    category: "Hand Stitched Match Ball",
    image: "/images/footballs/football-3.jpg",
    link: "/categories/soccer-footballs",
    is_active: true,
  },
  {
    id: "fb-4",
    name: "Royal Gold Hybrid Football",
    category: "Tournament Official Ball",
    image: "/images/footballs/football-4.jpg",
    link: "/categories/soccer-footballs",
    is_active: true,
  },
  {
    id: "fb-5",
    name: "Estrella Cyber Metallic Ball",
    category: "High Speed Match Ball",
    image: "/images/footballs/football-5.jpg",
    link: "/categories/soccer-footballs",
    is_active: true,
  },
  {
    id: "fb-6",
    name: "Estrella Sublimated Team Ball",
    category: "Custom OEM Match Ball",
    image: "/images/footballs/football-6.jpg",
    link: "/categories/soccer-footballs",
    is_active: true,
  },
  {
    id: "fb-7",
    name: "Ultra Precision Futsal Ball",
    category: "Low Bounce Futsal Ball",
    image: "/images/footballs/football-7.jpg",
    link: "/categories/soccer-footballs",
    is_active: true,
  },
];

export default function EliteFootballCollection() {
  const [footballs, setFootballs] = useState<FootballItem[]>(defaultFootballs);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const loadFootballs = useCallback(async () => {
    try {
      const cached = localStorage.getItem("estrella_football_collection");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFootballs(parsed.filter((item: FootballItem) => item.is_active !== false));
          return;
        }
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_slug", "soccer-footballs")
        .limit(10);

      if (!error && data && data.length > 0) {
        const mapped = data.map((item: any, idx: number): FootballItem => ({
          id: item.id,
          name: item.name || `Hybrid Soccer Ball ${idx + 1}`,
          category: item.sku || "Hybrid Soccer Balls",
          image: item.main_image_url || defaultFootballs[idx % defaultFootballs.length].image,
          link: `/products/${item.slug}`,
          is_active: true,
        }));
        setFootballs(mapped);
      } else {
        setFootballs(defaultFootballs);
      }
    } catch {
      setFootballs(defaultFootballs);
    }
  }, [supabase]);

  useEffect(() => {
    loadFootballs();

    const handleUpdate = () => {
      const cached = localStorage.getItem("estrella_football_collection");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFootballs(parsed.filter((item: FootballItem) => item.is_active !== false));
          }
        } catch {}
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("estrella_football_collection_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("estrella_football_collection_updated", handleUpdate);
    };
  }, [loadFootballs]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-100 overflow-hidden relative">
      <div className="site-container">
        
        {/* Top Header Badge & Title (Screenshot 1) */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 text-[#00AEF0] border border-sky-200/80 text-xs font-bold tracking-wide mb-3 shadow-xs">
            Made To Move. Built To Win.
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tight">
            FEATURED PRODUCTS
          </h2>
        </div>

        {/* Carousel Container with Flanking Left/Right Overlay Navigation Buttons */}
        <div className="relative px-4 sm:px-8">
          
          {/* Left Overlay Slider Arrow Button */}
          <button
            onClick={scrollLeft}
            aria-label="Previous footballs"
            className="absolute left-0 top-1/2 z-30 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-all duration-300 hover:bg-[#00AEF0] hover:scale-110 focus:outline-none"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Scrollable Products Rail */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth py-4 px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {footballs.map((item) => (
              <div
                key={item.id}
                className="group relative flex-none w-[260px] sm:w-[280px] lg:w-[300px] rounded-2xl bg-slate-50 border border-slate-200/80 p-5 transition-all duration-300 hover:bg-white hover:border-[#00AEF0] hover:shadow-xl flex flex-col justify-between"
              >
                {/* Wishlist Heart Icon */}
                <button
                  aria-label="Add to wishlist"
                  className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-400 backdrop-blur-xs transition hover:text-rose-500 hover:bg-white"
                >
                  <Heart size={16} />
                </button>

                {/* Product Image Holder */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-white mb-4 p-2 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
                    unoptimized
                  />
                </div>

                {/* Product Meta & Title */}
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-[#00AEF0] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {item.category || "Hybrid Soccer Balls"}
                  </p>
                </div>

                {/* Inquiry / Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <Link
                    href={item.link || "/contact"}
                    className="text-xs font-bold text-[#00AEF0] uppercase tracking-wider hover:underline"
                  >
                    Inquiry →
                  </Link>
                  <Link
                    href={item.link || "/contact"}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#00AEF0]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Right Overlay Slider Arrow Button */}
          <button
            onClick={scrollRight}
            aria-label="Next footballs"
            className="absolute right-0 top-1/2 z-30 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-all duration-300 hover:bg-[#00AEF0] hover:scale-110 focus:outline-none"
          >
            <ChevronRight size={24} />
          </button>

        </div>

      </div>
    </section>
  );
}
