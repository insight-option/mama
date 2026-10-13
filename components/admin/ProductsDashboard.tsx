"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Price } from "@/components/ui/Price";
import { PlusIcon, TagIcon } from "@/components/ui/icons";
import { categories } from "@/data/menu";
import { adminCopy } from "@/lib/admin-copy";
import { backendReady } from "@/lib/admin/amplify";
import { deleteProduct, importBundledMenu, listProducts, updateProduct } from "@/lib/admin/data";
import type { Locale } from "@/lib/i18n";
import type { ProductRecord } from "@/lib/products";
import type { CategoryId } from "@/types/menu";
import { ConfirmDialog } from "./ConfirmDialog";
import { ProductThumb } from "./ProductThumb";

export function ProductsDashboard({ locale }: { locale: Locale }) {
  const t = adminCopy[locale];
  const p = t.products;
  const [records, setRecords] = useState<ProductRecord[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CategoryId>("all");
  const [importing, setImporting] = useState<{ done: number; total: number } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<ProductRecord | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      setRecords(await listProducts());
    } catch (error) {
      console.error(error);
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    if (backendReady) load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (records ?? []).filter(
      (r) =>
        (category === "all" || r.category === category) &&
        (!q || r.nameAr.toLowerCase().includes(q) || r.nameEn.toLowerCase().includes(q)),
    );
  }, [records, query, category]);

  if (!backendReady) {
    return (
      <div className="rounded-[2rem] bg-surface p-8 shadow-soft ring-1 ring-line">
        <h1 className="font-display text-3xl text-forest">{t.notDeployed.title}</h1>
        <p className="mt-3 text-muted">{t.notDeployed.body}</p>
      </div>
    );
  }

  const stats = records
    ? {
        total: records.length,
        available: records.filter((r) => r.available !== false).length,
        offers: records.filter((r) => r.offerActive).length,
        hidden: records.filter((r) => r.available === false).length,
      }
    : null;

  const runImport = async () => {
    setActionError(null);
    setImporting({ done: 0, total: 0 });
    try {
      const count = await importBundledMenu((done, total) => setImporting({ done, total }));
      setNotice(p.imported(count));
      await load();
    } catch (error) {
      console.error(error);
      setActionError(t.editor.errors.save);
    } finally {
      setImporting(null);
    }
  };

  const toggleAvailable = async (record: ProductRecord) => {
    setBusyId(record.id);
    setActionError(null);
    try {
      const next = record.available === false;
      await updateProduct({ id: record.id, available: next });
      setRecords((rs) => rs?.map((r) => (r.id === record.id ? { ...r, available: next } : r)) ?? null);
      setNotice(p.liveNote);
    } catch (error) {
      console.error(error);
      setActionError(t.editor.errors.save);
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setBusyId(toDelete.id);
    try {
      await deleteProduct(toDelete);
      setRecords((rs) => rs?.filter((r) => r.id !== toDelete.id) ?? null);
      setNotice(p.deleted);
    } catch (error) {
      console.error(error);
      setActionError(t.editor.errors.save);
    } finally {
      setBusyId(null);
      setToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl text-forest">{p.title}</h1>
        <Link href={`/${locale}/admin/products/new`} className="btn-primary">
          <PlusIcon />
          {p.add}
        </Link>
      </div>

      {notice && (
        <p role="status" className="rounded-2xl bg-leaf/15 px-4 py-3 text-sm font-medium text-forest">
          {notice}
        </p>
      )}
      {(actionError || loadError) && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {actionError ?? t.editor.errors.load}
        </p>
      )}

      {stats && (
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(Object.keys(stats) as (keyof typeof stats)[]).map((key) => (
            <div key={key} className="rounded-3xl bg-surface p-5 shadow-soft ring-1 ring-line/70">
              <dt className="text-sm text-muted">{p.stats[key]}</dt>
              <dd className="mt-1 font-latin text-3xl font-extrabold text-forest">{stats[key]}</dd>
            </div>
          ))}
        </dl>
      )}

      {records === null && !loadError && <p className="text-muted">{t.loading}</p>}

      {records && records.length === 0 && (
        <div className="rounded-[2rem] bg-forest p-8 text-white md:p-10">
          <h2 className="font-display text-3xl">{p.importTitle}</h2>
          <p className="mt-3 max-w-xl text-white/75">{p.importBody}</p>
          <button type="button" onClick={runImport} disabled={Boolean(importing)} className="btn-leaf mt-6 disabled:opacity-70">
            {importing ? p.importing(importing.done, importing.total) : p.importButton}
          </button>
        </div>
      )}

      {records && records.length > 0 && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={p.search}
              aria-label={p.search}
              className="min-h-12 flex-1 rounded-full border border-line bg-surface px-5 outline-none focus:border-forest"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "all" | CategoryId)}
              aria-label={p.allCategories}
              className="min-h-12 rounded-full border border-line bg-surface px-5 outline-none focus:border-forest"
            >
              <option value="all">{p.allCategories}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name[locale]}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="text-muted">{p.noResults}</p>
          ) : (
            <ul className="space-y-3">
              {filtered.map((r) => (
                <li
                  key={r.id}
                  className={`flex flex-wrap items-center gap-4 rounded-3xl bg-surface p-4 shadow-soft ring-1 ring-line/70 ${
                    r.available === false ? "opacity-70" : ""
                  }`}
                >
                  <ProductThumb record={r} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg text-forest">{locale === "ar" ? r.nameAr : r.nameEn}</p>
                    <p className="truncate text-sm text-muted">
                      {locale === "ar" ? r.nameEn : r.nameAr} ·{" "}
                      {categories.find((c) => c.id === r.category)?.name[locale]}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                      {r.pricingType === "fixed" ? (
                        <Price amount={r.price ?? 0} locale={locale} className="font-bold" />
                      ) : (
                        <span className="flex items-center gap-2 font-bold">
                          <Price amount={r.priceOne ?? 0} locale={locale} />
                          <span className="text-muted">/</span>
                          <Price amount={r.priceTwo ?? 0} locale={locale} />
                        </span>
                      )}
                      {r.offerActive && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-leaf/20 px-2.5 py-0.5 text-xs font-bold text-forest">
                          <TagIcon className="size-3" />
                          {p.offer}
                        </span>
                      )}
                      {r.featured && (
                        <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-bold text-forest">{p.featured}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={r.available !== false}
                      disabled={busyId === r.id}
                      onClick={() => toggleAvailable(r)}
                      className={`min-h-10 rounded-full px-4 text-xs font-bold transition-colors ${
                        r.available !== false ? "bg-leaf/20 text-forest" : "bg-line text-muted"
                      }`}
                    >
                      {r.available !== false ? p.available : p.hidden}
                    </button>
                    <Link
                      href={`/${locale}/admin/products/edit?id=${encodeURIComponent(r.id)}`}
                      className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm font-bold text-forest hover:border-forest"
                    >
                      {p.edit}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setToDelete(r)}
                      className="inline-flex min-h-10 items-center rounded-full px-3 text-sm font-bold text-red-700 hover:bg-red-50"
                    >
                      {p.delete}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={p.confirmDeleteTitle}
        body={toDelete ? p.confirmDeleteBody(locale === "ar" ? toDelete.nameAr : toDelete.nameEn) : ""}
        confirmLabel={p.confirmDelete}
        cancelLabel={p.cancel}
        busy={Boolean(busyId)}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
