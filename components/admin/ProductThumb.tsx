"use client";

import { useEffect, useState } from "react";
import { DishIcon } from "@/components/ui/icons";
import { imagePreviewUrl } from "@/lib/admin/data";
import type { ProductRecord } from "@/lib/products";

/** Small product photo for admin lists: uploaded (S3) or bundled file. */
export function ProductThumb({ record, className = "size-16" }: { record: ProductRecord; className?: string }) {
  const [src, setSrc] = useState<string | null>(record.imageKey ? null : (record.imagePath ?? null));

  useEffect(() => {
    let cancelled = false;
    if (record.imageKey) {
      imagePreviewUrl(record.imageKey)
        .then((url) => !cancelled && setSrc(url))
        .catch(() => !cancelled && setSrc(record.imagePath ?? null));
    } else {
      setSrc(record.imagePath ?? null);
    }
    return () => {
      cancelled = true;
    };
  }, [record.imageKey, record.imagePath]);

  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream text-muted ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" loading="lazy" />
      ) : (
        <DishIcon className="size-6" />
      )}
    </span>
  );
}
