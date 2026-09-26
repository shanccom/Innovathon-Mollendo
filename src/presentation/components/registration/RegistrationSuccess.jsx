import { PARTICIPATION_TYPE_LABELS } from '../../../domain/entities/registrationCatalog';
import { EVENT } from '../../../infrastructure/content/event';

// Confirmation screen shown after a successful submission.
export function RegistrationSuccess({ receipt, onReset }) {
  const { values, registrationId } = receipt;
  const isTeam = values.participationType === 'team';

  return (
    <div className="surface-card p-8 text-center sm:p-12">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-aqua-500 text-3xl font-extrabold text-navy-950">
        ✓
      </span>
      <h2 className="mt-6 text-2xl font-extrabold text-navy-900 dark:text-sand-100">¡Registro completado!</h2>
      <p className="mt-3 text-sm leading-relaxed text-navy-700/80 dark:text-sand-200/70">
        Gracias por inscribirte a {EVENT.edition}. Enviaremos los accesos e instrucciones a{' '} <strong className="text-aqua-600 dark:text-aqua-400">{values.email}</strong> con
        los accesos e instrucciones del evento.
      </p>

      <dl className="mx-auto mt-8 grid max-w-md gap-3 text-left text-sm">
        <div className="flex items-center justify-between gap-4 rounded-xl bg-aqua-500/10 px-4 py-3">
          <dt className="text-xs font-bold uppercase tracking-widest text-navy-700/70 dark:text-sand-200/60">Código</dt>
          <dd className="font-display font-extrabold text-aqua-600 dark:text-aqua-400">{registrationId}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-xl bg-aqua-500/10 px-4 py-3">
          <dt className="text-xs font-bold uppercase tracking-widest text-navy-700/70 dark:text-sand-200/60">Modalidad</dt>
          <dd className="font-semibold text-navy-900 dark:text-sand-100">
            {isTeam ? `Equipo ${values.teamName} (${values.teamSize})` : PARTICIPATION_TYPE_LABELS.individual}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-xl bg-aqua-500/10 px-4 py-3">
          <dt className="text-xs font-bold uppercase tracking-widest text-navy-700/70 dark:text-sand-200/60">Ciudad</dt>
          <dd className="font-semibold text-navy-900 dark:text-sand-100">{values.city}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onReset}
        className="mt-8 rounded-full border border-navy-900/20 px-6 py-2.5 text-sm font-bold text-navy-900 transition hover:border-aqua-500 dark:border-white/25 dark:text-sand-100"
      >
        Registrar a otra persona
      </button>
    </div>
  );
}
