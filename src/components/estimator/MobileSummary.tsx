"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/common/I18nProvider";
import { Icon } from "@/components/common/Icon";
import { usePlan } from "@/features/estimator/usePlan";
import { SummaryCard } from "./SummaryCard";

const TEXT_INPUT = "input:not([type=range]):not([type=checkbox]):not([type=radio]), textarea, select";

/**
 * Compact bottom bar for small screens that expands into a details sheet.
 * It only shows while the estimator is on screen, hides while a text field is
 * focused (virtual keyboard), and the section reserves space so it never
 * covers controls (requirement T17).
 */
export function MobileSummary() {
  const { t } = useI18n();
  const { price, money } = usePlan();
  const [inView, setInView] = useState(false);
  const [typing, setTyping] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const section = document.getElementById("estimator");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.05 });
    observer.observe(section);
    const onFocusIn = (e: FocusEvent) => setTyping(e.target instanceof Element && e.target.matches(TEXT_INPUT));
    const onFocusOut = () => setTyping(false);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const visible = inView && !typing;

  return (
    <>
      {/* Spacer so the fixed bar never overlaps the last controls. */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-navy/90 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          visible ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-hidden={!visible}
        inert={!visible}
      >
        <div className="container-page flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="text-xs text-muted">{t("summary.mobileLabel")}</p>
            <p className="truncate text-xl font-black text-gradient" data-testid="mobile-first-month">
              <bdi>{money(price.firstMonthQarMinor)}</bdi>
            </p>
          </div>
          <button type="button" className="btn btn-primary shrink-0" onClick={() => dialogRef.current?.showModal()}>
            {t("summary.details")}
            <Icon name="chevron" size={18} className="-rotate-90" />
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="sheet lg:hidden"
        aria-labelledby="mobile-summary-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="max-h-[88vh] overflow-y-auto rounded-t-3xl bg-navy p-3 pt-2">
          <div className="sticky top-0 z-10 flex justify-end bg-navy pb-2">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full border border-line-strong text-offwhite"
              onClick={() => dialogRef.current?.close()}
              aria-label={t("summary.closeDetails")}
            >
              <Icon name="x" size={20} />
            </button>
          </div>
          <SummaryCard headingId="mobile-summary-title" />
        </div>
      </dialog>
    </>
  );
}
