// Admin sign-in rules and Cognito error handling (used by LoginForm, tested
// in tests/admin-auth.test.ts).

/**
 * Characters Cognito counts as a "symbol" in its password policy. Anything
 * else that is not a letter or digit (é, Arabic letters, emoji…) does not
 * satisfy the symbol rule. The space counts too, but not at either end.
 */
export const COGNITO_SYMBOLS = "^$*.[]{}()?-\"!@#%&/\\,><':;|_~`+= ";

/** The pool's policy: 8+ characters, upper, lower, number and symbol. */
export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    password.length <= 256 &&
    password === password.trim() &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    password.split("").some((c) => COGNITO_SYMBOLS.includes(c))
  );
}

export type LoginErrorKey =
  | "credentials"
  | "required"
  | "email"
  | "mismatch"
  | "weak"
  | "code"
  | "expired"
  | "tooMany"
  | "notConfirmed"
  | "network"
  | "sessionExpired"
  | "passwordRejected"
  | "tempExpired"
  | "unknown";

type ServiceError = { name?: string; message?: string };

/** Maps a Cognito / Amplify error to a message key using its code and text. */
export function loginErrorKey(error: unknown, online = true): LoginErrorKey {
  const { name = "", message = "" } = (error ?? {}) as ServiceError;
  switch (name) {
    case "NotAuthorizedException":
      // Cognito uses this one code for several different problems.
      if (/attempts exceeded/i.test(message)) return "tooMany";
      if (/temporary password has expired/i.test(message)) return "tempExpired";
      if (/session/i.test(message)) return "sessionExpired";
      return "credentials";
    case "UserNotFoundException":
      return "credentials";
    case "InvalidPasswordException":
      return "weak";
    case "CodeMismatchException":
      return "code";
    case "ExpiredCodeException":
      return "expired";
    case "LimitExceededException":
    case "TooManyRequestsException":
    case "TooManyFailedAttemptsException":
      return "tooMany";
    case "UserNotConfirmedException":
      return "notConfirmed";
    case "NetworkError":
      return "network";
    default:
      return online ? "unknown" : "network";
  }
}

/**
 * A failed confirmSignIn (new password step). Cognito's challenge session
 * lasts about 3 minutes and cannot be reused after a failed attempt, so
 * retrying on the same screen always fails with "Invalid session". Restart
 * sign-in instead, unless the request never reached Cognito.
 */
export function newPasswordFailure(
  error: unknown,
  online = true,
): { key: LoginErrorKey; restart: boolean } {
  const key = loginErrorKey(error, online);
  if (key === "network") return { key, restart: false };
  if (key === "weak") return { key: "passwordRejected", restart: true };
  if (key === "credentials" || key === "unknown") return { key: "sessionExpired", restart: true };
  return { key, restart: true };
}

/** Error code and Cognito's own message, for the browser console. Never includes input values. */
export function describeError(error: unknown): string {
  const { name = "Error", message = "" } = (error ?? {}) as ServiceError;
  return `${name}: ${message}`;
}

/**
 * Cognito's challenge session after the temporary password is accepted lasts
 * 3 minutes (the app client's AuthSessionValidity). Past this age the app
 * asks for a fresh one before submitting the new password.
 */
export const CHALLENGE_REFRESH_MS = 150_000;

export function challengeIsStale(startedAt: number, now = Date.now()): boolean {
  return !startedAt || now - startedAt >= CHALLENGE_REFRESH_MS;
}
