"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  // whileInView resolves its in-view state on the client before React can
  // compare it against the server-rendered "hidden" markup, which trips a
  // hydration mismatch. Rendering a plain div until after mount keeps the
  // first client render identical to the server output; the animated
  // version only takes over once it's a normal (non-hydration) re-render.
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Intentional one-time mount flag for hydration-safe rendering (see
    // comment above) — not deriving from a prop, so an effect is correct.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  const variants: Variants = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
