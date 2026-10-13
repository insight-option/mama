"use client";

import { confirmResetPassword, confirmSignIn, resetPassword, signIn, type SignInOutput } from "@/lib/admin/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/layout/Wordmark";
import { LockIcon } from "@/components/ui/icons";
import { adminCopy } from "@/lib/admin-copy";
import type { Locale } from "@/lib/i18n";
import { useAdminAuth } from "./AdminAuth";

type Step = "signIn" | "newPassword" | "forgot" | "forgotCode" | "notAdmin";
type ErrorKey = keyof (typeof adminCopy)["en"]["login"]["errors"];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Matches the Cognito pool policy: 8+ chars, upper, lower, number, symbol.
const strong = (p: string) =>
  p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p);

function errorKey(error: unknown): ErrorKey {
  const name = (error as { name?: string })?.name ?? "";
  switch (name) {
    case "NotAuthorizedException":
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
      return typeof navigator !== "undefined" && !navigator.onLine ? "network" : "unknown";
  }
}

const input =
  "block w-full rounded-2xl border border-line bg-surface px-4 py-3 text-base text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-leaf/40";

export function LoginForm({ locale }: { locale: Locale }) {
  const t = adminCopy[locale].login;
  const { status, refresh, signOut } = useAdminAuth();
  const router = useRouter();
  const adminHome = `/${locale}/admin`;

  const [step, setStep] = useState<Step>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorKey | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Already signed in as an admin: go straight to the workspace.
  useEffect(() => {
    if (status === "admin") router.replace(adminHome);
    if (status === "notAdmin") setStep("notAdmin");
  }, [status, router, adminHome]);

  const finish = async () => {
    const next = await refresh();
    if (next === "admin") router.replace(adminHome);
    else setStep("notAdmin");
  };

  const handleNextStep = async (output: SignInOutput) => {
    switch (output.nextStep.signInStep) {
      case "DONE":
        return finish();
      case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
        setStep("newPassword");
        return;
      case "RESET_PASSWORD":
        setStep("forgot");
        return;
      case "CONFIRM_SIGN_UP":
        setError("notConfirmed");
        return;
      default:
        setError("unknown");
    }
  };

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await action();
    } catch (err) {
      if ((err as { name?: string })?.name === "UserAlreadyAuthenticatedException") {
        await finish();
      } else if ((err as { name?: string })?.name === "PasswordResetRequiredException") {
        setStep("forgot");
      } else {
        setError(errorKey(err));
      }
    } finally {
      setBusy(false);
    }
  };

  const onSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const username = email.trim().toLowerCase();
    if (!username || !password) return setError("required");
    if (!EMAIL.test(username)) return setError("email");
    run(async () => handleNextStep(await signIn({ username, password })));
  };

  const onNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirm) return setError("required");
    if (newPassword !== confirm) return setError("mismatch");
    if (!strong(newPassword)) return setError("weak");
    run(async () => handleNextStep(await confirmSignIn({ challengeResponse: newPassword })));
  };

  const onSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    const username = email.trim().toLowerCase();
    if (!EMAIL.test(username)) return setError("email");
    run(async () => {
      await resetPassword({ username });
      setStep("forgotCode");
    });
  };

  const onReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newPassword || !confirm) return setError("required");
    if (newPassword !== confirm) return setError("mismatch");
    if (!strong(newPassword)) return setError("weak");
    run(async () => {
      await confirmResetPassword({
        username: email.trim().toLowerCase(),
        confirmationCode: code.trim(),
        newPassword,
      });
      setPassword("");
      setNewPassword("");
      setConfirm("");
      setCode("");
      setStep("signIn");
      setNotice(t.resetDone);
    });
  };

  const titles: Record<Step, string> = {
    signIn: t.title,
    newPassword: t.newPasswordTitle,
    forgot: t.resetTitle,
    forgotCode: t.resetTitle,
    notAdmin: t.notAdminTitle,
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href={`/${locale}`} className="mb-8 text-white">
        <Wordmark tone="light" />
      </Link>

      <div className="w-full max-w-md animate-pop-in rounded-[2rem] bg-ivory p-8 shadow-lift md:p-10">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-forest text-white">
          <LockIcon className="size-6" />
        </span>
        <h1 className="mt-6 font-display text-3xl text-forest">{titles[step]}</h1>

        {error && (
          <p role="alert" className="mt-5 rounded-2xl border border-red-700/30 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {t.errors[error]}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-5 rounded-2xl bg-leaf/15 px-4 py-3 text-sm font-medium text-forest">
            {notice}
          </p>
        )}

        {step === "signIn" && (
          <form onSubmit={onSignIn} noValidate className="mt-6 space-y-4">
            <p className="text-sm text-muted">{t.intro}</p>
            <Field label={t.email} id="admin-email">
              <input
                id="admin-email"
                type="email"
                dir="ltr"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={input}
              />
            </Field>
            <Field label={t.password} id="admin-password">
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  dir="ltr"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${input} pe-20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 end-2 my-auto h-9 rounded-full px-3 text-xs font-bold text-forest hover:bg-forest/5"
                >
                  {showPassword ? t.hide : t.show}
                </button>
              </div>
            </Field>
            <button type="submit" disabled={busy} className="btn-primary w-full min-h-14 text-base disabled:opacity-70">
              {busy ? t.submitting : t.submit}
            </button>
            <div className="flex items-center justify-between gap-3 text-sm">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setNotice(null);
                  setStep("forgot");
                }}
                className="min-h-10 font-bold text-forest hover:text-leaf"
              >
                {t.forgot}
              </button>
              <Link href={`/${locale}`} className="min-h-10 py-2 text-muted hover:text-forest">
                {t.backToSite}
              </Link>
            </div>
          </form>
        )}

        {step === "newPassword" && (
          <form onSubmit={onNewPassword} noValidate className="mt-6 space-y-4">
            <p className="text-sm text-muted">{t.newPasswordIntro}</p>
            <PasswordPair
              t={t}
              newPassword={newPassword}
              confirm={confirm}
              onNew={setNewPassword}
              onConfirm={setConfirm}
            />
            <button type="submit" disabled={busy} className="btn-primary w-full min-h-14 text-base disabled:opacity-70">
              {busy ? t.submitting : t.setPassword}
            </button>
          </form>
        )}

        {step === "forgot" && (
          <form onSubmit={onSendCode} noValidate className="mt-6 space-y-4">
            <p className="text-sm text-muted">{t.resetIntro}</p>
            <Field label={t.email} id="reset-email">
              <input
                id="reset-email"
                type="email"
                dir="ltr"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={input}
              />
            </Field>
            <button type="submit" disabled={busy} className="btn-primary w-full min-h-14 text-base disabled:opacity-70">
              {busy ? t.submitting : t.sendCode}
            </button>
            <BackToLogin t={t} onClick={() => setStep("signIn")} />
          </form>
        )}

        {step === "forgotCode" && (
          <form onSubmit={onReset} noValidate className="mt-6 space-y-4">
            <Field label={t.code} id="reset-code">
              <input
                id="reset-code"
                inputMode="numeric"
                dir="ltr"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={input}
              />
            </Field>
            <PasswordPair
              t={t}
              newPassword={newPassword}
              confirm={confirm}
              onNew={setNewPassword}
              onConfirm={setConfirm}
            />
            <button type="submit" disabled={busy} className="btn-primary w-full min-h-14 text-base disabled:opacity-70">
              {busy ? t.submitting : t.resetSubmit}
            </button>
            <BackToLogin t={t} onClick={() => setStep("signIn")} />
          </form>
        )}

        {step === "notAdmin" && (
          <div className="mt-6 space-y-4">
            <p className="text-muted">{t.notAdminBody}</p>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                setPassword("");
                setStep("signIn");
              }}
              className="btn-primary w-full min-h-14"
            >
              {t.useAnother}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

function PasswordPair({
  t,
  newPassword,
  confirm,
  onNew,
  onConfirm,
}: {
  t: (typeof adminCopy)["en"]["login"];
  newPassword: string;
  confirm: string;
  onNew: (v: string) => void;
  onConfirm: (v: string) => void;
}) {
  return (
    <>
      <Field label={t.newPassword} id="new-password">
        <input
          id="new-password"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => onNew(e.target.value)}
          aria-describedby="password-rules"
          className={input}
        />
      </Field>
      <p id="password-rules" className="text-xs text-muted">
        {t.passwordRules}
      </p>
      <Field label={t.confirmPassword} id="confirm-password">
        <input
          id="confirm-password"
          type="password"
          dir="ltr"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => onConfirm(e.target.value)}
          className={input}
        />
      </Field>
    </>
  );
}

function BackToLogin({ t, onClick }: { t: (typeof adminCopy)["en"]["login"]; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="min-h-10 text-sm font-bold text-forest hover:text-leaf">
      {t.backToLogin}
    </button>
  );
}
