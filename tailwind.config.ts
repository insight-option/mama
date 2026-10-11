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
        ivory: "rgb(var(--color-ivory) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        arabic: ["var(--font-tajawal)", "system-ui", "sans-serif"],
        latin: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "var(--radius-card)",
      },
      maxWidth: {
        content: "var(--max-width)",
      },
    },
  },
  plugins: [],
};

export default config;
