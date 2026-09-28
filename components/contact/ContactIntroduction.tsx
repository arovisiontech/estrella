"use client";

import { motion } from "framer-motion";

export default function ContactIntroduction() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24 border-b border-slate-100">
      <div className="site-container px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Eyebrow & Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#00AEF0]">GET IN TOUCH</p>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Talk To The Team Behind Estrella International
              </h2>
              {/* Animated cyan line */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="h-1 bg-[#00AEF0] rounded-full"
              />
            </div>
          </motion.div>

          {/* Right: Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
          >
            From initial concepts to final bulk production, we support sports brands, global distributors and athletic businesses with structured communication, clear production planning and dependable OEM manufacturing support.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
