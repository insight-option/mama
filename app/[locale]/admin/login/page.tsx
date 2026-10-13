import { LoginForm } from "@/components/admin/LoginForm";
import type { Locale } from "@/lib/i18n";

export default function AdminLoginPage({ params }: { params: { locale: Locale } }) {
  return <LoginForm locale={params.locale} />;
}
