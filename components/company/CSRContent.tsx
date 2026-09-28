"use client";

import Link from "next/link";
import { Home, Heart, Shield, BookOpen, Users, Leaf, Handshake } from "lucide-react";
import { motion } from "framer-motion";

const csrPillars = [
  {
    icon: Heart,
    title: "Employee Wellbeing",
    description:
      "We believe that healthy and satisfied employees are the foundation of a successful business. Torque provides competitive compensation, healthcare benefits, mental health support and a supportive work environment.",
  },
  {
    icon: Shield,
    title: "Workplace Safety",
    description:
      "Safety is non-negotiable. We maintain rigorous safety standards, provide protective equipment, conduct regular safety training and investigate incidents to create a zero-harm workplace.",
  },
  {
    icon: BookOpen,
    title: "Skills Development",
    description:
      "We invest in our employees' growth through vocational training, technical certifications, leadership development and continuous learning opportunities to build career pathways.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Torque supports local communities through employment creation, educational partnerships, scholarship programs and participation in community development initiatives.",
  },
  {
    icon: Leaf,
    title: "Environmental Responsibility",
    description:
      "We are committed to reducing our environmental footprint through efficient production, waste reduction, sustainable material sourcing and responsible manufacturing practices.",
  },
  {
    icon: Handshake,
    title: "Ethical Manufacturing",
    description:
      "Ethical business practices are fundamental. We comply with international labour standards, ensure fair wages, maintain transparent supply chains and operate with integrity.",
  },
];

export default function CSRContent() {
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
            <p className="text-red-600 text-sm font-semibold uppercase tracking-widest mb-4">CORPORATE RESPONSIBILITY</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">Our CSR Commitment</h1>
            <p className="text-lg sm:text-xl text-zinc-300 max-w-2xl">
              Building A Responsible Business That Creates Positive Impact For Employees, Communities And The Environment.
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
              Responsibility At The Core Of Everything We Do
            </h2>
            <p className="text-base sm:text-lg text-zinc-700 leading-relaxed">
              At Torque, corporate social responsibility is not an afterthought—it is woven into the fabric of our
              operations. We believe that building quality motorcycle apparel means building a quality company that cares
              for its people, respects the environment and contributes meaningfully to society.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CSR Pillars */}
      <section className="bg-black text-white py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-white mb-16 text-center"
          >
            Our Six CSR Pillars
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {csrPillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 hover:border-red-600 transition"
                >
                  <div className="mb-6">
                    <Icon size={48} className="text-red-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">{pillar.title}</h3>
                  <p className="text-zinc-300 leading-relaxed">{pillar.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitments Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container px-12 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-8">Our Commitments</h2>
            <ul className="space-y-4 text-base sm:text-lg text-zinc-700">
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0 mt-1">✓</span>
                <span>Maintain safe, healthy and respectful work environments for all employees</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0 mt-1">✓</span>
                <span>Provide fair compensation and competitive benefits packages</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0 mt-1">✓</span>
                <span>Support continuous training and professional development</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0 mt-1">✓</span>
                <span>Minimize environmental impact across all operations</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0 mt-1">✓</span>
                <span>Comply with all local and international regulations</span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold flex-shrink-0 mt-1">✓</span>
                <span>Conduct business with transparency and ethical integrity</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Closing Section */}
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
              Torque's CSR journey is ongoing. We regularly review our practices, seek stakeholder feedback and explore
              new ways to create positive impact. By building responsibility into our business, we build better products
              and better futures for everyone connected to Torque.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
