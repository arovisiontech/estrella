"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface HeroSlideItem {
  id?: string;
  type: "video" | "image";
  src: string;
  poster?: string;
  mobileSrc?: string;
  title?: string;
  eyebrow?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  textPosition?: string;
}

const userBanners: HeroSlideItem[] = [
  {
    id: "user-slide-1",
    type: "image",
    src: "/images/hero-banner-1.jpg",
    title: "Estrella Surgical & Medical Instruments",
  },
  {
    id: "user-slide-2",
    type: "image",
    src: "/images/hero-banner-2.jpg",
    title: "Estrella Custom Sublimation Sportswear",
  },
  {
    id: "user-slide-3",
    type: "image",
    src: "/images/hero-banner-3.jpg",
    title: "Estrella Quality Craftsmanship & Values",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [slides, setSlides] = useState<HeroSlideItem[]>(userBanners);
  const supabase = createClient();

  useEffect(() => {
    async function loadSlides() {
      try {
        const cachedAdminSlides = localStorage.getItem("estrella_admin_hero_slides");
        if (cachedAdminSlides) {
          const parsed = JSON.parse(cachedAdminSlides);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const valid = parsed.map((s: any, idx: number) => {
              const src = s.src || s.image_url;
              if (!src || src.endsWith(".svg") || src.includes("banner-our-values") || src.includes("banner-surgical") || src.includes("banner-sublimation")) {
                return userBanners[idx % userBanners.length];
              }
              return s;
            });
            setSlides(valid);
            return;
          }
        }

        const { data, error } = await supabase
          .from("hero_slides")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map((slide: any, idx: number): HeroSlideItem => {
            const img = slide.image_url || slide.video_url;
            if (!img || img.endsWith(".svg") || img.includes("banner-our-values") || img.includes("banner-surgical") || img.includes("banner-sublimation")) {
              return userBanners[idx % userBanners.length];
            }
            return {
              id: slide.id,
              type: slide.video_url ? "video" : "image",
              src: img,
              title: slide.title,
            };
          });
          setSlides(mapped);
        } else {
          setSlides(userBanners);
        }
      } catch (err) {
        setSlides(userBanners);
      }
    }

    loadSlides();

    const handleStorageChange = () => {
      const cached = localStorage.getItem("estrella_admin_hero_slides");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const valid = parsed.map((s: any, idx: number) => {
              const src = s.src || s.image_url;
              if (!src || src.endsWith(".svg") || src.includes("banner-our-values") || src.includes("banner-surgical") || src.includes("banner-sublimation")) {
                return userBanners[idx % userBanners.length];
              }
              return s;
            });
            setSlides(valid);
          }
        } catch (e) {}
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("estrella_hero_slides_updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("estrella_hero_slides_updated", handleStorageChange);
    };
  }, []);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Auto-play slider (Switches banner automatically every 4.5 seconds, no buttons)
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      next();
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length, next]);

  return (
    <section className="relative w-full overflow-hidden bg-white aspect-[1648/640] shadow-sm">
      {slides.map((slide, index) => {
        const isActive = index === active;

        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
            }`}
          >
            {/* Full Banner Image showing 100% without cropping */}
            <div className="relative h-full w-full">
              <Image
                src={slide.src}
                alt={slide.title || "Estrella Hero Banner"}
                fill
                priority={index === 0}
                className="object-contain w-full h-full"
                unoptimized
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
