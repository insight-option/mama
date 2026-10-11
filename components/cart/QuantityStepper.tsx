import { MAX_QUANTITY } from "@/lib/cart";

const stepButton =
  "flex size-11 items-center justify-center text-lg font-bold text-forest transition-colors hover:bg-forest/5 disabled:cursor-not-allowed disabled:text-muted/50 disabled:hover:bg-transparent";

export function QuantityStepper({
  value,
  onChange,
  labels,
  itemName,
}: {
  value: number;
  onChange: (value: number) => void;
  labels: { decrease: string; increase: string; quantity: string };
  itemName: string;
}) {
  return (
    <div
      role="group"
      aria-label={`${labels.quantity}: ${itemName}`}
      className="inline-flex items-center overflow-hidden rounded-full border border-line bg-surface"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={labels.decrease}
        className={stepButton}
      >
        −
      </button>
      <output
        aria-live="polite"
        className="min-w-8 text-center font-latin font-bold text-ink"
      >
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label={labels.increase}
        className={stepButton}
      >
        +
      </button>
    </div>
  );
}
