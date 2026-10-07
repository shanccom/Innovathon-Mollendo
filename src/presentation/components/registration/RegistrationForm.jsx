import { RegistrationStepper } from './RegistrationStepper';
import { Step1PersonalData } from './Step1PersonalData';
import { Step2SkillsTeam } from './Step2SkillsTeam';
import { Step3Terms } from './Step3Terms';
import { RegistrationSuccess } from './RegistrationSuccess';

export function RegistrationForm({ form }) {
  const {
    step,
    values,
    errors,
    status,
    message,
    receipt,
    nextStep,
    prevStep,
    goToStep,
    handleChange,
    handleBlur,
    handleToggleContributionArea,
    handleSubmit,
    reset,
  } = form;

  if (status === 'success' && receipt) {
    return (
      <div className="w-full rounded-2xl sm:rounded-[28px] border border-[#1b254b]/80 bg-[#0a0f26]/75 p-4 sm:p-7 md:p-10 shadow-2xl backdrop-blur-xl">
        <RegistrationSuccess receipt={receipt} onReset={reset} />
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl sm:rounded-[28px] border border-[#1b254b]/80 bg-[#0a0f26]/75 p-4 sm:p-7 md:p-10 shadow-2xl backdrop-blur-xl">
      {/* Stepper Header */}
      <RegistrationStepper currentStep={step} onStepClick={goToStep} />

      {/* Duplicate / Already Registered Banner */}
      {status === 'duplicate' && (
        <div className="mt-6 rounded-2xl border border-[#03c4c5]/50 bg-[#03c4c5]/10 p-4 sm:p-5 text-sm text-slate-200 shadow-xl backdrop-blur-md">
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#03c4c5]/20 text-[#03c4c5] border border-[#03c4c5]/40 mt-0.5">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm sm:text-base">
                ¡Tu postulación ya se encuentra registrada!
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {message ||
                  'Este correo o DNI ya ha sido inscrito previamente para la Innovathon Mollendo 2026. Tu postulación fue recibida y se encuentra en proceso de revisión por el equipo organizador.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {status === 'error' && message && (
        <div className="mt-6 rounded-2xl border border-rose-500/40 bg-rose-950/30 p-4 text-xs font-semibold text-rose-300">
          {message}
        </div>
      )}

      {/* Wizard Steps */}
      <div className="mt-7">
        {step === 1 && (
          <Step1PersonalData
            values={values}
            errors={errors}
            onChange={handleChange}
            onBlur={handleBlur}
            onNext={nextStep}
          />
        )}

        {step === 2 && (
          <Step2SkillsTeam
            values={values}
            errors={errors}
            onChange={handleChange}
            onBlur={handleBlur}
            onToggleContributionArea={handleToggleContributionArea}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}

        {step === 3 && (
          <Step3Terms
            values={values}
            errors={errors}
            isSubmitting={status === 'submitting'}
            onChange={handleChange}
            onPrev={prevStep}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
