import {
  CONTRIBUTION_AREAS,
  MAX_SKILLS_LENGTH,
  INNOVATHON_CHALLENGES,
} from '../../../domain/entities/registrationCatalog';
import {
  CodeIcon,
  GearIcon,
  MapPinIcon,
  UsersIcon,
  PlusIcon,
  CheckIcon,
  Step2SingleWave,
  CompassIcon,
  ExternalLinkIcon,
} from './RegistrationIcons';

const ICON_MAP = {
  software: CodeIcon,
  hardware: GearIcon,
  local_knowledge: MapPinIcon,
  management: UsersIcon,
  other: PlusIcon,
};

export function Step2SkillsTeam({
  values,
  errors,
  onChange,
  onBlur,
  onToggleContributionArea,
  onNext,
  onPrev,
}) {
  const currentSkillsLength = values.skills ? values.skills.length : 0;
  const selectedAreas = values.contributionAreas || [];

  return (
    <div className="space-y-6">
      {/* Section Header matching Figma Paso 2 */}
      <div className="space-y-1 sm:space-y-1.5 pb-1">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Step2SingleWave className="h-3.5 w-7 text-[#741cf3] shrink-0" />
          <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
            Paso 2: <span className="text-[#b0cf03]">Habilidades y Equipo</span>
          </h2>
        </div>
        <p className="pl-8 sm:pl-10 text-xs sm:text-sm text-[#8795b8]">
          Cuéntanos qué te hace único/a y cómo quieres aportar al equipo.
        </p>
      </div>

      {/* Two Column Layout: Habilidades y Áreas de Aporte */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
        {/* Left Column: Habilidades principales */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-skills" className="text-sm font-semibold text-white">
            Habilidades principales <span className="text-purple-400">*</span>
          </label>
          <p className="text-xs text-[#8795b8] leading-relaxed">
            Describe brevemente tus habilidades, conocimientos o experiencias que consideres relevantes.
          </p>

          <div className="relative mt-2">
            <textarea
              id="field-skills"
              name="skills"
              maxLength={MAX_SKILLS_LENGTH}
              placeholder="Ej. Programación en Python, diseño UI/UX, marketing digital, trabajo en equipo, etc..."
              value={values.skills}
              onChange={onChange}
              onBlur={onBlur}
              className={`w-full min-h-[160px] sm:min-h-[220px] lg:min-h-[340px] resize-none rounded-xl border bg-[#0d1633]/70 p-4 pb-8 text-base sm:text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                errors.skills
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-[#1b254b] focus:border-[#b8da02] focus:ring-[#b8da02]/20'
              }`}
            />
            <div className="pointer-events-none absolute bottom-3 right-4">
              <span
                className={`text-xs font-medium ${
                  currentSkillsLength >= MAX_SKILLS_LENGTH ? 'text-[#b8da02]' : 'text-[#7684a8]'
                }`}
              >
                {currentSkillsLength}/{MAX_SKILLS_LENGTH}
              </span>
            </div>
          </div>

          {errors.skills && (
            <p id="error-skills" role="alert" className="text-xs font-semibold text-rose-400">
              {errors.skills}
            </p>
          )}
        </div>

        {/* Right Column: Área de aporte */}
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold text-white">
            Área de aporte <span className="text-purple-400">*</span>
          </p>
          <p className="text-xs text-[#8795b8] leading-relaxed">
            Selecciona el área en la que consideras que puedes aportar más al equipo.
          </p>

          <div className="mt-2 space-y-2">
            {CONTRIBUTION_AREAS.map((area) => {
              const isSelected = selectedAreas.includes(area.title);
              const AreaIcon = ICON_MAP[area.icon] || null;

              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => onToggleContributionArea(area.title)}
                  className={`group flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#cbfb45]/40 bg-[#0d1633]/90 text-white'
                      : 'border-[#1b254b] bg-[#0d1633]/70 text-[#cbd5e1] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-all ${
                        isSelected
                          ? 'border-[#cbfb45] bg-[#cbfb45] text-black'
                          : 'border-[#2a3765] bg-[#0b132c]'
                      }`}
                    >
                      {isSelected && <CheckIcon className="h-3 w-3 text-black stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium">
                      {area.title}
                    </span>
                  </div>

                  {AreaIcon && (
                    <div className="text-[#8795b8] group-hover:text-slate-300">
                      <AreaIcon className="h-4 w-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {errors.contributionAreas && (
            <p id="error-contributionAreas" role="alert" className="text-xs font-semibold text-rose-400">
              {errors.contributionAreas}
            </p>
          )}
        </div>
      </div>

      {/* Secondary Fields: Reto, Enlace profesional y Referencia */}
      <div className="space-y-4 pt-2">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Eje temático o Reto de mayor interés */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="field-challengeInterest" className="text-xs font-semibold text-slate-300">
              Eje temático / Reto de mayor interés <span className="text-purple-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <CompassIcon className="h-5 w-5 text-slate-500" />
              </div>
              <select
                id="field-challengeInterest"
                name="challengeInterest"
                value={values.challengeInterest || ''}
                onChange={onChange}
                onBlur={onBlur}
                className={`w-full appearance-none rounded-xl border bg-[#0d1633]/70 py-3 pl-11 pr-10 text-sm text-white outline-none transition focus:ring-2 ${
                  errors.challengeInterest
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-800 focus:border-[#b8da02] focus:ring-[#b8da02]/20'
                }`}
              >
                <option value="" className="bg-[#0b132b] text-slate-400">
                  Selecciona tu reto de interés
                </option>
                {INNOVATHON_CHALLENGES.map((challenge) => (
                  <option key={challenge} value={challenge} className="bg-[#0b132b] text-white">
                    {challenge}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.challengeInterest && (
              <p id="error-challengeInterest" role="alert" className="text-xs font-semibold text-rose-400">
                {errors.challengeInterest}
              </p>
            )}
          </div>

          {/* Enlace a LinkedIn / Portafolio / GitHub */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="field-portfolioUrl" className="text-xs font-semibold text-slate-300">
              LinkedIn / Portafolio / GitHub <span className="text-xs font-normal text-slate-400">(opcional)</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <ExternalLinkIcon className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="field-portfolioUrl"
                name="portfolioUrl"
                type="text"
                placeholder="https://linkedin.com/in/... o github.com/..."
                value={values.portfolioUrl || ''}
                onChange={onChange}
                onBlur={onBlur}
                className="w-full rounded-xl border border-slate-800 bg-[#0d1633]/70 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#b8da02] focus:ring-2 focus:ring-[#b8da02]/20"
              />
            </div>
          </div>
        </div>

        {/* Compañero de equipo */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-referencePerson" className="text-xs font-semibold text-slate-300">
            Compañero de equipo <span className="text-xs font-normal text-slate-400">(opcional)</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <UsersIcon className="h-5 w-5 text-slate-500" />
            </div>
            <input
              id="field-referencePerson"
              name="referencePerson"
              type="text"
              placeholder="Nombres y apellidos de tu compañero"
              value={values.referencePerson || ''}
              onChange={onChange}
              onBlur={onBlur}
              className="w-full rounded-xl border border-slate-800 bg-[#0d1633]/70 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#b8da02] focus:ring-2 focus:ring-[#b8da02]/20"
            />
          </div>
        </div>
      </div>

      {/* Form Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2b3765] bg-[#0c132c] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[#94a3b8] transition-all hover:border-slate-500 hover:text-white active:scale-95 cursor-pointer"
        >
          <span>← Atrás</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#cbfb45] px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-black shadow-md shadow-[#cbfb45]/20 transition-all hover:bg-[#b8da02] active:scale-95 cursor-pointer"
        >
          <span>Siguiente →</span>
        </button>
      </div>
    </div>
  );
}
