// LOCAL MOCK ONLY — server-side stand-in for DynamoDB (products) and S3
// (photos). Files live in .local-mock/ (gitignored). Never imported by
// client components; only by the local-mock API route and lib/catalog.ts
// when LOCAL_MOCK is on.
import { promises as fs } from "fs";
import path from "path";
import type { ProductInput, ProductRecord } from "@/lib/products";

const ROOT = process.env.LOCAL_MOCK_DIR ?? path.join(process.cwd(), ".local-mock");
const PRODUCTS = () => path.join(ROOT, "products.json");
const UPLOADS = () => path.join(ROOT, "uploads");

/** Same shape the admin uploads to S3: products/<id>-<version>.jpg */
const IMAGE_KEY = /^products\/[a-z0-9-]+\.jpg$/;

export class MockError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function readAll(): Promise<ProductRecord[]> {
  try {
    return JSON.parse(await fs.readFile(PRODUCTS(), "utf8")) as ProductRecord[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

// Writes go through a temp file so a crash never leaves half a JSON file.
let queue: Promise<unknown> = Promise.resolve();
function writeAll(records: ProductRecord[]) {
  const run = queue.then(async () => {
    await fs.mkdir(ROOT, { recursive: true });
    const tmp = `${PRODUCTS()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(records, null, 2));
    await fs.rename(tmp, PRODUCTS());
  });
  queue = run.catch(() => undefined);
  return run;
}

export async function listProducts(): Promise<ProductRecord[]> {
  return readAll();
}

export async function getProduct(id: string): Promise<ProductRecord | null> {
  return (await readAll()).find((r) => r.id === id) ?? null;
}

export async function createProduct(input: ProductInput): Promise<ProductRecord> {
  if (!input.id || !input.nameAr || !input.nameEn || !input.category || !input.pricingType) {
    throw new MockError("Missing required product fields", 400);
  }
  const records = await readAll();
  // DynamoDB rejects a create with an existing id; so does the mock.
  if (records.some((r) => r.id === input.id)) throw new MockError(`Product ${input.id} already exists`, 409);
  const record: ProductRecord = { ...input, updatedAt: new Date().toISOString() };
  await writeAll([...records, record]);
  return record;
}

export async function updateProduct(input: Partial<ProductInput> & { id: string }): Promise<ProductRecord> {
  const records = await readAll();
  const index = records.findIndex((r) => r.id === input.id);
  if (index === -1) throw new MockError(`Product ${input.id} not found`, 404);
  const record: ProductRecord = { ...records[index], ...input, updatedAt: new Date().toISOString() };
  records[index] = record;
  await writeAll(records);
  return record;
}

export async function deleteProduct(id: string): Promise<void> {
  const records = await readAll();
  if (!records.some((r) => r.id === id)) throw new MockError(`Product ${id} not found`, 404);
  await writeAll(records.filter((r) => r.id !== id));
}

function imageFile(key: string) {
  if (!IMAGE_KEY.test(key)) throw new MockError("Invalid image key", 400);
  return path.join(UPLOADS(), path.basename(key));
}

export async function saveImage(key: string, data: Buffer) {
  const file = imageFile(key);
  await fs.mkdir(UPLOADS(), { recursive: true });
  await fs.writeFile(file, data);
}

export async function readImage(key: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(imageFile(key));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function deleteImage(key: string) {
  await fs.rm(imageFile(key), { force: true });
}
