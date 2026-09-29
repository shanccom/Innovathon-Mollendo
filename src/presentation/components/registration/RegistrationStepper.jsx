import { CheckIcon } from './RegistrationIcons';

const STEPS = [
  { id: 1, label: 'Datos personales' },
  { id: 2, label: 'Habilidades y Equipo' },
  { id: 3, label: 'Confirmación' },
];

export function RegistrationStepper({ currentStep, onStepClick }) {
  const isStep1 = currentStep === 1;

  return (
    <div
      className={`relative w-full ${
        isStep1 ? 'border-b border-[#172044] pb-6 sm:pb-8' : 'pb-6 sm:pb-8'
      }`}
    >
      {/* Right indicator text */}
      <div className="absolute right-0 top-0 sm:top-1 text-right">
        <span className="text-xs font-normal text-[#7684a8]">
          Paso {currentStep} de 3
        </span>
      </div>

      {/* Step items track */}
      <div
        className={`flex items-start ${
          isStep1 ? 'max-w-xl' : 'mx-auto max-w-[720px] px-2 sm:px-6'
        }`}
      >
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isClickable = onStepClick && (isCompleted || step.id <= currentStep);
          const alignClass = isStep1 && idx === 0 ? 'items-start' : 'items-center text-center';

          return (
            <div key={step.id} className="flex flex-1 items-start last:flex-none">
              {/* Step Circle + Label */}
              <div className={`flex flex-col ${alignClass}`}>
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(step.id)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold transition-all ${
                    isActive
                      ? 'bg-[#cbfb45] text-black shadow-[0_10px_15px_-3px_rgba(203,251,69,0.3)]'
                      : isCompleted
                        ? 'bg-[#741cf3] text-white shadow-[0_0_12px_rgba(116,28,243,0.35)] hover:scale-105 cursor-pointer'
                        : 'border border-[#2b3765] bg-[#0c132c] text-[#6b7ba3]'
                  }`}
                >
                  {isCompleted ? <CheckIcon className="h-4 w-4 text-white stroke-[2.5]" /> : step.id}
                </button>

                <span
                  className={`mt-2 text-[12px] whitespace-nowrap transition-colors ${
                    isActive ? 'font-medium text-white' : 'font-normal text-[#7684a8]'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {idx < STEPS.length - 1 && (
                <div className="mx-2 sm:mx-4 mt-4 h-[2px] flex-1 overflow-hidden bg-[#1e2a54]">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: isCompleted ? '100%' : isActive ? '35%' : '0%',
                      background: isCompleted
                        ? 'linear-gradient(90deg, #741cf3 0%, #cbfb45 100%)'
                        : 'rgba(203, 251, 69, 0.4)',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
