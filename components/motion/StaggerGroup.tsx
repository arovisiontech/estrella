"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import { motionVariants } from "@/lib/motion/variants";
import { prefersReducedMotion } from "@/lib/motion/config";

interface StaggerGroupProps {
  children: ReactNode;
  amount?: number;
  once?: boolean;
  className?: string;
  variant?: "default" | "delayed" | "small";
}

export default function StaggerGroup({
  children,
  amount = 0.2,
  once = true,
  className,
  variant = "default",
}: StaggerGroupProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setIsReducedMotion(prefersReducedMotion());
    setHasMounted(true);
  }, []);

  const variantMap = {
    default: motionVariants.container,
    delayed: motionVariants.containerDelayed,
    small: motionVariants.containerSmallStagger,
  };

  // During SSR and initial hydration, render animation wrapper
  // After hydration, if reduced motion is preferred, render without animations
  if (hasMounted && isReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount, once }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
