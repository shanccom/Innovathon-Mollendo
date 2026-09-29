/**
 * Countdown block displaying an animated numeric value and label in cyber/glass style.
 */
export function CountdownCard({ value, label }) {
  const formatted = String(value).padStart(2, '0');

  return (
    <div className="group relative flex flex-col items-center justify-center rounded-2xl border border-[#1e2a5a]/80 bg-[#0d1633]/70 p-3 sm:p-5 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-[1.03] hover:border-[#b8da02]/50">
      {/* Top subtle glow highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#b8da02]/30 to-transparent"
        aria-hidden="true"
      />

      <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_16px_rgba(184,218,2,0.25)] group-hover:text-[#cbfb45] transition-colors">
        {formatted}
      </span>
      <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-[2px] text-[#8795b8]">
        {label}
      </span>
    </div>
  );
}
