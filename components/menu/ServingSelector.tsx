import { Price } from "@/components/ui/Price";
import type { Locale } from "@/lib/i18n";
import type { ServingId, ServingOption } from "@/types/menu";

/**
 * One row per serving: "شخص واحد — 28 ر.ق". Label, separator and price are
 * separate flex items so Arabic text and numbers never share one string.
 */
export function ServingSelector({
  name,
  legend,
  labels,
  options,
  value,
  onChange,
  locale,
  disabled,
}: {
  name: string;
  legend: string;
  labels: Record<ServingId, string>;
  options: ServingOption[];
  value: ServingId;
  onChange: (id: ServingId) => void;
  locale: Locale;
  disabled?: boolean;
}) {
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-1.5 text-xs font-medium text-muted">{legend}</legend>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.id} className="block cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="peer sr-only"
            />
            <span className="flex min-h-12 items-center gap-3 rounded-xl border border-line bg-surface px-4 text-ink transition-colors peer-checked:border-forest peer-checked:bg-forest peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-leaf peer-disabled:cursor-not-allowed peer-disabled:opacity-60">
              {/* Radio indicator */}
              <span
                aria-hidden="true"
                className="flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-current"
              >
                <span
                  className={`size-1.5 rounded-full bg-current ${
                    value === option.id ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
              <span className="flex items-center gap-2">
                <span className="font-bold">{labels[option.id]}</span>
                <span aria-hidden="true" className="opacity-60">
                  —
                </span>
                <Price amount={option.price} locale={locale} className="font-bold" />
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
