"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ContentSectionProps {
  children: ReactNode;
  isDark?: boolean;
}

export default function ContentSection({ children, isDark = false }: ContentSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`py-16 sm:py-20 lg:py-24 ${isDark ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <div className="site-container px-12 sm:px-16 lg:px-24">
        {children}
      </div>
    </motion.section>
  );
}
