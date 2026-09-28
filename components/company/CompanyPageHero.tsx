"use client";

import { motion } from "framer-motion";

interface CompanyPageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export default function CompanyPageHero({ eyebrow, title, subtitle }: CompanyPageHeroProps) {
  return (
    <section className="relative bg-black text-white py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-red-600 to-black" />
      </div>

      <div className="site-container px-12 sm:px-16 lg:px-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-red-600 text-sm font-semibold uppercase tracking-widest mb-4"
          >
            {eyebrow}
          </motion.p>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-zinc-300 max-w-2xl"
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
