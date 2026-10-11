export function SectionHeading({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  /** Optional action shown at the end of the heading row. */
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
      <div>
        <h2 id={id} className="text-2xl font-extrabold text-forest md:text-3xl">
          {title}
        </h2>
        {intro && <p className="mt-1 text-muted">{intro}</p>}
      </div>
      {children}
    </div>
  );
}
