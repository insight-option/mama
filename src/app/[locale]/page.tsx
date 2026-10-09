import { notFound } from "next/navigation";
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { Estimator } from "@/components/estimator/Estimator";
import { Faq, FAQ_NUMBERS } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { Methodology } from "@/components/sections/Methodology";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { Showcase } from "@/components/sections/Showcase";
import { createTranslator, getDictionary, isLocale } from "@/i18n";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = createTranslator(getDictionary(locale));

  // FAQ structured data — explanatory content only, never individual quotes.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: FAQ_NUMBERS.map((n) => ({
      "@type": "Question",
      name: t(`faq.q${n}`),
      acceptedAnswer: { "@type": "Answer", text: t(`faq.a${n}`) },
    })),
  };

  return (
    <>
      <Header />
      <main id="main" aria-label={t("a11y.mainContent")}>
        <Hero />
        <Industries />
        <Estimator />
        <Services t={t} />
        <Showcase />
        <Methodology t={t} locale={locale} />
        <Process t={t} />
        <Faq t={t} />
        <FinalCta />
      </main>
      <Footer locale={locale} t={t} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
