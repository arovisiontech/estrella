"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap, Target } from "lucide-react";

const qualityProcessSteps = [
  {
    step: "01",
    title: "Material Selection",
    description:
      "We source premium leather, textiles and protective materials from certified suppliers who meet our rigorous quality standards.",
  },
  {
    step: "02",
    title: "Pattern Design",
    description:
      "Expert pattern makers design garments for optimal fit, comfort and protection using advanced CAD software and physical testing.",
  },
  {
    step: "03",
    title: "Cutting Precision",
    description:
      "Automated cutting systems ensure consistent material usage and precise dimensions across every garment produced.",
  },
  {
    step: "04",
    title: "Manufacturing",
    description:
      "Skilled craftspeople construct each garment following standardized processes with strict quality checkpoints at every stage.",
  },
  {
    step: "05",
    title: "Quality Inspection",
    description:
      "Comprehensive inspection of stitching, seams, reinforcements, zippers and overall construction ensures every piece meets standards.",
  },
  {
    step: "06",
    title: "Testing & Certification",
    description:
      "Products undergo performance testing for safety, durability and protection before certification and final packaging.",
  },
];

const qualityMetrics = [
  {
    metric: "99.2%",
    label: "First-Pass Approval",
    description: "Products meeting quality standards without requiring rework",
  },
  {
    metric: "0.8%",
    label: "Defect Rate",
    description: "Industry-leading low defect percentage across all products",
  },
  {
    metric: "100%",
    label: "Inspection Coverage",
    description: "Every single product undergoes rigorous quality inspection",
  },
  {
    metric: "50+",
    label: "Quality Checkpoints",
    description: "Multiple touchpoints throughout the manufacturing process",
  },
];

const inspectionAreas = [
  {
    icon: CheckCircle2,
    title: "Stitching Quality",
    description: "Thread tension, stitch length and seam strength validation",
  },
  {
    icon: Zap,
    title: "Safety Features",
    description: "Reinforcement placement, padding integrity and closure functionality",
  },
  {
    icon: Target,
    title: "Fit & Comfort",
    description: "Sizing accuracy, flexibility and ergonomic design verification",
  },
];

export default function QualityContent() {
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
            <p className="text-red-600 text-sm font-semibold uppercase tracking-widest mb-4">QUALITY EXCELLENCE</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Our Quality Promise</h1>
            <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl">
              Every Torque Garment Is Built With Precision, Tested For Performance And Delivered To Exceed Rider Expectations.
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
              Quality Built Into Every Step
            </h2>
            <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
              Quality is not just a final inspection—it is woven into every stage of our manufacturing process. From material
              selection through to final packaging, Torque maintains unwavering commitment to excellence. We don't compromise
              on quality because riders depend on our products for protection.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quality Process */}
      <section className="bg-black text-white py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-16 text-center"
          >
            The Six Stages Of Quality
          </motion.h2>

          <div className="space-y-8 max-w-4xl mx-auto">
            {qualityProcessSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-8 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-red-600 text-white font-bold text-2xl">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-300 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Metrics */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-black mb-16 text-center"
          >
            Quality By The Numbers
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualityMetrics.map((item, index) => (
              <motion.div
                key={item.metric}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-zinc-50 border border-zinc-200 rounded-lg p-8 text-center hover:border-red-600 transition"
              >
                <div className="text-4xl sm:text-5xl font-bold text-red-600 mb-3">{item.metric}</div>
                <h3 className="text-lg sm:text-xl font-bold text-black mb-2">{item.label}</h3>
                <p className="text-sm sm:text-base text-zinc-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspection Areas */}
      <section className="bg-black text-white py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-16 text-center"
          >
            What We Inspect
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {inspectionAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center hover:border-red-600 transition"
                >
                  <Icon size={48} className="text-red-600 mx-auto mb-6" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{area.title}</h3>
                  <p className="text-zinc-300">{area.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testing & Standards */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8">Performance Testing</h2>
            <ul className="space-y-4 text-base sm:text-lg text-zinc-700">
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0 mt-1">✓</span>
                <span>Tensile strength testing for leather and textile materials</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0 mt-1">✓</span>
                <span>Thermal protection evaluation of protective padding</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0 mt-1">✓</span>
                <span>Abrasion resistance testing for riding surfaces</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0 mt-1">✓</span>
                <span>Seam strength validation and flexibility testing</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0 mt-1">✓</span>
                <span>Color fastness and durability verification</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0 mt-1">✓</span>
                <span>Closure mechanism reliability and safety checks</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="bg-black text-white py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed">
              Quality is our promise to every rider. We invest time, expertise and resources into rigorous testing and
              inspection because we understand that motorcycle apparel is not just fashion—it is protection. When you choose
              Torque, you choose a brand that puts your safety first.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
