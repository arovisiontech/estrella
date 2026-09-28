"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function AnimatedButton({
  children,
  onClick,
  disabled = false,
  className,
  type = "button",
}: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </motion.button>
  );
}
