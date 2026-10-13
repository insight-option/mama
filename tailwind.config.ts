import type { Config } from "tailwindcss";

// Colors and fonts point at the CSS variables in app/globals.css,
// so design tokens are edited in one place.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        leaf: "rgb(var(--color-leaf) / <alpha-value>)",
        forest: "rgb(var(--color-forest) / <alpha-value>)",
        night: "rgb(var(--color-night) / <alpha-value>)",
        ivory: "rgb(var(--color-ivory) / <alpha-value>)",
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "serif"],
        arabic: ["var(--font-tajawal)", "system-ui", "sans-serif"],
        latin: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "var(--radius-card)",
      },
      maxWidth: {
        content: "var(--max-width)",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(11 37 24 / 0.04), 0 8px 24px -12px rgb(11 37 24 / 0.12)",
        lift: "0 2px 4px rgb(11 37 24 / 0.04), 0 24px 48px -20px rgb(11 37 24 / 0.28)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slow-zoom": {
          from: { transform: "scale(1.04)" },
          to: { transform: "scale(1.14)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pop-in": {
          from: { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        "slow-zoom": "slow-zoom 18s ease-in-out infinite alternate",
        marquee: "marquee 40s linear infinite",
        "pop-in": "pop-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
