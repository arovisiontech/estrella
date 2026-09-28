"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getActiveDepartments } from "@/lib/data/departments";

interface DepartmentsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepartmentsDropdown({
  isOpen,
  onClose,
}: DepartmentsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const departments = getActiveDepartments();

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
        {departments.map((dept, index) => (
          <div key={dept.id}>
            {index > 0 && <div className="h-px bg-zinc-100" />}
            <Link
              href={`/departments/${dept.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-black hover:bg-zinc-50 transition-colors group"
            >
              <span className="w-2 h-2 rounded-full bg-red-600 group-hover:scale-125 transition-transform" />
              <span className="group-hover:text-red-600">{dept.name}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
