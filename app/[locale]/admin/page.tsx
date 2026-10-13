import { ProductsDashboard } from "@/components/admin/ProductsDashboard";
import type { Locale } from "@/lib/i18n";

export default function AdminHomePage({ params }: { params: { locale: Locale } }) {
  return <ProductsDashboard locale={params.locale} />;
}
