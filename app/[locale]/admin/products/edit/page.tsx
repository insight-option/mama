import { Suspense } from "react";
import { ProductEditor } from "@/components/admin/ProductEditor";
import type { Locale } from "@/lib/i18n";

// The product id comes from ?id=…, read on the client.
export default function EditProductPage({ params }: { params: { locale: Locale } }) {
  return (
    <Suspense>
      <ProductEditor locale={params.locale} mode="edit" />
    </Suspense>
  );
}
