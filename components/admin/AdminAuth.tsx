"use client";

import { fetchAuthSession, getCurrentUser, signOut as amplifySignOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ADMIN_GROUP, ensureAmplify } from "@/lib/admin/amplify";
import { LOCAL_MOCK } from "@/lib/local-mock/flag";
import * as mock from "@/lib/local-mock/client";

export type AuthStatus = "loading" | "signedOut" | "notAdmin" | "admin";

type AuthValue = {
  status: AuthStatus;
  email: string | null;
  /** Re-reads the session (e.g. right after sign-in). Returns the new status. */
  refresh: () => Promise<AuthStatus>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

/** Group membership comes from the Cognito tokens ("cognito:groups"). */
async function readSession(): Promise<{ status: AuthStatus; email: string | null }> {
  if (LOCAL_MOCK) return mock.readSession();
  try {
    await getCurrentUser();
  } catch {
    return { status: "signedOut", email: null };
  }
  try {
    const session = await fetchAuthSession({ forceRefresh: true });
    const payload = session.tokens?.idToken?.payload;
    if (!payload) return { status: "signedOut", email: null };
    const groups = (payload["cognito:groups"] as string[] | undefined) ?? [];
    const email = (payload.email as string | undefined) ?? null;
    return { status: groups.includes(ADMIN_GROUP) ? "admin" : "notAdmin", email };
  } catch {
    return { status: "signedOut", email: null };
  }
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  if (!LOCAL_MOCK) ensureAmplify();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [email, setEmail] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const next = await readSession();
    setStatus(next.status);
    setEmail(next.email);
    return next.status;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await (LOCAL_MOCK ? mock.signOut() : amplifySignOut());
    } finally {
      setStatus("signedOut");
      setEmail(null);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (LOCAL_MOCK) return mock.onSessionChange(refresh);
    // Keep tabs in step: sign-in / sign-out / token refresh failures.
    return Hub.listen("auth", ({ payload }) => {
      if (["signedIn", "signedOut", "tokenRefresh_failure"].includes(payload.event)) refresh();
    });
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ status, email, refresh, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAdminAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return value;
}
