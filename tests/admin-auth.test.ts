import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CHALLENGE_REFRESH_MS,
  challengeIsStale,
  describeError,
  isStrongPassword,
  loginErrorKey,
  newPasswordFailure,
} from "@/lib/admin/auth-errors";

const cognito = (name: string, message = "") => Object.assign(new Error(message), { name });

test("password rule matches the Cognito pool policy", () => {
  assert.equal(isStrongPassword("Mama2026!"), true);
  assert.equal(isStrongPassword("Mama 2026x"), true, "an inner space counts as a symbol");
  assert.equal(isStrongPassword("Mama2026"), false, "no symbol");
  assert.equal(isStrongPassword("Mama2026é"), false, "accented letter is not a Cognito symbol");
  assert.equal(isStrongPassword("Mama2026ماما"), false, "Arabic letters are not a Cognito symbol");
  assert.equal(isStrongPassword("mama2026!"), false, "no uppercase");
  assert.equal(isStrongPassword("MAMA2026!"), false, "no lowercase");
  assert.equal(isStrongPassword("Mama!!!!"), false, "no number");
  assert.equal(isStrongPassword("Ma1!"), false, "too short");
  assert.equal(isStrongPassword(" Mama2026!"), false, "leading space");
  assert.equal(isStrongPassword("Mama2026! "), false, "trailing space");
});

test("Cognito NotAuthorizedException is split by its message", () => {
  assert.equal(loginErrorKey(cognito("NotAuthorizedException", "Incorrect username or password.")), "credentials");
  assert.equal(
    loginErrorKey(cognito("NotAuthorizedException", "Invalid session for the user, session is expired.")),
    "sessionExpired",
  );
  assert.equal(loginErrorKey(cognito("NotAuthorizedException", "Invalid session for the user.")), "sessionExpired");
  assert.equal(loginErrorKey(cognito("NotAuthorizedException", "Password attempts exceeded")), "tooMany");
  assert.equal(
    loginErrorKey(
      cognito("NotAuthorizedException", "Temporary password has expired and must be reset by an administrator."),
    ),
    "tempExpired",
  );
});

test("other Cognito codes keep their meaning", () => {
  assert.equal(loginErrorKey(cognito("UserNotFoundException")), "credentials");
  assert.equal(loginErrorKey(cognito("InvalidPasswordException")), "weak");
  assert.equal(loginErrorKey(cognito("CodeMismatchException")), "code");
  assert.equal(loginErrorKey(cognito("LimitExceededException")), "tooMany");
  assert.equal(loginErrorKey(cognito("NetworkError")), "network");
  assert.equal(loginErrorKey(cognito("Whatever")), "unknown");
  assert.equal(loginErrorKey(cognito("Whatever"), false), "network");
});

test("a failed new-password answer restarts sign-in with the real reason", () => {
  assert.deepEqual(
    newPasswordFailure(cognito("NotAuthorizedException", "Invalid session for the user, session is expired.")),
    { key: "sessionExpired", restart: true },
  );
  assert.deepEqual(newPasswordFailure(cognito("InvalidPasswordException")), {
    key: "passwordRejected",
    restart: true,
  });
  assert.deepEqual(newPasswordFailure(cognito("NetworkError")), { key: "network", restart: false });
  assert.deepEqual(newPasswordFailure(cognito("Whatever")), { key: "sessionExpired", restart: true });
});

test("a challenge older than 2.5 minutes is renewed before answering", () => {
  const start = 1_000_000;
  assert.equal(challengeIsStale(start, start + 60_000), false);
  assert.equal(challengeIsStale(start, start + CHALLENGE_REFRESH_MS), true);
  assert.equal(challengeIsStale(start, start + 15 * 60_000), true);
  assert.equal(challengeIsStale(0), true, "unknown start counts as stale");
  assert.ok(CHALLENGE_REFRESH_MS < 180_000, "renews before Cognito's 3-minute limit");
});

test("console diagnostics carry only the code and Cognito's message", () => {
  assert.equal(
    describeError(cognito("NotAuthorizedException", "Invalid session for the user, session is expired.")),
    "NotAuthorizedException: Invalid session for the user, session is expired.",
  );
});
