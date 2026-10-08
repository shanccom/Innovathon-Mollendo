import { useId, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { assetUrl } from '../../../shared/utils/assets';
import { ArrowRightIcon } from './RegistrationIcons';
import './event-navigation.css';

const SECTIONS = [
  ['inicio', 'Inicio'], ['evento', 'El evento'],
  ['actividades', 'Actividades'], ['preguntas', 'Preguntas'],
];

export function RegistrationNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === ROUTES.home;
  const isRegistration = location.pathname === ROUTES.registration;
  const menuId = useId();
  const headerRef = useRef(null);
  const toggleRef = useRef(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const measure = () => document.documentElement.style.setProperty('--event-nav-offset', `${header.getBoundingClientRect().height + 16}px`);
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(header);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      document.documentElement.style.removeProperty('--event-nav-offset');
    };
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);
  const escapeMenu = (event) => {
    if (event.key !== 'Escape' || !mobileMenuOpen) return;
    closeMenu();
    toggleRef.current?.focus();
  };

  return (
    <header className="event-navbar" ref={headerRef} onKeyDown={escapeMenu}>
      <div className="event-navbar__shell">
        <Link to={ROUTES.home} viewTransition onClick={closeMenu} className="event-navbar__brand">
          <img src={assetUrl('/assets/brand-logo-transparent.png')} alt="Innovathon Mollendo" />
        </Link>
      <nav id={menuId} aria-label="Navegación principal" className="event-navbar__menu" data-open={mobileMenuOpen}>
        <div className="event-navbar__links">
          {SECTIONS.map(([id, label]) => isHome ? (
            <a key={id} href={`#${id}`} onClick={closeMenu}>{label}</a>
          ) : (
            <Link key={id} to={`${ROUTES.home}#${id}`} viewTransition onClick={closeMenu}>{label}</Link>
          ))}
        </div>
      </nav>
      <Link to={ROUTES.registration} viewTransition onClick={closeMenu} className="event-navbar__registration" aria-label="Inscríbete ahora" aria-current={isRegistration ? 'page' : undefined}>
        <span className="event-navbar__cta-label"><span className="event-navbar__cta-long">Inscríbete ahora</span><span className="event-navbar__cta-short">Inscríbete</span></span><span className="event-navbar__cta-arrow" aria-hidden="true"><ArrowRightIcon /></span>
      </Link>
      <button ref={toggleRef} type="button" className="event-navbar__toggle" aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileMenuOpen} aria-controls={menuId} onClick={() => setMobileMenuOpen((open) => !open)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d={mobileMenuOpen ? 'M6 6L18 18M6 18L18 6' : 'M4 6H20M4 12H20M4 18H20'} strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      </div>
    </header>
  );
}
