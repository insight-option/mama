import { expect, test, type Page } from "@playwright/test";

const nbsp = (s: string | null) => (s ?? "").replace(/ /g, " ");

/** The summary visible at this viewport (sticky card on desktop, sheet trigger bar on smaller screens). */
async function firstMonth(page: Page) {
  const wide = page.viewportSize()!.width >= 1024;
  return nbsp(await page.getByTestId(wide ? "first-month-total" : "mobile-first-month").filter({ visible: true }).first().textContent());
}

const estimator = (page: Page) => page.locator("#estimator");
const step = (page: Page, name: RegExp) => estimator(page).getByRole("navigation").getByRole("button", { name }).click();

test("industry cards pre-select the sector in the estimator", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: /Real estate & investment.*Plan for this sector/ }).click();
  await expect(estimator(page).getByRole("radio", { name: "Real estate & investment" })).toBeChecked();
  await expect(estimator(page).getByText("Step 1 of 5")).toBeVisible();
});

test("video tier cards select the tier and open the video step", async ({ page }) => {
  await page.goto("/en");
  await page.locator("#showcase").getByRole("button", { name: "Choose this tier" }).last().click();
  await expect(estimator(page).getByText("Step 2 of 5")).toBeVisible();
  await expect(estimator(page).getByRole("radio", { name: /Cinematic campaigns/ })).toBeChecked();
});

test("video stepper, add-ons and reset update the totals", async ({ page }) => {
  await page.goto("/en");
  await step(page, /AI video/);
  await estimator(page).getByRole("button", { name: "More videos" }).click(); // 6 → 8 professional
  await expect(estimator(page).getByText("QAR 3,600").first()).toBeVisible();
  await step(page, /Web & tracking/);
  await estimator(page).getByText("Campaign landing page").click();
  await expect.poll(() => firstMonth(page)).toContain("8,850"); // 3,600 + 3,000 + 750 + 1,500
  await step(page, /Your plan/);
  await estimator(page).getByRole("button", { name: "Start over" }).click();
  await expect.poll(() => firstMonth(page)).toContain("6,450");
  await expect(estimator(page).getByText("Step 1 of 5")).toBeVisible();
});

test("recommendation actions apply only when clicked", async ({ page }) => {
  await page.goto("/en");
  await step(page, /Meta ads/);
  await page.getByRole("switch", { name: "Run paid campaigns" }).uncheck({ force: true });
  await step(page, /Your plan/);
  await expect(page.getByText("Focus on creative and site readiness first")).toBeVisible();
  await page.getByRole("button", { name: "Add a small test budget" }).click();
  // 6 × 450 + 1,500 media + 750 minimum fee
  await expect.poll(() => firstMonth(page)).toContain("4,950");
});

test("currency switch converts the display without changing QAR pricing", async ({ page }) => {
  await page.goto("/en");
  const wide = page.viewportSize()!.width >= 768;
  if (!wide) await page.getByRole("button", { name: "Open menu" }).click();
  await page.locator("select[id^=currency]").filter({ visible: true }).first().selectOption("USD");
  await expect.poll(() => firstMonth(page)).toContain("$1,772");
  await page.locator("select[id^=currency]").filter({ visible: true }).first().selectOption("QAR");
  await expect.poll(() => firstMonth(page)).toContain("QAR 6,450");
});

test("copy plan puts the localized summary with pricing version on the clipboard", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/ar");
  await step(page, /خطتك/);
  await estimator(page).getByLabel("اسمك (اختياري)").fill("سارة");
  await estimator(page).getByRole("button", { name: "نسخ الخطة" }).first().click();
  await expect(page.getByText("تم نسخ الخطة").first()).toBeVisible();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toContain("طلب خطة نمو من فونتين");
  expect(text).toContain("إصدار التسعير: v1-draft");
  expect(text).toContain("الاسم: سارة");
});

test("share link restores the plan in a new browser — without personal details", async ({ page, context, browser }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/en");
  await page.getByRole("button", { name: /Scale/ }).click();
  await step(page, /Your plan/);
  await estimator(page).getByLabel("Your name (optional)").fill("Private Name");
  await page.evaluate(() => Object.defineProperty(navigator, "share", { value: undefined }));
  await estimator(page).getByRole("button", { name: "Share plan" }).first().click();
  const link = await page.evaluate(() => navigator.clipboard.readText());
  expect(link).not.toContain("Private");

  const fresh = await browser.newContext();
  const other = await fresh.newPage();
  await other.goto(link);
  // Scale: 12 × 450 + 8,000 media + 1,200 fee (15%) + 2,250 setup = 16,850
  await expect.poll(() => firstMonth(other)).toContain("16,850");
  await fresh.close();
});

test("FAQ items expand and footer legal links work", async ({ page }) => {
  await page.goto("/en");
  const faq = page.locator("#faq details").first();
  await faq.locator("summary").click();
  await expect(faq).toHaveAttribute("open", "");
  await page.getByRole("contentinfo").getByRole("link", { name: "Terms of Use" }).click();
  await expect(page).toHaveURL(/\/en\/terms$/);
  await expect(page.getByRole("heading", { level: 1, name: "Terms of Use" })).toBeVisible();
});
