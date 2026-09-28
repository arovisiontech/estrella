"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { motionVariants } from "@/lib/motion/variants";

export default function ContactHero() {
  return (
    <section className="relative min-h-[550px] lg:min-h-[650px] overflow-hidden bg-slate-950">
      {/* Background gradient and glow */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#00AEF0]/15 to-transparent opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00AEF0]/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative site-container h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          {/* Left content */}
          <motion.div
            variants={motionVariants.containerDelayed}
            initial="hidden"
            animate="visible"
            className="z-10 flex flex-col justify-center space-y-8"
          >
            {/* Eyebrow */}
            <motion.div variants={motionVariants.fadeUp}>
              <p className="text-xs font-bold uppercase tracking-widest text-[#00AEF0]">
                ESTRELLA INTERNATIONAL — LET'S CONNECT
              </p>
            </motion.div>

            {/* Heading */}
            <motion.div variants={motionVariants.fadeUp} className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight">
                Let's Build Something
                <span className="block text-[#00AEF0]">Powerful Together.</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={motionVariants.fadeUp}
              className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-medium"
            >
              Whether You Are Looking For Custom Sportswear Manufacturing, Boxing Equipment, Soccer Footballs, Bulk Production Or Business Collaboration, Our Team Is Ready To Discuss Your Requirements.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={motionVariants.fadeUp} className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="#contact-form"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00AEF0] hover:bg-[#0090c8] text-white font-bold rounded-xl transition-all duration-300 group shadow-lg shadow-sky-500/25"
              >
                DISCUSS YOUR PROJECT
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            variants={motionVariants.fadeRight}
            initial="hidden"
            animate="visible"
            className="relative hidden lg:flex items-center justify-center h-full min-h-[500px]"
          >
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-[#00AEF0]/20 to-slate-900 flex items-center justify-center shadow-2xl">
              <div className="text-center space-y-4 p-8">
                <div className="inline-block p-4 bg-[#00AEF0]/20 rounded-2xl">
                  <Sparkles className="w-16 h-16 text-[#00AEF0]" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wide">Custom OEM Manufacturing</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Sportswear, Boxing Gear, Soccer Footballs & Surgical Tools</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
