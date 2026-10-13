"use client";

import { generateClient } from "aws-amplify/data";
import { getUrl, remove, uploadData } from "aws-amplify/storage";
import type { Schema } from "@/amplify/data/resource";
import { menu as bundledMenu } from "@/data/menu";
import { menuItemToInput, sortRecords, type ProductInput, type ProductRecord } from "@/lib/products";
import { LOCAL_MOCK } from "@/lib/local-mock/flag";
import { mockData } from "@/lib/local-mock/client";
import { ensureAmplify } from "./amplify";

// All writes are signed with the admin's Cognito user pool token; the
// backend only accepts them from the ADMIN group. With `npm run dev:mock`
// every call below goes to the local mock store instead (LOCAL_MOCK).
let client: ReturnType<typeof generateClient<Schema>> | null = null;
function api() {
  ensureAmplify();
  client ??= generateClient<Schema>({ authMode: "userPool" });
  return client.models.Product;
}

function check<T>(result: { data: T; errors?: { message: string }[] }): T {
  if (result.errors?.length) throw new Error(result.errors.map((e) => e.message).join("; "));
  return result.data;
}

export async function listProducts(): Promise<ProductRecord[]> {
  if (LOCAL_MOCK) return sortRecords(await mockData.list());
  const records: ProductRecord[] = [];
  let nextToken: string | null | undefined;
  do {
    const result = await api().list({ limit: 1000, nextToken });
    records.push(...(check(result) as unknown as ProductRecord[]));
    nextToken = result.nextToken;
  } while (nextToken);
  return sortRecords(records);
}

export async function getProduct(id: string): Promise<ProductRecord | null> {
  if (LOCAL_MOCK) return mockData.get(id);
  return (check(await api().get({ id })) as unknown as ProductRecord) ?? null;
}

type CreatePayload = Parameters<ReturnType<typeof api>["create"]>[0];
type UpdatePayload = Parameters<ReturnType<typeof api>["update"]>[0];

export async function createProduct(input: ProductInput): Promise<ProductRecord> {
  if (LOCAL_MOCK) return mockData.create(input);
  return check(await api().create(input as CreatePayload)) as unknown as ProductRecord;
}

/** Updates only the given fields of a product. */
export async function updateProduct(
  input: Partial<ProductInput> & { id: string },
): Promise<ProductRecord> {
  if (LOCAL_MOCK) return mockData.update(input);
  return check(await api().update(input as UpdatePayload)) as unknown as ProductRecord;
}

export async function deleteProduct(record: ProductRecord): Promise<void> {
  if (LOCAL_MOCK) await mockData.remove(record.id);
  else check(await api().delete({ id: record.id }));
  if (record.imageKey) await deleteImage(record.imageKey);
}

/** Creates the bundled menu (data/menu.ts) in the backend, unchanged. */
export async function importBundledMenu(onProgress: (done: number, total: number) => void) {
  const existing = new Set((await listProducts()).map((p) => p.id));
  const toCreate = bundledMenu.filter((item) => !existing.has(item.id));
  let done = 0;
  for (const item of toCreate) {
    await createProduct(menuItemToInput(item, bundledMenu.indexOf(item)));
    onProgress(++done, toCreate.length);
  }
  return toCreate.length;
}

/** URL-safe id from the English name; unique among existing products. */
export async function uniqueSlug(nameEn: string): Promise<string> {
  const base =
    nameEn
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || `dish-${Date.now().toString(36)}`;
  const taken = new Set((await listProducts()).map((p) => p.id));
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}

/**
 * Downscales a photo in the browser before upload (max 1600 px, JPEG), so
 * product pages stay fast. Returns the blob and its pixel size.
 */
export async function prepareImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode failed"))), "image/jpeg", 0.86),
  );
  return { blob, width, height };
}

export async function uploadImage(productId: string, blob: Blob): Promise<string> {
  const path = `products/${productId}-${Date.now().toString(36)}.jpg`;
  if (LOCAL_MOCK) {
    await mockData.upload(path, blob);
    return path;
  }
  ensureAmplify();
  await uploadData({ path, data: blob, options: { contentType: "image/jpeg" } }).result;
  return path;
}

export async function deleteImage(path: string) {
  try {
    if (LOCAL_MOCK) return void (await mockData.removeFile(path));
    ensureAmplify();
    await remove({ path });
  } catch (error) {
    // The product change matters more than a leftover file.
    console.warn("Could not delete old image", path, error);
  }
}

export async function imagePreviewUrl(path: string): Promise<string> {
  if (LOCAL_MOCK) return mockData.fileUrl(path);
  ensureAmplify();
  const { url } = await getUrl({ path, options: { expiresIn: 3600 } });
  return url.toString();
}
