"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motionVariants } from "@/lib/motion/variants";
import { motionConfig, prefersReducedMotion } from "@/lib/motion/config";

interface ImageRevealProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  onScroll?: boolean;
  delay?: number;
  className?: string;
  containerClassName?: string;
}

export default function ImageReveal({
  src,
  alt,
  width,
  height,
  priority = false,
  onScroll = true,
  delay = 0,
  className,
  containerClassName,
}: ImageRevealProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setIsReducedMotion(prefersReducedMotion());
    setHasMounted(true);
  }, []);

  const imageContent = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );

  // During SSR and initial hydration, render animation wrapper
  // After hydration, if reduced motion is preferred, render without animations
  if (hasMounted && isReducedMotion) {
    return <div className={containerClassName}>{imageContent}</div>;
  }

  if (onScroll) {
    return (
      <motion.div
        variants={motionVariants.imageFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2, once: true }}
        transition={{ delay }}
        className={containerClassName}
      >
        {imageContent}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={motionVariants.imageFadeIn}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: motionConfig.timing.slow }}
      className={containerClassName}
    >
      {imageContent}
    </motion.div>
  );
}
