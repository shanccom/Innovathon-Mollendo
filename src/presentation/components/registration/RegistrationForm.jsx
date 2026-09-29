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

      {/* Global Error Banner */}
      {message && (
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
