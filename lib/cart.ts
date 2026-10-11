import { restaurant } from "@/config/restaurant";
import { menu } from "@/data/menu";
import type { MenuItem, ServingId } from "@/types/menu";

export type Fulfillment = "delivery" | "pickup";

/**
 * What the browser stores: dish ids, serving and quantity only. Prices are
 * always looked up from data/menu.ts, never read from storage.
 */
export type CartLine = {
  itemId: string;
  servingId?: ServingId;
  quantity: number;
};

export type CartState = {
  lines: CartLine[];
  fulfillment: Fulfillment;
};

export type ResolvedLine = CartLine & {
  key: string;
  item: MenuItem;
  unitPrice: number;
  lineTotal: number;
};

export type CartTotals = {
  itemCount: number;
  subtotal: number;
  fee: number;
  total: number;
};

export const MAX_QUANTITY = 99;
export const STORAGE_KEY = "mama-food-cart-v1";
export const emptyCart: CartState = { lines: [], fulfillment: "delivery" };

const itemsById = new Map(menu.map((item) => [item.id, item]));

/** Each dish + serving pair is its own line, e.g. "mansaf:two". */
export function lineKey(line: Pick<CartLine, "itemId" | "servingId">): string {
  return line.servingId ? `${line.itemId}:${line.servingId}` : line.itemId;
}

/** Current price for a dish and serving, or null if the pair is not valid. */
export function unitPriceFor(
  item: MenuItem,
  servingId?: ServingId,
): number | null {
  if (item.pricing.type === "fixed") {
    return servingId ? null : item.pricing.price;
  }
  const option = item.pricing.options.find((o) => o.id === servingId);
  return option ? option.price : null;
}

export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  const resolved: ResolvedLine[] = [];
  for (const line of lines) {
    const item = itemsById.get(line.itemId);
    if (!item || !item.available) continue;
    const unitPrice = unitPriceFor(item, line.servingId);
    if (unitPrice === null) continue;
    resolved.push({
      ...line,
      key: lineKey(line),
      item,
      unitPrice,
      lineTotal: unitPrice * line.quantity,
    });
  }
  return resolved;
}

export function feeFor(fulfillment: Fulfillment): number {
  return fulfillment === "delivery"
    ? restaurant.fees.delivery
    : restaurant.fees.pickup;
}

export function computeTotals(
  lines: ResolvedLine[],
  fulfillment: Fulfillment,
): CartTotals {
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  // No fee on an empty cart: there is nothing to deliver.
  const fee = itemCount > 0 ? feeFor(fulfillment) : 0;
  return { itemCount, subtotal, fee, total: subtotal + fee };
}

function clampQuantity(quantity: number): number {
  return Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));
}

export function addLine(
  lines: CartLine[],
  itemId: string,
  servingId?: ServingId,
): CartLine[] {
  const key = lineKey({ itemId, servingId });
  const existing = lines.find((line) => lineKey(line) === key);
  if (existing) {
    return lines.map((line) =>
      line === existing
        ? { ...line, quantity: clampQuantity(line.quantity + 1) }
        : line,
    );
  }
  return [...lines, { itemId, servingId, quantity: 1 }];
}

export function setLineQuantity(
  lines: CartLine[],
  key: string,
  quantity: number,
): CartLine[] {
  return lines.map((line) =>
    lineKey(line) === key ? { ...line, quantity: clampQuantity(quantity) } : line,
  );
}

export function removeLine(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((line) => lineKey(line) !== key);
}

/**
 * Reads stored data defensively: anything malformed, unknown, unavailable
 * or with an invalid serving is dropped, and duplicate lines are merged.
 */
export function parseStoredCart(raw: string | null): CartState {
  if (!raw) return emptyCart;
  try {
    const data = JSON.parse(raw) as Partial<CartState>;
    const fulfillment: Fulfillment =
      data.fulfillment === "pickup" ? "pickup" : "delivery";

    const merged = new Map<string, CartLine>();
    for (const entry of Array.isArray(data.lines) ? data.lines : []) {
      if (!entry || typeof entry.itemId !== "string") continue;
      if (typeof entry.quantity !== "number" || !(entry.quantity >= 1)) continue;
      const servingId =
        entry.servingId === "one" || entry.servingId === "two"
          ? entry.servingId
          : undefined;
      const item = itemsById.get(entry.itemId);
      if (!item || !item.available || unitPriceFor(item, servingId) === null) {
        continue;
      }
      const key = lineKey({ itemId: entry.itemId, servingId });
      const quantity = (merged.get(key)?.quantity ?? 0) + entry.quantity;
      merged.set(key, {
        itemId: entry.itemId,
        servingId,
        quantity: clampQuantity(quantity),
      });
    }
    return { lines: Array.from(merged.values()), fulfillment };
  } catch {
    return emptyCart;
  }
}
