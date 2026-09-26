// Small badge used across sections to highlight labels and tags.
export function Badge({ children, tone = 'aqua' }) {
  const tones = {
    aqua: 'bg-aqua-500/10 text-aqua-600 border-aqua-500/30 dark:text-aqua-300',
    coral: 'bg-coral-500/10 text-coral-500 border-coral-500/30 dark:text-coral-300',
    lime: 'bg-lime-500/10 text-lime-500 border-lime-500/30 dark:text-lime-300',
  };

  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>
  );
}
