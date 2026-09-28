"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { manufacturingGallery, type ManufacturingGalleryItem } from "@/lib/data/manufacturingGallery";
import HexagonImage from "./HexagonImage";

interface ManufacturingHoneycombProps {
  gallery?: ManufacturingGalleryItem[];
}

export default function ManufacturingHoneycomb({ gallery }: ManufacturingHoneycombProps) {
  const activeGallery = gallery && gallery.length > 0 ? gallery : manufacturingGallery;
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleImageClick = (imageId: string) => {
    setSelectedImageId(imageId);
    setIsLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setSelectedImageId(null);
  }, []);

  const handlePrevious = useCallback(() => {
    setSelectedImageId((prev) => {
      if (!prev) return null;
      const currentIndex = activeGallery.findIndex((img: ManufacturingGalleryItem) => img.id === prev);
      const newIndex = currentIndex === 0 ? activeGallery.length - 1 : currentIndex - 1;
      return activeGallery[newIndex].id;
    });
  }, [activeGallery]);

  const handleNext = useCallback(() => {
    setSelectedImageId((prev) => {
      if (!prev) return null;
      const currentIndex = activeGallery.findIndex((img: ManufacturingGalleryItem) => img.id === prev);
      const newIndex = currentIndex === activeGallery.length - 1 ? 0 : currentIndex + 1;
      return activeGallery[newIndex].id;
    });
  }, [activeGallery]);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, closeLightbox, handlePrevious, handleNext]);

  const currentImage = activeGallery.find((img: ManufacturingGalleryItem) => img.id === selectedImageId);

  const getImageByPlacement = (placement: string) => {
    return activeGallery.find((img: ManufacturingGalleryItem) => img.placement === placement);
  };

  return (
    <>
      {/* Honeycomb Gallery Container */}
      <div className="w-full flex justify-center items-center py-4 sm:py-6">
        <div className="relative w-full max-w-[460px] sm:max-w-[580px] md:max-w-[680px] lg:max-w-[760px] xl:max-w-[880px] 2xl:max-w-[980px] aspect-square mx-auto">
          {/* Honeycomb layout with positioned hexagons */}

          {/* Center Large Hexagon */}
          {getImageByPlacement("center") && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] z-20">
              <HexagonImage
                src={getImageByPlacement("center")!.src}
                alt={getImageByPlacement("center")!.alt}
                placement="center"
                onClick={() => handleImageClick(getImageByPlacement("center")!.id)}
              />
            </div>
          )}

          {/* Top Small Hexagon */}
          {getImageByPlacement("top") && (
            <div className="absolute left-1/2 top-[0%] -translate-x-1/2 w-[30%] h-[30%] z-10">
              <HexagonImage
                src={getImageByPlacement("top")!.src}
                alt={getImageByPlacement("top")!.alt}
                placement="top"
                onClick={() => handleImageClick(getImageByPlacement("top")!.id)}
              />
            </div>
          )}

          {/* Upper Left Small Hexagon */}
          {getImageByPlacement("upper-left") && (
            <div className="absolute left-[1%] top-[19%] w-[30%] h-[30%] z-10">
              <HexagonImage
                src={getImageByPlacement("upper-left")!.src}
                alt={getImageByPlacement("upper-left")!.alt}
                placement="upper-left"
                onClick={() => handleImageClick(getImageByPlacement("upper-left")!.id)}
              />
            </div>
          )}

          {/* Upper Right Small Hexagon */}
          {getImageByPlacement("upper-right") && (
            <div className="absolute right-[1%] top-[19%] w-[30%] h-[30%] z-10">
              <HexagonImage
                src={getImageByPlacement("upper-right")!.src}
                alt={getImageByPlacement("upper-right")!.alt}
                placement="upper-right"
                onClick={() => handleImageClick(getImageByPlacement("upper-right")!.id)}
              />
            </div>
          )}

          {/* Lower Left Small Hexagon */}
          {getImageByPlacement("lower-left") && (
            <div className="absolute left-[1%] bottom-[19%] w-[30%] h-[30%] z-10">
              <HexagonImage
                src={getImageByPlacement("lower-left")!.src}
                alt={getImageByPlacement("lower-left")!.alt}
                placement="lower-left"
                onClick={() => handleImageClick(getImageByPlacement("lower-left")!.id)}
              />
            </div>
          )}

          {/* Lower Right Small Hexagon */}
          {getImageByPlacement("lower-right") && (
            <div className="absolute right-[1%] bottom-[19%] w-[30%] h-[30%] z-10">
              <HexagonImage
                src={getImageByPlacement("lower-right")!.src}
                alt={getImageByPlacement("lower-right")!.alt}
                placement="lower-right"
                onClick={() => handleImageClick(getImageByPlacement("lower-right")!.id)}
              />
            </div>
          )}

          {/* Bottom Small Hexagon */}
          {getImageByPlacement("bottom") && (
            <div className="absolute left-1/2 bottom-[0%] -translate-x-1/2 w-[30%] h-[30%] z-10">
              <HexagonImage
                src={getImageByPlacement("bottom")!.src}
                alt={getImageByPlacement("bottom")!.alt}
                placement="bottom"
                onClick={() => handleImageClick(getImageByPlacement("bottom")!.id)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-red-600 transition-colors"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-6 text-white hover:text-red-600 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Image container */}
          <div
            className="relative w-11/12 h-5/6 max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-6 text-white hover:text-red-600 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={40} />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm">
            <p>
              {activeGallery.findIndex((img: ManufacturingGalleryItem) => img.id === selectedImageId) + 1} /{" "}
              {activeGallery.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
