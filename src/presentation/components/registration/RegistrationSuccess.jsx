import { EVENT } from '../../../infrastructure/content/event';
import {
  CheckIcon,
  DocumentHubIcon,
  BookOpenIcon,
  ScaleIcon,
  ExternalLinkIcon,
} from './RegistrationIcons';

// Confirmation screen shown after a successful submission.
export function RegistrationSuccess({ receipt, onReset }) {
  const { values } = receipt;

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

      {/* What's next & Resources */}
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-700/80 bg-[#0b132b]/80 p-5 text-xs text-left space-y-4">
        <div>
          <span className="inline-flex items-center gap-2 font-bold text-sm text-white mb-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#b8da02]"></span>
            ¿Qué sigue ahora?
          </span>
          <p className="text-slate-300 text-xs mt-1 leading-relaxed">
            El equipo organizador revisará tu postulación y te contactará a tu correo institucional. Ya puedes acceder a los enlaces clave del evento:
          </p>
        </div>

        {/* CTA Enlaces Importantes Google Doc */}
        <a
          href={EVENT.documents.enlacesImportantes}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 w-full rounded-xl bg-[#cbfb45] px-4 py-3 text-xs sm:text-sm font-extrabold text-[#050814] shadow-[0_0_20px_rgba(203,251,69,0.25)] transition-all hover:bg-[#b0cf03] hover:shadow-[0_0_25px_rgba(203,251,69,0.4)] active:scale-[0.98] group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <DocumentHubIcon className="h-5 w-5 text-[#050814] shrink-0" />
            <span className="truncate">Ver Enlaces y Recursos Importantes</span>
          </div>
          <ExternalLinkIcon className="h-4 w-4 text-[#050814] shrink-0 transition-transform group-hover:translate-x-0.5" />
        </a>

        {/* Secondary links */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-700/80 text-[11px] text-slate-400">
          <span>Documentos oficiales:</span>
          <div className="flex items-center gap-3">
            <a
              href={EVENT.documents.bases}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#b8da02] transition-colors"
            >
              <BookOpenIcon className="h-3.5 w-3.5 text-white" />
              <span>Bases ↗</span>
            </a>
            <span className="text-slate-600">•</span>
            <a
              href={EVENT.documents.reglamento}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-[#b8da02] transition-colors"
            >
              <ScaleIcon className="h-3.5 w-3.5 text-white" />
              <span>Reglamento ↗</span>
            </a>
          </div>
        </div>
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

