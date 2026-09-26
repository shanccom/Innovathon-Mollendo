// Shared section header with eyebrow, title and optional description.
export function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : 'text-left';

  return (
    <header className={`max-w-2xl ${alignment}`}>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.25em] text-aqua-600 dark:text-aqua-400">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-extrabold text-navy-900 sm:text-4xl dark:text-sand-100">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-navy-700/80 dark:text-sand-200/70">{description}</p>}
    </header>
  );
}
