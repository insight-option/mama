// Server-side catalogue loading. Do not import from client components.
import outputs from "@/amplify_outputs.json";
import { menu as staticMenu } from "@/data/menu";
import { LOCAL_MOCK } from "@/lib/local-mock/flag";
import {
  PRODUCT_FIELDS,
  recordToMenuItem,
  sortRecords,
  type ProductRecord,
} from "@/lib/products";
import type { MenuItem } from "@/types/menu";

/** Seconds a fetched catalogue is reused before the site checks again. */
export const CATALOG_REVALIDATE = 30;

export type CatalogResult = {
  items: MenuItem[];
  /** "backend" once products exist in the database, else the bundled menu. */
  source: "backend" | "static";
  records: ProductRecord[];
};

type Outputs = {
  data?: {
    url?: string;
    api_key?: string;
    model_introspection?: { models?: Record<string, unknown> };
  };
};

const dataConfig = (outputs as Outputs).data;
const backendHasProducts = Boolean(
  dataConfig?.url && dataConfig.api_key && dataConfig.model_introspection?.models?.Product,
);

async function fetchRecords(): Promise<ProductRecord[] | null> {
  // Local mock mode: the products saved from the mock admin workspace.
  if (LOCAL_MOCK) return (await import("@/lib/local-mock/store")).listProducts();
  if (!backendHasProducts) return null;
  const records: ProductRecord[] = [];
  let nextToken: string | null = null;
  try {
    do {
      const res: Response = await fetch(dataConfig!.url!, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": dataConfig!.api_key! },
        body: JSON.stringify({
          query: `query List($nextToken: String) {
            listProducts(limit: 1000, nextToken: $nextToken) { items { ${PRODUCT_FIELDS} } nextToken }
          }`,
          variables: { nextToken },
        }),
        next: { revalidate: CATALOG_REVALIDATE, tags: ["products"] },
      });
      const json = await res.json();
      if (!res.ok || json.errors) {
        console.error("Catalogue fetch failed:", json.errors ?? res.status);
        return null;
      }
      records.push(...json.data.listProducts.items);
      nextToken = json.data.listProducts.nextToken;
    } while (nextToken);
  } catch (error) {
    console.error("Catalogue fetch failed:", error);
    return null;
  }
  return records;
}

/**
 * The published menu. Falls back to the bundled menu (data/menu.ts) until
 * products have been imported into the backend, or if it is unreachable.
 */
export async function getCatalog(): Promise<CatalogResult> {
  const records = await fetchRecords();
  if (records && records.length > 0) {
    const sorted = sortRecords(records);
    return { items: sorted.map(recordToMenuItem), source: "backend", records: sorted };
  }
  return { items: staticMenu, source: "static", records: [] };
}

export async function getProduct(id: string) {
  const { items, records } = await getCatalog();
  return {
    item: items.find((item) => item.id === id),
    record: records.find((record) => record.id === id),
  };
}
