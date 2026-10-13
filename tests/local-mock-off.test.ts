// Mock mode must be OFF unless explicitly started, and can never be on in a
// production build.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { test } from "node:test";

delete process.env.NEXT_PUBLIC_LOCAL_MOCK;

const require = createRequire(__filename);
const tsxCli = require.resolve("tsx/cli");

function flagWith(env: Record<string, string>) {
  return execFileSync(
    process.execPath,
    [tsxCli, "-e", 'console.log(require("./lib/local-mock/flag").LOCAL_MOCK)'],
    { env: { ...process.env, ...env }, encoding: "utf8" },
  ).trim();
}

test("the mock API answers 404 when mock mode is off", async () => {
  const route = await import("@/app/api/local-mock/[...slug]/route");
  for (const method of ["GET", "POST", "DELETE"] as const) {
    const res = await route[method](
      new Request("http://localhost/api/local-mock/products", { method, headers: { "x-local-mock-admin": "1" } }),
      { params: { slug: ["products"] } },
    );
    assert.equal(res.status, 404, method);
  }
});

test("flag: off by default, on only with NEXT_PUBLIC_LOCAL_MOCK=1 outside production", () => {
  assert.equal(flagWith({ NODE_ENV: "development" }), "false");
  assert.equal(flagWith({ NODE_ENV: "development", NEXT_PUBLIC_LOCAL_MOCK: "1" }), "true");
  assert.equal(flagWith({ NODE_ENV: "production", NEXT_PUBLIC_LOCAL_MOCK: "1" }), "false");
});
