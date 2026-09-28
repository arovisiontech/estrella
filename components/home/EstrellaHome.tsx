"use client";

import Hero from "./Hero";
import DiscoverCategoriesSection from "./DiscoverCategoriesSection";
import EliteFootballCollection from "./EliteFootballCollection";
import ConceptToCreationSection from "./ConceptToCreationSection";
import HowWeWorkSection from "./HowWeWorkSection";
import WhoWeManufactureForSection from "./WhoWeManufactureForSection";
import ParallaxBannerSection from "./ParallaxBannerSection";
import ManufacturingProcessSection from "./ManufacturingProcessSection";
import FAQSection from "./FAQSection";
import {
  Building2,
  ShieldCheck,
  Globe2,
  PackageCheck,
} from "lucide-react";

const capabilities = [
  {
    icon: Building2,
    title: "Custom Manufacturing & OEM",
    description:
      "Precision custom manufacturing tailored to your exact specifications, materials, and branding standards.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Quality Control",
    description:
      "Rigorously audited quality control procedures with multi-stage ISO testing for zero-defect output.",
  },
  {
    icon: Globe2,
    title: "Global Supply Chain & Export",
    description:
      "Seamless door-to-door international logistics, customs compliance, and container shipping worldwide.",
  },
  {
    icon: PackageCheck,
    title: "Bulk Wholesale & B2B Supply",
    description:
      "Competitive tiered pricing models for enterprise distributors, commercial clients, and high-volume orders.",
  },
];

const stats = [
  { label: "Global Clients", value: "500+" },
  { label: "Countries Served", value: "45+" },
  { label: "Quality Pass Rate", value: "99.8%" },
  { label: "Inquiry Response Time", value: "< 2 Hrs" },
];

export default function EstrellaHome() {
  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* HERO BANNER SLIDER */}
      <Hero />

      {/* MADE TO MOVE. BUILT TO WIN. - ELITE FOOTBALL COLLECTION */}
      <EliteFootballCollection />

      {/* DISCOVER OUR CATEGORIES SECTION */}
      <DiscoverCategoriesSection />

      {/* FROM CONCEPT TO CREATION SECTION (SS 1) */}
      <ConceptToCreationSection />

      {/* HOW WE WORK SECTION (SS 1) */}
      <HowWeWorkSection />

      {/* STATS STRIP SECTION */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="site-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs"
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-[#00AEF0]">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS CAPABILITIES SECTION (SS 3: Why Global Clients Choose Estrella) */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="site-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#00AEF0] bg-sky-50 px-3 py-1 rounded-full">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 mt-4">
              Why Global Clients Choose Estrella
            </h2>
            <p className="mt-4 text-slate-600 text-base">
              End-to-end commercial operations designed to scale your business with uncompromised precision and reliability.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative rounded-2xl border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:border-[#00AEF0] hover:bg-white hover:shadow-lg"
                >
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-sky-100 text-[#00AEF0] group-hover:bg-[#00AEF0] group-hover:text-white transition-all duration-300">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHO WE MANUFACTURE FOR SECTION (SS 1 & 2 - Placed right below SS 3) */}
      <WhoWeManufactureForSection />

      {/* PARALLAX BANNER SECTION (Brochure Media Image Parallax) */}
      <ParallaxBannerSection />

      {/* OUR MANUFACTURING PROCESS OF THE GARMENTS (SS 4 & 5 - Hexagons + Hover Animations) */}
      <ManufacturingProcessSection />

      {/* FREQUENTLY ASKED QUESTIONS (FAQ Accordion Section) */}
      <FAQSection />
    </div>
  );
}
