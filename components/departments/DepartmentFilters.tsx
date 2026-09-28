"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface DepartmentFiltersProps {
  departments?: any[];
  selectedDept?: string;
}

export default function DepartmentFilters({
  departments = [],
  selectedDept = "all",
}: DepartmentFiltersProps) {
  const filters = [
    { label: "All", value: "all", href: "/departments" },
    ...departments.map((dept) => ({
      label: dept.name,
      value: dept.slug,
      href: `/departments?dept=${dept.slug}`,
    })),
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white py-8 border-b border-zinc-200"
    >
      <div className="site-container px-12 sm:px-16 lg:px-24">
        <div className="overflow-x-auto">
          <div className="flex items-center gap-6 pb-2 whitespace-nowrap min-w-min">
            {filters.map((filter, index) => (
              <div
                key={filter.value}
                className="flex items-center gap-6"
              >
                <Link
                  href={filter.href}
                  className={`text-xs sm:text-sm font-medium transition-colors ${
                    selectedDept === filter.value
                      ? "text-[#00AEF0] font-bold"
                      : "text-black hover:text-[#00AEF0]"
                  }`}
                  aria-pressed={selectedDept === filter.value}
                >
                  {filter.label}
                </Link>
                {index < filters.length - 1 && (
                  <span className="text-zinc-400">/</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
