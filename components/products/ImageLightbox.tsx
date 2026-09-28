"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ProductImage } from "@/lib/types/product";

type ImageLightboxProps = {
  images: ProductImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
};

export default function ImageLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Reset to the clicked image whenever the lightbox transitions from
  // closed to open. Adjusted during render (React's recommended pattern
  // for resetting state on prop change) instead of an effect.
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) setIndex(initialIndex);
  }

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") {
        setIndex((prev) => (prev + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [isOpen, images.length, onClose]);

  const current = images[index];

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Product image viewer"
        >
          <motion.div
            className="relative flex h-full w-full max-w-5xl items-center justify-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close image viewer"
              className="absolute right-0 top-0 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
            >
              <X size={22} />
            </button>

            {images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setIndex((prev) => (prev - 1 + images.length) % images.length)
                }
                aria-label="Previous image"
                className="absolute left-0 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 sm:left-2"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            <div className="relative h-full max-h-[80vh] w-full">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setIndex((prev) => (prev + 1) % images.length)}
                aria-label="Next image"
                className="absolute right-0 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 sm:right-2"
              >
                <ChevronRight size={26} />
              </button>
            )}

            {images.length > 1 && (
              <p className="absolute bottom-0 text-sm text-white/70">
                {index + 1} / {images.length}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
