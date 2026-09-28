"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactCards = [
  {
    icon: MapPin,
    label: "LOCATION",
    title: "ESTRELLA INTERNATIONAL",
    content: "Sialkot 51310 - Pakistan",
  },
  {
    icon: Phone,
    label: "PHONE",
    title: "+92-523-561460",
    content: "Monday to Saturday, 9:00 AM – 6:00 PM",
  },
  {
    icon: Mail,
    label: "EMAIL",
    title: "info@estrellainternational.com",
    content: "We typically respond within 24 hours",
  },
  {
    icon: Clock,
    label: "BUSINESS HOURS",
    title: "Monday – Saturday",
    content: "9:00 AM – 6:00 PM (Pakistan Standard Time)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function ContactInfoCards() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24 border-b border-slate-100">
      <div className="site-container px-6 sm:px-12 lg:px-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {contactCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group relative bg-white border border-slate-200 p-8 rounded-2xl transition-all duration-300 hover:border-[#00AEF0] hover:shadow-xl"
              >
                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className="inline-block p-3 bg-sky-50 text-[#00AEF0] rounded-xl group-hover:bg-[#00AEF0] group-hover:text-white transition-colors duration-300">
                    <Icon size={24} />
                  </div>

                  {/* Label */}
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {card.label}
                  </p>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-[#00AEF0] transition-colors duration-300 break-words">
                    {card.title}
                  </h3>

                  {/* Content */}
                  <p className="text-sm font-medium text-slate-500">{card.content}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
