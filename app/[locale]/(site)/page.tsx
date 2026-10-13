import { Hero } from "@/components/home/Hero";
import {
  CategoryTiles,
  ChatCta,
  DishMarquee,
  OffersTeaser,
  OrderSteps,
  SignatureDishes,
} from "@/components/home/HomeSections";
import { getCatalog } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";

export const revalidate = 30;

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const { items } = await getCatalog();

  return (
    <>
      <Hero locale={locale} />
      <DishMarquee items={items} locale={locale} />
      <SignatureDishes items={items} locale={locale} />
      <CategoryTiles items={items} locale={locale} />
      <OffersTeaser items={items} locale={locale} />
      <OrderSteps locale={locale} />
      <ChatCta locale={locale} />
    </>
  );
}
