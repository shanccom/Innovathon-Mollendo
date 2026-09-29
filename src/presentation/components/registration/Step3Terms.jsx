import { useState } from 'react';
import {
  ShieldCheckIcon,
  ExternalLinkIcon,
  ArrowLeftIcon,
  CheckIcon,
  Step2SingleWave,
  StepOfficialDocIcon,
  LinkIcon,
} from './RegistrationIcons';

export function Step3Terms({
  values,
  errors,
  isSubmitting,
  onChange,
  onPrev,
  onSubmit,
}) {
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Section Header */}
      <div className="space-y-1.5 pb-1">
        <div className="flex items-center gap-3">
          <Step2SingleWave className="h-3.5 w-7 text-[#741cf3] shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-[-1px] text-white">
            Paso 3: <span className="text-[#b0cf03]">Disponibilidad y Términos</span>
          </h2>
        </div>
        <p className="pl-10 text-xs sm:text-sm text-[#8795b8]">
          Último paso. Solo queda confirmar tu participación y aceptar los términos.
        </p>
      </div>

      {/* Checkbox 1: Disponibilidad Presencial */}
      <div className="pt-2">
        <div
          onClick={() =>
            onChange({
              target: {
                name: 'availability',
                type: 'checkbox',
                checked: !values.availability,
              },
            })
          }
          className="group flex items-start gap-3.5 cursor-pointer select-none"
        >
          <div className="pt-0.5">
            <input
              id="field-availability"
              name="availability"
              type="checkbox"
              checked={values.availability}
              onChange={onChange}
              onClick={(e) => e.stopPropagation()}
              className="sr-only"
            />
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all ${
                values.availability
                  ? 'border-[#cbfb45] bg-[#cbfb45] text-black shadow-[0_0_12px_rgba(203,251,69,0.3)]'
                  : 'border-[#2b3765] bg-[#0c132c] group-hover:border-slate-400'
              }`}
            >
              {values.availability && <CheckIcon className="h-4 w-4 stroke-[3]" />}
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="field-availability"
              className="text-sm font-semibold text-white leading-snug cursor-pointer select-none"
            >
              Confirmo mi disponibilidad para participar de manera presencial en las fechas del evento (17 y 18 de diciembre de 2026) y en las actividades previas y posteriores que se requieran.
            </label>
            <p className="text-xs text-[#8795b8] leading-relaxed">
              Es importante que puedas asistir en los horarios establecidos para el desarrollo del Innovathon.
            </p>
          </div>
        </div>

        {errors.availability && (
          <p id="error-availability" role="alert" className="mt-2 text-xs font-semibold text-rose-400 pl-9">
            {errors.availability}
          </p>
        )}
      </div>

      {/* Bases Oficiales Card */}
      <div className="rounded-2xl border border-[#1b254b]/80 bg-[#080d22]/50 p-5 sm:p-6 space-y-4">
        <div className="flex items-start gap-3.5">
          <StepOfficialDocIcon className="h-6 w-6 text-[#8A64FF] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Bases Oficiales</h3>
            <p className="text-xs text-[#8795b8] mt-0.5">
              Revisa aquí las bases y consideraciones del evento.
            </p>
          </div>
        </div>

        {/* Link Input Bar */}
        <a
          href="https://innovathonmollendo.pe/bases-oficiales.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-[#172146] bg-[#060b1e]/90 px-4 py-3 text-xs sm:text-sm text-slate-300 transition-colors hover:border-[#8A64FF]/60 group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <LinkIcon className="h-4 w-4 text-[#8795b8] shrink-0 group-hover:text-[#8A64FF] transition-colors" />
            <span className="font-mono text-xs sm:text-sm text-slate-300 truncate">
              https://innovathonmollendo.pe/bases-oficiales.pdf
            </span>
          </div>
          <ExternalLinkIcon className="h-4 w-4 text-[#8795b8] shrink-0 ml-2 group-hover:text-white transition-colors" />
        </a>
      </div>

      {/* Checkbox 2: Términos y Condiciones */}
      <div>
        <div
          onClick={() =>
            onChange({
              target: {
                name: 'termsAccepted',
                type: 'checkbox',
                checked: !values.termsAccepted,
              },
            })
          }
          className="group flex items-start gap-3.5 cursor-pointer select-none"
        >
          <div className="pt-0.5">
            <input
              id="field-termsAccepted"
              name="termsAccepted"
              type="checkbox"
              checked={values.termsAccepted}
              onChange={onChange}
              onClick={(e) => e.stopPropagation()}
              className="sr-only"
            />
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all ${
                values.termsAccepted
                  ? 'border-[#cbfb45] bg-[#cbfb45] text-black shadow-[0_0_12px_rgba(203,251,69,0.3)]'
                  : 'border-[#2b3765] bg-[#0c132c] group-hover:border-slate-400'
              }`}
            >
              {values.termsAccepted && <CheckIcon className="h-4 w-4 stroke-[3]" />}
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="field-termsAccepted"
              className="text-sm font-semibold text-white leading-snug cursor-pointer select-none"
            >
              Acepto los Términos y Condiciones y el Tratamiento de Datos Personales
            </label>
            <p className="text-xs text-[#8795b8] leading-relaxed">
              Al inscribirme, declaro que he leído y acepto los términos y condiciones del evento, así como el tratamiento de mis datos personales de acuerdo con la política de privacidad.
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTermsModal(true);
              }}
              className="inline-flex items-center text-xs font-semibold text-[#8A64FF] hover:text-[#a78bfa] hover:underline cursor-pointer pt-1"
            >
              Ver términos y condiciones →
            </button>
          </div>
        </div>

        {errors.termsAccepted && (
          <p id="error-termsAccepted" role="alert" className="mt-2 text-xs font-semibold text-rose-400 pl-9">
            {errors.termsAccepted}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between border-t border-[#172044] pt-6 mt-8">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2b3765] bg-[#0c132c]/60 px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-[#162044] hover:border-[#3b4b85] disabled:opacity-50 cursor-pointer active:scale-95"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Atrás</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#cbfb45] px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-extrabold text-black shadow-[0_0_24px_rgba(203,251,69,0.35)] transition-all hover:bg-[#b0cf03] hover:shadow-[0_0_30px_rgba(203,251,69,0.5)] disabled:opacity-60 cursor-pointer active:scale-95"
        >
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin text-black" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span>Enviando...</span>
            </>
          ) : (
            <span>Enviar Inscripción</span>
          )}
        </button>
      </div>

      {/* Lightweight Terms Modal */}
      {showTermsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-700 bg-[#0a0f24] p-6 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheckIcon className="h-6 w-6 text-[#b0cf03]" />
                <h3 className="text-lg font-bold text-white">Términos y Condiciones</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs leading-relaxed text-slate-300">
              <p>
                <strong>1. Participación:</strong> La postulación a Innovathon Mollendo 2026 es libre y gratuita.
                Completar este formulario constituye una solicitud de inscripción sujeta a verificación de cupos y
                perfil por parte del comité organizador.
              </p>
              <p>
                <strong>2. Tratamiento de Datos Personales:</strong> De acuerdo con la Ley N° 29733 (Ley de Protección
                de Datos Personales del Perú), la información recolectada será empleada únicamente para la
                comunicación oficial, acreditación de participantes, entrega de certificados y coordinación
                logística del evento.
              </p>
              <p>
                <strong>3. Presencialidad:</strong> Al aceptar, el participante se compromete a acudir puntualmente a las
                instalaciones en Mollendo durante las fechas oficiales (17 y 18 de diciembre de 2026) con su propio
                equipo de trabajo (laptop y accesorios).
              </p>
              <p>
                <strong>4. Propiedad Intelectual:</strong> Los prototipos y soluciones desarrollados durante la hackatón
                permanecen bajo la titularidad intelectual de sus respectivos creadores.
              </p>
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="rounded-full bg-[#cbfb45] px-6 py-2 text-xs font-bold text-black hover:bg-[#b0cf03]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
