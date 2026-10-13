"use client";

import { useEffect, useRef } from "react";

/** Accessible confirm dialog (native <dialog>: focus trap, Escape to close). */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  busy,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      aria-labelledby="confirm-title"
      className="w-[min(28rem,calc(100vw-2rem))] rounded-[2rem] bg-ivory p-0 text-ink shadow-lift backdrop:bg-night/60"
    >
      <div className="p-7">
        <h2 id="confirm-title" className="font-display text-2xl text-forest">
          {title}
        </h2>
        <p className="mt-3 text-muted">{body}</p>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onCancel} className="btn-ghost">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="btn bg-red-700 text-white hover:bg-red-800 disabled:opacity-70"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
