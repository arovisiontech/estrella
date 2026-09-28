"use client";

import { useEffect, useState } from "react";
import ManufacturingHoneycomb from "@/components/manufacturing/ManufacturingHoneycomb";
import { defaultAboutUsData, AboutUsFullData } from "./AboutUsData";

interface AboutIntroSectionProps {
  data?: AboutUsFullData;
}

export default function AboutIntroSection({ data: initialData }: AboutIntroSectionProps) {
  const [data, setData] = useState<AboutUsFullData>(initialData || defaultAboutUsData);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const loadData = () => {
      const cached = localStorage.getItem("estrella_about_page");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            setData({ ...defaultAboutUsData, ...parsed });
          }
        } catch {}
      }
    };

    loadData();

    window.addEventListener("storage", loadData);
    window.addEventListener("estrella_about_page_updated", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("estrella_about_page_updated", loadData);
    };
  }, []);

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20 overflow-hidden text-slate-900 border-b border-slate-200">
      <div className="site-container px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 lg:gap-16 lg:grid-cols-2 items-center">
          {/* Left: Manufacturing Visual (Honeycomb) */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <ManufacturingHoneycomb gallery={data.gallery} />
          </div>

          {/* Right: Content */}
          <div
            className={`transition-all duration-1000 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Experience Badge */}
            <div className="mb-4">
              <p className="text-4xl sm:text-5xl font-extrabold text-[#00AEF0]">
                {data.yearsValue}
              </p>
              <p className="text-xs sm:text-sm font-bold uppercase text-slate-500 tracking-wider">
                {data.yearsLabel}
              </p>
            </div>

            {/* Subheading */}
            <p className="text-base sm:text-lg font-bold text-[#00AEF0] mb-4">
              {data.locationText}
            </p>

            {/* Main Statement with Underline */}
            <div className="mb-6 relative">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 leading-tight mb-3">
                {data.mainHeading}
              </h1>
              <div
                className={`absolute bottom-0 left-0 h-1 bg-[#00AEF0] transition-all duration-1000 ${
                  isVisible ? "w-32" : "w-0"
                }`}
              />
            </div>

            {/* Body Text */}
            <div className="space-y-4 text-slate-700">
              <p className="text-sm sm:text-base leading-relaxed">
                {data.paragraph1}
              </p>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                {data.paragraph2}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
