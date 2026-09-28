"use client";

import { motion } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import { motionVariants } from "@/lib/motion/variants";
import { motionConfig, prefersReducedMotion } from "@/lib/motion/config";

type FadeInVariant = "normal" | "fast" | "slow";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  variant?: FadeInVariant;
  className?: string;
  onScroll?: boolean;
  amount?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  variant = "normal",
  className,
  onScroll = true,
  amount = 0.2,
}: FadeInProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setIsReducedMotion(prefersReducedMotion());
    setHasMounted(true);
  }, []);

  const variantMap = {
    normal: motionVariants.fadeIn,
    fast: motionVariants.fadeInFast,
    slow: { ...motionVariants.fadeIn, visible: { ...motionVariants.fadeIn.visible, transition: { duration: motionConfig.timing.slow } } },
  };

  // During SSR and initial hydration, render animation wrapper
  // After hydration, if reduced motion is preferred, render without animations
  if (hasMounted && isReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  if (onScroll) {
    return (
      <motion.div
        variants={variantMap[variant]}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount, once: true }}
        transition={{ delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={variantMap[variant]}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
