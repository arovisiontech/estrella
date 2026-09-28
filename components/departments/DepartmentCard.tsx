"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface DepartmentCardProps {
  department: any;
  index: number;
}

export default function DepartmentCard({ department, index }: DepartmentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const rawImg = department.image || department.image_url;
  const imageSrc =
    typeof rawImg === "string"
      ? rawImg
      : typeof rawImg === "object" && rawImg !== null
        ? rawImg.src || rawImg.url || "/images/banner-sublimation-sports.svg"
        : "/images/banner-sublimation-sports.svg";
  const name = department.name || "Department";
  const slug = department.slug || "";
  const shortDesc = department.shortDescription || department.short_description || department.description || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/departments/${slug}`}>
        <div
          className="group relative h-64 sm:h-72 lg:h-80 overflow-hidden rounded-2xl cursor-pointer bg-zinc-900 border border-zinc-200"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image */}
          <motion.div
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full relative"
          >
            <Image
              src={imageSrc}
              alt={name}
              fill
              className="object-cover"
              priority={index < 3}
            />
          </motion.div>

          {/* Dark Overlay on Hover */}
          <motion.div
            animate={{ opacity: isHovered ? 0.3 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black"
          />

          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
            <motion.h3
              animate={{ color: isHovered ? "#00AEF0" : "#ffffff" }}
              transition={{ duration: 0.3 }}
              className="text-lg sm:text-xl font-bold text-white"
            >
              {name}
            </motion.h3>
            {shortDesc && (
              <p className="text-xs text-zinc-300 mt-1 line-clamp-2">
                {shortDesc}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
