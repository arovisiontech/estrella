"use client";

import Image from "next/image";
import { useState } from "react";

type HexagonImageProps = {
  src: string;
  alt: string;
  placement: "center" | "top" | "upper-left" | "upper-right" | "lower-left" | "lower-right" | "bottom";
  onClick: () => void;
};

export default function HexagonImage({
  src,
  alt,
  placement,
  onClick,
}: HexagonImageProps) {
  const [isHovering, setIsHovering] = useState(false);
  const isCenter = placement === "center";

  const hexagonClip =
    "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)";

  return (
    <div
      className="relative w-full h-full cursor-pointer shrink-0"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      style={{
        perspective: "1000px",
      }}
    >
      {/* Outer brand blue hexagon border */}
      <div
        className="absolute inset-0 bg-[#00AEF0] transition-all duration-300"
        style={{
          clipPath: hexagonClip,
          opacity: isHovering ? 1 : 0.85,
        }}
      />

      {/* Inner dark background with inset for border effect */}
      <div
        className="absolute transition-all duration-300"
        style={{
          inset: "3px",
          clipPath: hexagonClip,
          backgroundColor: "#191b1d",
        }}
      >
        {/* Image container */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            clipPath: hexagonClip,
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-all duration-300"
            style={{
              transform: isCenter
                ? isHovering
                  ? "scale(1.15) perspective(600px) rotateZ(2deg)"
                  : "scale(1)"
                : isHovering
                  ? "scale(1.08) rotate(14deg) skewX(2deg)"
                  : "scale(1)",
              transformStyle: "preserve-3d",
            }}
            priority={isCenter}
          />
        </div>
      </div>
    </div>
  );
}
