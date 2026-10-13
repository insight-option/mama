// Production builds use this file in place of lib/local-mock/client.ts and
// lib/local-mock/store.ts (see next.config.js), so no mock code ships.
// LOCAL_MOCK is always false there, so nothing below is ever called.
const disabled = (): never => {
  throw new Error("Local mock is not available in production builds");
};

export class MockError extends Error {
  status = 500;
}

// lib/local-mock/client.ts
export const signIn = disabled;
export const confirmSignIn = disabled;
export const resetPassword = disabled;
export const confirmResetPassword = disabled;
export const readSession = disabled;
export const signOut = disabled;
export const onSessionChange = disabled;
export const mockData = new Proxy({}, { get: () => disabled });

// lib/local-mock/store.ts
export const listProducts = disabled;
export const getProduct = disabled;
export const createProduct = disabled;
export const updateProduct = disabled;
export const deleteProduct = disabled;
export const saveImage = disabled;
export const readImage = disabled;
export const deleteImage = disabled;
