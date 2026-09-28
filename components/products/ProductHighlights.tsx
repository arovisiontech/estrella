"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ProductHighlight } from "@/lib/types/product";

type ProductHighlightsProps = {
  highlights: ProductHighlight[];
};

export default function ProductHighlights({ highlights }: ProductHighlightsProps) {
  if (highlights.length === 0) return null;

  return (
    <div className="mt-10 border-t border-zinc-200 pt-6">
      <p className="text-center text-sm font-medium italic text-red-600">Highlights</p>

      <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-5">
        {highlights.map((highlight) => (
          <motion.div
            key={highlight.title}
            className="group cursor-pointer"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-zinc-100">
              <Image
                src={highlight.image.src}
                alt={highlight.image.alt}
                fill
                sizes="(max-width: 640px) 33vw, 15vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>
            <motion.p
              className="mt-3 text-sm font-semibold text-black"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {highlight.title}
            </motion.p>
            <motion.p
              className="mt-1 text-xs leading-relaxed text-zinc-600 sm:text-sm"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1, color: "#000" }}
              transition={{ duration: 0.2 }}
            >
              {highlight.description}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
