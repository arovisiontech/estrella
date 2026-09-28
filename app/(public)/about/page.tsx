import type { Metadata } from "next";
import AboutBreadcrumb from "@/components/about/AboutBreadcrumb";
import AboutIntroSection from "@/components/about/AboutIntroSection";
import AboutApproachSection from "@/components/about/AboutApproachSection";
import AboutTabs from "@/components/about/AboutTabs";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About Us | Estrella International",
    description: "Learn about Estrella International - a trusted global manufacturer of high-performance sportswear, boxing equipment, soccer balls & precision surgical instruments.",
    openGraph: {
      title: "About Us | Estrella International",
      description: "Trusted manufacturer of high-performance sportswear & precision surgical instruments.",
      type: "website",
    },
  };
}

export default async function AboutPage() {
  return (
    <main className="bg-white">
      <AboutBreadcrumb />
      <AboutIntroSection />
      <AboutApproachSection />
      <AboutTabs />
    </main>
  );
}
