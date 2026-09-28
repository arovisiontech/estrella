"use client";

import { useState, useEffect } from "react";
import { defaultAboutUsData, AboutUsFullData } from "./AboutUsData";

type TabId = "who-we-are" | "production" | "value";

interface AboutTabsProps {
  data?: AboutUsFullData;
}

export default function AboutTabs({ data: initialData }: AboutTabsProps) {
  const [data, setData] = useState<AboutUsFullData>(initialData || defaultAboutUsData);
  const [activeTab, setActiveTab] = useState<TabId>("who-we-are");

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

  const tabs: { id: TabId; label: string }[] = [
    { id: "who-we-are", label: "WHO WE ARE" },
    { id: "production", label: "PRODUCTION FACILITY & WORKFORCE" },
    { id: "value", label: "OUR VALUE" },
  ];

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-16">
      <div className="site-container px-4 sm:px-8 lg:px-12">
        <div className="rounded-xl border border-slate-200 shadow-md overflow-hidden">
          {/* Tab Buttons */}
          <div
            className="flex flex-wrap sm:flex-nowrap border-b border-slate-200"
            role="tablist"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                className={`flex-1 px-4 py-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#00AEF0] text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Panels */}
          <div className="bg-white">
            {/* WHO WE ARE */}
            <div
              id="panel-who-we-are"
              role="tabpanel"
              aria-labelledby="who-we-are"
              className={`transition-all duration-300 overflow-hidden ${
                activeTab === "who-we-are" ? "block" : "hidden"
              }`}
            >
              <div className="px-6 py-8">
                <p className="text-sm sm:text-base leading-relaxed text-slate-700 mb-6 font-medium">
                  {data.whoWeAreText}
                </p>

                <h3 className="text-xs font-bold uppercase tracking-wider text-[#00AEF0] mb-3">
                  We Proudly Offer:
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-semibold">
                  {data.whoWeAreOffers.map((offer, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <span className="text-[#00AEF0] font-bold">•</span>
                      <span>{offer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PRODUCTION FACILITY & WORKFORCE */}
            <div
              id="panel-production"
              role="tabpanel"
              aria-labelledby="production"
              className={`transition-all duration-300 overflow-hidden ${
                activeTab === "production" ? "block" : "hidden"
              }`}
            >
              <div className="px-6 py-8">
                <div className="space-y-6 text-slate-700">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {data.productionTitle1}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                      {data.productionDesc1}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {data.productionTitle2}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                      {data.productionDesc2}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">
                      {data.productionTitle3}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                      {data.productionDesc3}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* OUR VALUE */}
            <div
              id="panel-value"
              role="tabpanel"
              aria-labelledby="value"
              className={`transition-all duration-300 overflow-hidden ${
                activeTab === "value" ? "block" : "hidden"
              }`}
            >
              <div className="px-6 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-[#00AEF0] mb-1">
                      {data.value1Title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                      {data.value1Desc}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#00AEF0] mb-1">
                      {data.value2Title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                      {data.value2Desc}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#00AEF0] mb-1">
                      {data.value3Title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                      {data.value3Desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
