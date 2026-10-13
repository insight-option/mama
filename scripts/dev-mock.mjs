// Starts `next dev` in LOCAL MOCK mode: admin sign-in, products and photos
// are simulated on this computer and nothing talks to AWS.
// See lib/local-mock/README.md. Usage: npm run dev:mock [-- -p 3001]
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const next = require.resolve("next/dist/bin/next");

console.log("\n  LOCAL MOCK MODE — data saved in .local-mock/, no AWS calls\n");

const child = spawn(process.execPath, [next, "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_LOCAL_MOCK: "1" },
});
child.on("exit", (code) => process.exit(code ?? 0));
