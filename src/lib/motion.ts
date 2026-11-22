/**
 * Standardized Motion Configuration
 * Single source of truth for all easings, durations, and shader hero effects.
 */

export const MOTION = {
  // Shared easing curves
  ease: {
    smooth: "cubic-bezier(0.25, 1, 0.5, 1)",
    snappy: "cubic-bezier(0.16, 1, 0.3, 1)",
    liquid: "cubic-bezier(0.77, 0, 0.175, 1)",
    gsapSmooth: "power2.out",
    gsapExpo: "power3.out",
  },

  // Standard durations in seconds
  duration: {
    instant: 0.15,
    quick: 0.35,
    normal: 0.6,
    slow: 1.0,
    deliberate: 1.4,
  },

  // Scroll dynamics
  scroll: {
    lenisDuration: 1.2,
    scrubSmoothness: 0.5,
    colorMorphDuration: 0.7,
  },

  // Hero interactive photo shader mode: "liquid" | "trail-reveal" | "pixel-morph"
  heroShaderMode: "liquid" as "liquid" | "trail-reveal" | "pixel-morph",

  // Particle & background dynamics
  background: {
    particleCount: 45,
    driftSpeed: 0.08,
    cursorParallaxStrength: 0.04,
  },
} as const;
