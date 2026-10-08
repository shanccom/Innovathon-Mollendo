import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { useSeo } from '../hooks/useSeo';
import { RegistrationNavbar } from '../components/registration/RegistrationNavbar';
import { RegistrationForm } from '../components/registration/RegistrationForm';
import {
  SingleWave,
  CornerBracket,
  AsideBottomRightMotif,
  Step2LeftWaves,
  Step2RightMotif,
  Step3DotsMatrix,
  Step3RightWaves,
} from '../components/registration/RegistrationIcons';

export default function RegistrationPage() {
  const form = useRegistrationForm();
  const isStep1 = form.step === 1;
  const isStep3 = form.step === 3;

  useSeo({
    title: 'Inscripción Individual | Innovathon Mollendo 2026',
    description: 'Postula a la Innovathon Mollendo 2026. Sé parte de esta experiencia y construyamos juntos soluciones para Mollendo e Islay.',
  });

  return (
    <div className="registration-scope relative min-h-screen overflow-x-clip bg-[#070a18] text-white flex flex-col justify-between selection:bg-[#b8da02] selection:text-[#050814]">
      {/* ----------------- GEOMETRIC BACKGROUND GRAPHICS (ADAPTIVE BY STEP) ----------------- */}
      {isStep1 ? (
        <>
          {/* Top-left: Círculo normal (visible solo en desktop para no tapar el texto en móvil) */}
          <div
            className="pointer-events-none absolute -left-14 sm:-left-16 top-14 sm:top-16 h-44 w-44 sm:h-48 sm:w-48 rounded-full bg-[#CBFB45] hidden lg:block"
            aria-hidden="true"
          />

          {/* Top-left: Círculo transparente por encima y un poco más abajo */}
          <div
            className="pointer-events-none absolute -left-14 sm:-left-16 top-28 sm:top-32 h-44 w-44 sm:h-48 sm:w-48 rounded-full bg-[#CBFB45]/80 blur-[24px] hidden lg:block"
            aria-hidden="true"
          />

          {/* Bottom-left Overlapping Circles */}
          <div
            className="pointer-events-none absolute -left-14 sm:-left-16 bottom-9 sm:bottom-11 h-44 w-44 sm:h-48 sm:w-48 rounded-full bg-[#652ce6] hidden sm:block"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-14 sm:-left-16 -bottom-1 h-44 w-44 sm:h-48 sm:w-48 rounded-full bg-[#CBFB45]/80 backdrop-blur-[0.5px] hidden sm:block"
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          {/* Ambient Radial Glow at Left (Spring Green / Mint to Cyan) - Elevated in Step 3 */}
          <div
            className={`pointer-events-none absolute h-[550px] w-[550px] rounded-full transition-all duration-500 ${
              isStep3
                ? '-left-[140px] top-[360px] sm:top-[400px]'
                : '-left-[150px] top-[480px] sm:top-[560px]'
            }`}
            style={{
              background:
                'radial-gradient(389px 389px at 50% 50%, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.20) 35%, rgba(6, 182, 212, 0) 70%)',
            }}
            aria-hidden="true"
          />

          {/* Ambient Radial Glow at Right (Violet to Azure) - Shifted down in Step 3 */}
          <div
            className={`pointer-events-none absolute h-[500px] w-[500px] rounded-full transition-all duration-500 ${
              isStep3
                ? '-right-[80px] top-[160px] sm:top-[180px]'
                : '-right-[80px] -top-[40px]'
            }`}
            style={{
              background:
                'radial-gradient(354px 354px at 50% 50%, rgba(124, 58, 237, 0.12) 0%, rgba(59, 130, 246, 0.08) 40%, rgba(59, 130, 246, 0) 70%)',
            }}
            aria-hidden="true"
          />

          {/* Center Behind-Card Glow (Deep Azure) */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[850px]"
            style={{
              background:
                'radial-gradient(520px 520px at 50% 50%, rgba(30, 58, 138, 0.18) 0%, rgba(30, 58, 138, 0) 70%)',
            }}
            aria-hidden="true"
          />

          {/* Decorative: Left Triple Waves */}
          <div className="pointer-events-none absolute left-4 sm:left-6 lg:left-8 top-[240px] sm:top-[280px] z-10 hidden sm:block">
            <Step2LeftWaves allPurple={isStep3} className="w-16 h-12" />
          </div>

          {/* Decorative: Right-Side Elements */}
          {isStep3 ? (
            <>
              {/* Step 3: 12 Dots Matrix (Higher up) */}
              <div className="pointer-events-none absolute right-4 sm:right-6 lg:right-10 top-[520px] sm:top-[560px] z-10 hidden sm:block">
                <Step3DotsMatrix />
              </div>
              {/* Step 3: Triple Wave (Bottom-Right) */}
              <div className="pointer-events-none absolute right-4 sm:right-6 lg:right-10 bottom-12 sm:bottom-16 z-10 hidden sm:block">
                <Step3RightWaves className="w-16 h-10" />
              </div>
            </>
          ) : (
            /* Step 2: Combined 15 Dots + Triple Wave */
            <div className="pointer-events-none absolute right-4 sm:right-6 lg:right-10 bottom-12 sm:bottom-16 z-10 hidden sm:block">
              <Step2RightMotif className="w-20" />
            </div>
          )}
        </>
      )}

      {/* ----------------- DEDICATED REGISTRATION NAVBAR ----------------- */}
      <RegistrationNavbar />

      {/* ----------------- MAIN CONTENT (ADAPTIVE CANVAS) ----------------- */}
      {isStep1 ? (
        /* Step 1: Two-column layout (Left: Headline & Slogan, Right: Registration card) */
        <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-16 relative z-10 my-auto py-4 lg:py-6">
          <div className="grid gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Headline, Description and Slogan */}
            <section className="lg:col-span-4 lg:pt-36 space-y-4 sm:space-y-6">
              <header className="space-y-2 sm:space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-[-1px] text-white leading-tight lg:leading-[48px]">
                  Inscripción <br className="hidden sm:inline" />
                  <span className="text-[#741cf3]">Indi</span>
                  <span className="text-[#b0cf03]">vidual</span>
                </h1>
                <p className="text-xs sm:text-[14px] leading-relaxed sm:leading-[23px] text-[#9aa7ca] max-w-[384px]">
                  Sé parte de esta experiencia y construyamos juntos<br className="hidden sm:inline" /> soluciones para Mollendo e Islay.
                </p>
              </header>

              {/* Decorative double wavy line */}
              <div className="pt-1 sm:pt-2">
                <svg className="h-4 w-10 sm:h-5 sm:w-12 text-[#4d5598]" viewBox="0 0 48 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M2 5c5-4 10-4 15 0s10 4 15 0 10-4 14 0" />
                  <path d="M2 14c5-4 10-4 15 0s10 4 15 0 10-4 14 0" />
                </svg>
              </div>

              {/* Inspirational Slogan Badge: Centrado en móviles, a la izquierda en desktop */}
              <div className="pt-2 sm:pt-4 lg:pt-8 flex justify-center sm:justify-start">
                <div className="flex flex-col items-center sm:items-start gap-1 pl-0.5">
                  <CornerBracket className="h-[16px] w-[30px] sm:h-[18px] sm:w-[34px] text-[#741cf3]" />
                  <div className="text-[11px] sm:text-[12px] font-black tracking-[3px] text-white leading-[18px] sm:leading-[20px] text-center sm:text-left">
                    <p>IDEAS QUE</p>
                    <p className="text-[#cbfb45]">TRANSFORMAN</p>
                    <p>
                      EL FUTURO<span className="text-[#741cf3]">.</span>
                    </p>
                  </div>
                  <div className="pt-1.5">
                    <SingleWave className="h-[8px] w-[32px] sm:h-[10px] sm:w-[40px] text-[#b0cf03]" />
                  </div>
                </div>
              </div>

              {/* Bottom decorative double wave (only on desktop) */}
              <div className="hidden lg:flex max-w-[384px] justify-end pt-8 lg:pt-14 pr-1">
                <svg className="h-5 w-12 text-[#222a57]" viewBox="0 0 48 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M2 5c5-4 10-4 15 0s10 4 15 0 10-4 14 0" />
                  <path d="M2 14c5-4 10-4 15 0s10 4 15 0 10-4 14 0" />
                </svg>
              </div>
            </section>

            {/* Right Column: Multi-Step Card with Top-Right Purple Sphere */}
            <section className="relative lg:col-span-8">
              {/* Top-Right Glowing Orb */}
              <div
                className="pointer-events-none absolute -right-[124px] -top-[192px] h-[320px] w-[320px] rounded-full opacity-60 blur-[40px]"
                style={{
                  background: 'linear-gradient(135deg, #6d48e5 0%, #34d399 100%)',
                }}
                aria-hidden="true"
              />

              {/* Defined Purple Circle */}
              <div
                className="pointer-events-none absolute -right-[36px] -top-[64px] h-[208px] w-[208px] rounded-full opacity-80 hidden sm:block"
                style={{
                  background: 'linear-gradient(45deg, #6d48e5 0%, #312e81 100%)',
                }}
                aria-hidden="true"
              />

              <div className="relative z-10">
                <RegistrationForm form={form} />
              </div>
            </section>
          </div>
        </main>
      ) : (
        /* Step 2 & 3: Expanded Centered Layout (1080px wide container from Figma) */
        <main className="mx-auto w-full max-w-[1080px] px-3 sm:px-6 relative z-10 my-auto py-4 lg:py-6">
          <RegistrationForm form={form} />
        </main>
      )}

      {/* Step 1 Page-level Decorative Bottom-Right Motif (solo en desktop para no tapar el footer) */}
      {isStep1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 sm:bottom-12 z-0 mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-16 hidden lg:flex justify-end">
          <AsideBottomRightMotif className="h-12 w-24" />
        </div>
      )}

      {/* ----------------- MINIMAL DEDICATED FIGMA FOOTER ----------------- */}
      <footer className="relative z-10 w-full bg-transparent pt-8 pb-12 sm:pb-8 sm:pt-6 mt-auto">
        <div className="flex items-center justify-center gap-3 px-4 text-center">
          <SingleWave className="h-2.5 w-7 text-[#818cf8] shrink-0" />
          <p className="font-body text-xs font-semibold uppercase tracking-[3px] text-[#94a3b8]">
            INNOVATHON MOLLENDO <span className="text-[#818cf8]">2026</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
