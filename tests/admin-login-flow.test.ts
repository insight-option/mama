import assert from "node:assert/strict";
import { test } from "node:test";
import { answerNewPassword, isStrongPassword, newPasswordFailure } from "@/lib/admin/auth-errors";

// The "Choose a new password" step, run through the same function LoginForm
// calls. No browser: Cognito is modelled with a fake clock, then the local
// mock is used for real.

type Output = { isSignedIn: boolean; nextStep: { signInStep: string } };
const TEMP = "Temp-Pass1";
const NEW = "Mama2026!";
const cognitoError = (name: string, message: string) => Object.assign(new Error(message), { name });
const challenge = (): Output => ({
  isSignedIn: false,
  nextStep: { signInStep: "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED" },
});
const done = (): Output => ({ isSignedIn: true, nextStep: { signInStep: "DONE" } });

/**
 * Cognito's NEW_PASSWORD_REQUIRED challenge as seen in CloudTrail: the
 * session lasts 3 minutes and any answer, right or wrong, uses it up.
 */
function fakeCognito() {
  let clock = 1_000_000;
  let session: { startedAt: number } | null = null;
  const calls: string[] = [];
  return {
    calls,
    now: () => clock,
    wait: (ms: number) => {
      clock += ms;
    },
    signIn: async (password: string) => {
      calls.push("signIn");
      if (password !== TEMP) throw cognitoError("NotAuthorizedException", "Incorrect username or password.");
      session = { startedAt: clock };
      return challenge();
    },
    confirm: async (newPassword: string) => {
      calls.push("confirm");
      const current = session;
      session = null;
      if (!current) throw cognitoError("NotAuthorizedException", "Invalid session for the user.");
      if (clock - current.startedAt > 180_000) {
        throw cognitoError("NotAuthorizedException", "Invalid session for the user, session is expired.");
      }
      if (!isStrongPassword(newPassword)) {
        throw cognitoError("InvalidPasswordException", "Password does not conform to policy");
      }
      return done();
    },
  };
}

/** What LoginForm does after the temporary password was accepted at `startedAt`. */
function save(cognito: ReturnType<typeof fakeCognito>, startedAt: number, newPassword = NEW) {
  return answerNewPassword({
    startedAt,
    signInAgain: () => cognito.signIn(TEMP),
    answer: () => cognito.confirm(newPassword),
    onNewChallenge: () => {},
    now: cognito.now,
  });
}

test("the model reproduces the production error: answering after 4 minutes", async () => {
  const cognito = fakeCognito();
  await cognito.signIn(TEMP);
  cognito.wait(4 * 60_000);
  await assert.rejects(cognito.confirm(NEW), /session is expired/);
});

test("answered within the session: saved without signing in again", async () => {
  const cognito = fakeCognito();
  await cognito.signIn(TEMP);
  const startedAt = cognito.now();
  cognito.wait(60_000);
  assert.equal((await save(cognito, startedAt)).nextStep.signInStep, "DONE");
  assert.deepEqual(cognito.calls, ["signIn", "confirm"]);
});

test("4 minutes on the screen: a fresh challenge is fetched first, then saved", async () => {
  const cognito = fakeCognito();
  await cognito.signIn(TEMP);
  const startedAt = cognito.now();
  cognito.wait(4 * 60_000);
  assert.equal((await save(cognito, startedAt)).nextStep.signInStep, "DONE");
  assert.deepEqual(cognito.calls, ["signIn", "signIn", "confirm"]);
});

test("Cognito says the session is gone before the 2.5 minute mark: renewed and saved", async () => {
  const cognito = fakeCognito();
  await cognito.signIn(TEMP);
  const startedAt = cognito.now();
  // A rejected answer has already used up this session.
  await assert.rejects(cognito.confirm("Mama2026é"), { name: "InvalidPasswordException" });
  assert.equal((await save(cognito, startedAt)).nextStep.signInStep, "DONE");
  assert.deepEqual(cognito.calls, ["signIn", "confirm", "confirm", "signIn", "confirm"]);
});

test("a second session failure is not retried again: back to sign-in", async () => {
  const calls: string[] = [];
  const failure = await answerNewPassword({
    startedAt: Date.now(),
    signInAgain: async () => (calls.push("signIn"), challenge()),
    answer: async () => {
      calls.push("confirm");
      throw cognitoError("NotAuthorizedException", "Invalid session for the user, session is expired.");
    },
    onNewChallenge: () => {},
  }).catch((err: unknown) => err);
  assert.deepEqual(calls, ["confirm", "signIn", "confirm"]);
  assert.deepEqual(newPasswordFailure(failure), { key: "sessionExpired", restart: true });
});

test("Cognito rejects the new password: no retry, back to sign-in with that reason", async () => {
  const calls: string[] = [];
  const failure = await answerNewPassword({
    startedAt: Date.now(),
    signInAgain: async () => (calls.push("signIn"), challenge()),
    answer: async () => {
      calls.push("confirm");
      throw cognitoError("InvalidPasswordException", "Password does not conform to policy");
    },
    onNewChallenge: () => {},
  }).catch((err: unknown) => err);
  assert.deepEqual(calls, ["confirm"]);
  assert.deepEqual(newPasswordFailure(failure), { key: "passwordRejected", restart: true });
});

test("temporary password expired when renewing: that reason is shown", async () => {
  const failure = await answerNewPassword({
    startedAt: 0,
    signInAgain: async () => {
      throw cognitoError(
        "NotAuthorizedException",
        "Temporary password has expired and must be reset by an administrator.",
      );
    },
    answer: async () => done(),
    onNewChallenge: () => {},
  }).catch((err: unknown) => err);
  assert.deepEqual(newPasswordFailure(failure), { key: "tempExpired", restart: true });
});

test("a renewal that lands on another step is passed on, not answered", async () => {
  let answered = false;
  const output = await answerNewPassword({
    startedAt: 0,
    signInAgain: async () => done(),
    answer: async () => ((answered = true), done()),
    onNewChallenge: () => {},
  });
  assert.equal(output.nextStep.signInStep, "DONE");
  assert.equal(answered, false);
});

test("local mock: an expired session is renewed and the admin is signed in", async () => {
  const items = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => items.set(key, String(value)),
      removeItem: (key: string) => items.delete(key),
    },
  });
  // The mock's session lasts 1 second here instead of Cognito's 3 minutes.
  items.set("mama-local-mock-session-ms", "1000");
  const mock = await import("@/lib/local-mock/client");
  const username = "new.owner@mama.test";

  const first = await mock.signIn({ username, password: TEMP });
  assert.equal(first.nextStep.signInStep, "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED");
  const startedAt = Date.now();
  await new Promise((r) => setTimeout(r, 1300));

  let renewals = 0;
  const output = await answerNewPassword({
    startedAt,
    signInAgain: () => (renewals++, mock.signIn({ username, password: TEMP })),
    answer: () => mock.confirmSignIn({ challengeResponse: NEW }),
    onNewChallenge: () => {},
  });
  assert.equal(output.nextStep.signInStep, "DONE");
  assert.equal(renewals, 1);
  assert.deepEqual(await mock.readSession(), { status: "admin", email: username });
});
