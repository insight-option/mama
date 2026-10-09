import { describe, expect, it } from "vitest";
import { buildPlanMessage, buildWhatsAppUrl, createPlanReference, isValidWhatsAppNumber } from "@/features/whatsapp/buildMessage";
import { calculatePrice, toEstimateInput } from "@/features/pricing/calculate";
import { DEFAULT_STATE } from "@/features/estimator/state";
import { createTranslator, getDictionary } from "@/i18n";
import { plainSpaces } from "./normalize";
import type { EstimatorState } from "@/features/estimator/types";

const demo: EstimatorState = {
  ...DEFAULT_STATE,
  industry: "automotive",
  objective: "messages",
  channel: "whatsapp",
  addons: { landingPage: true, pixelCapi: true, customWebApp: true },
};

function message(locale: "ar" | "en", state = demo, contact?: Parameters<typeof buildPlanMessage>[0]["contact"]): string {
  return plainSpaces(rawMessage(locale, state, contact));
}

function rawMessage(locale: "ar" | "en", state: EstimatorState, contact?: Parameters<typeof buildPlanMessage>[0]["contact"]) {
  return buildPlanMessage({
    state,
    price: calculatePrice(toEstimateInput(state, locale)),
    locale,
    t: createTranslator(getDictionary(locale)),
    reference: "FTN-261009-ABCD",
    contact,
  });
}

describe("WhatsApp handoff", () => {
  it("T15: builds a localized English summary from canonical totals", () => {
    const text = message("en");
    expect(text).toContain("Fontaine growth plan request");
    expect(text).toContain("FTN-261009-ABCD");
    expect(text).toContain("Automotive & premium services");
    expect(text).toContain("QAR 6,450");
    expect(text).toContain("QAR 8,700");
    expect(text).toContain("Custom web app — quote required");
    expect(text).not.toMatch(/sent|delivered/i);
  });

  it("T15: builds a natural Arabic summary", () => {
    const text = message("ar");
    expect(text).toContain("طلب خطة نمو من فونتين");
    expect(text).toContain("السيارات والخدمات المميزة");
    expect(text).toContain("8,700");
  });

  it("adds the display-currency equivalent while keeping QAR as billing currency", () => {
    const text = message("en", { ...demo, currency: "USD" });
    expect(text).toMatch(/QAR 8,700 \(≈ \$2,390\)/);
  });

  it("includes optional contact details only when provided", () => {
    expect(message("en")).not.toContain("Contact");
    const text = message("en", demo, { name: "Sara", company: "Doha Motors", timeline: "month", notes: "" });
    expect(text).toContain("Name: Sara");
    expect(text).toContain("Within 30 days");
  });

  it("validates Click-to-Chat numbers (digits only, no +)", () => {
    expect(isValidWhatsAppNumber("97450000000")).toBe(true);
    expect(isValidWhatsAppNumber("+97450000000")).toBe(false);
    expect(isValidWhatsAppNumber("974 5000 0000")).toBe(false);
    expect(isValidWhatsAppNumber("REPLACE_WITH_APPROVED_NUMBER")).toBe(false);
    expect(isValidWhatsAppNumber("")).toBe(false);
  });

  it("builds an encoded wa.me URL, or null for an invalid config", () => {
    expect(buildWhatsAppUrl("97450000000", "مرحبا & hi")).toBe(
      `https://wa.me/97450000000?text=${encodeURIComponent("مرحبا & hi")}`,
    );
    expect(buildWhatsAppUrl("", "x")).toBeNull();
  });

  it("creates readable plan references", () => {
    expect(createPlanReference(new Date("2026-10-09T08:00:00Z"), () => 0)).toBe("FTN-261009-AAAA");
  });
});
