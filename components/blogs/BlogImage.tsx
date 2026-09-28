"use client";

import Image from "next/image";
import { useState } from "react";

type BlogImageProps = {
  src: string;
  alt: string;
};

export default function BlogImage({ src, alt }: BlogImageProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg mb-6"
      style={{
        aspectRatio: "16 / 9",
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background glow effect */}
      <div
        className="absolute inset-0 rounded-lg transition-all duration-500 pointer-events-none"
        style={{
          boxShadow: isHovering
            ? "0 0 40px rgba(220, 38, 38, 0.6), inset 0 0 40px rgba(220, 38, 38, 0.2)"
            : "0 0 0px rgba(220, 38, 38, 0)",
          zIndex: 1,
        }}
      />

      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-all duration-500"
        style={{
          transform: isHovering ? "scale(1.12)" : "scale(1)",
          filter: isHovering ? "brightness(1.2) contrast(1.1)" : "brightness(1) contrast(1)",
        }}
        priority
      />
    </div>
  );
}
