"use client";

import { Factory, Package, CheckCircle, Lightbulb } from "lucide-react";
import { useState } from "react";

type CapabilityCardProps = {
  title: string;
  description: string;
  icon: string;
};

const iconMap = {
  Factory: Factory,
  Package: Package,
  CheckCircle: CheckCircle,
  Lightbulb: Lightbulb,
};

export default function CapabilityCard({
  title,
  description,
  icon,
}: CapabilityCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const Icon = iconMap[icon as keyof typeof iconMap] || Factory;

  return (
    <div
      className="group relative h-full rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900/40 backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800/60 hover:border-red-600/50"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Card content */}
      <div className="relative z-10 p-5 sm:p-6 lg:p-7 h-full flex flex-col justify-between">
        <div>
          {/* Icon */}
          <div className="mb-3 flex-shrink-0">
            <div
              className={`w-9 h-9 flex items-center justify-center text-red-600 transition-all duration-300 ${
                isHovering ? "-translate-y-0.5" : ""
              }`}
            >
              <Icon size={24} strokeWidth={1.8} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-red-600 mb-2 uppercase tracking-wide leading-snug">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm lg:text-[15px] leading-relaxed text-zinc-300 grow mt-1.5">
          {description}
        </p>
      </div>

      {/* Subtle animated border on hover */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          boxShadow: "inset 0 0 20px rgba(220, 38, 38, 0.1)",
        }}
      />
    </div>
  );
}
