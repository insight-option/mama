import type { Fulfillment } from "@/lib/cart";

export type CheckoutForm = {
  name: string;
  phone: string;
  area: string;
  street: string;
  building: string;
  unit: string;
  landmark: string;
  notes: string;
};

export type CheckoutField = keyof CheckoutForm;

export type CheckoutError = "required" | "phone" | "tooLong";

export type CheckoutErrors = Partial<Record<CheckoutField, CheckoutError>>;

export const emptyCheckoutForm: CheckoutForm = {
  name: "",
  phone: "",
  area: "",
  street: "",
  building: "",
  unit: "",
  landmark: "",
  notes: "",
};

export const maxLengths: Record<CheckoutField, number> = {
  name: 80,
  phone: 20,
  area: 80,
  street: 80,
  building: 40,
  unit: 40,
  landmark: 120,
  notes: 500,
};

/** Field order, used for error focus and the address block. */
export const checkoutFields: CheckoutField[] = [
  "name",
  "phone",
  "area",
  "street",
  "building",
  "unit",
  "landmark",
  "notes",
];

export const addressFields: CheckoutField[] = [
  "area",
  "street",
  "building",
  "unit",
  "landmark",
];

const requiredAlways: CheckoutField[] = ["name", "phone"];
const requiredForDelivery: CheckoutField[] = ["area", "street", "building"];

/** Converts Arabic-Indic and Persian digits to Western digits. */
export function toWesternDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/** "+974 5118-4219" → "+97451184219". Returns null when not a phone number. */
export function normalizePhone(value: string): string | null {
  const compact = toWesternDigits(value).replace(/[\s\-().]/g, "");
  return /^\+?\d{8,15}$/.test(compact) ? compact : null;
}

/** Trims, removes control characters and, unless multiline, line breaks. */
export function cleanText(value: string, multiline = false): string {
  const withoutControls = value.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "");
  const text = multiline
    ? withoutControls.replace(/\n{3,}/g, "\n\n")
    : withoutControls.replace(/\s+/g, " ");
  return text.trim();
}

export function validateCheckout(
  form: CheckoutForm,
  fulfillment: Fulfillment,
): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const required =
    fulfillment === "delivery"
      ? [...requiredAlways, ...requiredForDelivery]
      : requiredAlways;

  for (const field of checkoutFields) {
    const isAddress = addressFields.includes(field);
    if (isAddress && fulfillment !== "delivery") continue;
    const value = cleanText(form[field], field === "notes");
    if (required.includes(field) && value === "") {
      errors[field] = "required";
    } else if (value.length > maxLengths[field]) {
      errors[field] = "tooLong";
    }
  }

  if (!errors.phone && normalizePhone(form.phone) === null) {
    errors.phone = "phone";
  }
  return errors;
}
