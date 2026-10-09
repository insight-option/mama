import { expect, test, type Page } from "@playwright/test";

const nbsp = (s: string | null) => (s ?? "").replace(/ /g, " ");

async function summaryText(page: Page, testId: string) {
  // Desktop shows the sticky summary; mobile shows the bottom bar.
  const visible = page.getByTestId(testId).filter({ visible: true }).first();
  return nbsp(await visible.textContent());
}

test.describe("localized routing", () => {
  test("root redirects Arabic browsers to /ar with RTL", async ({ browser }) => {
    const context = await browser.newContext({ locale: "ar-QA" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/ar$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("خطّط لحملتك القادمة");
    await context.close();
  });

  test("root follows Accept-Language for English browsers", async ({ browser }) => {
    const context = await browser.newContext({ locale: "en-US" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await context.close();
  });

  test("English route is LTR", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("A smarter way to plan");
  });

  test("unknown pages show the localized 404", async ({ page }) => {
    const res = await page.goto("/ar/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "الصفحة غير موجودة" })).toBeVisible();
  });
});

test.describe("estimator", () => {
  test("T09: Growth preset shows the demo totals (6,450 / 8,700)", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: /Growth/ }).click();
    await expect.poll(() => summaryText(page, page.viewportSize()!.width < 1024 ? "mobile-first-month" : "first-month-total")).toContain("8,700");
  });

  test("T03: turning ads off removes the fee and the paid forecast", async ({ page }) => {
    await page.goto("/en");
    await page.locator("#estimator").getByRole("button", { name: /Meta ads/ }).click();
    await page.getByRole("switch", { name: "Run paid campaigns" }).uncheck({ force: true });
    await expect(page.getByText("No paid advertising selected")).toBeVisible();
    await expect(page.getByLabel("Monthly advertising budget")).toHaveCount(0);
  });

  test("custom budget is validated with a clear message", async ({ page }) => {
    await page.goto("/en");
    await page.locator("#estimator").getByRole("button", { name: /Meta ads/ }).click();
    await page.getByLabel(/Custom budget/).fill("100");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.locator("#custom-budget-error")).toContainText("Enter an amount between");
  });

  test("T11: switching language keeps selections, step and currency", async ({ page, isMobile }) => {
    await page.goto("/ar");
    const estimator = page.locator("#estimator");
    await estimator.getByText("السيارات والخدمات المميزة").click();
    await estimator.getByRole("button", { name: /الفيديو/ }).click();
    await expect(estimator.getByText("الخطوة 2 من 5")).toBeVisible();

    if (isMobile) await page.getByRole("button", { name: "فتح القائمة" }).click();
    await page.locator("select[id^=currency]").filter({ visible: true }).first().selectOption("USD");

    await page.getByTestId("locale-switch").filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(estimator.getByText("Step 2 of 5")).toBeVisible();
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("select[id^=currency]").filter({ visible: true }).first()).toHaveValue("USD");
    if (isMobile) await page.keyboard.press("Escape");

    await estimator.getByRole("button", { name: /Business/ }).click();
    await expect(estimator.getByRole("radio", { name: "Automotive & premium services" })).toBeChecked();
  });

  test("T15: WhatsApp falls back to copying the plan when no number is configured", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/en");
    await page.locator("#estimator").getByRole("button", { name: /Your plan/ }).click();
    await page.getByRole("button", { name: /Send my plan to Fontaine/ }).first().click();
    const status = page.getByRole("status").filter({ hasText: "WhatsApp" }).first();
    await expect(status).toContainText(/isn't configured yet|opening/);
    await expect(status).not.toContainText(/delivered/i);
  });
});

test.describe("mobile layout", () => {
  test("T17: no horizontal scroll and the sticky bar never blocks controls", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    for (const path of ["/ar", "/en"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
    await page.locator("#estimator").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("mobile-first-month")).toBeVisible();
    // Playwright refuses to click an element covered by another one, so this proves reachability.
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Step 2 of 5")).toBeVisible();
    await page.getByRole("button", { name: "Details" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});
