import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import React, { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ContactPage from "@/app/[locale]/(site)/contact/page";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { DishCard } from "@/components/menu/DishCard";
import { MenuSection } from "@/components/menu/MenuSection";
import { categories, menu } from "@/data/menu";
import { dictionaries } from "@/lib/dictionaries";
import { priceParts } from "@/lib/format-currency";
import type { Locale } from "@/lib/i18n";
import { recordToMenuItem } from "@/lib/products";
import { pagePath, siteCopy } from "@/lib/site-copy";
import type { MenuItem } from "@/types/menu";
import nextConfig from "../next.config.js";

// The menu is a page on the site, never a PDF. Components are rendered to
// HTML here (no browser); Next.js normally provides React to compiled JSX.
(globalThis as { React?: unknown }).React = React;

const ROOT = path.join(__dirname, "..");
const locales: Locale[] = ["ar", "en"];
const withCart = (products: MenuItem[], child: React.ReactElement) =>
  renderToStaticMarkup(h(CartProvider, { products, children: child }));
const hrefs = (html: string) => Array.from(html.matchAll(/href="([^"]*)"/g), (m) => m[1]);
/** Text as React writes it into HTML. */
const esc = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

test("header and footer: 'القائمة' and 'Menu' go to /ar/menu and /en/menu", () => {
  assert.equal(pagePath("ar", "menu"), "/ar/menu");
  assert.equal(pagePath("en", "menu"), "/en/menu");
  assert.equal(siteCopy.ar.pages.menu, "القائمة");
  assert.equal(siteCopy.en.pages.menu, "Menu");
});

for (const locale of locales) {
  test(`footer (${locale}): menu link opens the menu page, no PDF`, () => {
    const html = renderToStaticMarkup(h(SiteFooter, { locale }));
    assert.ok(html.includes(`href="/${locale}/menu">${siteCopy[locale].pages.menu}</a>`));
    assert.ok(!hrefs(html).some((href) => /\.pdf/i.test(href)), "a footer link points to a PDF");
    assert.ok(!/PDF/.test(html), "the footer mentions a PDF");
  });

  test(`contact page (${locale}): 'View menu' opens the menu page in the same tab`, () => {
    const html = renderToStaticMarkup(ContactPage({ params: { locale } }));
    const menuLink = html.match(new RegExp(`<a href="/${locale}/menu"[^>]*>`))?.[0];
    assert.ok(menuLink, "no link to the menu page");
    assert.ok(!menuLink.includes("_blank"), "the menu link opens a new tab");
    assert.ok(!hrefs(html).some((href) => /\.pdf/i.test(href)), "a link points to a PDF");
    assert.ok(!/PDF/.test(html), "the page mentions a PDF");
  });

  test(`empty cart (${locale}): 'Browse the menu' opens the menu page`, () => {
    const html = withCart(menu, h(CartDrawer, { locale }));
    assert.ok(hrefs(html).includes(`/${locale}/menu`));
    assert.ok(!hrefs(html).includes("#menu"));
  });

  test(`menu (${locale}): every dish shown on the page with photo, name, description, price, category and actions`, () => {
    const html = withCart(menu, h(MenuSection, { locale, items: menu }));
    const cards = html.split("<article").slice(1);
    assert.equal(cards.length, menu.length);
    assert.equal(menu.length, 18);
    const { currency } = priceParts(1, locale);
    const t = dictionaries[locale];

    for (const item of menu) {
      const card = cards.find((c) => c.includes(`href="/${locale}/menu/${item.id}"`));
      assert.ok(card, `${item.id}: no card linking to its details page`);
      assert.ok(card.includes(item.name[locale]), `${item.id}: name`);
      const firstIngredient = item.ingredients?.[locale]?.[0];
      if (firstIngredient) assert.ok(card.includes(firstIngredient), `${item.id}: description`);
      const prices = item.pricing.type === "fixed" ? [item.pricing.price] : item.pricing.options.map((o) => o.price);
      for (const price of prices) assert.ok(card.includes(priceParts(price, locale).value), `${item.id}: price ${price}`);
      assert.ok(card.includes(currency), `${item.id}: currency`);
      const photo = item.image ? "<img" : t.menu.photoPending;
      assert.ok(card.includes(photo), `${item.id}: photo`);
      assert.ok(card.includes(`aria-label="${esc(`${t.cart.add}: ${item.name[locale]}`)}"`), `${item.id}: add to cart`);
    }
    for (const category of categories.filter((c) => menu.some((i) => i.category === c.id))) {
      assert.ok(html.includes(`>${category.name[locale]}</h2>`), `category heading ${category.id}`);
    }
    assert.ok(!hrefs(html).some((href) => /\.pdf/i.test(href)));
  });

  test(`dish card (${locale}): an active offer shows its label and offer price`, () => {
    const item = recordToMenuItem({
      id: "offer-dish",
      category: "specials",
      nameAr: "طبق العرض",
      nameEn: "Offer dish",
      pricingType: "fixed",
      price: 40,
      offerActive: true,
      offerPrice: 32,
      offerLabelAr: "عرض اليوم",
      offerLabelEn: "Today's offer",
    });
    const html = withCart([item], h(DishCard, { item, locale }));
    assert.ok(html.includes(esc(locale === "ar" ? "عرض اليوم" : "Today's offer")), "offer label");
    assert.ok(html.includes(priceParts(32, locale).value), "offer price");
    assert.ok(html.includes(priceParts(40, locale).value), "regular price");
  });
}

test("no page or component links to a PDF, and the site publishes no PDF", () => {
  const offenders: string[] = [];
  const scan = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const file = path.join(dir, name);
      if (statSync(file).isDirectory()) scan(file);
      else if (/\.(tsx?|js|mjs)$/.test(name) && /\.pdf["'`]|menuPdfPath/i.test(readFileSync(file, "utf8"))) {
        offenders.push(path.relative(ROOT, file));
      }
    }
  };
  for (const dir of ["app", "components", "lib", "data", "config"]) scan(path.join(ROOT, dir));
  assert.deepEqual(offenders, []);

  const published: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const file = path.join(dir, name);
      if (statSync(file).isDirectory()) walk(file);
      else if (/\.pdf$/i.test(name)) published.push(path.relative(ROOT, file));
    }
  };
  walk(path.join(ROOT, "public"));
  assert.deepEqual(published, []);
});

test("old links to the former menu PDF open the Arabic menu page", async () => {
  const redirects = await (nextConfig as { redirects: () => Promise<{ source: string; destination: string }[]> }).redirects();
  // Same matcher options Next.js uses for redirects.
  const rule = (pathname: string) =>
    redirects.find((r) => getPathMatch(r.source, { strict: true, removeUnnamedParams: true, sensitive: false })(pathname));
  assert.equal(rule("/Mama%20Food%20Menu%20V-2.pdf")?.destination, "/ar/menu");
  assert.equal(rule("/Mama Food Menu V-2.pdf")?.destination, "/ar/menu");
  assert.equal(rule("/ar/menu"), undefined);
  assert.equal(rule("/en/menu"), undefined);
  assert.equal(rule("/images/menu/qudrah.jpg"), undefined);
});
