import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["ar", "en"] as const;
const DEFAULT_LOCALE = "ar";

/** Saved choice first, then the browser's Accept-Language, else Arabic (Qatar-first). */
function preferredLocale(request: NextRequest): string {
  const saved = request.cookies.get("NEXT_LOCALE")?.value;
  if (saved && (LOCALES as readonly string[]).includes(saved)) return saved;
  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag = "", q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return ranked.find((r) => (LOCALES as readonly string[]).includes(r.lang ?? ""))?.lang ?? DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;
  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes, metadata files and anything with a file extension.
  matcher: ["/((?!api|_next|media|brand|icon|apple-icon|sitemap.xml|robots.txt|.*\\..*).*)"],
};
