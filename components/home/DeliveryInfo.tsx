import { StoreIcon, TruckIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/Price";
import { restaurant } from "@/config/restaurant";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

export function DeliveryInfo({ locale }: { locale: Locale }) {
  const t = dictionaries[locale].delivery;
  const { delivery, pickup } = restaurant.fees;

  return (
    <>
      <SectionHeading id="delivery-title" title={t.title} intro={t.intro} />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <FeeCard
          icon={<TruckIcon className="size-6" />}
          label={t.deliveryLabel}
          value={<Price amount={delivery} locale={locale} currencyClassName="text-xl" />}
          suffix={t.perOrder}
          note={t.deliveryNote}
        />
        <FeeCard
          icon={<StoreIcon className="size-6" />}
          label={t.pickupLabel}
          value={
            pickup === 0 ? t.free : <Price amount={pickup} locale={locale} currencyClassName="text-xl" />
          }
          note={t.pickupNote}
        />

        <div className="rounded-2xl bg-forest p-5 text-white">
          <h3 className="text-lg font-bold">{t.stepsTitle}</h3>
          <ol className="mt-3 space-y-3">
            {t.steps.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm text-white/85">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-leaf font-latin text-xs font-bold text-forest">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}

function FeeCard({
  icon,
  label,
  value,
  suffix,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  suffix?: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-leaf/15 text-forest">
          {icon}
        </span>
        <h3 className="text-base font-bold text-ink">{label}</h3>
      </div>
      <p className="mt-4 flex items-baseline gap-2 text-3xl font-extrabold text-forest">
        {value}
        {suffix && <span className="text-sm font-medium text-muted">{suffix}</span>}
      </p>
      <p className="mt-2 text-sm text-muted">{note}</p>
    </div>
  );
}
