"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One observer for the whole page: elements marked with `data-reveal` fade
 * up when they scroll into view. Content stays visible if JS is off, and
 * reduced-motion users see no movement (see globals.css).
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!("IntersectionObserver" in window)) return;
    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const watch = () =>
      document
        .querySelectorAll("[data-reveal]:not([data-visible])")
        .forEach((el) => observer.observe(el));
    watch();
    // Content rendered later (e.g. filtered lists) is picked up too.
    const mutations = new MutationObserver(watch);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
