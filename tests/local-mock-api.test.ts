// The local mock API with mock mode ON, using a throwaway data folder.
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";

const dir = mkdtempSync(path.join(tmpdir(), "mama-mock-"));
process.env.LOCAL_MOCK_DIR = dir;
process.env.NEXT_PUBLIC_LOCAL_MOCK = "1";

type Handler = (request: Request, ctx: { params: { slug: string[] } }) => Promise<Response>;
let route: Record<"GET" | "POST" | "PATCH" | "PUT" | "DELETE", Handler>;
let catalog: typeof import("@/lib/catalog");

before(async () => {
  route = await import("@/app/api/local-mock/[...slug]/route");
  catalog = await import("@/lib/catalog");
});
after(() => rmSync(dir, { recursive: true, force: true }));

function call(method: keyof typeof route, slug: string, body?: unknown, admin = true) {
  const headers: Record<string, string> = admin ? { "x-local-mock-admin": "1" } : {};
  let payload: BodyInit | undefined;
  if (body instanceof Uint8Array) payload = body;
  else if (body !== undefined) {
    payload = JSON.stringify(body);
    headers["content-type"] = "application/json";
  }
  const request = new Request(`http://localhost/api/local-mock/${slug}`, { method, headers, body: payload });
  return route[method](request, { params: { slug: slug.split("/") } });
}

const dish = {
  id: "test-dish",
  category: "pasta",
  nameAr: "طبق تجريبي",
  nameEn: "Test dish",
  pricingType: "fixed",
  price: 4.5,
  available: true,
};

test("starts empty, so the site falls back to the bundled menu", async () => {
  assert.deepEqual(await (await call("GET", "products")).json(), []);
  assert.equal((await catalog.getCatalog()).source, "static");
});

test("writes without the mock ADMIN session are rejected, reads are public", async () => {
  assert.equal((await call("POST", "products", dish, false)).status, 401);
  assert.equal((await call("GET", "products", undefined, false)).status, 200);
});

test("create, read, update, delete a product", async () => {
  const created = await call("POST", "products", dish);
  assert.equal(created.status, 201);
  assert.ok((await created.json()).updatedAt);

  assert.equal((await call("POST", "products", dish)).status, 409, "duplicate id rejected");

  const updated = await (await call("PATCH", "products/test-dish", { price: 3.75, offerActive: true })).json();
  assert.equal(updated.price, 3.75);
  assert.equal(updated.nameEn, "Test dish", "partial update keeps other fields");

  const fetched = await (await call("GET", "products/test-dish")).json();
  assert.equal(fetched.price, 3.75);

  assert.equal((await call("PATCH", "products/missing", { price: 1 })).status, 404);
});

test("the customer catalogue reads what the admin saved", async () => {
  const result = await catalog.getCatalog();
  assert.equal(result.source, "backend");
  const item = result.items.find((i) => i.id === "test-dish");
  assert.deepEqual(item?.pricing, { type: "fixed", price: 3.75 });
});

test("photo upload, read and delete", async () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
  assert.equal((await call("PUT", "files/products/test-dish-1.jpg", jpeg)).status, 201);
  const read = await call("GET", "files/products/test-dish-1.jpg", undefined, false);
  assert.equal(read.headers.get("content-type"), "image/jpeg");
  assert.deepEqual(new Uint8Array(await read.arrayBuffer()), jpeg);

  assert.equal((await call("DELETE", "files/products/test-dish-1.jpg")).status, 200);
  assert.equal((await call("GET", "files/products/test-dish-1.jpg")).status, 404);
});

test("photo keys outside products/*.jpg are refused (no path traversal)", async () => {
  for (const bad of ["files/products/../../evil.jpg", "files/other/x.jpg", "files/products/x.exe"]) {
    assert.equal((await call("PUT", bad, new Uint8Array([1]))).status, 400, bad);
  }
  assert.deepEqual(readdirSync(dir).sort(), ["products.json", "uploads"]);
});

test("deleting removes the product from the site", async () => {
  assert.equal((await call("DELETE", "products/test-dish")).status, 200);
  assert.equal((await call("DELETE", "products/test-dish")).status, 404);
  assert.equal((await catalog.getCatalog()).source, "static");
});
