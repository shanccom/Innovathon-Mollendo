import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { assetUrl } from '../../../shared/utils/assets';
import { CalendarIcon } from './RegistrationIcons';

export function RegistrationNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isRegistration = location.pathname === ROUTES.registration;
  const isHome = location.pathname === ROUTES.home;

  return (
    <header className="relative z-30 w-full bg-transparent">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-16 py-4 sm:py-6">
        {/* Brand Logo matching Figma */}
        <Link to={ROUTES.home} className="flex items-center transition hover:opacity-95">
          <img
            src={assetUrl('/assets/brand-logo-transparent.png')}
            alt="Innovathon Mollendo"
            className="h-9 sm:h-11 md:h-13 w-auto object-contain"
          />
        </Link>

        {/* Center Nav Links (Figma Layout) */}
        <nav className="hidden items-center gap-10 md:flex">
          {isHome ? (
            <div className="relative flex flex-col items-center">
              <span className="text-sm font-semibold text-white">Inicio</span>
              <div className="mt-1 h-[2.5px] w-full rounded-full bg-[#b8da02] shadow-[0_0_8px_rgba(184,218,2,0.7)]" />
            </div>
          ) : (
            <Link
              to={ROUTES.home}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Inicio
            </Link>
          )}

          <Link
            to={ROUTES.home}
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Sobre el evento
          </Link>

          {isRegistration ? (
            <div className="relative flex flex-col items-center">
              <span className="text-sm font-semibold text-white">Inscripción</span>
              <div className="mt-1 h-[2.5px] w-full rounded-full bg-[#b8da02] shadow-[0_0_8px_rgba(184,218,2,0.7)]" />
            </div>
          ) : (
            <Link
              to={ROUTES.registration}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Inscripción
            </Link>
          )}

          <a
            href="mailto:hola@innovathonmollendo.tech"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Contacto
          </a>
        </nav>

        {/* Right Action: Event Date Pill (Figma) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5 rounded-full border border-purple-500/40 bg-[#161a38]/80 px-3 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium text-slate-100 shadow-inner backdrop-blur-md">
            <span>17 - 18 DIC. 2026</span>
            <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-300" />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-lg border border-slate-800 p-2 text-slate-300 md:hidden hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800/80 bg-[#070a18]/95 px-6 py-4 md:hidden backdrop-blur-lg">
          <div className="flex flex-col gap-3 text-sm">
            <Link
              to={ROUTES.home}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1 ${isHome ? 'font-semibold text-[#b8da02]' : 'text-slate-300 hover:text-white'}`}
            >
              Inicio
            </Link>
            <Link
              to={ROUTES.home}
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-300 hover:text-white"
            >
              Sobre el evento
            </Link>
            <Link
              to={ROUTES.registration}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1 ${isRegistration ? 'font-semibold text-[#b8da02]' : 'text-slate-300 hover:text-white'}`}
            >
              Inscripción
            </Link>
            <a
              href="mailto:hola@innovathonmollendo.tech"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-300 hover:text-white"
            >
              Contacto
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
