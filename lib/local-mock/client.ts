"use client";

// LOCAL MOCK ONLY — browser stand-ins for Cognito sign-in and the
// AppSync/S3 calls in lib/admin/data.ts. Everything goes to
// /api/local-mock on this computer; nothing reaches AWS.
//
// Test accounts (any password works unless noted):
//   any email                → ADMIN
//   staff@…                  → signed in, but not in the ADMIN group
//   new@…                    → must choose a new password first; like
//                              Cognito, that session expires (3 min, or
//                              localStorage "mama-local-mock-session-ms")
//                              and dies after one failed answer
//   password "wrong"         → "incorrect email or password"
//   reset code "123456"      → accepted; any other code is rejected
import type {
  confirmResetPassword as ConfirmResetPassword,
  confirmSignIn as ConfirmSignIn,
  resetPassword as ResetPassword,
  signIn as SignIn,
  SignInOutput,
} from "aws-amplify/auth";
import { isStrongPassword } from "@/lib/admin/auth-errors";
import type { ProductInput, ProductRecord } from "@/lib/products";

const SESSION_KEY = "mama-local-mock-session";
const ADMIN_HEADER = { "x-local-mock-admin": "1" };

type Session = { email: string; admin: boolean };

function named(name: string, message = `[local mock] ${name}`) {
  return Object.assign(new Error(message), { name });
}

function readStored(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function store(session: Session | null) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // Private window: the session simply lasts until reload.
  }
}

// --- Auth -----------------------------------------------------------------

let pendingNewPassword: { email: string; startedAt: number } | null = null;
const sessionMs = () => {
  try {
    return Number(localStorage.getItem("mama-local-mock-session-ms")) || 180_000;
  } catch {
    return 180_000;
  }
};
const done = (): SignInOutput => ({ isSignedIn: true, nextStep: { signInStep: "DONE" } });
const delay = () => new Promise((r) => setTimeout(r, 250));

export const signIn = (async ({ username, password }: { username: string; password?: string }) => {
  await delay();
  if (readStored()) throw named("UserAlreadyAuthenticatedException");
  if (!password || password === "wrong") throw named("NotAuthorizedException", "Incorrect username or password.");
  if (username.startsWith("new")) {
    pendingNewPassword = { email: username, startedAt: Date.now() };
    return {
      isSignedIn: false,
      nextStep: { signInStep: "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED" },
    } as SignInOutput;
  }
  store({ email: username, admin: !username.startsWith("staff") });
  return done();
}) as typeof SignIn;

export const confirmSignIn = (async ({ challengeResponse }: { challengeResponse: string }) => {
  await delay();
  const pending = pendingNewPassword;
  // Like Cognito: one answer per session, and the session expires.
  pendingNewPassword = null;
  if (!pending) throw named("NotAuthorizedException", "Invalid session for the user.");
  if (Date.now() - pending.startedAt > sessionMs()) {
    throw named("NotAuthorizedException", "Invalid session for the user, session is expired.");
  }
  if (!isStrongPassword(challengeResponse)) {
    throw named("InvalidPasswordException", "Password does not conform to policy");
  }
  store({ email: pending.email, admin: true });
  return done();
}) as unknown as typeof ConfirmSignIn;

export const resetPassword = (async () => {
  await delay();
}) as unknown as typeof ResetPassword;

export const confirmResetPassword = (async ({ confirmationCode }: { confirmationCode: string }) => {
  await delay();
  if (confirmationCode !== "123456") throw named("CodeMismatchException");
}) as unknown as typeof ConfirmResetPassword;

export async function readSession(): Promise<{ status: "signedOut" | "notAdmin" | "admin"; email: string | null }> {
  const session = readStored();
  if (!session) return { status: "signedOut", email: null };
  return { status: session.admin ? "admin" : "notAdmin", email: session.email };
}

export async function signOut() {
  store(null);
}

/** Other tabs signing in or out (the real build uses Amplify Hub). */
export function onSessionChange(callback: () => void) {
  const listener = (e: StorageEvent) => e.key === SESSION_KEY && callback();
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}

// --- Data and photos --------------------------------------------------------

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/local-mock/${path}`, {
    ...init,
    headers: { ...(init?.method && init.method !== "GET" ? ADMIN_HEADER : {}), ...init?.headers },
  });
  const body = res.headers.get("content-type")?.includes("json") ? await res.json() : null;
  if (!res.ok) throw new Error(body?.message ?? `Mock request failed (${res.status})`);
  return body as T;
}

const product = (id: string) => `products/${encodeURIComponent(id)}`;
const jsonBody = (data: unknown): RequestInit => ({
  body: JSON.stringify(data),
  headers: { "content-type": "application/json" },
});

export const mockData = {
  list: () => call<ProductRecord[]>("products"),
  get: (id: string) => call<ProductRecord | null>(product(id)),
  create: (input: ProductInput) => call<ProductRecord>("products", { method: "POST", ...jsonBody(input) }),
  update: (input: Partial<ProductInput> & { id: string }) =>
    call<ProductRecord>(product(input.id), { method: "PATCH", ...jsonBody(input) }),
  remove: (id: string) => call<{ id: string }>(product(id), { method: "DELETE" }),
  upload: (path: string, blob: Blob) =>
    call(`files/${path}`, { method: "PUT", body: blob, headers: { "content-type": "image/jpeg" } }),
  removeFile: (path: string) => call(`files/${path}`, { method: "DELETE" }),
  fileUrl: (path: string) => `/api/local-mock/files/${path}`,
};
