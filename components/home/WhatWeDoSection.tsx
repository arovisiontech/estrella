"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { capabilities as defaultCapabilities } from "@/lib/data/capabilities";
import { manufacturingGallery as defaultGallery, type ManufacturingGalleryItem } from "@/lib/data/manufacturingGallery";
import CapabilityCard from "@/components/manufacturing/CapabilityCard";
import ManufacturingHoneycomb from "@/components/manufacturing/ManufacturingHoneycomb";

interface CapabilityItem {
  title: string;
  description: string;
  icon?: string;
}

export default function WhatWeDoSection() {
  const [heading, setHeading] = useState("Reliable Craftsmanship. Premium Leather Jackets.");
  const [eyebrow, setEyebrow] = useState("What We Do");
  const [capabilities, setCapabilities] = useState<CapabilityItem[]>(defaultCapabilities);
  const [gallery, setGallery] = useState<ManufacturingGalleryItem[]>(defaultGallery);
  const supabase = createClient();

  useEffect(() => {
    async function loadContent() {
      try {
        const { data } = await supabase
          .from("home_sections")
          .select("*")
          .eq("section_key", "what-we-do")
          .single();

        if (data) {
          if (data.heading || data.title) {
            setHeading(data.heading || data.title);
          }
          if (data.subheading) {
            setEyebrow(data.subheading);
          }

          const contentObj = (data.content || {}) as Record<string, any>;
          if (contentObj.capabilities && Array.isArray(contentObj.capabilities) && contentObj.capabilities.length > 0) {
            setCapabilities(contentObj.capabilities);
          }
          if (contentObj.gallery && Array.isArray(contentObj.gallery) && contentObj.gallery.length > 0) {
            setGallery(contentObj.gallery);
          }
        }
      } catch (err) {
        console.error("Error loading WhatWeDo section:", err);
      }
    }
    loadContent();
  }, []);

  return (
    <section className="bg-[#191b1d] border-t-2 border-black py-16 sm:py-20 lg:py-28 overflow-hidden">
      <div className="site-container px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:gap-14 lg:grid-cols-2 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center">
            {/* Header */}
            <div className="mb-8 sm:mb-10">
              <p className="text-sm font-bold uppercase tracking-widest text-red-600">
                {eyebrow}
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight text-white">
                {heading}
              </h2>
            </div>

            {/* Capability Cards Grid - Equal Alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 w-full items-stretch">
              {capabilities.slice(0, 4).map((cap, index) => (
                <div key={index} className="h-full">
                  <CapabilityCard
                    title={cap.title}
                    description={cap.description}
                    icon={cap.icon || defaultCapabilities[index]?.icon || "Factory"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Honeycomb Gallery */}
          <div className="flex items-center justify-center">
            <ManufacturingHoneycomb gallery={gallery} />
          </div>
        </div>
      </div>
    </section>
  );
}
