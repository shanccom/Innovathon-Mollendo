import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import { assetUrl } from '../../../shared/utils/assets';

const NAV_LINKS = [
  { hash: '#manifiesto', label: 'Manifiesto' },
  { hash: '#experiencias', label: 'Experiencias' },
  { hash: '#cronograma', label: 'Cronograma' },
  { hash: '#mentores', label: 'Mentores' },
  { hash: '#faq', label: 'FAQ' },
];

// Sticky navigation with theme switcher and registration CTA.
export function Navbar({ theme, onToggleTheme, menuOpen, onToggleMenu, onCloseMenu }) {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-900/10 bg-sand-100/85 backdrop-blur-lg dark:border-white/10 dark:bg-navy-950/85">
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Principal">
        <Link to={ROUTES.home} className="flex min-w-0 items-center gap-2">
          <img src={assetUrl('/assets/logo-light.png')} alt="" className="h-8 w-auto shrink-0 dark:hidden" />
          <img src={assetUrl('/assets/logo-dark.png')} alt="" className="hidden h-8 w-auto shrink-0 dark:block" />
          <span className="hidden whitespace-nowrap font-display text-sm font-extrabold uppercase tracking-widest text-navy-900 sm:inline dark:text-sand-100">
            Innovathon<span className="text-aqua-600 dark:text-aqua-400">Mollendo</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.hash}>
              <Link
                to={{ pathname: ROUTES.home, hash: link.hash }}
                onClick={onCloseMenu}
                className="text-sm font-medium text-navy-700 transition hover:text-aqua-600 dark:text-sand-200 dark:hover:text-aqua-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-full border border-navy-900/15 px-3 py-1.5 text-xs font-semibold text-navy-700 transition hover:border-aqua-500 hover:text-aqua-600 dark:border-white/20 dark:text-sand-200 dark:hover:text-aqua-400"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? 'Claro' : 'Oscuro'}
          </button>
          <Link
            to={ROUTES.registration}
            className="hidden rounded-full bg-aqua-500 px-5 py-2 text-sm font-bold text-navy-950 transition hover:bg-aqua-400 sm:block"
          >
            Registrarme
          </Link>
          <button
            type="button"
            onClick={onToggleMenu}
            className="rounded-lg border border-navy-900/15 p-2 lg:hidden dark:border-white/20"
            aria-expanded={menuOpen}
            aria-label="Abrir menú"
          >
            <span className="block h-0.5 w-4 bg-current" />
            <span className="mt-1 block h-0.5 w-4 bg-current" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <ul className="container-page flex flex-col gap-3 border-t border-navy-900/10 py-4 lg:hidden dark:border-white/10">
          {NAV_LINKS.map((link) => (
            <li key={link.hash}>
              <Link
                to={{ pathname: ROUTES.home, hash: link.hash }}
                onClick={onCloseMenu}
                className="text-sm font-medium text-navy-700 dark:text-sand-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to={ROUTES.registration} onClick={onCloseMenu} className="text-sm font-bold text-aqua-600 dark:text-aqua-400">
              Registrarme
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
