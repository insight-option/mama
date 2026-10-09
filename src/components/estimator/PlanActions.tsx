"use client";

import { useState } from "react";
import { useI18n } from "@/components/common/I18nProvider";
import { Icon, WhatsAppIcon } from "@/components/common/Icon";
import { usePlan } from "@/features/estimator/usePlan";
import type { ContactDetails } from "@/features/estimator/types";
import { track } from "@/lib/analytics";

type Status = { kind: "opened" | "copied" | "shareCopied" | "unavailable" | "copyFailed"; text?: string } | null;

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

type PlanActionsProps = {
  contact?: ContactDetails;
  variant?: "full" | "compact";
  whatsappLabel?: "actions.whatsapp" | "actions.whatsappFinal";
};

/**
 * WhatsApp hand-off with copy/share fallbacks (blueprint section 14). Opening
 * WhatsApp is only an intent signal — the UI never claims the message was sent.
 */
export function PlanActions({ contact, variant = "full", whatsappLabel = "actions.whatsapp" }: PlanActionsProps) {
  const { t } = useI18n();
  const plan = usePlan();
  const [status, setStatus] = useState<Status>(null);

  async function onWhatsApp() {
    const url = plan.whatsappUrl(contact);
    if (!url) {
      const copied = await copyText(plan.buildMessage(contact));
      setStatus({ kind: copied ? "unavailable" : "copyFailed", text: plan.buildMessage(contact) });
      return;
    }
    track("WhatsAppClicked", { reference: plan.reference });
    if (whatsappLabel === "actions.whatsappFinal") track("QuoteRequested", { reference: plan.reference });
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus({ kind: "opened" });
  }

  async function onCopy() {
    const text = plan.buildMessage(contact);
    const copied = await copyText(text);
    if (copied) track("PlanCopied");
    setStatus(copied ? { kind: "copied" } : { kind: "copyFailed", text });
  }

  async function onShare() {
    const url = plan.shareUrl();
    // Share links contain selections only — never contact details.
    if (navigator.share) {
      try {
        await navigator.share({ title: t("app.name"), url });
        track("PlanShared", { method: "native" });
        return;
      } catch {
        // User cancelled or share failed; fall back to copying the link.
      }
    }
    const copied = await copyText(url);
    if (copied) track("PlanShared", { method: "copy" });
    setStatus(copied ? { kind: "shareCopied" } : { kind: "copyFailed", text: url });
  }

  const message =
    status &&
    {
      opened: t("actions.whatsappOpened"),
      copied: t("actions.copied"),
      shareCopied: t("actions.shareCopied"),
      unavailable: `${t("actions.whatsappUnavailable")} ${t("actions.copied")}.`,
      copyFailed: t("actions.copyFailed"),
    }[status.kind];

  return (
    <div>
      <div className={variant === "full" ? "flex flex-col gap-3 sm:flex-row sm:flex-wrap" : "flex flex-col gap-2.5"}>
        <button type="button" className="btn btn-whatsapp w-full sm:w-auto sm:flex-1" onClick={onWhatsApp}>
          <WhatsAppIcon size={20} />
          {t(whatsappLabel)}
          <span className="sr-only">{t("actions.opensNewTab")}</span>
        </button>
        <div className="flex gap-2.5">
          <button type="button" className="btn btn-ghost flex-1" onClick={onCopy}>
            <Icon name="copy" size={18} />
            {t("actions.copy")}
          </button>
          <button type="button" className="btn btn-ghost flex-1" onClick={onShare}>
            <Icon name="share" size={18} />
            {t("actions.share")}
          </button>
        </div>
      </div>
      <div role="status" aria-live="polite" className="mt-3 text-sm">
        {message && (
          <p className="flex gap-2 rounded-lg bg-white/5 p-3 leading-relaxed text-ink">
            <Icon name={status?.kind === "copyFailed" ? "info" : "check"} size={16} className="mt-0.5 shrink-0 text-cyan" />
            {message}
          </p>
        )}
        {(status?.kind === "copyFailed" || status?.kind === "unavailable") && status.text && (
          <textarea
            readOnly
            dir="auto"
            className="field mt-2 h-40 text-xs"
            value={status.text}
            onFocus={(e) => e.currentTarget.select()}
            aria-label={t("actions.copy")}
          />
        )}
      </div>
    </div>
  );
}
