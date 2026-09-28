"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MotionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "underline" | "none";
}

export default function MotionLink({
  href,
  children,
  className,
  variant = "default",
}: MotionLinkProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: variant === "none" ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {children}
      </motion.div>
    </Link>
  );
}
