"use client";

import { motion } from "framer-motion";

export default function DepartmentsIntro() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="site-container px-12 sm:px-16 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Badge & Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-3 bg-black text-white px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#00AEF0]" />
              <span className="text-xs font-bold uppercase tracking-wide">
                OUR DEPARTMENTS
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black leading-tight">
              How We Process Across
            </h1>
          </motion.div>

          {/* Right: Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-start"
          >
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Every Department Plays A Vital Role In Bringing Our Products Through A
              Streamlined And Quality-Driven Workflow To Ensure Precision, Consistency,
              And Efficiency. From Product Design And Manufacturing To Quality Assurance,
              Packing, And Global Logistics, Each Stage Is Carefully Coordinated Under One
              Standard.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
