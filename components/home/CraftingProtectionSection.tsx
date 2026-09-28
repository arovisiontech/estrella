"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ContactBadge from "@/components/home/ContactBadge";

export default function CraftingProtectionSection() {
  const [isHovering, setIsHovering] = useState(false);
  const [eyebrow, setEyebrow] = useState("TORQUE — Ride With Confidence");
  const [heading, setHeading] = useState("Crafting Protection With Style");
  const [description, setDescription] = useState(
    "Torque is a premium manufacturer of leather jackets, textile jackets, and leather gloves designed for motorcycle riders. We collaborate with global brands to create eco-friendly, high-performance products."
  );
  const [offers, setOffers] = useState([
    "On-time delivery",
    "Cost-efficient solutions",
    "High-tech manufacturing",
    "Innovative designs",
  ]);
  const [buttonText, setButtonText] = useState("More About Us");
  const [buttonLink, setButtonLink] = useState("/about");
  const [imageUrl, setImageUrl] = useState("/images/banner-our-values.svg");
  const supabase = createClient();

  useEffect(() => {
    async function loadContent() {
      try {
        const { data } = await supabase
          .from("home_sections")
          .select("*")
          .eq("section_key", "crafting-protection")
          .single();

        if (data) {
          if (data.heading) setHeading(data.heading);
          if (data.subheading) setEyebrow(data.subheading);
          if (data.description) setDescription(data.description);
          if (data.image_url) setImageUrl(data.image_url);
          if (data.button_text) setButtonText(data.button_text);
          if (data.button_link) setButtonLink(data.button_link);

          const contentObj = (data.content || {}) as Record<string, any>;
          if (contentObj.offers && Array.isArray(contentObj.offers) && contentObj.offers.length > 0) {
            setOffers(contentObj.offers);
          }
        }
      } catch (err) {
        console.error("Error loading CraftingProtection section:", err);
      }
    }
    loadContent();
  }, []);

  return (
    <section className="relative bg-black mt-2 sm:mt-3 lg:mt-4 mb-2 sm:mb-3 lg:mb-4">
      <div className="site-container">
        <div className="relative grid gap-0 lg:min-h-96 lg:grid-cols-[0.47fr_0.53fr]">
          {/* Left Content Column */}
          <div className="px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-20">
            <div className="max-w-lg space-y-5 sm:space-y-6">
              <p className="text-sm font-semibold italic text-red-600 sm:text-base">
                {eyebrow}
              </p>

              <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {heading}
              </h2>

              <p className="text-xs leading-relaxed text-zinc-200 sm:text-sm">
                {description}
              </p>

              <div className="space-y-3 pt-2">
                <p className="text-sm font-semibold italic text-red-600 sm:text-base">We Proudly Offer:</p>
                <ul className="space-y-2 text-xs text-zinc-200 sm:text-sm">
                  {offers.map((offer, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="mt-0.5 shrink-0 text-red-600">•</span>
                      <span>{offer}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <Link
                  href={buttonLink || "/about"}
                  className="inline-block bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition duration-300 hover:bg-red-700 sm:px-7"
                >
                  {buttonText}
                </Link>
              </div>
            </div>
          </div>

          {/* Right Image Column */}
          <div
            className="relative min-h-96 overflow-hidden bg-black sm:min-h-120 lg:min-h-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Image
              src={imageUrl || "/images/banner.png"}
              alt={heading || "Crafting Protection"}
              fill
              className={`object-cover transition-transform duration-700 ease-out ${
                isHovering ? "scale-105" : "scale-100"
              }`}
              priority
              unoptimized
            />
          </div>

          {/* Contact Badge */}
          <div className="absolute left-[47%] top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 lg:left-[47%] lg:top-1/2">
            <ContactBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
