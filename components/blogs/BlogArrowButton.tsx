"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

type BlogArrowButtonProps = {
  onClick?: () => void;
  href?: string;
};

export default function BlogArrowButton({
  onClick,
  href,
}: BlogArrowButtonProps) {
  const [isHovering, setIsHovering] = useState(false);

  const buttonClass =
    "relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2";

  const icon = (
    <ArrowUpRight
      size={24}
      className={`transition-all duration-300 ${
        isHovering ? "translate-x-2 -translate-y-2 text-white" : "text-white"
      }`}
      strokeWidth={2}
    />
  );

  const bgStyle = {
    background: isHovering
      ? "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"
      : "rgb(24, 24, 27)",
    boxShadow: isHovering
      ? "0 0 30px rgba(220, 38, 38, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.1)"
      : "none",
    transform: isHovering ? "scale(1.08)" : "scale(1)",
    transition: "all 300ms ease",
  };

  if (href) {
    return (
      <a
        href={href}
        className={buttonClass}
        style={bgStyle}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        aria-label="Read blog post"
      >
        {icon}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={buttonClass}
      style={bgStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label="Read blog post"
    >
      {icon}
    </button>
  );
}
