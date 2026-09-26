import { EXPERIENCE_LEVELS, INTEREST_AREAS, MAX_AGE, MIN_AGE, TEAM_SIZES } from '../../../domain/entities/registrationCatalog';
import { Field, controlProps } from './Field';
import { ParticipationPicker } from './ParticipationPicker';
import { RegistrationSuccess } from './RegistrationSuccess';

// Registration form; all state lives in the useRegistrationForm hook.
export function RegistrationForm({ form }) {
  const { values, errors, status, message, receipt, isTeam, handleChange, handleBlur, handleSubmit, reset } = form;

  if (status === 'success') return <RegistrationSuccess receipt={receipt} onReset={reset} />;

  const isSubmitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-card space-y-6 p-6 sm:p-9">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="field-fullName" label="Nombres y apellidos" error={errors.fullName} required>
          <input type="text" autoComplete="name" placeholder="Camila Valdivia" {...controlProps({ id: 'field-fullName', name: 'fullName', value: values.fullName, error: errors.fullName, onChange: handleChange, onBlur: handleBlur })} />
        </Field>

        <Field id="field-email" label="Correo electrónico" error={errors.email} required>
          <input type="email" autoComplete="email" placeholder="usuario@correo.com" {...controlProps({ id: 'field-email', name: 'email', value: values.email, error: errors.email, onChange: handleChange, onBlur: handleBlur })} />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Field id="field-phone" label="Celular / WhatsApp" error={errors.phone} required>
          <input type="tel" autoComplete="tel" placeholder="987 654 321" {...controlProps({ id: 'field-phone', name: 'phone', value: values.phone, error: errors.phone, onChange: handleChange, onBlur: handleBlur })} />
        </Field>

        <Field id="field-city" label="Ciudad" error={errors.city} required>
          <input type="text" autoComplete="address-level2" placeholder="Mollendo" {...controlProps({ id: 'field-city', name: 'city', value: values.city, error: errors.city, onChange: handleChange, onBlur: handleBlur })} />
        </Field>

        <Field id="field-age" label="Edad" error={errors.age} hint={`Entre ${MIN_AGE} y ${MAX_AGE} años`} required>
          <input type="number" min={MIN_AGE} max={MAX_AGE} inputMode="numeric" placeholder="21" {...controlProps({ id: 'field-age', name: 'age', value: values.age, error: errors.age, onChange: handleChange, onBlur: handleBlur })} />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="field-occupation" label="Ocupación o institución" error={errors.occupation} required>
          <input type="text" placeholder="Universidad, colegio o empresa" {...controlProps({ id: 'field-occupation', name: 'occupation', value: values.occupation, error: errors.occupation, onChange: handleChange, onBlur: handleBlur })} />
        </Field>

        <Field id="field-interestArea" label="Área principal de aporte">
          <select {...controlProps({ id: 'field-interestArea', name: 'interestArea', value: values.interestArea, onChange: handleChange, onBlur: handleBlur })}>
            {INTEREST_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="field-experienceLevel" label="Nivel de experiencia">
        <select {...controlProps({ id: 'field-experienceLevel', name: 'experienceLevel', value: values.experienceLevel, onChange: handleChange, onBlur: handleBlur })}>
          {EXPERIENCE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </Field>

      <fieldset className="space-y-3">
        <legend className="text-sm font-bold text-navy-900 dark:text-sand-100">Modalidad de participación</legend>
        <ParticipationPicker name="participationType" value={values.participationType} onChange={handleChange} onBlur={handleBlur} />
      </fieldset>

      {isTeam && (
        <div className="grid gap-6 rounded-2xl border border-dashed border-aqua-500/60 bg-aqua-500/5 p-5 sm:grid-cols-2">
          <Field id="field-teamName" label="Nombre del equipo" error={errors.teamName} required>
            <input type="text" placeholder="OlaTech Mollendo" {...controlProps({ id: 'field-teamName', name: 'teamName', value: values.teamName, error: errors.teamName, onChange: handleChange, onBlur: handleBlur })} />
          </Field>

          <Field id="field-teamSize" label="Integrantes" error={errors.teamSize} required>
            <select {...controlProps({ id: 'field-teamSize', name: 'teamSize', value: values.teamSize, error: errors.teamSize, onChange: handleChange, onBlur: handleBlur })}>
              {TEAM_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} integrantes
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}

      <Field id="field-motivation" label="¿Qué esperas aportar o aprender?" hint="Opcional, pero nos ayuda a armar mejores equipos.">
        <textarea rows={4} placeholder="Cuéntanos tu idea o lo que te motiva a transformar Mollendo..." {...controlProps({ id: 'field-motivation', name: 'motivation', value: values.motivation, onChange: handleChange, onBlur: handleBlur })} />
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-navy-700/80 dark:text-sand-200/70">
          <input
            id="field-termsAccepted"
            name="termsAccepted"
            type="checkbox"
            checked={values.termsAccepted}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.termsAccepted)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-aqua-500"
          />
          <span>
            Acepto el código de conducta de la Innovathon Mollendo y el tratamiento de mis datos de contacto para la coordinación del evento.
          </span>
        </label>
        {errors.termsAccepted && (
          <p role="alert" className="mt-2 text-xs font-semibold text-coral-500">
            {errors.termsAccepted}
          </p>
        )}
      </div>

      {message && (
        <p role="alert" className="rounded-xl border border-coral-500/50 bg-coral-500/10 px-4 py-3 text-sm font-semibold text-coral-500">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-aqua-500 px-6 py-3.5 text-sm font-bold text-navy-950 transition hover:bg-aqua-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Enviando inscripción...' : 'Confirmar mi inscripción'}
      </button>

      <p className="text-center text-xs text-navy-700/60 dark:text-sand-200/50">
        Participation gratuita · Datos tratados únicamente para la coordinación del evento.
      </p>
    </form>
  );
}
