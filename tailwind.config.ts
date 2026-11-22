import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── LUXURY EDITORIAL PALETTE (Warm Ivory, Soft Black, Champagne Gold, Walnut) ──
        ivory: {
          DEFAULT: "#F1E9DF",
          deep: "#E8DCCB",
          light: "#F7F2EC",
        },
        softblack: {
          DEFAULT: "#0E0D0C",
          raised: "#171513",
          deep: "#080707",
        },
        charcoal: {
          DEFAULT: "#14110F",
          muted: "rgba(20, 17, 15, 0.62)",
        },
        cream: {
          DEFAULT: "#F1E9DF",
          muted: "rgba(241, 233, 223, 0.62)",
        },
        gold: {
          DEFAULT: "#B8935A",
          light: "#CDAA73",
          glow: "rgba(184, 147, 90, 0.35)",
          dim: "#9E7B46",
        },
        walnut: {
          light: "#7A492C",
          DEFAULT: "#6B3F24",
          mid: "#5E361E",
          dark: "#4A2A16",
          deep: "#2E180B",
        },
        border: {
          dark: "rgba(184, 147, 90, 0.35)",
          light: "rgba(20, 17, 15, 0.14)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-sans)", "monospace"], // Tracked uppercase DM Sans replaces JetBrains Mono
      },
      letterSpacing: {
        widest: "0.22em",
        label: "0.18em",
        tightest: "-0.04em",
      },
      perspective: {
        1000: "1000px",
        1600: "1600px",
        2000: "2000px",
      },
    },
  },
  plugins: [],
};

export default config;
