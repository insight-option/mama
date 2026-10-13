import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminCopy } from "@/lib/admin-copy";
import type { Locale } from "@/lib/i18n";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  return {
    title: adminCopy[params.locale].workspace,
    robots: { index: false, follow: false },
  };
}

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  return <AdminShell locale={params.locale}>{children}</AdminShell>;
}
