"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export interface HowWeWorkStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HowWeWorkData {
  sectionTitle: string;
  bgImage: string;
  steps: HowWeWorkStep[];
}

export const defaultHowWeWorkData: HowWeWorkData = {
  sectionTitle: "HOW WE WORK!",
  bgImage: "/images/concept-to-creation/image-1.jpg",
  steps: [
    {
      id: "step-1",
      title: "PRODUCT DEVELOPMENT",
      description:
        "We Collaborate Closely With Clients To Refine Concepts, Review Technical Requirements, And Prepare Specifications For Production Readiness.",
      icon: "/images/how-we-work/icon-1.png",
    },
    {
      id: "step-2",
      title: "SAMPLING & PROTOTYPING",
      description:
        "Before Mass Production, We Create Pre-Production Samples To Ensure Sizing, Fit, Colors, And Details Meet Your Exact Expectations.",
      icon: "/images/how-we-work/icon-2.png",
    },
    {
      id: "step-3",
      title: "MATERIAL SOURCING",
      description:
        "We Carefully Source And Select Quality Fabrics, Trims, And Accessories That Meet Global Performance And Durability Standards.",
      icon: "/images/how-we-work/icon-3.png",
    },
    {
      id: "step-4",
      title: "QUALITY ASSURANCE",
      description:
        "From Fabric Inspection To Final Packing, Every Step Is Monitored Through Strict Quality Checks To Guarantee Consistency, Reliability, And International Compliance.",
      icon: "/images/how-we-work/icon-2.png",
    },
  ],
};

export default function HowWeWorkSection() {
  const [data, setData] = useState<HowWeWorkData>(defaultHowWeWorkData);
  const supabase = createClient();

  const loadData = useCallback(async () => {
    try {
      const cached = localStorage.getItem("estrella_how_we_work");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.steps)) {
          setData({ ...defaultHowWeWorkData, ...parsed });
          return;
        }
      }

      const { data: dbData } = await supabase
        .from("home_sections")
        .select("*")
        .eq("section_key", "how-we-work")
        .single();

      if (dbData && dbData.content) {
        setData({ ...defaultHowWeWorkData, ...dbData.content });
      } else {
        setData(defaultHowWeWorkData);
      }
    } catch {
      setData(defaultHowWeWorkData);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      const cached = localStorage.getItem("estrella_how_we_work");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object" && Array.isArray(parsed.steps)) {
            setData({ ...defaultHowWeWorkData, ...parsed });
          }
        } catch {}
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("estrella_how_we_work_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("estrella_how_we_work_updated", handleUpdate);
    };
  }, [loadData]);

  return (
    <section className="relative bg-[#0d1838] text-white overflow-hidden py-0">
      {/* Background Workshop Image with Deep Blue Overlay (Screenshot 1 Match) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data.bgImage || "/images/concept-to-creation/image-1.jpg"}
          alt="How We Work Background"
          fill
          className="object-cover object-center opacity-30"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a122c]/95 via-[#0d1b46]/90 to-[#071026]/95" />
      </div>

      <div className="relative z-10 site-container py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-y lg:border-y-0 lg:border-l border-white/20">
          
          {/* Left Block: Section Main Title (HOW WE WORK!) */}
          <div className="lg:col-span-4 p-8 sm:p-12 lg:p-14 flex items-center justify-start border-b lg:border-b-0 lg:border-r border-white/20 bg-white/5 backdrop-blur-xs">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight text-white drop-shadow-md">
              {data.sectionTitle}
            </h2>
          </div>

          {/* Right Block: 2x2 Grid for Steps with Divider Lines (Exact SS 1 Grid) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2">
            {data.steps.map((step, idx) => (
              <div
                key={step.id || idx}
                className="p-8 sm:p-10 lg:p-12 border-b md:border-r border-white/20 bg-slate-900/30 backdrop-blur-xs flex flex-col justify-start space-y-5 transition-colors duration-300 hover:bg-white/10"
              >
                {/* Step Icon with Circular Outline (SS 3: White & Larger) */}
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-full border-2 border-white/60 p-3 flex items-center justify-center bg-white/15 shadow-lg group-hover:border-white transition-all">
                  {step.icon ? (
                    <Image
                      src={step.icon}
                      alt={step.title}
                      width={48}
                      height={48}
                      className="h-10 w-10 sm:h-12 sm:w-12 object-contain brightness-0 invert"
                      unoptimized
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-white" />
                  )}
                </div>

                {/* Step Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
