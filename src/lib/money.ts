/**
 * Integer money helpers. Canonical amounts are QAR minor units (1 QAR = 100
 * dirhams). Rounding policy: half-up to the nearest minor unit, applied once
 * per line item — totals are plain integer sums of rounded lines.
 */
export const MINOR_PER_MAJOR = 100;

export function toMinor(major: number): number {
  return Math.round(major * MINOR_PER_MAJOR);
}

export function toMajor(minor: number): number {
  return minor / MINOR_PER_MAJOR;
}

/** Percentage of an integer amount, rounded half-up to an integer. */
export function percentOf(minor: number, rate: number): number {
  return Math.round(minor * rate);
}

export function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
