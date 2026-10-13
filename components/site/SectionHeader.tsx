export function SectionHeader({
  id,
  eyebrow,
  title,
  intro,
  children,
  tone = "light",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Optional action at the end of the heading row. */
  children?: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div data-reveal className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2
          id={id}
          className={`font-display text-3xl leading-tight md:text-5xl ${dark ? "text-white" : "text-forest"}`}
        >
          {title}
        </h2>
        {intro && (
          <p className={`mt-3 text-base md:text-lg ${dark ? "text-white/70" : "text-muted"}`}>{intro}</p>
        )}
      </div>
      {children}
    </div>
  );
}

/** Top band for inner pages (menu, offers, delivery, contact). */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-forest text-white">
      <div
        aria-hidden="true"
        className="absolute -end-24 -top-24 size-80 rounded-full bg-leaf/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-content px-4 py-14 md:py-20">
        {eyebrow && <p className="eyebrow mb-4 animate-fade-up">{eyebrow}</p>}
        <h1 className="animate-fade-up font-display text-4xl leading-tight [animation-delay:80ms] md:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl animate-fade-up text-lg text-white/75 [animation-delay:160ms]">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
