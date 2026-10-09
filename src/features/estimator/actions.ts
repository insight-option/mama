"use client";

import { track } from "@/lib/analytics";
import type { ConfigChange } from "@/features/recommendations/rules";
import type { EstimatorAction } from "./state";
import { dispatch } from "./store";

const PACKAGE_ACTIONS: ReadonlySet<EstimatorAction["type"]> = new Set([
  "setVideoTier",
  "setVideoQuantity",
  "setAdBudget",
  "toggleAddon",
  "applyPreset",
]);

/** Dispatches a state change and records the matching privacy-safe analytics event. */
export function act(action: EstimatorAction) {
  dispatch(action);
  track("EstimatorStarted");
  if (action.type === "setIndustry") track("IndustrySelected", { industry: action.industry });
  if (PACKAGE_ACTIONS.has(action.type)) track("PackageAdjusted", { action: action.type });
}

/** Applies a recommendation's linked configuration change — only ever on explicit user request. */
export function applyConfigChange(change: ConfigChange) {
  switch (change.type) {
    case "patch":
      if (change.patch.videoTier) act({ type: "setVideoTier", tier: change.patch.videoTier });
      if (change.patch.adBudgetQar !== undefined) act({ type: "setAdBudget", budgetQar: change.patch.adBudgetQar });
      break;
    case "addon":
      act({ type: "toggleAddon", addon: change.addon, value: true });
      break;
    case "preset":
      act({ type: "applyPreset", preset: change.preset });
      break;
  }
}

/** Jumps to the estimator from anywhere on the page (e.g. industry cards, tier cards). */
export function goToEstimator(step?: number) {
  if (step !== undefined) dispatch({ type: "setStep", step });
  const target = document.getElementById("estimator");
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
