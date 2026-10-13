"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Wordmark } from "@/components/layout/Wordmark";
import { adminCopy } from "@/lib/admin-copy";
import type { Locale } from "@/lib/i18n";
import { AdminAuthProvider, useAdminAuth } from "./AdminAuth";

export function AdminShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <Frame locale={locale}>{children}</Frame>
    </AdminAuthProvider>
  );
}

function Frame({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = adminCopy[locale];
  const { status, email, signOut } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const loginPath = `/${locale}/admin/login`;
  const onLogin = pathname === loginPath;

  // Every admin page except login requires an ADMIN session.
  useEffect(() => {
    if (!onLogin && (status === "signedOut" || status === "notAdmin")) {
      router.replace(loginPath);
    }
  }, [onLogin, status, router, loginPath]);

  if (onLogin) {
    return (
      <main id="main" className="min-h-screen bg-forest">
        {children}
      </main>
    );
  }

  if (status !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory text-muted" role="status">
        {t.loading}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <header className="sticky top-0 z-30 bg-night text-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/admin`} className="flex items-center gap-3">
              <Wordmark tone="light" />
              <span className="hidden rounded-full bg-leaf/20 px-3 py-1 text-xs font-bold text-leaf sm:inline">
                {t.workspace}
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-white/60 md:inline" dir="ltr">
              {email}
            </span>
            <Link
              href={`/${locale}`}
              className="inline-flex min-h-10 items-center rounded-full px-3 text-white/80 hover:text-white"
            >
              {t.viewSite}
            </Link>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.replace(loginPath);
              }}
              className="inline-flex min-h-10 items-center rounded-full border border-white/20 px-4 font-bold hover:border-white"
            >
              {t.signOut}
            </button>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
}
