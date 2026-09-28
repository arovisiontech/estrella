"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, Download } from "lucide-react";
import type { AdaptedCatalogue } from "@/lib/cms/types";
import { motion } from "framer-motion";

interface CatalogueCardProps {
  catalogue: AdaptedCatalogue;
  onPreview: (catalogue: AdaptedCatalogue) => void;
}

export default function CatalogueCard({ catalogue, onPreview }: CatalogueCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = () => {
    if (catalogue.pdfUrl) {
      window.open(catalogue.pdfUrl, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div
        className="relative h-full bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-zinc-100 flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Cover Image Container */}
        <div className="relative h-72 overflow-hidden cursor-pointer bg-zinc-900" onClick={() => onPreview(catalogue)}>
          <motion.div
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full relative"
          >
            <Image
              src={catalogue.coverImage}
              alt={catalogue.title}
              fill
              className="object-cover"
              priority={catalogue.featured}
            />
          </motion.div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

          {/* Featured Badge */}
          {catalogue.featured && (
            <div className="absolute top-3 right-3 bg-[#00AEF0] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm">
              Featured
            </div>
          )}

          {/* PDF Icon */}
          <div className="absolute top-3 left-3 bg-white/90 p-2 rounded-lg shadow">
            <FileText className="w-5 h-5 text-[#00AEF0]" />
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 bg-white flex flex-col flex-1 justify-between">
          <div>
            {/* Title */}
            <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
              {catalogue.title}
            </h3>

            {/* Description */}
            {catalogue.description && (
              <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                {catalogue.description}
              </p>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
              <div>
                <p className="text-zinc-500 font-semibold uppercase">Version</p>
                <p className="text-black font-medium">{catalogue.version || "2024.1"}</p>
              </div>
              <div>
                <p className="text-zinc-500 font-semibold uppercase">Pages</p>
                <p className="text-black font-medium">{catalogue.pages || "—"}</p>
              </div>
              <div>
                <p className="text-zinc-500 font-semibold uppercase">Language</p>
                <p className="text-black font-medium">{catalogue.language || "English"}</p>
              </div>
              <div>
                <p className="text-zinc-500 font-semibold uppercase">Size</p>
                <p className="text-black font-medium">{catalogue.fileSize || "PDF"}</p>
              </div>
            </div>

            {/* Updated Date */}
            <p className="text-xs text-zinc-400 mb-4">
              Updated: {new Date(catalogue.updatedDate).toLocaleDateString()}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-auto pt-2">
            <button
              onClick={() => onPreview(catalogue)}
              className="flex-1 py-2.5 px-3 bg-white border-2 border-[#00AEF0] text-[#00AEF0] font-semibold rounded text-sm hover:bg-sky-50 transition-colors duration-200 text-center"
            >
              Preview
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-3 bg-[#00AEF0] text-white font-semibold rounded text-sm hover:bg-[#0089bd] transition-colors duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
