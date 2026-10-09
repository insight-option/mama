import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.siteUrl;
  const pages = ["", "/privacy", "/terms"];
  return pages.map((path) => ({
    url: `${base}/ar${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.3,
    alternates: { languages: { ar: `${base}/ar${path}`, en: `${base}/en${path}` } },
  }));
}
