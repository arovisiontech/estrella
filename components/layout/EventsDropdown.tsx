"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface EventsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const eventLinks = [
  { label: "Recent Events", href: "/events/recent" },
  { label: "Upcoming Events", href: "/events/upcoming" },
];

export default function EventsDropdown({ isOpen, onClose }: EventsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="absolute top-full left-0 mt-0 w-56 bg-white rounded-lg shadow-xl border border-zinc-100 z-[99]"
    >
      <div className="py-2">
        {eventLinks.map((link, index) => (
          <div key={link.href}>
            {index > 0 && <div className="h-px bg-zinc-100" />}
            <Link
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-black hover:bg-zinc-50 transition-colors group"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 group-hover:scale-125 transition-transform" />
              <span className="group-hover:text-red-600">{link.label}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
