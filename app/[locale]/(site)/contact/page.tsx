import type { Metadata } from "next";
import { PageHeader } from "@/components/site/SectionHeader";
import { ChatIcon, DocumentIcon, PhoneIcon } from "@/components/ui/icons";
import { revealDelay } from "@/components/ui/reveal-delay";
import { restaurant } from "@/config/restaurant";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { pagePath, siteCopy, whatsappLink } from "@/lib/site-copy";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const t = dictionaries[params.locale].contact;
  return { title: t.title, description: t.intro };
}

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const t = dictionaries[locale].contact;
  const copy = siteCopy[locale];
  const phone = restaurant.whatsapp.display;

  const cards = [
    {
      icon: <ChatIcon className="size-7" />,
      label: t.whatsappLabel,
      note: t.whatsappNote,
      value: phone,
      cta: t.whatsappCta,
      href: whatsappLink(),
      external: true,
      primary: true,
    },
    {
      icon: <PhoneIcon className="size-7" />,
      label: t.phoneLabel,
      note: t.phoneNote,
      value: phone,
      cta: t.phoneCta,
      href: `tel:+${restaurant.whatsapp.number}`,
    },
    {
      icon: <DocumentIcon className="size-7" />,
      label: t.menuLabel,
      note: t.menuNote,
      cta: t.menuCta,
      href: pagePath(locale, "menu"),
    },
  ];

  return (
    <>
      <PageHeader eyebrow={copy.contactPage.eyebrow} title={t.title} intro={t.intro} />
      <section aria-label={t.title} className="mx-auto max-w-content px-4 py-16 md:py-24">
        <ul className="grid gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <li
              key={card.label}
              data-reveal
              style={revealDelay(index, 120)}
              className="flex flex-col rounded-card bg-surface p-7 shadow-soft ring-1 ring-line/70"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-leaf/15 text-forest">
                {card.icon}
              </span>
              <h2 className="mt-6 font-display text-2xl text-forest">{card.label}</h2>
              <p className="text-sm text-muted">{card.note}</p>
              {card.value && (
                <p dir="ltr" className="mt-4 font-latin text-2xl font-bold text-ink rtl:text-right">
                  {card.value}
                </p>
              )}
              <a
                href={card.href}
                {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`mt-6 ${card.primary ? "btn-primary" : "btn-ghost"}`}
              >
                {card.cta}
              </a>
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-16 rounded-[2rem] bg-cream p-8 md:p-12">
          <h2 className="font-display text-3xl text-forest">{copy.contactPage.quickTitle}</h2>
          <p className="mt-2 text-muted">{copy.contactPage.quickIntro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {copy.chat.replies.map((reply) => (
              <a
                key={reply.label}
                href={whatsappLink(reply.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-forest/15 bg-surface px-5 text-sm font-bold text-forest transition-colors hover:border-forest hover:bg-forest hover:text-white"
              >
                <ChatIcon className="size-4" />
                {reply.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
