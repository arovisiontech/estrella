"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

const certifications = [
  {
    name: "CE Mark",
    image: "/images/ce.png",
    description: "European Conformity certification for personal protective equipment compliance.",
  },
  {
    name: "FDA Approval",
    image: "/images/fda.png",
    description: "U.S. Food and Drug Administration approval for regulated materials.",
  },
  {
    name: "ISO 9001:2015",
    image: "/images/iso.png",
    description: "International quality management system certification.",
  },
  {
    name: "ISO 13485:2016",
    image: "/images/iso13.png",
    description: "Medical devices quality management system certification.",
  },
  {
    name: "SEDEX Certified",
    image: "/images/sedex.png",
    description: "Supplier Ethical Data Exchange certification for ethical practices.",
  },
];

const complianceAreas = [
  {
    title: "Product Safety",
    description:
      "All motorcycle apparel products comply with international safety standards including EN 13595 for leather jackets, EN 13634 for gloves, and EN 13595 for textile garments.",
  },
  {
    title: "Labour Standards",
    description:
      "Torque adheres to ILO (International Labour Organization) conventions and maintains ethical employment practices across all operations.",
  },
  {
    title: "Environmental Compliance",
    description:
      "Manufacturing processes comply with REACH regulations, water discharge standards and chemical management directives for sustainable production.",
  },
  {
    title: "Quality Systems",
    description:
      "ISO certified quality management systems ensure consistent product standards, traceability and continuous improvement.",
  },
  {
    title: "Supply Chain Transparency",
    description:
      "Full supply chain documentation and vendor compliance audits ensure ethical sourcing and responsible manufacturing partners.",
  },
  {
    title: "Data Protection",
    description:
      "GDPR compliant data handling practices and secure customer information management across all digital platforms.",
  },
];

export default function ComplianceContent() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black text-white py-16 sm:py-20 lg:py-28">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-red-600 text-sm font-semibold uppercase tracking-widest mb-4">QUALITY & STANDARDS</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Compliance & Certifications</h1>
            <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl">
              Torque Maintains The Highest International Standards For Product Safety, Quality And Ethical Manufacturing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
              Compliance Is Our Foundation
            </h2>
            <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
              Torque's commitment to compliance goes beyond meeting minimum requirements. We actively exceed international
              standards to ensure every product is safe, every process is ethical and every customer receives the quality they
              deserve. Our certifications reflect our dedication to continuous improvement and responsible manufacturing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-black text-white py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-16 text-center"
          >
            Our Certifications
          </motion.h2>

          <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-16 lg:gap-24">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative h-24 w-24 mb-4 flex items-center justify-center">
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    width={80}
                    height={80}
                    className="h-auto w-auto max-h-24 max-w-24 object-contain"
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{cert.name}</h3>
                <p className="text-sm text-zinc-400 max-w-xs">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Areas */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-black mb-16 text-center"
          >
            Compliance Focus Areas
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {complianceAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
                <CheckCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">{area.title}</h3>
                  <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">{area.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards Reference */}
      <section className="bg-black text-white py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">Key Standards We Follow</h2>
            <ul className="space-y-4 text-base sm:text-lg text-zinc-300">
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0">•</span>
                <span><strong>EN 13595:</strong> Personal protective equipment - clothing to protect against thermal hazards</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0">•</span>
                <span><strong>EN 13634:</strong> Personal protective equipment - gloves and mittens for motorcycle riders</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0">•</span>
                <span><strong>ISO 9001:2015:</strong> Quality management systems - requirements</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0">•</span>
                <span><strong>REACH Regulation:</strong> Registration, evaluation, authorization and restriction of chemicals</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0">•</span>
                <span><strong>GDPR:</strong> General Data Protection Regulation for customer data privacy</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0">•</span>
                <span><strong>ILO Conventions:</strong> International Labour Organization standards for ethical employment</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <p className="text-lg sm:text-xl text-zinc-700 leading-relaxed">
              Compliance is not a destination—it is a journey of continuous improvement. Torque regularly audits our
              processes, updates our practices and invests in new systems to maintain the highest standards of safety,
              quality and ethical manufacturing. Your trust is our responsibility.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
