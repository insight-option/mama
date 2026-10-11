import { ChatIcon, DocumentIcon, PhoneIcon } from "@/components/ui/icons";
import { restaurant } from "@/config/restaurant";
import { menuPdfPath } from "@/data/menu";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

export function ContactInfo({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].contact;
  const phone = restaurant.whatsapp.display;

  const cards = [
    {
      icon: <ChatIcon className="size-6" />,
      label: t.whatsappLabel,
      note: t.whatsappNote,
      value: phone,
      cta: t.whatsappCta,
      href: `https://wa.me/${restaurant.whatsapp.number}`,
      external: true,
      primary: true,
    },
    {
      icon: <PhoneIcon className="size-6" />,
      label: t.phoneLabel,
      note: t.phoneNote,
      value: phone,
      cta: t.phoneCta,
      href: `tel:+${restaurant.whatsapp.number}`,
    },
    {
      icon: <DocumentIcon className="size-6" />,
      label: t.menuLabel,
      note: t.menuNote,
      cta: t.menuCta,
      href: menuPdfPath,
      external: true,
    },
  ];

  return (
    <>
      <SectionHeading id="contact-title" title={t.title} intro={t.intro} />

      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <li
            key={card.label}
            className="flex flex-col rounded-2xl border border-line bg-surface p-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-leaf/15 text-forest">
                {card.icon}
              </span>
              <div>
                <h3 className="text-base font-bold text-ink">{card.label}</h3>
                <p className="text-sm text-muted">{card.note}</p>
              </div>
            </div>
            {card.value && (
              <p dir="ltr" className="mt-4 font-latin text-xl font-bold text-forest rtl:text-right">
                {card.value}
              </p>
            )}
            <a
              href={card.href}
              {...(card.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={`mt-4 inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-bold transition-colors ${
                card.primary
                  ? "bg-forest text-white hover:bg-forest/90"
                  : "border border-line text-forest hover:border-forest"
              }`}
            >
              {card.cta}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
