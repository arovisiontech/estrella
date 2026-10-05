"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, PlayCircle, ZoomIn } from "lucide-react";
import { useMemo, useRef, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils/cn";
import type { ProductImage, ProductMedia } from "@/lib/types/product";
import ProductVideo from "@/components/products/ProductVideo";
import ImageLightbox from "@/components/products/ImageLightbox";
import { getImageKey } from "@/lib/cms/types";

type ProductGalleryProps = {
  productName: string;
  images?: ProductImage[];
  videoUrl?: string;
  videoPoster?: ProductImage;
};

const SWIPE_THRESHOLD = 40;

export default function ProductGallery({
  productName,
  images = [],
  videoUrl,
  videoPoster,
}: ProductGalleryProps) {
  const media = useMemo<ProductMedia[]>(() => {
    const rawImages = Array.isArray(images) ? images : [];
    const validImages = rawImages
      .map((img: any) => {
        if (!img) return null;
        if (typeof img === "string" && img.trim().length > 0) {
          return { src: img.trim(), alt: productName || "Product image" };
        }
        if (typeof img === "object") {
          const src = img.src || img.url || img.image_url || img.imageUrl;
          if (typeof src === "string" && src.trim().length > 0) {
            return { src: src.trim(), alt: img.alt || productName || "Product image" };
          }
        }
        return null;
      })
      .filter((img): img is ProductImage => img !== null);

    const safeImages: ProductImage[] =
      validImages.length > 0
        ? validImages
        : [{ src: "/images/banner-sublimation-sports.svg", alt: productName || "Product image" }];

    // Deduplicate identical or re-uploaded images (e.g. timestamp-prefixed duplicates)
    const seenImageKeys = new Set<string>();
    const deduplicatedImages: ProductImage[] = [];
    for (const image of safeImages) {
      const key = getImageKey(image.src) || image.src;
      if (!seenImageKeys.has(key)) {
        seenImageKeys.add(key);
        deduplicatedImages.push(image);
      }
    }

    const items: ProductMedia[] = deduplicatedImages.map((image) => ({ type: "image", image }));

    if (videoUrl && videoPoster && (videoPoster.src || (videoPoster as any).url)) {
      const posterSrc = videoPoster.src || (videoPoster as any).url;
      items.push({
        type: "video",
        videoUrl,
        poster: { src: posterSrc, alt: videoPoster.alt || productName || "Video poster" },
      });
    }
    return items;
  }, [images, videoUrl, videoPoster, productName]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const touchStartX = useRef<number | null>(null);

  const safeIndex =
    media.length > 0 && activeIndex >= 0 && activeIndex < media.length ? activeIndex : 0;
  const active: ProductMedia = media[safeIndex] || {
    type: "image",
    image: { src: "/images/banner-sublimation-sports.svg", alt: productName || "Product image" },
  };

  const lightboxImages: ProductImage[] = media
    .filter((m): m is { type: "image"; image: ProductImage } => m.type === "image")
    .map((m) => m.image);

  const goTo = (index: number) => {
    if (media.length === 0) return;
    setActiveIndex((index + media.length) % media.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(safeIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(safeIndex - 1);
    }
    if ((event.key === "Enter" || event.key === " ") && active.type === "image") {
      event.preventDefault();
      setLightboxOpen(true);
    }
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      goTo(delta > 0 ? safeIndex - 1 : safeIndex + 1);
    }
    touchStartX.current = null;
  };

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  };

  const lightboxIndexForActive = () => {
    if (active.type !== "image") return 0;
    const idx = lightboxImages.findIndex((img) => img.src === active.image.src);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div>
      <div
        className="relative aspect-[3/4] sm:aspect-square md:aspect-[3/4] max-h-[580px] w-full overflow-hidden rounded-lg bg-zinc-50 border border-zinc-200/80 shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEF0]"
        tabIndex={0}
        role="group"
        aria-label={`${productName} media viewer, item ${safeIndex + 1} of ${media.length}`}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {active.type === "video" ? (
          <ProductVideo videoUrl={active.videoUrl} poster={active.poster} />
        ) : (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            aria-label={`Zoom into ${productName} image ${safeIndex + 1}`}
            className="group relative block h-full w-full cursor-zoom-in"
          >
            <Image
              src={active.image.src || "/images/banner-sublimation-sports.svg"}
              alt={active.image.alt || productName || "Product image"}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              style={{ transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` }}
              className={cn(
                "object-contain p-2 sm:p-4 transition-transform duration-300 ease-out",
                isZooming ? "scale-[1.9]" : "scale-100"
              )}
            />
            <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
              <ZoomIn size={14} /> Click to zoom
            </span>
          </button>
        )}

        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(safeIndex - 1)}
              aria-label="Previous media"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black shadow transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00AEF0]"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => goTo(safeIndex + 1)}
              aria-label="Next media"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black shadow transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00AEF0]"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail rail — always below the main image */}
      {media.length > 1 && (
        <div className="mt-3.5 flex items-center gap-2.5 overflow-x-auto pb-1 pt-1 scrollbar-thin">
          {media.map((item, index) => (
            <GalleryThumb
              key={index}
              item={item}
              index={index}
              active={index === safeIndex}
              onSelect={() => goTo(index)}
              productName={productName}
            />
          ))}
        </div>
      )}

      {lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndexForActive()}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

type GalleryThumbProps = {
  item: ProductMedia;
  index: number;
  active: boolean;
  onSelect: () => void;
  productName: string;
};

function GalleryThumb({ item, index, active, onSelect, productName }: GalleryThumbProps) {
  const src = item.type === "video" ? item.poster?.src : item.image?.src;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={
        item.type === "video"
          ? `Play ${productName} video`
          : `Show ${productName} image ${index + 1}`
      }
      aria-current={active}
      className={cn(
        "relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-md border-2 bg-zinc-50 transition shadow-xs",
        active ? "border-[#00AEF0] ring-2 ring-[#00AEF0]/30" : "border-zinc-200 hover:border-zinc-400"
      )}
    >
      <Image src={src || "/images/banner-sublimation-sports.svg"} alt="" fill sizes="80px" className="object-contain p-1" />
      {item.type === "video" && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/30">
          <PlayCircle size={20} className="text-white" />
        </span>
      )}
    </button>
  );
}
