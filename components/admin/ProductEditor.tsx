"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/data/menu";
import { adminCopy } from "@/lib/admin-copy";
import { backendReady } from "@/lib/admin/amplify";
import {
  createProduct,
  deleteImage,
  deleteProduct,
  getProduct,
  imagePreviewUrl,
  prepareImage,
  uniqueSlug,
  updateProduct,
  uploadImage,
} from "@/lib/admin/data";
import type { Locale } from "@/lib/i18n";
import type { ProductInput, ProductRecord } from "@/lib/products";
import type { CategoryId } from "@/types/menu";
import { ConfirmDialog } from "./ConfirmDialog";

type Form = {
  nameAr: string;
  nameEn: string;
  category: CategoryId;
  ingredientsAr: string;
  ingredientsEn: string;
  pricingType: "fixed" | "serving";
  price: string;
  priceOne: string;
  priceTwo: string;
  offerActive: boolean;
  offerLabelAr: string;
  offerLabelEn: string;
  offerPrice: string;
  offerPriceOne: string;
  offerPriceTwo: string;
  imageAltAr: string;
  imageAltEn: string;
  available: boolean;
  featured: boolean;
  sortOrder: string;
};

type FieldErrors = Partial<Record<keyof Form, string>>;

const emptyForm: Form = {
  nameAr: "",
  nameEn: "",
  category: "specials",
  ingredientsAr: "",
  ingredientsEn: "",
  pricingType: "fixed",
  price: "",
  priceOne: "",
  priceTwo: "",
  offerActive: false,
  offerLabelAr: "",
  offerLabelEn: "",
  offerPrice: "",
  offerPriceOne: "",
  offerPriceTwo: "",
  imageAltAr: "",
  imageAltEn: "",
  available: true,
  featured: false,
  sortOrder: "",
};

const num = (v?: number | null) => (typeof v === "number" ? String(v) : "");
const lines = (v?: (string | null)[] | null) => (v ?? []).filter(Boolean).join("\n");
const toList = (v: string) => v.split(/\n|،|,/).map((s) => s.trim()).filter(Boolean);
const toNumber = (v: string) => (v.trim() === "" ? null : Number(v.replace(",", ".")));

function fromRecord(r: ProductRecord): Form {
  return {
    nameAr: r.nameAr,
    nameEn: r.nameEn,
    category: r.category,
    ingredientsAr: lines(r.ingredientsAr),
    ingredientsEn: lines(r.ingredientsEn),
    pricingType: r.pricingType,
    price: num(r.price),
    priceOne: num(r.priceOne),
    priceTwo: num(r.priceTwo),
    offerActive: Boolean(r.offerActive),
    offerLabelAr: r.offerLabelAr ?? "",
    offerLabelEn: r.offerLabelEn ?? "",
    offerPrice: num(r.offerPrice),
    offerPriceOne: num(r.offerPriceOne),
    offerPriceTwo: num(r.offerPriceTwo),
    imageAltAr: r.imageAltAr ?? "",
    imageAltEn: r.imageAltEn ?? "",
    available: r.available !== false,
    featured: Boolean(r.featured),
    sortOrder: num(r.sortOrder),
  };
}

const control =
  "block w-full rounded-2xl border border-line bg-surface px-4 py-3 text-base outline-none transition focus:border-forest focus:ring-2 focus:ring-leaf/40 aria-[invalid=true]:border-red-700";

export function ProductEditor({ locale, mode }: { locale: Locale; mode: "new" | "edit" }) {
  const t = adminCopy[locale].editor;
  const common = adminCopy[locale];
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = mode === "edit" ? searchParams.get("id") : null;

  const [record, setRecord] = useState<ProductRecord | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"loading" | "ready" | "notFound" | "loadError">(
    mode === "new" ? "ready" : "loading",
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pendingImage, setPendingImage] = useState<{ blob: Blob; width: number; height: number; preview: string } | null>(null);
  const [removeUploaded, setRemoveUploaded] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode !== "edit" || !backendReady) return;
    if (!id) return setStatus("notFound");
    getProduct(id)
      .then((r) => {
        if (!r) return setStatus("notFound");
        setRecord(r);
        setForm(fromRecord(r));
        setStatus("ready");
      })
      .catch(() => setStatus("loadError"));
  }, [mode, id]);

  // Preview of the photo currently saved for this product.
  useEffect(() => {
    if (!record) return setCurrentImageUrl(null);
    if (record.imageKey) imagePreviewUrl(record.imageKey).then(setCurrentImageUrl).catch(() => setCurrentImageUrl(null));
    else setCurrentImageUrl(record.imagePath ?? null);
  }, [record]);

  useEffect(() => () => {
    if (pendingImage) URL.revokeObjectURL(pendingImage.preview);
  }, [pendingImage]);

  if (!backendReady) {
    return (
      <div className="rounded-[2rem] bg-surface p-8 shadow-soft ring-1 ring-line">
        <h1 className="font-display text-3xl text-forest">{common.notDeployed.title}</h1>
        <p className="mt-3 text-muted">{common.notDeployed.body}</p>
      </div>
    );
  }
  if (status === "loading") return <p className="text-muted">{common.loading}</p>;
  if (status === "notFound" || status === "loadError") {
    return (
      <div className="space-y-4">
        <p role="alert" className="text-red-800">{status === "notFound" ? t.notFound : t.errors.load}</p>
        <Link href={`/${locale}/admin`} className="btn-ghost">{t.back}</Link>
      </div>
    );
  }

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (!form.nameAr.trim()) e.nameAr = t.errors.required;
    if (!form.nameEn.trim()) e.nameEn = t.errors.required;
    const positive = (v: string) => {
      const n = toNumber(v);
      return n !== null && Number.isFinite(n) && n > 0;
    };
    if (form.pricingType === "fixed") {
      if (!positive(form.price)) e.price = t.errors.price;
    } else {
      if (!positive(form.priceOne)) e.priceOne = t.errors.price;
      if (!positive(form.priceTwo)) e.priceTwo = t.errors.price;
    }
    if (form.offerActive) {
      const below = (offer: string, regular: string) =>
        positive(offer) && toNumber(offer)! < (toNumber(regular) ?? 0);
      if (form.pricingType === "fixed") {
        if (!below(form.offerPrice, form.price)) e.offerPrice = t.errors.offerPrice;
      } else {
        // Each serving offer is optional, but must be valid when filled in;
        // at least one is required.
        const one = form.offerPriceOne.trim();
        const two = form.offerPriceTwo.trim();
        if (!one && !two) e.offerPriceOne = t.errors.offerPrice;
        if (one && !below(one, form.priceOne)) e.offerPriceOne = t.errors.offerPrice;
        if (two && !below(two, form.priceTwo)) e.offerPriceTwo = t.errors.offerPrice;
      }
    }
    if (form.sortOrder.trim() && !Number.isInteger(Number(form.sortOrder))) e.sortOrder = t.errors.price;
    return e;
  };

  const onPickImage = async (file?: File) => {
    if (!file) return;
    try {
      const prepared = await prepareImage(file);
      setPendingImage({ ...prepared, preview: URL.createObjectURL(prepared.blob) });
      setRemoveUploaded(false);
    } catch {
      setMessage({ kind: "error", text: t.errors.image });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      const first = Object.keys(found).find((k) => found[k as keyof Form]);
      document.getElementById(`field-${first}`)?.focus();
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const productId = record?.id ?? (await uniqueSlug(form.nameEn));
      let imageKey = removeUploaded ? null : (record?.imageKey ?? null);
      let imageWidth = record?.imageWidth ?? null;
      let imageHeight = record?.imageHeight ?? null;
      if (pendingImage) {
        imageKey = await uploadImage(productId, pendingImage.blob);
        imageWidth = pendingImage.width;
        imageHeight = pendingImage.height;
      } else if (removeUploaded) {
        imageWidth = null;
        imageHeight = null;
      }

      const serving = form.pricingType === "serving";
      const input: ProductInput = {
        id: productId,
        category: form.category,
        nameAr: form.nameAr.trim(),
        nameEn: form.nameEn.trim(),
        ingredientsAr: toList(form.ingredientsAr),
        ingredientsEn: toList(form.ingredientsEn),
        pricingType: form.pricingType,
        price: serving ? null : toNumber(form.price),
        priceOne: serving ? toNumber(form.priceOne) : null,
        priceTwo: serving ? toNumber(form.priceTwo) : null,
        offerActive: form.offerActive,
        offerPrice: form.offerActive && !serving ? toNumber(form.offerPrice) : null,
        offerPriceOne: form.offerActive && serving ? toNumber(form.offerPriceOne) : null,
        offerPriceTwo: form.offerActive && serving ? toNumber(form.offerPriceTwo) : null,
        offerLabelAr: form.offerActive ? form.offerLabelAr.trim() || null : null,
        offerLabelEn: form.offerActive ? form.offerLabelEn.trim() || null : null,
        imagePath: record?.imagePath ?? null,
        imageKey,
        imageWidth,
        imageHeight,
        imageAltAr: form.imageAltAr.trim() || null,
        imageAltEn: form.imageAltEn.trim() || null,
        imageLowResolution: imageKey ? false : (record?.imageLowResolution ?? false),
        available: form.available,
        featured: form.featured,
        sortOrder: form.sortOrder.trim() ? Number(form.sortOrder) : null,
      };

      const saved = record ? await updateProduct(input) : await createProduct(input);
      // Remove the replaced/removed upload only after the product is saved.
      if (record?.imageKey && record.imageKey !== imageKey) await deleteImage(record.imageKey);

      setRecord(saved);
      setForm(fromRecord(saved));
      setPendingImage(null);
      setRemoveUploaded(false);
      setMessage({ kind: "ok", text: t.saved });
      if (mode === "new") router.replace(`/${locale}/admin/products/edit?id=${encodeURIComponent(saved.id)}`);
    } catch (error) {
      console.error(error);
      setMessage({ kind: "error", text: t.errors.save });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!record) return;
    setSaving(true);
    try {
      await deleteProduct(record);
      router.replace(`/${locale}/admin`);
    } catch (error) {
      console.error(error);
      setMessage({ kind: "error", text: t.errors.save });
      setSaving(false);
      setConfirmingDelete(false);
    }
  };

  const preview = pendingImage?.preview ?? (removeUploaded ? (record?.imagePath ?? null) : currentImageUrl);
  const serving = form.pricingType === "serving";

  return (
    <form onSubmit={onSave} noValidate className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href={`/${locale}/admin`} className="text-sm font-bold text-muted hover:text-forest">
            {t.back}
          </Link>
          <h1 className="mt-2 font-display text-4xl text-forest">
            {mode === "new" ? t.newTitle : record ? (locale === "ar" ? record.nameAr : record.nameEn) : t.editTitle}
          </h1>
        </div>
        <div className="flex gap-3">
          {record && (
            <button type="button" onClick={() => setConfirmingDelete(true)} className="btn border border-red-700/30 text-red-700 hover:bg-red-50">
              {adminCopy[locale].products.delete}
            </button>
          )}
          <button type="submit" disabled={saving} className="btn-primary min-w-32 disabled:opacity-70">
            {saving ? t.saving : t.save}
          </button>
        </div>
      </div>

      {message && (
        <p
          role={message.kind === "error" ? "alert" : "status"}
          className={`rounded-2xl px-4 py-3 text-sm font-medium ${
            message.kind === "error" ? "bg-red-50 text-red-800" : "bg-leaf/15 text-forest"
          }`}
        >
          {message.text}
        </p>
      )}

      <Section title={t.sections.basics}>
        <div className="grid gap-4 md:grid-cols-2">
          <Text id="nameAr" label={t.nameAr} value={form.nameAr} error={errors.nameAr} onChange={(v) => set("nameAr", v)} dir="rtl" />
          <Text id="nameEn" label={t.nameEn} value={form.nameEn} error={errors.nameEn} onChange={(v) => set("nameEn", v)} dir="ltr" />
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">{t.category}</span>
          <select value={form.category} onChange={(e) => set("category", e.target.value as CategoryId)} className={control}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name[locale]}
              </option>
            ))}
          </select>
        </label>
      </Section>

      <Section title={t.sections.description}>
        <div className="grid gap-4 md:grid-cols-2">
          <Area id="ingredientsAr" label={t.ingredientsAr} hint={t.ingredientsHint} value={form.ingredientsAr} onChange={(v) => set("ingredientsAr", v)} dir="rtl" />
          <Area id="ingredientsEn" label={t.ingredientsEn} hint={t.ingredientsHint} value={form.ingredientsEn} onChange={(v) => set("ingredientsEn", v)} dir="ltr" />
        </div>
      </Section>

      <Section title={t.sections.pricing}>
        <fieldset>
          <legend className="mb-2 text-sm font-bold">{t.pricingType}</legend>
          <div className="flex flex-wrap gap-2">
            {(["fixed", "serving"] as const).map((type) => (
              <label key={type} className="cursor-pointer">
                <input type="radio" name="pricingType" value={type} checked={form.pricingType === type} onChange={() => set("pricingType", type)} className="peer sr-only" />
                <span className="inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-5 text-sm font-bold peer-checked:border-forest peer-checked:bg-forest peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-leaf">
                  {type === "fixed" ? t.fixed : t.serving}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {serving ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Text id="priceOne" label={t.priceOne} value={form.priceOne} error={errors.priceOne} onChange={(v) => set("priceOne", v)} numeric />
            <Text id="priceTwo" label={t.priceTwo} value={form.priceTwo} error={errors.priceTwo} onChange={(v) => set("priceTwo", v)} numeric />
          </div>
        ) : (
          <Text id="price" label={t.price} value={form.price} error={errors.price} onChange={(v) => set("price", v)} numeric />
        )}
      </Section>

      <Section title={t.sections.offer}>
        <Toggle label={t.offerActive} checked={form.offerActive} onChange={(v) => set("offerActive", v)} />
        {form.offerActive && (
          <div className="space-y-4">
            <p className="text-sm text-muted">{t.offerHint}</p>
            {serving ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Text id="offerPriceOne" label={t.offerPriceOne} value={form.offerPriceOne} error={errors.offerPriceOne} onChange={(v) => set("offerPriceOne", v)} numeric />
                <Text id="offerPriceTwo" label={t.offerPriceTwo} value={form.offerPriceTwo} error={errors.offerPriceTwo} onChange={(v) => set("offerPriceTwo", v)} numeric />
              </div>
            ) : (
              <Text id="offerPrice" label={t.offerPrice} value={form.offerPrice} error={errors.offerPrice} onChange={(v) => set("offerPrice", v)} numeric />
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <Text id="offerLabelAr" label={t.offerLabelAr} value={form.offerLabelAr} onChange={(v) => set("offerLabelAr", v)} dir="rtl" />
              <Text id="offerLabelEn" label={t.offerLabelEn} value={form.offerLabelEn} onChange={(v) => set("offerLabelEn", v)} dir="ltr" />
            </div>
          </div>
        )}
      </Section>

      <Section title={t.sections.image}>
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex aspect-[4/3] w-56 items-center justify-center overflow-hidden rounded-3xl bg-cream text-sm text-muted">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="size-full object-cover" />
            ) : (
              t.noImage
            )}
          </div>
          <div className="space-y-3">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" id="image-file" onChange={(e) => onPickImage(e.target.files?.[0])} />
            <label htmlFor="image-file" className="btn-ghost cursor-pointer">
              {preview ? t.replaceImage : t.uploadImage}
            </label>
            {(pendingImage || (record?.imageKey && !removeUploaded)) && (
              <button
                type="button"
                onClick={() => {
                  setPendingImage(null);
                  setRemoveUploaded(Boolean(record?.imageKey));
                }}
                className="block text-sm font-bold text-red-700 hover:underline"
              >
                {t.removeUploaded}
              </button>
            )}
            <p className="max-w-xs text-xs text-muted">{t.imageHint}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Text id="imageAltAr" label={t.altAr} value={form.imageAltAr} onChange={(v) => set("imageAltAr", v)} dir="rtl" />
          <Text id="imageAltEn" label={t.altEn} value={form.imageAltEn} onChange={(v) => set("imageAltEn", v)} dir="ltr" />
        </div>
      </Section>

      <Section title={t.sections.visibility}>
        <Toggle label={t.available} checked={form.available} onChange={(v) => set("available", v)} />
        <Toggle label={t.featured} checked={form.featured} onChange={(v) => set("featured", v)} />
        <div className="max-w-xs">
          <Text id="sortOrder" label={t.sortOrder} value={form.sortOrder} error={errors.sortOrder} onChange={(v) => set("sortOrder", v)} numeric />
        </div>
      </Section>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary min-w-40 disabled:opacity-70">
          {saving ? t.saving : t.save}
        </button>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title={adminCopy[locale].products.confirmDeleteTitle}
        body={record ? adminCopy[locale].products.confirmDeleteBody(locale === "ar" ? record.nameAr : record.nameEn) : ""}
        confirmLabel={adminCopy[locale].products.confirmDelete}
        cancelLabel={adminCopy[locale].products.cancel}
        busy={saving}
        onConfirm={onDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-[2rem] bg-surface p-6 shadow-soft ring-1 ring-line/70 md:p-8">
      <h2 className="font-display text-2xl text-forest">{title}</h2>
      {children}
    </section>
  );
}

function Text({
  id,
  label,
  value,
  onChange,
  error,
  dir,
  numeric,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  dir?: "rtl" | "ltr";
  numeric?: boolean;
}) {
  return (
    <div>
      <label htmlFor={`field-${id}`} className="mb-1.5 block text-sm font-bold">
        {label}
      </label>
      <input
        id={`field-${id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={numeric ? "ltr" : dir}
        inputMode={numeric ? "decimal" : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `field-${id}-error` : undefined}
        className={control}
      />
      {error && (
        <p id={`field-${id}-error`} className="mt-1 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function Area({
  id,
  label,
  hint,
  value,
  onChange,
  dir,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  dir: "rtl" | "ltr";
}) {
  return (
    <div>
      <label htmlFor={`field-${id}`} className="mb-1.5 block text-sm font-bold">
        {label}
      </label>
      <textarea id={`field-${id}`} rows={4} value={value} dir={dir} onChange={(e) => onChange(e.target.value)} className={control} />
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="relative h-7 w-12 shrink-0 rounded-full bg-line transition-colors after:absolute after:start-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-leaf peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-leaf rtl:peer-checked:after:-translate-x-5"
      />
      <span className="text-sm font-bold">{label}</span>
    </label>
  );
}
