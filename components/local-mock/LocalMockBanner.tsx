import { LOCAL_MOCK } from "@/lib/local-mock/flag";
import type { Locale } from "@/lib/i18n";

const copy = {
  ar: {
    label: "وضع تجريبي محلي",
    detail: "البيانات والصور محفوظة على هذا الجهاز فقط — لا اتصال بـ AWS",
  },
  en: {
    label: "LOCAL MOCK",
    detail: "Data and photos are saved on this computer only — no AWS",
  },
};

/** Always-visible label while `npm run dev:mock` is running. Renders nothing otherwise. */
export function LocalMockBanner({ locale }: { locale: Locale }) {
  if (!LOCAL_MOCK) return null;
  const t = copy[locale];
  return (
    <div
      role="note"
      data-local-mock
      className="pointer-events-none fixed bottom-3 start-3 z-[70] max-w-[calc(100vw-1.5rem)] rounded-2xl border-2 border-dashed border-amber-500 bg-amber-100/95 px-3 py-2 text-xs text-amber-950 shadow-lift"
    >
      <strong className="block font-extrabold tracking-wide">{t.label}</strong>
      <span>{t.detail}</span>
    </div>
  );
}
