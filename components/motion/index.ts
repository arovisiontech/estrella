// Central export for all motion components
export { default as Reveal } from "./Reveal";
export type { RevealVariant } from "./Reveal";

export { default as StaggerGroup } from "./StaggerGroup";
export { default as FadeIn } from "./FadeIn";
export { default as MotionLink } from "./MotionLink";
export { default as AnimatedButton } from "./AnimatedButton";
export { default as ImageReveal } from "./ImageReveal";
export { default as PageTransition } from "./PageTransition";

// Export motion configuration and variants for advanced usage
export { motionVariants } from "@/lib/motion/variants";
export { motionConfig, prefersReducedMotion } from "@/lib/motion/config";
