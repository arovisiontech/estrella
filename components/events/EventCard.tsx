"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/lib/types/event";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface EventCardProps {
  event: Event;
  index: number;
  layout?: "horizontal" | "vertical";
}

export default function EventCard({ event, index, layout = "vertical" }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (layout === "horizontal") {
    const isEven = index % 2 === 0;
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-12 border-b border-zinc-200 last:border-b-0"
      >
        {/* Image */}
        <motion.div
          className={`relative h-72 lg:h-80 overflow-hidden rounded-2xl order-${isEven ? "1" : "2"}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link href={`/events/${event.slug}`}>
            <motion.div
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full"
            >
              <Image
                src={event.featuredImage}
                alt={event.title}
                fill
                className="object-cover"
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Content */}
        <div className={`${isEven ? "order-2" : "order-1"}`}>
          <Link href={`/events/${event.slug}`}>
            <motion.h3
              animate={{ color: isHovered ? "#dc2626" : "#000000" }}
              transition={{ duration: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 cursor-pointer"
            >
              {event.title}
            </motion.h3>
          </Link>

          <div className="flex items-center gap-4 mb-4 text-sm text-zinc-600">
            <span className="font-semibold text-red-600 uppercase">{event.eventType}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>

          <p className="text-zinc-600 leading-relaxed mb-6">{event.shortDescription}</p>

          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors group"
          >
            View Event
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight size={18} />
            </motion.div>
          </Link>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <Link href={`/events/${event.slug}`}>
          <motion.div
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <Image
              src={event.featuredImage}
              alt={event.title}
              fill
              className="object-cover"
            />
          </motion.div>
        </Link>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 px-3 py-1 rounded-full">
            {event.eventType}
          </span>
        </div>

        <Link href={`/events/${event.slug}`}>
          <motion.h3
            animate={{ color: isHovered ? "#dc2626" : "#000000" }}
            transition={{ duration: 0.3 }}
            className="text-lg sm:text-xl font-bold mb-2 cursor-pointer line-clamp-2"
          >
            {event.title}
          </motion.h3>
        </Link>

        <p className="text-sm text-zinc-600 leading-relaxed mb-4 line-clamp-2">
          {event.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-700">{formattedDate}</span>
          <Link
            href={`/events/${event.slug}`}
            className="text-red-600 hover:text-red-700 font-semibold text-sm"
          >
            Learn More →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
