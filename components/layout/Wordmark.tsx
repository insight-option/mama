import { restaurant } from "@/config/restaurant";

// Temporary text wordmark until the supplied logo files are added.
// Swap for the dark/light logo images then; do not redraw the logo.
export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span
      dir="ltr"
      className={`font-latin text-lg font-bold tracking-tight ${
        tone === "dark" ? "text-forest" : "text-white"
      }`}
    >
      {restaurant.brandName}
    </span>
  );
}
