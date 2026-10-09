# FONTAINE · Smart Growth AI

Bilingual (Arabic RTL / English LTR) growth planner and campaign estimator for the Qatar market.
Visitors choose AI video production, Meta advertising and web/tracking services, see a transparent
estimate in QAR (with USD/SAR views), get rule-based recommendations and an illustrative forecast,
then hand the plan to Fontaine on WhatsApp. This is **Phase A (MVP)** of the
*Smart Growth AI Blueprint v3.0* (`../fontaine-project-specs/`).

## Quick start

```bash
npm install
cp .env.example .env.local   # optional: set NEXT_PUBLIC_WHATSAPP_NUMBER
npm run dev                  # http://localhost:3000 → redirects to /ar or /en
```

| Command | What it does |
| --- | --- |
| `npm run test` | Unit tests — pricing contract (T01–T10), forecast, WhatsApp, i18n parity, state |
| `npm run test:e2e` | Playwright on desktop + mobile (needs `npm run build` and `npx playwright install chromium` once) |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint |
| `npm run check` | typecheck + lint + unit tests + production build |

## Architecture

```
src/
  app/[locale]/            /ar and /en (static), privacy, terms, localized 404
  app/sitemap.ts, robots.ts, icon.svg, apple-icon.png
  proxy.ts                 "/" → saved language cookie → Accept-Language → Arabic
  config/pricing.ts        ALL prices, presets, FX rates and forecast assumptions (edit here only)
  config/site.ts           public env settings (site URL, WhatsApp number)
  features/
    pricing/calculate.ts       the single pure source of truth for every total (integer dirhams)
    forecasting/calculate.ts   bounded illustrative forecast + objective decision matrix
    recommendations/rules.ts   contextual advice with optional, user-applied changes
    whatsapp/buildMessage.ts   localized plan text, wa.me URL validation, plan reference
    estimator/                 types, pure reducer, URL/session (de)serialization, shared store
  i18n/en.json, ar.json    every visible string; build fails if Arabic misses a key
  components/              estimator steps, summary, forecast, sections, header/footer
  lib/                     money, currency formatting (Intl), privacy-safe analytics
public/media/              licensed photos & videos + manifest.json (alt text AR/EN) + CREDITS.md
public/brand/              supplied logo assets
```

Key decisions:

- **Money** is stored in QAR minor units and rounded once per line item; display currencies are derived at
  format time and never change canonical totals.
- **Language switching keeps state**: the estimator lives in a module-level store (persisted to
  `sessionStorage`), so `/ar ⇄ /en` preserves selections, step and currency.
- **Privacy**: contact fields stay in component state only; share links carry selections only; analytics
  receive no personal data and are a no-op until a consent-aware tag manager is added.
- **Honest forecasts**: generic illustrative assumptions, objective-aware metrics, "unavailable" instead of
  invented ranges (industry "Other" has no profile on purpose).
- **Security headers** (CSP, HSTS, frame-ancestors none, etc.) in `next.config.ts`.

## Before going live (owner approvals)

- Set `NEXT_PUBLIC_WHATSAPP_NUMBER` (digits only) and `NEXT_PUBLIC_SITE_URL` (verified domain) in Amplify.
- Approve all prices, presets, forecast assumptions and the SAR cross rate in `src/config/pricing.ts`.
- Legal review of `src/content/legal.ts` (currently marked *draft*).
- Confirm the logo and registered trade name.
- Next.js 16 on Amplify Hosting: confirm the Amplify build image supports it before the first deploy.
- `amplify/data/resource.ts` still contains the starter `Todo` model with a public API key. The app no longer
  uses it; replace it with the quote/lead models when Phase B is approved.

Phase B (secure lead storage, Meta Pixel/CAPI) and Phase C (admin, PDF quotes) are intentionally not built
until explicitly approved, as the blueprint requires.

---

## شرح المشروع بالعربية (لصاحب المشروع)

**ما هذا التطبيق؟** حاسبة «النمو الذكي» من فونتين: يختار الزائر خدمات إنتاج الفيديو بالذكاء الاصطناعي،
وحملات ميتا الإعلانية، وصفحات الهبوط والتتبع، فيرى فوراً تكلفة تقديرية واضحة بالريال القطري، مع توصيات
وتوقعات أداء استرشادية، ثم يرسل خطته إلى فريقكم عبر واتساب برسالة جاهزة. يعمل بالعربية (من اليمين لليسار)
والإنجليزية بالكامل منذ اليوم الأول، والعربية هي اللغة الافتراضية.

**أهم القرارات وسببها:**

- **مصدر واحد للأسعار:** كل الأسعار والباقات وافتراضات التوقعات موجودة في ملف واحد هو
  `src/config/pricing.ts`. لتعديل أي سعر غيّروه هناك فقط وستتحدّث الواجهة كلها تلقائياً.
- **دقة الحسابات:** تُحسب المبالغ بالدرهم (أصغر وحدة للريال) لتجنّب أخطاء الكسور، وكل نتائج جدول
  الاختبار في الوثيقة (مثل الشهري 6,450 والشهر الأول 8,700) مغطّاة باختبارات آلية.
- **الشفافية:** الميزانية الإعلانية المدفوعة لميتا تظهر منفصلة عن أتعاب فونتين، والتطبيق المخصص يظهر
  «السعر عند الطلب» ولا يُسعَّر بصفر، والتوقعات موسومة دائماً بأنها استرشادية وغير مضمونة.
- **الخصوصية:** لا يحتاج الحساب إلى أي بيانات شخصية، ولا يحفظ الموقع الاسم أو الملاحظات؛ تُضاف فقط إلى
  رسالة واتساب إذا اختار العميل إرسالها، احتراماً لقانون حماية البيانات القطري رقم 13 لسنة 2016.
- **تبديل اللغة دون فقدان الاختيارات:** ينتقل الزائر بين العربية والإنجليزية وتبقى اختياراته والخطوة
  والعملة كما هي.
- **الصور والفيديوهات:** مرخّصة للاستخدام التجاري (Unsplash وPexels)، ومعظمها من الدوحة واللؤلؤة،
  ومصادرها موثقة في `public/media/CREDITS.md`. وقد ذكرنا على الموقع أنها لقطات توضيحية وليست أعمال عملاء.

**أوامر مهمة:**

- `npm run dev` لتشغيل الموقع على جهازك.
- `npm run test` لتشغيل اختبارات الحسابات (يجب أن تنجح قبل أي نشر، وهي مضافة تلقائياً لخطوات Amplify).
- `npm run build` لبناء نسخة الإنتاج.

**مطلوب منكم قبل الإطلاق:** رقم واتساب المعتمد، والنطاق (الدومين)، واعتماد الأسعار والافتراضات،
ومراجعة قانونية لسياسة الخصوصية وشروط الاستخدام.
