/** Stagger delay for the n-th revealed item (see Reveal.tsx). Server-safe. */
export function revealDelay(index: number, step = 70): React.CSSProperties {
  return { ["--reveal-delay" as string]: `${Math.min(index, 8) * step}ms` };
}
