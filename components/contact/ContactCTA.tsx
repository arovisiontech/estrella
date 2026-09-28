"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ContactCTA() {
  const handleScroll = () => {
    const formSection = document.getElementById("contact-form");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
      // Focus first input
      const firstInput = formSection.querySelector("input");
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 500);
      }
    }
  };

  return (
    <section className="relative bg-black py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black to-red-600/10" />

        {/* Animated glow lines */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-red-600 to-transparent"
        />
        <motion.div
          animate={{
            y: [20, 0, 20],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-transparent to-red-600"
        />

        {/* Large blur circle */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative site-container px-12 sm:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest text-red-600"
          >
            READY TO START?
          </motion.p>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
          >
            Let's Turn Your Product
            <span className="block text-red-600">Vision Into Reality.</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-zinc-300 leading-relaxed max-w-2xl mx-auto"
          >
            Our team is ready to review your requirements and guide you through the next steps of
            your manufacturing journey.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="pt-4"
          >
            <motion.button
              onClick={handleScroll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 group"
            >
              DISCUSS YOUR PROJECT
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.button>
          </motion.div>

          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="pt-8 border-t border-white/10 text-zinc-400 text-sm"
          >
            <p>
              Average response time: <span className="text-white font-semibold">24 hours</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
