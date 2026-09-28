// Global motion configuration for premium, restrained animations
export const motionConfig = {
  // Timing presets (in milliseconds)
  timing: {
    fast: 0.2, // 200ms - quick interactions
    normal: 0.4, // 400ms - standard animations
    medium: 0.6, // 600ms - section reveals
    slow: 0.8, // 800ms - image reveals
    slower: 1, // 1000ms - cinematic reveals
  },

  // Stagger delays
  stagger: {
    small: 0.04, // 40ms
    normal: 0.08, // 80ms
    medium: 0.12, // 120ms
    large: 0.16, // 160ms
  },

  // Viewport trigger
  viewport: {
    // Trigger when 15-25% of element enters viewport
    amount: 0.2 as const,
    once: true,
    margin: "0px 0px -100px 0px", // Trigger slightly before full entry
  },

  // Default easing curve (smooth, professional)
  easing: [0.22, 1, 0.36, 1] as [number, number, number, number],

  // Reduced motion values
  reducedMotion: {
    duration: 0.01, // Instant
    stagger: 0, // No stagger
  },
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
