"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  Package,
  ClipboardCheck,
  Scissors,
  Flame,
  Tag,
  Sliders,
  Sparkles,
  CheckCircle2,
  Box,
  Truck,
  ArrowRight,
} from "lucide-react";

export interface ManufacturingStep {
  id: string;
  title: string;
  icon?: string; // Image URL if uploaded from laptop gallery
  iconType?: string;
}

export interface ManufacturingProcessData {
  sectionTitle: string;
  description: string;
  steps: ManufacturingStep[];
}

export const defaultManufacturingProcessData: ManufacturingProcessData = {
  sectionTitle: "OUR MANUFACTURING PROCESS OF THE GARMENTS",
  description:
    "Your order moves through a structured production process, starting with material sourcing and inspection, followed by precision cutting, panel stitching, and final quality control. Each stage is handled in-house to ensure consistency, accuracy, and reliable manufacturing standards for custom sportswear.",
  steps: [
    { id: "step-1", title: "Receiving", iconType: "receiving" },
    { id: "step-2", title: "Checking Materials", iconType: "checking" },
    { id: "step-3", title: "Cutting", iconType: "cutting" },
    { id: "step-4", title: "Heat Bonding", iconType: "heat-bonding" },
    { id: "step-5", title: "Branding", iconType: "branding" },
    { id: "step-6", title: "Customizations", iconType: "customizations" },
    { id: "step-7", title: "Stitching", iconType: "stitching" },
    { id: "step-8", title: "Finishing", iconType: "finishing" },
    { id: "step-9", title: "Packing", iconType: "packing" },
    { id: "step-10", title: "Dispatching", iconType: "dispatching" },
  ],
};

export default function ManufacturingProcessSection() {
  const [data, setData] = useState<ManufacturingProcessData>(defaultManufacturingProcessData);
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const supabase = createClient();

  const loadData = useCallback(async () => {
    try {
      const cached = localStorage.getItem("estrella_manufacturing_process");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.steps)) {
          setData({ ...defaultManufacturingProcessData, ...parsed });
          return;
        }
      }

      const { data: dbData } = await supabase
        .from("home_sections")
        .select("*")
        .eq("section_key", "manufacturing-process")
        .single();

      if (dbData && dbData.content) {
        setData({ ...defaultManufacturingProcessData, ...dbData.content });
      } else {
        setData(defaultManufacturingProcessData);
      }
    } catch {
      setData(defaultManufacturingProcessData);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      const cached = localStorage.getItem("estrella_manufacturing_process");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object" && Array.isArray(parsed.steps)) {
            setData({ ...defaultManufacturingProcessData, ...parsed });
          }
        } catch {}
      }
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("estrella_manufacturing_process_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("estrella_manufacturing_process_updated", handleUpdate);
    };
  }, [loadData]);

  // Helper to render step icon (custom uploaded image OR vector Lucide icon matching SS 4/5)
  const renderStepIcon = (step: ManufacturingStep, isHovered: boolean) => {
    if (step.icon) {
      return (
        <Image
          src={step.icon}
          alt={step.title}
          width={40}
          height={40}
          className={`h-10 w-10 object-contain transition-transform duration-300 ${
            isHovered ? "scale-115" : ""
          }`}
          unoptimized
        />
      );
    }

    const iconClasses = `w-9 h-9 transition-all duration-300 ${
      isHovered ? "text-[#00AEF0] scale-115 rotate-3" : "text-slate-800"
    }`;

    switch (step.iconType) {
      case "receiving":
        return <Package className={iconClasses} />;
      case "checking":
        return <ClipboardCheck className={iconClasses} />;
      case "cutting":
        return <Scissors className={iconClasses} />;
      case "heat-bonding":
        return <Flame className={iconClasses} />;
      case "branding":
        return <Tag className={iconClasses} />;
      case "customizations":
        return <Sliders className={iconClasses} />;
      case "stitching":
        return <Sparkles className={iconClasses} />;
      case "finishing":
        return <CheckCircle2 className={iconClasses} />;
      case "packing":
        return <Box className={iconClasses} />;
      case "dispatching":
        return <Truck className={iconClasses} />;
      default:
        return <Package className={iconClasses} />;
    }
  };

  const row1Steps = data.steps.slice(0, 5);
  const row2Steps = data.steps.slice(5, 10);

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200 overflow-hidden">
      <div className="site-container">

        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 uppercase font-sans">
            {data.sectionTitle}
          </h2>

          {/* Dual Sky Blue Bar Underline */}
          <div className="flex items-center justify-center gap-2 pt-1 pb-4">
            <div className="w-12 h-1.5 bg-[#00AEF0] rounded-full" />
            <div className="w-12 h-1.5 bg-[#00AEF0] rounded-full" />
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium max-w-3xl mx-auto">
            {data.description}
          </p>
        </div>

        {/* 10 Hexagon Process Steps in 2 Rows */}
        <div className="space-y-12 sm:space-y-16">
          
          {/* Row 1 (Steps 1 to 5) */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
            {row1Steps.map((step, idx) => {
              const isHovered = activeHoverId === step.id;
              const isLastInRow = idx === row1Steps.length - 1;

              return (
                <div key={step.id || idx} className="flex items-center gap-3 sm:gap-5">
                  {/* Hexagon Card */}
                  <div
                    onMouseEnter={() => setActiveHoverId(step.id)}
                    onMouseLeave={() => setActiveHoverId(null)}
                    className="relative group cursor-pointer transition-all duration-300"
                  >
                    {/* SVG Hexagon Shape Border & Background Container */}
                    <div className="relative w-36 h-40 sm:w-44 sm:h-48 flex flex-col items-center justify-center p-4 text-center transition-all duration-300">
                      
                      {/* Hexagon Background SVG */}
                      <svg
                        viewBox="0 0 100 115"
                        className={`absolute inset-0 w-full h-full transition-all duration-300 filter ${
                          isHovered
                            ? "drop-shadow-lg text-sky-50 stroke-[#00AEF0] fill-sky-50"
                            : "text-white stroke-slate-800 fill-white"
                        }`}
                      >
                        <polygon
                          points="50 3, 97 30, 97 85, 50 112, 3 85, 3 30"
                          strokeWidth="2.5"
                          className="transition-colors duration-300"
                        />
                      </svg>

                      {/* Content inside Hexagon */}
                      <div className="relative z-10 flex flex-col items-center justify-center space-y-2.5">
                        <div className={`p-2 rounded-full transition-all duration-300 ${
                          isHovered ? "bg-sky-100 scale-110" : ""
                        }`}>
                          {renderStepIcon(step, isHovered)}
                        </div>

                        <span className={`text-xs sm:text-sm font-black leading-tight transition-colors duration-300 max-w-[110px] ${
                          isHovered ? "text-[#00AEF0] scale-105" : "text-slate-900"
                        }`}>
                          {step.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Indicator between steps */}
                  {!isLastInRow && (
                    <div className="hidden sm:flex items-center justify-center text-slate-400 font-bold">
                      <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${
                        isHovered ? "translate-x-1.5 text-[#00AEF0]" : ""
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Row 2 (Steps 6 to 10) */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
            {row2Steps.map((step, idx) => {
              const isHovered = activeHoverId === step.id;
              const isLastInRow = idx === row2Steps.length - 1;

              return (
                <div key={step.id || idx} className="flex items-center gap-3 sm:gap-5">
                  {/* Hexagon Card */}
                  <div
                    onMouseEnter={() => setActiveHoverId(step.id)}
                    onMouseLeave={() => setActiveHoverId(null)}
                    className="relative group cursor-pointer transition-all duration-300"
                  >
                    {/* SVG Hexagon Shape Border & Background Container */}
                    <div className="relative w-36 h-40 sm:w-44 sm:h-48 flex flex-col items-center justify-center p-4 text-center transition-all duration-300">
                      
                      {/* Hexagon Background SVG */}
                      <svg
                        viewBox="0 0 100 115"
                        className={`absolute inset-0 w-full h-full transition-all duration-300 filter ${
                          isHovered
                            ? "drop-shadow-lg text-sky-50 stroke-[#00AEF0] fill-sky-50"
                            : "text-white stroke-slate-800 fill-white"
                        }`}
                      >
                        <polygon
                          points="50 3, 97 30, 97 85, 50 112, 3 85, 3 30"
                          strokeWidth="2.5"
                          className="transition-colors duration-300"
                        />
                      </svg>

                      {/* Content inside Hexagon */}
                      <div className="relative z-10 flex flex-col items-center justify-center space-y-2.5">
                        <div className={`p-2 rounded-full transition-all duration-300 ${
                          isHovered ? "bg-sky-100 scale-110" : ""
                        }`}>
                          {renderStepIcon(step, isHovered)}
                        </div>

                        <span className={`text-xs sm:text-sm font-black leading-tight transition-colors duration-300 max-w-[110px] ${
                          isHovered ? "text-[#00AEF0] scale-105" : "text-slate-900"
                        }`}>
                          {step.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Indicator between steps */}
                  {!isLastInRow && (
                    <div className="hidden sm:flex items-center justify-center text-slate-400 font-bold">
                      <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${
                        isHovered ? "translate-x-1.5 text-[#00AEF0]" : ""
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
