"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addLine,
  computeTotals,
  emptyCart,
  parseStoredCart,
  removeLine,
  resolveLines,
  setLineQuantity,
  STORAGE_KEY,
  type CartState,
  type CartTotals,
  type Fulfillment,
  type ResolvedLine,
} from "@/lib/cart";
import type { ServingId } from "@/types/menu";

type CartContextValue = {
  /** False until the stored cart has been read on the client. */
  ready: boolean;
  lines: ResolvedLine[];
  totals: CartTotals;
  fulfillment: Fulfillment;
  isOpen: boolean;
  add: (itemId: string, servingId?: ServingId) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  setFulfillment: (value: Fulfillment) => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartState {
  try {
    return parseStoredCart(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return emptyCart;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>(emptyCart);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load after mount so server and first client render match.
  useEffect(() => {
    setState(readStorage());
    setReady(true);

    // Keep other open tabs in sync.
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setState(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be blocked (private mode); the cart still works in memory.
    }
  }, [state, ready]);

  const add = useCallback((itemId: string, servingId?: ServingId) => {
    setState((s) => ({ ...s, lines: addLine(s.lines, itemId, servingId) }));
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setState((s) => ({ ...s, lines: setLineQuantity(s.lines, key, quantity) }));
  }, []);

  const remove = useCallback((key: string) => {
    setState((s) => ({ ...s, lines: removeLine(s.lines, key) }));
  }, []);

  const setFulfillment = useCallback((fulfillment: Fulfillment) => {
    setState((s) => ({ ...s, fulfillment }));
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const lines = resolveLines(state.lines);
    return {
      ready,
      lines,
      totals: computeTotals(lines, state.fulfillment),
      fulfillment: state.fulfillment,
      isOpen,
      add,
      setQuantity,
      remove,
      setFulfillment,
      open,
      close,
    };
  }, [state, ready, isOpen, add, setQuantity, remove, setFulfillment, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
