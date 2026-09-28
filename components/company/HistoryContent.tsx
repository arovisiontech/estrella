"use client";

import { motion } from "framer-motion";

const timelineEvents = [
  {
    year: "1982",
    title: "Foundation",
    description:
      "Torque was established in Pakistan with an initial focus on leather garments and protective motorcycle apparel.",
  },
  {
    year: "1990s",
    title: "Manufacturing Expansion",
    description:
      "Production capacity expanded with dedicated departments for pattern making, cutting, stitching, finishing and quality inspection.",
  },
  {
    year: "2000s",
    title: "International Market Development",
    description:
      "Torque began supporting international clients, private-label brands, distributors and motorcycle apparel businesses.",
  },
  {
    year: "2010s",
    title: "Technology And Quality Growth",
    description:
      "Modern production systems, improved material testing and stronger quality-control processes were introduced across the manufacturing workflow.",
  },
  {
    year: "2020s",
    title: "Sustainable Innovation",
    description:
      "Torque increased its focus on responsible manufacturing, efficient production, durable materials and environmentally conscious practices.",
  },
  {
    year: "Today",
    title: "Built For Global Riders",
    description:
      "Torque continues to manufacture motorcycle jackets, gloves, textile trousers and protective riding apparel for brands and riders worldwide.",
  },
];

export default function HistoryContent() {
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
            <p className="text-red-600 text-sm font-semibold uppercase tracking-widest mb-4">THE TORQUE JOURNEY</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Our History</h1>
            <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl">
              Four Decades Of Craftsmanship, Innovation And Motorcycle Apparel Manufacturing.
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
              From A Local Workshop To A Trusted Manufacturing Brand
            </h2>
            <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
              Torque began its journey in Pakistan in 1982 with a clear purpose: to manufacture dependable motorcycle
              apparel for riders who demand protection, comfort and performance. What started as a focused production
              operation gradually developed into a complete manufacturing system supported by skilled professionals, modern
              machinery and international quality practices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-black text-white py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-16 text-center"
          >
            Our Journey Through The Decades
          </motion.h2>

          <div className="max-w-4xl mx-auto">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-12 pb-12 border-b border-zinc-700 last:border-b-0 last:pb-0"
              >
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <span className="text-red-600 font-bold text-lg whitespace-nowrap">{event.year}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{event.title}</h3>
                    <p className="text-zinc-300 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
              Our history is defined by continuous improvement. Every generation of Torque products reflects decades of
              manufacturing knowledge, changing rider expectations and our commitment to building dependable motorcycle gear.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
