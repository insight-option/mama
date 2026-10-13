"use client";

import { useEffect, useRef, useState } from "react";
import { revealDelay } from "@/components/ui/reveal-delay";
import { categories } from "@/data/menu";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { CategoryId, MenuItem } from "@/types/menu";
import { DishCard } from "./DishCard";

type Filter = "all" | CategoryId;

const isCategory = (value: string | null): value is CategoryId =>
  categories.some((c) => c.id === value);

export function MenuSection({ locale, items }: { locale: Locale; items: MenuItem[] }) {
  const t = dictionaries[locale].menu;
  const [filter, setFilter] = useState<Filter>("all");
  const listRef = useRef<HTMLDivElement>(null);

  // Deep links from the home page: /menu?category=salads
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    if (isCategory(requested)) setFilter(requested);
  }, []);

  const visibleCategories = categories.filter((c) =>
    items.some((item) => item.category === c.id),
  );

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: t.all, count: items.length },
    ...visibleCategories.map((c) => ({
      id: c.id,
      label: (c.shortName ?? c.name)[locale],
      count: items.filter((item) => item.category === c.id).length,
    })),
  ];

  const choose = (id: Filter) => {
    setFilter(id);
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", id);
    window.history.replaceState(null, "", url);
    // If the visitor has scrolled into the dishes, bring the list start
    // back into view so the filtered results are visible.
    const list = listRef.current;
    if (list && list.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      list.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  };

  let cardIndex = 0;

  return (
    <>
      {/* Category bar stays under the header while browsing dishes. */}
      <div className="sticky top-[4.5rem] z-30 -mx-4 border-b border-line bg-ivory px-4 py-3">
        <div
          role="group"
          aria-label={t.filterLabel}
          className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto whitespace-nowrap px-4"
        >
          {filters.map(({ id, label, count }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => choose(id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 text-sm font-bold transition-all duration-300 ${
                  active
                    ? "border-forest bg-forest text-white shadow-soft"
                    : "border-line bg-surface text-ink hover:border-forest"
                }`}
              >
                {label}
                <span
                  aria-hidden="true"
                  className={`rounded-full px-1.5 font-latin text-xs ${
                    active ? "bg-white/15 text-white" : "bg-ivory text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hidden categories stay mounted so serving choices survive filtering. */}
      <div ref={listRef} className="scroll-mt-40">
        {visibleCategories.map((category) => {
          const categoryItems = items.filter((item) => item.category === category.id);
          const headingId = `category-${category.id}`;
          return (
            <section
              key={category.id}
              aria-labelledby={headingId}
              hidden={filter !== "all" && filter !== category.id}
              className="pt-12"
            >
              <h2 id={headingId} className="flex items-center gap-3 font-display text-2xl text-forest md:text-3xl">
                <span aria-hidden="true" className="h-7 w-1.5 rounded-full bg-leaf" />
                {category.name[locale]}
              </h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                {categoryItems.map((item) => {
                  const index = cardIndex++;
                  return (
                    <li key={item.id} data-reveal style={revealDelay(index % 3)} className="flex">
                      <DishCard item={item} locale={locale} priority={index < 3} />
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
