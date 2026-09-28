"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import { motionVariants } from "@/lib/motion/variants";
import { motionConfig, prefersReducedMotion } from "@/lib/motion/config";

export type RevealVariant =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "scale"
  | "blur";

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  className?: string;
}

export default function Reveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration,
  amount = 0.2,
  once = true,
  className,
}: RevealProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setIsReducedMotion(prefersReducedMotion());
    setHasMounted(true);
  }, []);

  // Map variant names to motion variants
  const variantMap = {
    fadeUp: motionVariants.fadeUp,
    fadeDown: { ...motionVariants.fadeUp, hidden: { ...motionVariants.fadeUp.hidden, y: -20 } },
    fadeLeft: motionVariants.fadeLeft,
    fadeRight: motionVariants.fadeRight,
    scale: motionVariants.scaleIn,
    blur: motionVariants.blurReveal,
  };

  const selectedVariant = variantMap[variant];

  // During SSR and initial hydration, render animation wrapper
  // After hydration, if reduced motion is preferred, render without animations
  if (hasMounted && isReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={selectedVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount, once }}
      transition={{
        duration: duration || motionConfig.timing.medium,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
