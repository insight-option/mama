/**
 * Public, non-secret site settings. Values come from NEXT_PUBLIC_* environment
 * variables so they can differ per environment; nothing here is sensitive.
 */
export const SITE_CONFIG = {
  /** Canonical origin used for metadata. Set NEXT_PUBLIC_SITE_URL once a verified domain exists. */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  /** International digits only, no "+" or punctuation (WhatsApp Click-to-Chat format). */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
} as const;
