import { ContactInfo } from "@/components/home/ContactInfo";
import { DeliveryInfo } from "@/components/home/DeliveryInfo";
import { Hero } from "@/components/home/Hero";
import { MenuSection } from "@/components/menu/MenuSection";
import type { Locale } from "@/lib/i18n";

// Sections sit below a sticky header, so anchor jumps need top offset.
const sectionClass = "mx-auto max-w-content scroll-mt-20 px-4";

export default function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;

  return (
    <>
      <Hero locale={locale} />

      <section
        id="menu"
        aria-labelledby="menu-title"
        className={`${sectionClass} pt-8 md:pt-12`}
      >
        <MenuSection locale={locale} />
      </section>

      <section
        id="delivery"
        aria-labelledby="delivery-title"
        className={`${sectionClass} pt-14 md:pt-20`}
      >
        <DeliveryInfo locale={locale} />
      </section>

      <section
        id="contact"
        aria-labelledby="contact-title"
        className={`${sectionClass} pb-14 pt-14 md:pb-20 md:pt-20`}
      >
        <ContactInfo locale={locale} />
      </section>
    </>
  );
}
