type LogoProps = {
  /** Unique per instance so SVG gradient ids never collide on one page. */
  id: string;
  variant?: "dark" | "light";
  showDescriptor?: boolean;
  className?: string;
  /** Hide the descriptor line on very small screens. */
  compactDescriptor?: boolean;
};

/** Monogram from the supplied brand SVG (brand/Fontaine_Icon.svg). */
export function FontaineMark({ id, className }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 108 108" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-f`} gradientUnits="userSpaceOnUse" x1="20" y1="85" x2="85" y2="20">
          <stop offset="0%" stopColor="#7451E8" />
          <stop offset="48%" stopColor="#20BDF3" />
          <stop offset="100%" stopColor="#00F2FE" />
        </linearGradient>
        <linearGradient id={`${id}-t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#17233A" />
          <stop offset="100%" stopColor="#0A0D14" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="107" height="107" rx="27" fill={`url(#${id}-t)`} stroke="#30415B" />
      <path d="M29 77V31Q29 26 34 26H74" fill="none" stroke={`url(#${id}-f)`} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 50H61" fill="none" stroke={`url(#${id}-f)`} strokeWidth="11" strokeLinecap="round" />
      <path d="M61.5 68L72 57L83 41" fill="none" stroke="#A084F7" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="61.5" cy="68" r="3.3" fill="#A084F7" />
      <circle cx="72" cy="57" r="3.3" fill="#20BDF3" />
      <circle cx="83" cy="41" r="4.2" fill="#00F2FE" />
    </svg>
  );
}

/** FONTAINE wordmark. Always rendered left-to-right, also inside RTL layouts. */
export function FontaineLogo({ id, variant = "dark", showDescriptor = true, compactDescriptor = false, className }: LogoProps) {
  const word = variant === "dark" ? "text-offwhite" : "text-[#0E1A2B]";
  const descriptor = variant === "dark" ? "text-muted" : "text-[#5C6C80]";
  return (
    <span dir="ltr" className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <FontaineMark id={id} className="size-9 shrink-0 sm:size-10" />
      <span className="flex flex-col leading-none">
        <span className={`font-sans text-[1.15rem] font-black tracking-[0.16em] sm:text-[1.3rem] ${word}`}>FONTAINE</span>
        {showDescriptor && (
          <span className={`mt-1 font-sans text-[0.55rem] font-bold tracking-[0.3em] ${descriptor} ${compactDescriptor ? "hidden min-[400px]:block" : ""}`}>DIGITAL / AI / GROWTH</span>
        )}
      </span>
    </span>
  );
}
