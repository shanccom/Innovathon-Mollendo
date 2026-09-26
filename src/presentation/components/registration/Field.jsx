const CONTROL_CLASS =
  'w-full rounded-xl border bg-white/70 px-4 py-3 text-sm text-navy-900 transition placeholder:text-navy-700/40 focus:outline-none focus:ring-2 focus:ring-aqua-500/40 dark:bg-navy-900/70 dark:text-sand-100 dark:placeholder:text-sand-200/30';

const INVALID_CLASS = 'border-coral-500 focus:border-coral-500';
const VALID_CLASS = 'border-navy-900/15 dark:border-white/15';

// Text-like control wrapper rendering label, control, hint and error message.
export function Field({ id, label, error, hint, required = false, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold text-navy-900 dark:text-sand-100">
        {label} {required && <span className="text-coral-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-navy-700/60 dark:text-sand-200/50">{hint}</p>}
      {error && (
        <p id={`error-${id}`} role="alert" className="text-xs font-semibold text-coral-500">
          {error}
        </p>
      )}
    </div>
  );
}

// Shared props for input, select and textarea controls.
export function controlProps({ id, name, value, error, onChange, onBlur, ...rest }) {
  return {
    id,
    name,
    value,
    onChange,
    onBlur,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `error-${id}` : undefined,
    className: `${CONTROL_CLASS} ${error ? INVALID_CLASS : VALID_CLASS}`,
    ...rest,
  };
}
