"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Eye } from "lucide-react";
import type { AdaptedCatalogue } from "@/lib/cms/types";

interface CataloguePreviewModalProps {
  catalogue: AdaptedCatalogue | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CataloguePreviewModal({
  catalogue,
  isOpen,
  onClose,
}: CataloguePreviewModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!catalogue) return null;

  const handleDownload = () => {
    if (catalogue.pdfUrl) {
      window.open(catalogue.pdfUrl, "_blank");
    }
  };

  const handlePreviewPdf = () => {
    if (catalogue.pdfUrl) {
      window.open(catalogue.pdfUrl, "_blank");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-2xl z-[110] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-zinc-100 rounded-full transition z-20 shadow"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            <div className="p-6 sm:p-8">
              {/* Cover Image */}
              <div className="relative w-full h-64 sm:h-80 mb-6 rounded-lg overflow-hidden bg-zinc-900">
                <Image
                  src={catalogue.coverImage}
                  alt={catalogue.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Content */}
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                  {catalogue.title}
                </h2>
                {catalogue.description && (
                  <p className="text-zinc-600 mb-4">{catalogue.description}</p>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-zinc-200 text-xs">
                  <div>
                    <p className="text-zinc-500 font-semibold uppercase mb-1">Version</p>
                    <p className="font-semibold text-black">{catalogue.version || "2024.1"}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 font-semibold uppercase mb-1">Pages</p>
                    <p className="font-semibold text-black">{catalogue.pages || "—"}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 font-semibold uppercase mb-1">Language</p>
                    <p className="font-semibold text-black">{catalogue.language || "English"}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 font-semibold uppercase mb-1">File Size</p>
                    <p className="font-semibold text-black">{catalogue.fileSize || "PDF"}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePreviewPdf}
                  className="flex-1 py-3 px-4 bg-white border-2 border-[#00AEF0] text-[#00AEF0] font-semibold rounded-lg hover:bg-sky-50 transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  View PDF
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 px-4 bg-[#00AEF0] text-white font-semibold rounded-lg hover:bg-[#0089bd] transition flex items-center justify-center gap-2 shadow-md shadow-sky-500/20"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
