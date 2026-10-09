"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_STATE, estimatorReducer, sanitizeState, stateFromSearchParams, type EstimatorAction } from "./state";
import type { EstimatorState } from "./types";

/**
 * Module-level store shared by every component on the page. Because it lives
 * outside the React tree it survives client-side navigation between /ar and
 * /en, and sessionStorage restores it after a refresh (requirement T11).
 */
const STORAGE_KEY = "fontaine.estimator.v1";

let state: EstimatorState = DEFAULT_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode); the estimator still works.
  }
}

export function dispatch(action: EstimatorAction) {
  const next = estimatorReducer(state, action);
  if (next === state) return;
  state = next;
  persist();
  emit();
}

/** Loads a shared plan from the URL, else the session copy. Runs once on the client. */
export function hydrateFromBrowser() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const url = new URL(window.location.href);
  const fromUrl = stateFromSearchParams(url.searchParams);
  if (fromUrl) {
    state = fromUrl;
    persist();
    // Clean the address bar so plan parameters are not re-applied on refresh.
    url.search = "";
    window.history.replaceState(window.history.state, "", url.toString());
    emit();
    return;
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const restored = raw ? sanitizeState(JSON.parse(raw)) : null;
    if (restored) {
      state = restored;
      emit();
    }
  } catch {
    // Ignore corrupt or inaccessible storage.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
const getServerSnapshot = () => DEFAULT_STATE;

export function useEstimatorState(): EstimatorState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
