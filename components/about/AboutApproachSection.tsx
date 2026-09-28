"use client";

import { useEffect, useState } from "react";
import { defaultAboutUsData, AboutUsFullData } from "./AboutUsData";

interface AboutApproachSectionProps {
  data?: AboutUsFullData;
}

export default function AboutApproachSection({ data: initialData }: AboutApproachSectionProps) {
  const [data, setData] = useState<AboutUsFullData>(initialData || defaultAboutUsData);

  useEffect(() => {
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
    <section className="bg-white py-10 sm:py-12 lg:py-16">
      <div className="site-container px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
          {/* Left: Heading */}
          <div>
            <p className="text-[#00AEF0] font-bold text-xs sm:text-sm mb-2 uppercase tracking-wide">
              {data.approachEyebrow}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-slate-900">
              {data.approachHeading}
            </h2>
          </div>

          {/* Right: Description */}
          <div className="lg:pl-6">
            <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-medium">
              {data.approachDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
