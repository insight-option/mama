"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { LOCAL_MOCK } from "@/lib/local-mock/flag";

// Configured once, only in the admin workspace (the public site does not
// load Amplify in the browser).
let configured = false;
export function ensureAmplify() {
  if (configured) return;
  Amplify.configure(outputs);
  configured = true;
}

type Outputs = {
  data?: { model_introspection?: { models?: Record<string, unknown> } };
  storage?: unknown;
};

/**
 * True once the Product model and image storage are deployed, or always in
 * local mock mode (which never uses the deployed backend).
 */
export const backendReady = LOCAL_MOCK || Boolean(
  (outputs as Outputs).data?.model_introspection?.models?.Product && (outputs as Outputs).storage,
);

export const ADMIN_GROUP = "ADMIN";
