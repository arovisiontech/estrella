"use client";

import Image from "next/image";
import { useState } from "react";

const certifications = [
  { id: "iso-13485", src: "/images/iso13.png", alt: "ISO 13485 Certification", width: 100, height: 100 },
  { id: "fda", src: "/images/fda.png", alt: "FDA Certification", width: 120, height: 80 },
  { id: "ce", src: "/images/ce.png", alt: "CE Certification", width: 100, height: 100 },
  { id: "sedex", src: "/images/sedex.png", alt: "Sedex Certification", width: 110, height: 80 },
  { id: "iso-9001", src: "/images/iso.png", alt: "ISO 9001 Certification", width: 100, height: 100 },
];

export default function CertificationsStrip() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-16 border-t border-zinc-200">
      <div className="site-container px-12 sm:px-16 lg:px-24">
        <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-16 lg:gap-24">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="flex items-center justify-center"
              onMouseEnter={() => setHoveredId(cert.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                animation: `fadeUpScale 0.6s ease-out forwards`,
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
              }}
            >
              <div
                className={`relative flex items-center justify-center transition-transform duration-300 ${
                  hoveredId === cert.id ? "scale-110" : "scale-100"
                }`}
              >
                <Image
                  src={cert.src}
                  alt={cert.alt}
                  width={cert.width}
                  height={cert.height}
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUpScale {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes fadeUpScale {
            from {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        }
      `}</style>
    </section>
  );
}
