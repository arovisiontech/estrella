"use client";

import { motion } from "framer-motion";
import { Briefcase, Factory, Lightbulb, Handshake } from "lucide-react";

const inquiryTypes = [
  {
    id: "private-label",
    icon: Briefcase,
    title: "Private Label Manufacturing",
    description:
      "Develop custom sportswear, boxing gear, soccer balls and surgical instruments branded with your specifications.",
  },
  {
    id: "bulk-production",
    icon: Factory,
    title: "Bulk Production",
    description:
      "Large-scale OEM manufacturing of custom sportswear and equipment with dedicated production scheduling and quality control.",
  },
  {
    id: "product-development",
    icon: Lightbulb,
    title: "Product Development",
    description:
      "Collaborate with our R&D team to design innovative sportswear, sublimation kits, and customized sports equipment.",
  },
  {
    id: "distribution",
    icon: Handshake,
    title: "Distribution Partnership",
    description:
      "Become an authorized international distributor and bring Estrella products to your region with full support.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function InquiryTypeCards() {
  const handleSelectInquiry = (inquiryId: string) => {
    // Scroll to form and set inquiry type
    const formSection = document.getElementById("contact-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
      // Dispatch custom event to form to set inquiry type
      window.dispatchEvent(
        new CustomEvent("selectInquiry", { detail: { inquiryType: inquiryId } })
      );
    }
  };

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="site-container px-12 sm:px-16 lg:px-24">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00AEF0]">
            WHAT WE DO
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
            How Can We Help You?
          </h2>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {inquiryTypes.map((inquiry) => {
            const Icon = inquiry.icon;
            return (
              <motion.button
                key={inquiry.id}
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectInquiry(inquiry.id)}
                className="group relative text-left bg-white border border-zinc-200 p-8 rounded-lg transition-all duration-300 hover:border-[#00AEF0] cursor-pointer"
              >
                {/* Hover glow background */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00AEF0]/0 to-[#00AEF0]/0 group-hover:from-[#00AEF0]/5 group-hover:to-[#00AEF0]/10 transition-all duration-300" />

                {/* Cyan line accent on hover */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 h-1 bg-[#00AEF0] rounded-b-lg origin-left"
                  style={{ width: "100%" }}
                />

                <div className="relative z-10 space-y-6">
                  {/* Icon */}
                  <div className="inline-block p-4 bg-sky-50 rounded-lg group-hover:bg-sky-100 transition-colors duration-300">
                    <Icon size={32} className="text-[#00AEF0]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-black group-hover:text-[#00AEF0] transition-colors duration-300">
                    {inquiry.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-zinc-700 leading-relaxed">{inquiry.description}</p>

                  {/* CTA Arrow */}
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#00AEF0] group-hover:text-[#0089bd] pt-2 transition-colors"
                  >
                    Select This Option
                    <span>→</span>
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
