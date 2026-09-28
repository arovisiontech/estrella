"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqItems = [
  {
    id: 1,
    question: "What information should I include in my inquiry?",
    answer:
      "Please provide details about your project scope, target market, product specifications, estimated quantity, timeline, and any reference designs or materials. This helps us better understand your requirements and provide accurate feedback.",
  },
  {
    id: 2,
    question: "Can Torque manufacture private-label products?",
    answer:
      "Yes, private-label manufacturing is one of our core services. We can develop custom motorcycle apparel branded with your company identity, including custom designs, materials, and packaging. Contact our team to discuss your specifications.",
  },
  {
    id: 3,
    question: "What is the minimum order quantity?",
    answer:
      "Minimum order quantities and production timelines vary by product, materials and order requirements. Our team will confirm these details after reviewing your inquiry and understanding your specific needs.",
  },
  {
    id: 4,
    question: "Can I request product samples?",
    answer:
      "Yes, we offer sampling for product development and approval stages. Samples help ensure specifications, quality, and fit meet your requirements before full-scale production begins.",
  },
  {
    id: 5,
    question: "How long does production take?",
    answer:
      "Production timelines depend on product complexity, customization level, quantity, and current capacity. Typical timelines range from 4-12 weeks for bulk orders. We'll provide a detailed timeline during the product discussion phase.",
  },
  {
    id: 6,
    question: "Do you support international shipping?",
    answer:
      "Yes, we ship to international markets and have experience with global logistics, customs documentation, and export procedures. We can work with your preferred freight forwarder or arrange shipping through our partners.",
  },
];

export default function ContactFAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  return (
    <section className="bg-zinc-50 py-16 sm:py-20 lg:py-24">
      <div className="site-container px-12 sm:px-16 lg:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4 max-w-2xl mx-auto"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-red-600">FREQUENTLY ASKED</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
            Common Questions About Working With Torque
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full group bg-white border border-zinc-200 rounded-lg p-6 text-left transition-all duration-300 hover:border-red-600 hover:shadow-md"
                aria-expanded={openId === item.id}
                aria-controls={`faq-content-${item.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base sm:text-lg font-semibold text-black group-hover:text-red-600 transition-colors flex-1">
                    {item.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openId === item.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={20} className="text-red-600" />
                  </motion.div>
                </div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    id={`faq-content-${item.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-white border border-t-0 border-red-600/20 p-6 rounded-b-lg"
                  >
                    <p className="text-base text-zinc-700 leading-relaxed">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA below FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-zinc-700 mb-4">Didn't find the answer you're looking for?</p>
          <a
            href="#contact-form"
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Ask Our Team
          </a>
        </motion.div>
      </div>
    </section>
  );
}
