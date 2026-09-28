import { motionConfig } from "./config";

export const motionVariants = {
  // Container animations for staggered children
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: motionConfig.stagger.normal,
        delayChildren: 0,
      },
    },
  },

  containerDelayed: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: motionConfig.stagger.normal,
        delayChildren: 0.15,
      },
    },
  },

  containerSmallStagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: motionConfig.stagger.small,
        delayChildren: 0,
      },
    },
  },

  // Basic fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: motionConfig.timing.medium },
    },
  },

  fadeInFast: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: motionConfig.timing.fast },
    },
  },

  // Fade up (element rises while fading in)
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: motionConfig.timing.medium },
    },
  },

  fadeUpFast: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: motionConfig.timing.fast },
    },
  },

  fadeUpSlow: {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: motionConfig.timing.slow },
    },
  },

  // Fade left
  fadeLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: motionConfig.timing.medium },
    },
  },

  // Fade right
  fadeRight: {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: motionConfig.timing.medium },
    },
  },

  // Scale reveal
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: motionConfig.timing.medium },
    },
  },

  scaleInFast: {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: motionConfig.timing.fast },
    },
  },

  // Slide in (for modals, drawers)
  slideInFromRight: {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: motionConfig.timing.fast },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: { duration: motionConfig.timing.fast },
    },
  },

  slideInFromTop: {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: motionConfig.timing.fast },
    },
    exit: {
      opacity: 0,
      y: -40,
      transition: { duration: motionConfig.timing.fast },
    },
  },

  // Dropdown/menu animation
  dropdownOpen: {
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: { duration: 0.15 },
    },
  },

  // Accordion animation
  accordionOpen: {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: motionConfig.timing.fast },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: motionConfig.timing.fast },
    },
  },

  // Image animations
  imageZoom: {
    initial: { scale: 1 },
    whileHover: { scale: 1.05 },
    transition: { duration: 0.6 },
  },

  imageFadeIn: {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: motionConfig.timing.slow },
    },
  },

  // Blur reveal (for text)
  blurReveal: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: motionConfig.timing.medium },
    },
  },

  // Line reveal (underline animation)
  lineReveal: {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: motionConfig.timing.medium, delay: 0.1 },
    },
  },

  // Button hover animations
  buttonHover: {
    scale: 1.02,
    transition: { duration: motionConfig.timing.fast },
  },

  buttonTap: {
    scale: 0.98,
  },

  // Icon animations
  iconHover: {
    scale: 1.1,
    transition: { duration: motionConfig.timing.fast },
  },

  iconRotate: {
    rotate: 180,
    transition: { duration: motionConfig.timing.fast },
  },

  // Pulse/glow effects (subtle)
  subtlePulse: {
    opacity: [1, 0.8, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
