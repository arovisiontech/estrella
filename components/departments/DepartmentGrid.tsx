"use client";

import { useMemo } from "react";
import DepartmentCard from "./DepartmentCard";
import { motion } from "framer-motion";

interface DepartmentGridProps {
  departments?: any[];
  selectedDept?: string;
}

export default function DepartmentGrid({
  departments = [],
  selectedDept = "all",
}: DepartmentGridProps) {
  const filteredDepartments = useMemo(() => {
    if (selectedDept === "all") {
      return departments;
    }
    return departments.filter((dept) => dept.slug === selectedDept);
  }, [selectedDept, departments]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="site-container px-12 sm:px-16 lg:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {filteredDepartments.map((department, index) => (
            <DepartmentCard
              key={department.id || department.slug || index}
              department={department}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
