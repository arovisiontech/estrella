"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Shirt, Flame, Trophy, PackageCheck, Image as ImageIcon } from "lucide-react";

export interface WhoWeManufactureForCard {
  id: string;
  title: string;
  description: string;
  icon?: string; // Image URL or fallback icon identifier
  iconType?: string; // "shirt" | "fist" | "trophy" | "boxes" | "custom"
  badges: string[];
}

export interface WhoWeManufactureForData {
  sectionTitle: string;
  sectionSubtitle: string;
  cards: WhoWeManufactureForCard[];
}

export const defaultWhoWeManufactureForData: WhoWeManufactureForData = {
  sectionTitle: "Who We Manufacture For",
  sectionSubtitle: "Trusted by industry leaders worldwide",
  cards: [
    {
      id: "card-1",
      title: "Sportswear Brands & Private Label Startups",
      description:
        "You have the vision. We handle production. From design files to finished garments — we manufacture your custom line with your branding, your labels, and your packaging. Full OEM service with flexible MOQ.",
      iconType: "shirt",
      badges: ["OEM Service", "Flexible MOQ"],
    },
    {
      id: "card-2",
      title: "Combat Sports Gyms & Fight Wear Brands",
      description:
        "Custom rash guards, fight shorts, compression wear, and martial arts uniforms made to perform in the gym and on the competition mat. Low MOQ, full sublimation, durable stitching.",
      iconType: "fist",
      badges: ["Full Sublimation", "Low MOQ"],
    },
    {
      id: "card-3",
      title: "Sports Clubs, Academies & National Teams",
      description:
        "We supply custom team kits, training wear, and match uniforms for football clubs, basketball teams, cricket academies, and national federations. Consistent sizing, bulk pricing, and on-time delivery.",
      iconType: "trophy",
      badges: ["Bulk Pricing", "On-Time Delivery"],
    },
    {
      id: "card-4",
      title: "Distributors, Wholesalers & B2B Resellers",
      description:
        "Import-ready sportswear and activewear at factory prices. We work with regional distributors, importers, and B2B resellers who need reliable volume production, certifications, and consistent quality across reorders.",
      iconType: "boxes",
      badges: ["Factory Prices", "Bulk Orders"],
    },
  ],
};

export default function WhoWeManufactureForSection() {
  const [data, setData] = useState<WhoWeManufactureForData>(defaultWhoWeManufactureForData);
  const supabase = createClient();

  const loadData = useCallback(async () => {
    try {
      const cached = localStorage.getItem("estrella_who_we_manufacture_for");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.cards)) {
          setData({ ...defaultWhoWeManufactureForData, ...parsed });
          return;
        }
      }

      const { data: dbData } = await supabase
        .from("home_sections")
        .select("*")
        .eq("section_key", "who-we-manufacture-for")
        .single();

      if (dbData && dbData.content) {
        setData({ ...defaultWhoWeManufactureForData, ...dbData.content });
      } else {
        setData(defaultWhoWeManufactureForData);
      }
    } catch {
      setData(defaultWhoWeManufactureForData);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      const cached = localStorage.getItem("estrella_who_we_manufacture_for");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object" && Array.isArray(parsed.cards)) {
            setData({ ...defaultWhoWeManufactureForData, ...parsed });
          }
        } catch {}
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("estrella_who_we_manufacture_for_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("estrella_who_we_manufacture_for_updated", handleUpdate);
    };
  }, [loadData]);

  // Fallback Lucide Icon renderer based on card iconType
  const renderCardIcon = (card: WhoWeManufactureForCard) => {
    if (card.icon) {
      return (
        <Image
          src={card.icon}
          alt={card.title}
          width={36}
          height={36}
          className="h-9 w-9 object-contain filter invert"
          unoptimized
        />
      );
    }

    switch (card.iconType) {
      case "shirt":
        return <Shirt className="w-8 h-8 text-white" />;
      case "fist":
        return <Flame className="w-8 h-8 text-white" />;
      case "trophy":
        return <Trophy className="w-8 h-8 text-white" />;
      case "boxes":
        return <PackageCheck className="w-8 h-8 text-white" />;
      default:
        return <Shirt className="w-8 h-8 text-white" />;
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-slate-50 border-t border-slate-200">
      <div className="site-container">

        {/* Section Header (Matches SS 1) */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {data.sectionTitle}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            {data.sectionSubtitle}
          </p>
          <div className="w-16 h-1 bg-[#00AEF0] mx-auto rounded-full mt-4" />
        </div>

        {/* 4 Cards Grid (Matches SS 1 & SS 2) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.cards.map((card) => (
            <div
              key={card.id}
              className="group relative rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#00AEF0]"
            >
              <div className="space-y-6">
                {/* Circular Estrella Cyan Icon Container (SS 4 Match) */}
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#00AEF0] text-white shadow-md shadow-sky-500/25 group-hover:scale-110 transition-transform duration-300">
                  {renderCardIcon(card)}
                </div>

                {/* Card Title */}
                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>

              {/* Badges / Tags (Matches SS 2) */}
              {card.badges && card.badges.length > 0 && (
                <div className="mt-8 pt-4 flex flex-wrap gap-2">
                  {card.badges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="inline-block rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200/80"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
