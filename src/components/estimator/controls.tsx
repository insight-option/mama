"use client";

import { useId, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/common/Icon";

type Option<T extends string> = { value: T; label: string; icon?: IconName; hint?: string };

type ChoiceGroupProps<T extends string> = {
  legend: string;
  name: string;
  options: readonly Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  columns?: string;
  description?: string;
};

/** Single-choice group built on native radios so keyboard and screen readers just work. */
export function ChoiceGroup<T extends string>({ legend, name, options, value, onChange, columns, description }: ChoiceGroupProps<T>) {
  const descId = useId();
  return (
    <fieldset aria-describedby={description ? descId : undefined}>
      <legend className="mb-1 text-base font-bold text-offwhite">{legend}</legend>
      {description && (
        <p id={descId} className="mb-3 text-sm text-muted">
          {description}
        </p>
      )}
      <div className={`mt-3 grid gap-2.5 ${columns ?? "grid-cols-1 sm:grid-cols-2"}`}>
        {options.map((option) => (
          <label key={option.value} className="chip">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.icon && (
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 text-cyan">
                <Icon name={option.icon} size={18} />
              </span>
            )}
            <span className="flex min-w-0 flex-col">
              <span className="text-[0.95rem] leading-snug">{option.label}</span>
              {option.hint && <span className="mt-0.5 text-xs text-muted">{option.hint}</span>}
            </span>
            <span className="chip-check" aria-hidden="true">
              <Icon name="check" size={12} strokeWidth={3} />
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type SliderProps = {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  valueText: string;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  disabled?: boolean;
  aside?: ReactNode;
};

/** Range slider paired with large +/- buttons and a visible value (mobile + keyboard friendly). */
export function Slider({ id, label, min, max, step, value, valueText, onChange, decreaseLabel, increaseLabel, disabled, aside }: SliderProps) {
  const clamped = Math.min(max, Math.max(min, value));
  const fill = max === min ? 0 : ((clamped - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <label htmlFor={id} className="text-base font-bold text-offwhite">
          {label}
        </label>
        <output htmlFor={id} className="text-lg font-extrabold text-cyan" aria-hidden="true">
          {valueText}
        </output>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-offwhite transition hover:border-cyan disabled:opacity-40"
          onClick={() => onChange(Math.max(min, clamped - step))}
          disabled={disabled || clamped <= min}
          aria-label={decreaseLabel}
        >
          <Icon name="minus" size={18} />
        </button>
        <input
          id={id}
          type="range"
          className="range"
          min={min}
          max={max}
          step={step}
          value={clamped}
          disabled={disabled}
          aria-valuetext={valueText}
          style={{ ["--fill" as string]: `${fill}%` }}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <button
          type="button"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-offwhite transition hover:border-cyan disabled:opacity-40"
          onClick={() => onChange(Math.min(max, clamped + step))}
          disabled={disabled || clamped >= max}
          aria-label={increaseLabel}
        >
          <Icon name="plus" size={18} />
        </button>
      </div>
      {aside}
    </div>
  );
}

export function StepHeading({ id, icon, title, subtitle }: { id: string; icon: IconName; title: string; subtitle?: string }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan/20 to-purple/20 text-cyan ring-1 ring-cyan/30">
        <Icon name={icon} size={22} />
      </span>
      <div>
        <h3 id={id} tabIndex={-1} className="text-xl font-extrabold text-offwhite outline-none sm:text-2xl">
          {title}
        </h3>
        {subtitle && <p className="mt-1 text-sm leading-relaxed text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
