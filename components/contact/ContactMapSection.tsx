"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function ContactMapSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="site-container px-12 sm:px-16 lg:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#00AEF0]">LOCATION</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">Visit Our Office</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
          {/* Interactive Google Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2 relative rounded-lg overflow-hidden border border-zinc-200 h-96 lg:h-[500px] shadow-sm group"
          >
            <iframe
              title="Estrella International Location Map"
              src="https://maps.google.com/maps?q=Estrella+International,+China+Chowk,+Sialkot,+Pakistan&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Get Directions overlay button */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-10">
              <Link
                href="https://share.google/ZiUd0XS8jeTIxeBqr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#00AEF0] hover:bg-[#0089bd] text-white font-semibold rounded-lg shadow-lg shadow-sky-500/20 transition-all duration-300 transform hover:scale-105"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
              </Link>
            </div>
          </motion.div>

          {/* Right column - Contact details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Main address */}
            <div className="space-y-4">
              <div className="inline-block p-3 bg-sky-50 rounded-lg">
                <MapPin size={24} className="text-[#00AEF0]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-black mb-1">ESTRELLA INTERNATIONAL</h3>
                <p className="text-sm font-semibold text-zinc-700">CHINA CHOWK</p>
                <p className="text-sm text-zinc-600 mt-2">Sialkot 51310</p>
                <p className="text-sm text-zinc-600">Pakistan</p>
              </div>
            </div>

            {/* Phone */}
            <motion.div whileHover={{ x: 4 }} className="space-y-4">
              <div className="inline-block p-3 bg-sky-50 rounded-lg">
                <Phone size={24} className="text-[#00AEF0]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">
                  Phone
                </p>
                <Link
                  href="tel:+92-52-3561460"
                  className="text-lg font-bold text-black hover:text-[#00AEF0] transition-colors"
                >
                  +92-52-3561460
                </Link>
                <p className="text-xs text-zinc-600 mt-2">Mon-Sat: 9:00 AM – 6:00 PM</p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div whileHover={{ x: 4 }} className="space-y-4">
              <div className="inline-block p-3 bg-sky-50 rounded-lg">
                <Mail size={24} className="text-[#00AEF0]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-2">
                  Email
                </p>
                <Link
                  href="mailto:info@estrella-international.com"
                  className="text-lg font-bold text-black hover:text-[#00AEF0] transition-colors break-all"
                >
                  info@estrella-international.com
                </Link>
                <p className="text-xs text-zinc-600 mt-2">Response within 24 hours</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

