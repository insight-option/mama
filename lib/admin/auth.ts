"use client";

// Admin sign-in calls. Cognito (via Amplify) normally; the local mock when
// running `npm run dev:mock` (see lib/local-mock/flag.ts).
import * as amplify from "aws-amplify/auth";
import { LOCAL_MOCK } from "@/lib/local-mock/flag";
import * as mock from "@/lib/local-mock/client";

export type { SignInOutput } from "aws-amplify/auth";

export const signIn = LOCAL_MOCK ? mock.signIn : amplify.signIn;
export const confirmSignIn = LOCAL_MOCK ? mock.confirmSignIn : amplify.confirmSignIn;
export const resetPassword = LOCAL_MOCK ? mock.resetPassword : amplify.resetPassword;
export const confirmResetPassword = LOCAL_MOCK ? mock.confirmResetPassword : amplify.confirmResetPassword;
