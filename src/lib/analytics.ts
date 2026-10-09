/**
 * Product analytics (blueprint section 15). This is a privacy-safe dispatcher:
 * it never accepts personal data, never blocks the UI, and only forwards events
 * to `window.dataLayer` if a consent-aware tag manager has installed one.
 * Meta Pixel / CAPI are intentionally NOT wired up until Phase B approval.
 */
export type AnalyticsEvent =
  | "EstimatorStarted"
  | "IndustrySelected"
  | "PackageAdjusted"
  | "EstimateCompleted"
  | "QuoteRequested"
  | "WhatsAppClicked"
  | "PlanCopied"
  | "PlanShared";

type SafeValue = string | number | boolean | null;
type EventProps = Record<string, SafeValue>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const fired = new Set<AnalyticsEvent>();
const ONCE_PER_SESSION: ReadonlySet<AnalyticsEvent> = new Set(["EstimatorStarted", "EstimateCompleted"]);
const THROTTLE_MS = 4_000;
let lastAdjustedAt = 0;

export function track(event: AnalyticsEvent, props: EventProps = {}): void {
  if (typeof window === "undefined") return;
  if (ONCE_PER_SESSION.has(event)) {
    if (fired.has(event)) return;
    fired.add(event);
  }
  if (event === "PackageAdjusted") {
    const now = Date.now();
    if (now - lastAdjustedAt < THROTTLE_MS) return;
    lastAdjustedAt = now;
  }
  try {
    window.dataLayer?.push({ event: `fontaine_${event}`, ...props });
    window.dispatchEvent(new CustomEvent("fontaine:analytics", { detail: { event, props } }));
  } catch {
    // Tracking must never break the estimator.
  }
}
