import { ProductEditor } from "@/components/admin/ProductEditor";
import type { Locale } from "@/lib/i18n";

export default function NewProductPage({ params }: { params: { locale: Locale } }) {
  return <ProductEditor locale={params.locale} mode="new" />;
}
