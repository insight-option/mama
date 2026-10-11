type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  optionalLabel?: string;
  required?: boolean;
  multiline?: boolean;
  maxLength: number;
  type?: "text" | "tel";
  autoComplete?: string;
  inputMode?: "text" | "tel";
  dir?: "ltr" | "auto";
};

const inputClass =
  "block w-full rounded-xl border bg-surface px-3 py-2.5 text-base text-ink placeholder:text-muted/70 aria-[invalid=true]:border-red-700";

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  optionalLabel,
  required,
  multiline,
  maxLength,
  type = "text",
  autoComplete,
  inputMode,
  dir,
}: Props) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const shared = {
    id,
    name: id,
    value,
    required,
    maxLength,
    autoComplete,
    dir,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: `${inputClass} ${error ? "border-red-700" : "border-line"}`,
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink">
        {label}
        {optionalLabel && (
          <span className="font-normal text-muted"> ({optionalLabel})</span>
        )}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          {...shared}
        />
      ) : (
        <input
          type={type}
          inputMode={inputMode}
          onChange={(e) => onChange(e.target.value)}
          {...shared}
        />
      )}
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
