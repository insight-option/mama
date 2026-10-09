import { notFound } from "next/navigation";

// Any unknown path under /ar or /en renders the localized, branded 404.
export const dynamicParams = true;

export default function CatchAll() {
  notFound();
}
