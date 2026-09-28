"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface ConceptToCreationData {
  mainTitle: string;
  subtitle1: string;
  desc1: string;
  subtitle2: string;
  desc2: string;
  buttonText: string;
  buttonLink: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
}

export const defaultConceptData: ConceptToCreationData = {
  mainTitle: "FROM CONCEPT TO CREATION ALL UNDER ONE ROOF. YOUR FULL-SERVICE PARTNER IN SPORTSWEAR MANUFACTURING.",
  subtitle1: "Deliver Premium Quality Vendor Wears",
  desc1: "Our Mission Is To Deliver High-Quality Vendor Wears That Combine Durability, Comfort, And Strong Brand Identity. We Are Committed To Supporting Businesses With Reliable Manufacturing, Innovative Customization, And Consistent Excellence—Helping Our Clients Represent Their Brand With Confidence In Every Environment.",
  subtitle2: "Maintain Excellence In Quality And Production",
  desc2: "Our Vision Is To Become A Leading Global Manufacturer Of Vendor Wears, Recognized For Quality, Innovation, And Reliability. We Aim To Set Industry Standards By Delivering Customized Solutions That Help Brands Strengthen Their Identity And Presence Across Every Market.",
  buttonText: "About US",
  buttonLink: "/about",
  image1: "/images/concept-to-creation/image-1.jpg",
  image2: "/images/banner-our-values.svg",
  image3: "/images/banner-surgical-tools.svg",
  image4: "/images/banner-sublimation-sports.svg",
};

export default function ConceptToCreationSection() {
  const [data, setData] = useState<ConceptToCreationData>(defaultConceptData);
  const supabase = createClient();

  const loadData = useCallback(async () => {
    try {
      const cached = localStorage.getItem("estrella_concept_to_creation");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          setData({ ...defaultConceptData, ...parsed });
          return;
        }
      }

      const { data: dbData } = await supabase
        .from("home_sections")
        .select("*")
        .eq("section_key", "concept-to-creation")
        .single();

      if (dbData && dbData.content) {
        setData({ ...defaultConceptData, ...dbData.content });
      } else {
        setData(defaultConceptData);
      }
    } catch {
      setData(defaultConceptData);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      const cached = localStorage.getItem("estrella_concept_to_creation");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            setData({ ...defaultConceptData, ...parsed });
          }
        } catch {}
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("estrella_concept_to_creation_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("estrella_concept_to_creation_updated", handleUpdate);
    };
  }, [loadData]);

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-100 overflow-hidden">
      <div className="site-container">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          
          {/* Left Column: Text & Content (Screenshot 1 Match) */}
          <div className="lg:col-span-6 space-y-8">
            {/* Main Bold Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black leading-[1.15] text-slate-900 tracking-tight uppercase">
              {data.mainTitle}
            </h2>

            {/* Subtitle 1 & Paragraph */}
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-rose-600 tracking-tight">
                {data.subtitle1}
              </h3>
              <div className="pl-4 border-l-2 border-slate-300">
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {data.desc1}
                </p>
              </div>
            </div>

            {/* Subtitle 2 & Paragraph */}
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-rose-600 tracking-tight">
                {data.subtitle2}
              </h3>
              <div className="pl-4 border-l-2 border-slate-300">
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {data.desc2}
                </p>
              </div>
            </div>

            {/* About Us Button */}
            <div className="pt-2">
              <Link
                href={data.buttonLink || "/about"}
                className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-rose-600/20 transition-all duration-300 hover:bg-rose-700 hover:shadow-rose-600/30 hover:scale-[1.02]"
              >
                <span>{data.buttonText || "About US"}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Right Column: Custom Polygon Angled Geometric Image Grid (Exact Match Screenshot 2!) */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 items-stretch h-[450px] sm:h-[520px] lg:h-[580px]">
              
              {/* Image 1: Left Column (Full height with Bottom-Right Diagonal Chamfered Corner) */}
              <div className="relative h-full w-full group">
                <div
                  className="relative h-full w-full overflow-hidden shadow-lg"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 82%, 75% 100%, 0 100%)",
                  }}
                >
                  <Image
                    src={data.image1}
                    alt="Sportswear Manufacturing"
                    fill
                    className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                    unoptimized
                  />
                </div>
              </div>

              {/* Middle Column: 2 Stacked Images */}
              <div className="flex flex-col gap-3 sm:gap-4 h-full">
                
                {/* Image 2: Middle Top (Top-Left Chamfered Corner) */}
                <div className="relative flex-1 w-full group">
                  <div
                    className="relative h-full w-full overflow-hidden shadow-lg"
                    style={{
                      clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%, 0 22%)",
                    }}
                  >
                    <Image
                      src={data.image2}
                      alt="Garment Stitching"
                      fill
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Image 3: Middle Bottom (Bottom-Right Chamfered Corner) */}
                <div className="relative flex-1 w-full group">
                  <div
                    className="relative h-full w-full overflow-hidden shadow-lg"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)",
                    }}
                  >
                    <Image
                      src={data.image3}
                      alt="Printing & Sublimation"
                      fill
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                </div>

              </div>

              {/* Image 4: Right Column (Full height with Bottom-Left Chamfered Corner) */}
              <div className="relative h-full w-full group">
                <div
                  className="relative h-full w-full overflow-hidden shadow-lg"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 22% 100%, 0 78%)",
                  }}
                >
                  <Image
                    src={data.image4}
                    alt="Fabric Cutting"
                    fill
                    className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                    unoptimized
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
