import { EVENT } from '../../../infrastructure/content/event';
import { CheckIcon } from './RegistrationIcons';

// Confirmation screen shown after a successful submission.
export function RegistrationSuccess({ receipt, onReset }) {
  const { values, registrationId } = receipt;

  return (
    <div className="space-y-6 text-center py-4">
      {/* Success Badge */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#b8da02] shadow-xl shadow-[#b8da02]/30 ring-8 ring-[#b8da02]/20">
        <CheckIcon className="h-10 w-10 text-[#050814]" />
      </div>

      <div className="space-y-2">
        <span className="inline-block rounded-full bg-[#b8da02]/15 border border-[#b8da02]/30 px-3 py-1 text-xs font-black tracking-wider text-[#b8da02] uppercase">
          Postulación Recibida
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          ¡Inscripción Exitosa!
        </h2>
        <p className="mx-auto max-w-md text-sm text-slate-300">
          Hola <strong className="text-white">{values.fullName}</strong>, tu registro para{' '}
          <strong className="text-[#03c4c5]">{EVENT.edition}</strong> ha sido enviado correctamente.
        </p>
      </div>

      {/* Registration Details Card */}
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-700/80 bg-[#0b132b]/80 p-5 text-left space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Código de Postulación</span>
          <span className="font-mono text-base font-black text-[#b8da02]">{registrationId}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="block font-medium text-slate-400">DNI</span>
            <span className="font-semibold text-white">{values.dni}</span>
          </div>
          <div>
            <span className="block font-medium text-slate-400">Sede</span>
            <span className="font-semibold text-white">{values.sede}</span>
          </div>
          <div className="col-span-2">
            <span className="block font-medium text-slate-400">Correo institucional</span>
            <span className="font-semibold text-[#03c4c5] truncate block">{values.institutionalEmail}</span>
          </div>
          <div className="col-span-2">
            <span className="block font-medium text-slate-400">Carrera / Especialidad</span>
            <span className="font-semibold text-white">{values.career}</span>
          </div>
          {values.contributionAreas && values.contributionAreas.length > 0 && (
            <div className="col-span-2">
              <span className="block font-medium text-slate-400 mb-1">Áreas de aporte</span>
              <div className="flex flex-wrap gap-1.5">
                {values.contributionAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-[11px] font-medium text-slate-200"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-md rounded-xl bg-cyan-950/30 border border-cyan-500/20 p-4 text-xs text-cyan-200/90 leading-relaxed text-left">
        <strong>¿Qué sigue?</strong> El equipo revisará tu postulación y te contactará a tu correo institucional{' '}
        con la confirmación de tu cupo y el enlace a la comunidad de participantes.
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-slate-700 bg-slate-900/60 px-6 py-2.5 text-xs font-bold text-slate-300 transition hover:border-[#b8da02] hover:text-[#b8da02] cursor-pointer"
        >
          Registrar a otra persona
        </button>
      </div>
    </div>
  );
}

