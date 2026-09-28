"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion/config";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setIsReducedMotion(prefersReducedMotion());
    setHasMounted(true);
  }, []);

  // During SSR and initial hydration, render without animation wrapper
  if (!hasMounted || isReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
