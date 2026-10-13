"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { FulfillmentPicker } from "@/components/cart/FulfillmentPicker";
import { OrderTotals } from "@/components/cart/OrderTotals";
import {
  addressFields,
  checkoutFields,
  maxLengths,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutForm as CheckoutFormValues,
} from "@/lib/checkout";
import { dictionaries } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { TextField } from "./TextField";

const autoComplete: Partial<Record<CheckoutField, string>> = {
  name: "name",
  phone: "tel",
  street: "address-line1",
  building: "address-line2",
};

const optionalFields: CheckoutField[] = ["unit", "landmark", "notes"];

export function CheckoutForm({
  locale,
  values,
  onValuesChange,
  onSent,
}: {
  locale: Locale;
  values: CheckoutFormValues;
  onValuesChange: (values: CheckoutFormValues) => void;
  /** Called with the WhatsApp link after it has been opened. */
  onSent: (url: string) => void;
}) {
  const t = dictionaries[locale].checkout;
  const { lines, totals, fulfillment } = useCart();
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [showSummary, setShowSummary] = useState(false);

  const isDelivery = fulfillment === "delivery";

  const update = (field: CheckoutField, value: string) => {
    onValuesChange({ ...values, [field]: value });
    // Clear a field's error as soon as it is edited.
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const found = validateCheckout(values, fulfillment);
    setErrors(found);

    const firstInvalid = checkoutFields.find((field) => found[field]);
    if (firstInvalid) {
      setShowSummary(true);
      document.getElementById(`checkout-${firstInvalid}`)?.focus();
      return;
    }
    setShowSummary(false);

    const url = buildWhatsAppUrl(
      buildOrderMessage({
        locale,
        lines,
        totals,
        fulfillment,
        customer: values,
        origin: window.location.origin,
      }),
    );
    window.open(url, "_blank", "noopener,noreferrer");
    onSent(url);
  };

  const field = (name: CheckoutField, extra?: Partial<Parameters<typeof TextField>[0]>) => {
    const error = errors[name];
    return (
      <TextField
        id={`checkout-${name}`}
        label={t.labels[name]}
        value={values[name]}
        onChange={(value) => update(name, value)}
        error={error ? t.errors[error] : undefined}
        hint={t.hints[name]}
        optionalLabel={optionalFields.includes(name) ? t.optional : undefined}
        required={!optionalFields.includes(name)}
        maxLength={maxLengths[name]}
        autoComplete={autoComplete[name]}
        {...extra}
      />
    );
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {showSummary && Object.values(errors).some(Boolean) && (
          <p role="alert" className="rounded-xl border border-red-700 bg-red-50 p-3 text-sm font-medium text-red-800">
            {t.errorSummary}
          </p>
        )}

        <FulfillmentPicker locale={locale} name="fulfillment-checkout" />

        <fieldset className="space-y-4">
          <legend className="mb-3 text-base font-bold text-forest">
            {t.customerLegend}
          </legend>
          {field("name")}
          {field("phone", { type: "tel", inputMode: "tel", dir: "ltr" })}
        </fieldset>

        {isDelivery && (
          <fieldset className="space-y-4">
            <legend className="mb-3 text-base font-bold text-forest">
              {t.addressLegend}
            </legend>
            {addressFields.map((name) => (
              <div key={name}>{field(name)}</div>
            ))}
          </fieldset>
        )}

        {field("notes", { multiline: true })}
      </div>

      <div className="space-y-3 border-t border-line bg-surface p-4">
        <OrderTotals locale={locale} />
        <p className="text-xs text-muted">{t.whatsappNote}</p>
        <button
          type="submit"
          className="min-h-12 w-full rounded-full bg-forest px-5 font-bold text-white hover:bg-forest/90"
        >
          {t.submit}
        </button>
      </div>
    </form>
  );
}
