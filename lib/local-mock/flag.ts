/**
 * LOCAL MOCK MODE — for testing the admin workspace on this computer only.
 *
 * On only when `npm run dev:mock` sets NEXT_PUBLIC_LOCAL_MOCK=1 *and* Next
 * runs in development. Production builds (`next build`, Amplify Hosting)
 * always have NODE_ENV=production, so the mock can never ship: both values
 * are inlined at build time and every mock branch compiles away.
 *
 * In mock mode nothing talks to AWS: sign-in is a fake session in the
 * browser, products live in .local-mock/products.json and photos in
 * .local-mock/uploads/. See lib/local-mock/README.md.
 */
export const LOCAL_MOCK =
  process.env.NEXT_PUBLIC_LOCAL_MOCK === "1" && process.env.NODE_ENV !== "production";
