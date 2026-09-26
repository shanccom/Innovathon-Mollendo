import { PARTICIPATION_TYPE_LABELS } from '../../../domain/entities/registrationCatalog';

const OPTIONS = [
  {
    value: 'individual',
    title: PARTICIPATION_TYPE_LABELS.individual,
    description: 'Te integramos a un equipo mediante el team matching del primer día.',
  },
  {
    value: 'team',
    title: PARTICIPATION_TYPE_LABELS.team,
    description: 'Ya somos un equipo formado de 3 a 5 integrantes.',
  },
];

// Radio cards to choose between individual and team participation.
export function ParticipationPicker({ value, onChange, onBlur, name }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {OPTIONS.map((option) => {
        const isActive = value === option.value;

        return (
          <label
            key={option.value}
            className={`cursor-pointer rounded-2xl border p-4 transition ${
              isActive
                ? 'border-aqua-500 bg-aqua-500/10'
                : 'border-navy-900/15 hover:border-aqua-500/50 dark:border-white/15'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isActive}
              onChange={onChange}
              onBlur={onBlur}
              className="sr-only"
            />
            <span className="flex items-center gap-2">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  isActive ? 'border-aqua-500' : 'border-navy-700/40 dark:border-sand-200/40'
                }`}
              >
                {isActive && <span className="h-2 w-2 rounded-full bg-aqua-500" />}
              </span>
              <span className="text-sm font-extrabold text-navy-900 dark:text-sand-100">{option.title}</span>
            </span>
            <span className="mt-2 block text-xs leading-relaxed text-navy-700/70 dark:text-sand-200/60">{option.description}</span>
          </label>
        );
      })}
    </div>
  );
}
