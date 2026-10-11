"use client";

import { useRef, useState } from "react";
import { SectionHeading } from "@/components/home/SectionHeading";
import { DocumentIcon } from "@/components/ui/icons";
import { categories, menu, menuPdfPath } from "@/data/menu";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { CategoryId } from "@/types/menu";
import { DishCard } from "./DishCard";

type Filter = "all" | CategoryId;

export function MenuSection({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].menu;
  const [filter, setFilter] = useState<Filter>("all");
  const listRef = useRef<HTMLDivElement>(null);

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: t.all, count: menu.length },
    ...categories.map((c) => ({
      id: c.id,
      label: (c.shortName ?? c.name)[locale],
      count: menu.filter((item) => item.category === c.id).length,
    })),
  ];

  const choose = (id: Filter) => {
    setFilter(id);
    // If the visitor has scrolled into the dishes, bring the list start
    // back into view so the filtered results are visible.
    const list = listRef.current;
    if (list && list.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      list.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <>
      <SectionHeading id="menu-title" title={t.title}>
        <a
          href={menuPdfPath}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-forest underline-offset-4 hover:underline"
        >
          <DocumentIcon className="size-4" />
          {t.pdfLink}
        </a>
      </SectionHeading>

      {/* Category bar stays under the header while browsing dishes. */}
      <div className="sticky top-16 z-30 -mx-4 mt-4 border-b border-line bg-ivory px-4 py-3">
        <div
          role="group"
          aria-label={t.filterLabel}
          className="-mx-4 flex gap-2 overflow-x-auto whitespace-nowrap px-4 [scrollbar-width:none]"
        >
          {filters.map(({ id, label, count }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => choose(id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors ${
                  active
                    ? "border-forest bg-forest text-white"
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
      <div ref={listRef} className="scroll-mt-36">
        {categories.map((category) => {
          const items = menu.filter((item) => item.category === category.id);
          const headingId = `category-${category.id}`;
          return (
            <section
              key={category.id}
              aria-labelledby={headingId}
              hidden={filter !== "all" && filter !== category.id}
              className="pt-8"
            >
              <h3 id={headingId} className="flex items-center gap-3 text-xl font-extrabold text-ink md:text-2xl">
                <span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-leaf" />
                {category.name[locale]}
              </h3>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {items.map((item) => (
                  <li key={item.id} className="flex">
                    <DishCard item={item} locale={locale} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
