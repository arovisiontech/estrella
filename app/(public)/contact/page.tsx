import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactIntroduction from "@/components/contact/ContactIntroduction";
import ContactInfoCards from "@/components/contact/ContactInfoCards";
import InquiryTypeCards from "@/components/contact/InquiryTypeCards";
import ContactForm from "@/components/contact/ContactForm";
import ContactMapSection from "@/components/contact/ContactMapSection";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact Us | Estrella International",
    description: "Contact Estrella International for custom sportswear, boxing gear, soccer balls, surgical instruments, bulk OEM production and international manufacturing inquiries.",
    openGraph: {
      title: "Contact Us | Estrella International",
      description: "Contact Estrella International for OEM manufacturing, bulk production and international inquiries.",
      type: "website",
    },
  };
}

export default function ContactPage() {
  return (
    <main className="bg-white">
      {/* Introduction Section */}
      <ContactIntroduction />

      {/* Contact Info Cards */}
      <ContactInfoCards />

      {/* Inquiry Type Cards */}
      <InquiryTypeCards />

      {/* Contact Form */}
      <ContactForm />

      {/* Location/Map Section */}
      <ContactMapSection />
    </main>
  );
}
