"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface ParallaxBannerData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  bgImage: string;
}

export const defaultParallaxBannerData: ParallaxBannerData = {
  title: "PRECISION SPORTSWEAR MANUFACTURING & EXPORT",
  subtitle: "Equipping Global Brands, Sports Clubs & Commercial Partners With Premium Quality Garments & Performance Gear.",
  buttonText: "EXPLORE PRODUCT CATALOGUES",
  buttonLink: "/catalogue",
  bgImage: "/images/brochure-parallax.jpeg",
};

export default function ParallaxBannerSection() {
  const [data, setData] = useState<ParallaxBannerData>(defaultParallaxBannerData);
  const supabase = createClient();

  const loadData = useCallback(async () => {
    try {
      const cached = localStorage.getItem("estrella_parallax_banner");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          setData({ ...defaultParallaxBannerData, ...parsed });
          return;
        }
      }

      const { data: dbData } = await supabase
        .from("home_sections")
        .select("*")
        .eq("section_key", "parallax-banner")
        .single();

      if (dbData && dbData.content) {
        setData({ ...defaultParallaxBannerData, ...dbData.content });
      } else {
        setData(defaultParallaxBannerData);
      }
    } catch {
      setData(defaultParallaxBannerData);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      const cached = localStorage.getItem("estrella_parallax_banner");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            setData({ ...defaultParallaxBannerData, ...parsed });
          }
        } catch {}
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("estrella_parallax_banner_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("estrella_parallax_banner_updated", handleUpdate);
    };
  }, [loadData]);

  const bgImageUrl = data.bgImage || "/images/brochure-parallax.jpeg";

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden bg-slate-900">
      {/* Clean Parallax Background Container - NO BLUE OVERLAY, AS-IS IMAGE DISPLAY! */}
      <div
        className="absolute inset-0 z-0 bg-fixed bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />

      {/* Very light subtle dark tint only behind text if needed for legibility, zero blue overlay */}
      <div className="absolute inset-0 z-[1] bg-black/25" />

      {/* Content Container */}
      <div className="relative z-10 site-container text-center text-white max-w-4xl mx-auto space-y-6 px-4">
        {data.title && (
          <div className="inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-4 py-1.5 border border-white/20 text-xs font-extrabold uppercase tracking-widest text-[#00AEF0] shadow-md">
            <Sparkles className="w-4 h-4 text-[#00AEF0]" />
            <span>ESTRELLA MANUFACTURING</span>
          </div>
        )}

        {data.title && (
          <h2
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] uppercase text-white"
            style={{ textShadow: "0 4px 16px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.9)" }}
          >
            {data.title}
          </h2>
        )}

        {data.subtitle && (
          <p
            className="text-slate-100 text-base sm:text-xl font-bold max-w-2xl mx-auto leading-relaxed"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.9)" }}
          >
            {data.subtitle}
          </p>
        )}

        {data.buttonText && (
          <div className="pt-4">
            <Link
              href={data.buttonLink || "/catalogue"}
              className="inline-flex items-center gap-3 rounded-xl bg-[#00AEF0] hover:bg-[#0095ce] px-8 py-4 text-base font-extrabold text-white shadow-2xl transition-all duration-300 hover:scale-[1.04] uppercase tracking-wider"
            >
              <span>{data.buttonText}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
