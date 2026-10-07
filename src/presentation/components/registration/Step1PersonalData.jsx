import {
  SEDES,
  CAREER_CATEGORIES,
  INSTITUCIONES,
  ACADEMIC_LEVELS,
} from '../../../domain/entities/registrationCatalog';
import {
  UserIcon,
  IdCardIcon,
  MailIcon,
  MapPinIcon,
  GraduationCapIcon,
  BuildingLibraryIcon,
  AcademicBadgeIcon,
  InfoIcon,
  ArrowRightIcon,
  StepDoubleWave,
  DotMatrix,
} from './RegistrationIcons';

export function Step1PersonalData({ values, errors, onChange, onBlur, onNext }) {
  const handleFullNameChange = (e) => {
    // Permite solo letras del alfabeto español, espacios, tildes, diéresis, apóstrofes y guiones
    const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '');
    onChange({ target: { name: 'fullName', value: val } });
  };

  const handleDniChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    onChange({ target: { name: 'dni', value: val } });
  };

  return (
    <div className="space-y-6">
      {/* Section Header matching Figma Paso 1 */}
      <div className="flex items-start justify-between pb-1">
        <div className="space-y-1 sm:space-y-1.5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <StepDoubleWave className="h-4 w-6 text-[#6d48e5] shrink-0" />
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
              Paso 1: <span className="text-[#b0cf03]">Datos personales</span>
            </h2>
          </div>
          <p className="pl-8 sm:pl-9 text-xs sm:text-sm text-[#8795b8]">
            Cuéntanos un poco sobre ti para continuar con tu inscripción.
          </p>
        </div>

        {/* 3x3 Dot Grid Matrix */}
        <div className="pt-1.5 shrink-0 hidden sm:block">
          <DotMatrix className="text-[#6d48e5] opacity-80" dotRadius={3} gap={6} rows={3} cols={3} />
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Nombres y Apellidos */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-fullName" className="text-xs font-semibold text-slate-300">
            Nombres y apellidos <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <UserIcon className="h-5 w-5 text-slate-500" />
            </div>
            <input
              id="field-fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Ej. Ana García Pérez"
              value={values.fullName}
              onChange={handleFullNameChange}
              onBlur={onBlur}
              className={`w-full rounded-xl border bg-[#0d1633]/70 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                errors.fullName
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-[#b8da02] focus:ring-[#b8da02]/20'
              }`}
            />
          </div>
          {errors.fullName && (
            <p id="error-fullName" role="alert" className="text-xs font-semibold text-rose-400">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* DNI */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-dni" className="text-xs font-semibold text-slate-300">
            DNI <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <IdCardIcon className="h-5 w-5 text-slate-500" />
            </div>
            <input
              id="field-dni"
              name="dni"
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="Ingresa tu número de DNI"
              value={values.dni}
              onChange={handleDniChange}
              onBlur={onBlur}
              className={`w-full rounded-xl border bg-[#0d1633]/70 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                errors.dni
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-[#b8da02] focus:ring-[#b8da02]/20'
              }`}
            />
          </div>
          {errors.dni && (
            <p id="error-dni" role="alert" className="text-xs font-semibold text-rose-400">
              {errors.dni}
            </p>
          )}
        </div>

        {/* Correo personal */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-personalEmail" className="text-xs font-semibold text-slate-300">
            Correo personal <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <MailIcon className="h-5 w-5 text-slate-500" />
            </div>
            <input
              id="field-personalEmail"
              name="personalEmail"
              type="email"
              autoComplete="email"
              placeholder="ejemplo@gmail.com"
              value={values.personalEmail}
              onChange={onChange}
              onBlur={onBlur}
              className={`w-full rounded-xl border bg-[#0d1633]/70 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                errors.personalEmail
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-[#b8da02] focus:ring-[#b8da02]/20'
              }`}
            />
          </div>
          {errors.personalEmail && (
            <p id="error-personalEmail" role="alert" className="text-xs font-semibold text-rose-400">
              {errors.personalEmail}
            </p>
          )}
        </div>

        {/* Correo institucional (opcional) */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-institutionalEmail" className="text-xs font-semibold text-slate-300">
            Correo institucional <span className="text-xs font-normal text-slate-400">(opcional)</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <MailIcon className="h-5 w-5 text-slate-500" />
            </div>
            <input
              id="field-institutionalEmail"
              name="institutionalEmail"
              type="email"
              autoComplete="email"
              placeholder="ejemplo@unsa.edu.pe"
              value={values.institutionalEmail}
              onChange={onChange}
              onBlur={onBlur}
              className={`w-full rounded-xl border bg-[#0d1633]/70 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                errors.institutionalEmail
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-[#b8da02] focus:ring-[#b8da02]/20'
              }`}
            />
          </div>
          {errors.institutionalEmail && (
            <p id="error-institutionalEmail" role="alert" className="text-xs font-semibold text-rose-400">
              {errors.institutionalEmail}
            </p>
          )}
        </div>

        {/* Sede */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-sede" className="text-xs font-semibold text-slate-300">
            Sede <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <MapPinIcon className="h-5 w-5 text-slate-500" />
            </div>
            <select
              id="field-sede"
              name="sede"
              value={values.sede}
              onChange={onChange}
              onBlur={onBlur}
              className={`w-full appearance-none rounded-xl border bg-[#0d1633]/70 py-3 pl-11 pr-10 text-sm text-white outline-none transition focus:ring-2 ${
                errors.sede
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-[#b8da02] focus:ring-[#b8da02]/20'
              }`}
            >
              <option value="" className="bg-[#0b132b] text-slate-400">
                Selecciona tu sede
              </option>
              {SEDES.map((sede) => (
                <option key={sede} value={sede} className="bg-[#0b132b] text-white">
                  {sede}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.sede && (
            <p id="error-sede" role="alert" className="text-xs font-semibold text-rose-400">
              {errors.sede}
            </p>
          )}

          {/* Conditional input for Otra localidad */}
          {values.sede === 'Otra localidad' && (
            <div className="flex flex-col gap-1 pt-1">
              <input
                id="field-otherSede"
                name="otherSede"
                type="text"
                placeholder="Escribe tu localidad de residencia"
                value={values.otherSede || ''}
                onChange={onChange}
                onBlur={onBlur}
                className={`w-full rounded-xl border bg-[#0d1633]/70 py-2.5 px-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                  errors.otherSede
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-800 focus:border-[#b8da02] focus:ring-[#b8da02]/20'
                }`}
              />
              {errors.otherSede && (
                <p id="error-otherSede" role="alert" className="text-xs font-semibold text-rose-400">
                  {errors.otherSede}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Carrera */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-career" className="text-xs font-semibold text-slate-300">
            Carrera <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <GraduationCapIcon className="h-5 w-5 text-slate-500" />
            </div>
            <select
              id="field-career"
              name="career"
              value={values.career}
              onChange={onChange}
              onBlur={onBlur}
              className={`w-full appearance-none rounded-xl border bg-[#0d1633]/70 py-3 pl-11 pr-10 text-sm text-white outline-none transition focus:ring-2 ${
                errors.career
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-[#b8da02] focus:ring-[#b8da02]/20'
              }`}
            >
              <option value="" className="bg-[#0b132b] text-slate-400">
                Selecciona tu carrera
              </option>
              {CAREER_CATEGORIES.map((career) => (
                <option key={career} value={career} className="bg-[#0b132b] text-white">
                  {career}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.career && (
            <p id="error-career" role="alert" className="text-xs font-semibold text-rose-400">
              {errors.career}
            </p>
          )}

          {/* Conditional input for Otra carrera */}
          {values.career === 'Otra carrera o especialidad' && (
            <div className="flex flex-col gap-1 pt-1">
              <input
                id="field-otherCareer"
                name="otherCareer"
                type="text"
                placeholder="Escribe tu carrera o especialidad"
                value={values.otherCareer || ''}
                onChange={onChange}
                onBlur={onBlur}
                className={`w-full rounded-xl border bg-[#0d1633]/70 py-2.5 px-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                  errors.otherCareer
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-800 focus:border-[#b8da02] focus:ring-[#b8da02]/20'
                }`}
              />
              {errors.otherCareer && (
                <p id="error-otherCareer" role="alert" className="text-xs font-semibold text-rose-400">
                  {errors.otherCareer}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Institución de procedencia */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-institution" className="text-xs font-semibold text-slate-300">
            Institución de procedencia <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <BuildingLibraryIcon className="h-5 w-5 text-slate-500" />
            </div>
            <select
              id="field-institution"
              name="institution"
              value={values.institution || ''}
              onChange={onChange}
              onBlur={onBlur}
              className={`w-full appearance-none rounded-xl border bg-[#0d1633]/70 py-3 pl-11 pr-10 text-sm text-white outline-none transition focus:ring-2 ${
                errors.institution
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-[#b8da02] focus:ring-[#b8da02]/20'
              }`}
            >
              <option value="" className="bg-[#0b132b] text-slate-400">
                Selecciona tu institución
              </option>
              {INSTITUCIONES.map((inst) => (
                <option key={inst} value={inst} className="bg-[#0b132b] text-white">
                  {inst}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.institution && (
            <p id="error-institution" role="alert" className="text-xs font-semibold text-rose-400">
              {errors.institution}
            </p>
          )}

          {/* Conditional input for Otra institución */}
          {values.institution === 'Otra institución de educación superior' && (
            <div className="flex flex-col gap-1 pt-1">
              <input
                id="field-otherInstitution"
                name="otherInstitution"
                type="text"
                placeholder="Escribe el nombre de tu institución"
                value={values.otherInstitution || ''}
                onChange={onChange}
                onBlur={onBlur}
                className={`w-full rounded-xl border bg-[#0d1633]/70 py-2.5 px-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:ring-2 ${
                  errors.otherInstitution
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-800 focus:border-[#b8da02] focus:ring-[#b8da02]/20'
                }`}
              />
              {errors.otherInstitution && (
                <p id="error-otherInstitution" role="alert" className="text-xs font-semibold text-rose-400">
                  {errors.otherInstitution}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Nivel académico */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="field-academicLevel" className="text-xs font-semibold text-slate-300">
            Nivel académico <span className="text-purple-400">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <AcademicBadgeIcon className="h-5 w-5 text-slate-500" />
            </div>
            <select
              id="field-academicLevel"
              name="academicLevel"
              value={values.academicLevel || ''}
              onChange={onChange}
              onBlur={onBlur}
              className={`w-full appearance-none rounded-xl border bg-[#0d1633]/70 py-3 pl-11 pr-10 text-sm text-white outline-none transition focus:ring-2 ${
                errors.academicLevel
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-800 focus:border-[#b8da02] focus:ring-[#b8da02]/20'
              }`}
            >
              <option value="" className="bg-[#0b132b] text-slate-400">
                Selecciona tu nivel académico
              </option>
              {ACADEMIC_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl} className="bg-[#0b132b] text-white">
                  {lvl}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.academicLevel && (
            <p id="error-academicLevel" role="alert" className="text-xs font-semibold text-rose-400">
              {errors.academicLevel}
            </p>
          )}
        </div>
      </div>

      {/* Info Callout */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#0d1633]/50 p-4">
        <InfoIcon className="h-5 w-5 shrink-0 text-[#8A64FF]" />
        <p className="text-xs leading-relaxed text-slate-400">
          La inscripción no garantiza tu participación. Te contactaremos en los próximos días con más información.
        </p>
      </div>

      {/* Action button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#b8da02] px-8 py-3 text-sm font-bold text-[#050814] shadow-md shadow-[#b8da02]/20 transition-all hover:bg-[#a6c502] hover:shadow-[#b8da02]/30 active:scale-95 cursor-pointer"
        >
          <span>Siguiente</span>
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
