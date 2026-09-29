import { Link } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/routes';
import { useSeo } from '../hooks/useSeo';
import { RegistrationNavbar } from '../components/registration/RegistrationNavbar';
import {
  SingleWave,
  CornerBracket,
  AsideBottomRightMotif,
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
} from '../components/registration/RegistrationIcons';

export default function HomePage() {
  useSeo({
    title: 'Muy Pronto | Innovathon Mollendo 2026',
    description:
      'Las ideas también tienen marea. Muy pronto la hackathon y experiencia de innovación más grande del litoral sur en Mollendo e Islay. 17 y 18 de Diciembre 2026.',
  });

  return (
    <div className="registration-scope relative min-h-screen overflow-x-hidden bg-[#070a18] text-white flex flex-col justify-between selection:bg-[#b8da02] selection:text-[#050814]">
      {/* ----------------- GEOMETRIC BACKGROUND GRAPHICS ----------------- */}
      {/* Top-left: Flat Lime Circle (visible en desktop para no tapar texto en móvil) */}
      <div
        className="pointer-events-none absolute -left-14 sm:-left-16 top-14 sm:top-16 h-44 w-44 sm:h-48 sm:w-48 rounded-full bg-[#CBFB45] hidden lg:block"
        aria-hidden="true"
      />

      {/* Top-left: Blurred Lime Glow */}
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

      {/* Ambient Top-Right Radial Glow */}
      <div
        className="pointer-events-none absolute -right-[124px] -top-[192px] h-[360px] sm:h-[480px] w-[360px] sm:w-[480px] rounded-full opacity-60 blur-[60px]"
        style={{
          background: 'linear-gradient(135deg, #6d48e5 0%, #06b6d4 100%)',
        }}
        aria-hidden="true"
      />

      {/* Center Ambient Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] sm:h-[600px] w-[90vw] sm:w-[850px]"
        style={{
          background:
            'radial-gradient(520px 520px at 50% 50%, rgba(30, 58, 138, 0.22) 0%, rgba(30, 58, 138, 0) 70%)',
        }}
        aria-hidden="true"
      />

      {/* ----------------- NAVBAR ----------------- */}
      <RegistrationNavbar />

      {/* ----------------- MAIN HERO & DATE ----------------- */}
      <main className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-16 relative z-10 my-auto py-6 sm:py-10 lg:py-16">
        <div className="grid gap-10 sm:gap-12 lg:gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Concept, Headline & Narrative */}
          <section className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6">
            {/* Launch Status Pill */}
            <div className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full border border-purple-500/40 bg-[#161a38]/80 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold text-[#cbfb45] shadow-inner backdrop-blur-md mx-auto lg:mx-0">
              <span className="h-2 w-2 rounded-full bg-[#b8da02] animate-pulse" />
              <span className="tracking-wide">EDICIÓN 2026 · LANZAMIENTO OFICIAL</span>
            </div>

            {/* Headline */}
            <header className="space-y-2.5 sm:space-y-4 max-w-[540px] mx-auto lg:mx-0">
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-[-1px] sm:tracking-[-1.5px] text-white leading-[1.1] lg:leading-[1.08]">
                Muy <span className="text-[#741cf3]">pro</span>
                <span className="text-[#b0cf03]">nto</span>
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-200 block mt-2">
                  Las ideas también tienen marea.
                </span>
              </h1>
              <p className="text-sm sm:text-base leading-relaxed text-[#9aa7ca] max-w-[500px] mx-auto lg:mx-0">
                Estamos preparando la experiencia de innovación y tecnología más grande frente al mar.
                48 horas intensivas de co-creación, prototipado y soluciones sostenibles para Mollendo, Islay y la región sur.
              </p>
            </header>

            {/* Decorative double wavy line */}
            <div className="pt-0.5 flex justify-center lg:justify-start">
              <svg
                className="h-4 w-10 sm:h-5 sm:w-12 text-[#4d5598]"
                viewBox="0 0 48 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M2 5c5-4 10-4 15 0s10 4 15 0 10-4 14 0" />
                <path d="M2 14c5-4 10-4 15 0s10 4 15 0 10-4 14 0" />
              </svg>
            </div>

            {/* Inspirational Slogan Badge (Identity DNA): En móvil actúa como sello de cierre armónico, en desktop a la izquierda */}
            <div className="pt-2 sm:pt-4 flex justify-center lg:justify-start order-last lg:order-none mt-2 lg:mt-0">
              <div className="flex flex-col items-center lg:items-start gap-1 pl-0.5">
                <CornerBracket className="h-[16px] w-[30px] sm:h-[18px] sm:w-[34px] text-[#741cf3]" />
                <div className="text-[11px] sm:text-[12px] font-black tracking-[3px] text-white leading-[18px] sm:leading-[20px] text-center lg:text-left">
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
          </section>

          {/* Right Column: Solo la fecha grande y limpia */}
          <section className="relative lg:col-span-6 flex flex-col items-center lg:items-start justify-center space-y-4 sm:space-y-6 lg:pl-6 text-center lg:text-left">
            {/* Defined Purple Ambient Circle behind date */}
            <div
              className="pointer-events-none absolute -right-[20px] -top-[40px] h-[220px] w-[220px] rounded-full opacity-60 hidden sm:block"
              style={{
                background: 'linear-gradient(45deg, #6d48e5 0%, #312e81 100%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 w-full flex flex-col items-center lg:items-start space-y-3 sm:space-y-4">
              {/* Month Tag */}
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-[#161a38]/70 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[3px] text-[#cbfb45] backdrop-blur-md mx-auto lg:mx-0">
                <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#cbfb45]" />
                <span>DICIEMBRE 2026</span>
              </div>

              {/* Large Days */}
              <div className="flex items-baseline justify-center lg:justify-start gap-2 sm:gap-4 my-1">
                <span className="font-mono text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.2)]">
                  17
                </span>
                <span className="font-mono text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#741cf3]">
                  —
                </span>
                <span className="font-mono text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.2)]">
                  18
                </span>
              </div>

              {/* Location & Format Subtitle */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[2px] text-[#9aa7ca]">
                <MapPinIcon className="h-4 w-4 text-[#818cf8] shrink-0" />
                <span>Mollendo, Arequipa <span className="text-[#741cf3]">·</span> Perú</span>
              </div>

              {/* Action Button */}
              <div className="pt-3 sm:pt-6 w-full flex justify-center lg:justify-start">
                <Link
                  to={ROUTES.registration}
                  className="w-full max-w-sm sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#b8da02] px-8 sm:px-9 py-3.5 sm:py-4 text-sm font-bold text-[#050814] shadow-lg shadow-[#b8da02]/20 transition-all hover:bg-[#a6c502] hover:shadow-[#b8da02]/30 active:scale-95 cursor-pointer text-center"
                >
                  <span>Inscribirme como participante</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Decorative Bottom-Right Motif (solo en desktop) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-16 sm:bottom-12 z-0 mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-16 hidden lg:flex justify-end">
        <AsideBottomRightMotif className="h-12 w-24" />
      </div>

      {/* ----------------- MINIMAL FIGMA FOOTER ----------------- */}
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
