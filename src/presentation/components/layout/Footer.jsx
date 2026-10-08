import { Link } from 'react-router-dom';
import { EVENT } from '../../../infrastructure/content/event';
import { ROUTES } from '../../../shared/constants/routes';

// Site footer with event summary and social links.
export function Footer() {
  return (
    <footer className="border-t border-navy-900/10 bg-navy-900 text-sand-100 dark:border-white/10 dark:bg-navy-950">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0">
          <p className="font-display text-lg font-extrabold uppercase tracking-wider break-words">
            Innovathon<span className="text-aqua-400">Mollendo</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-sand-200/70">{EVENT.summary}</p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-aqua-400">Evento</h2>
          <ul className="mt-4 space-y-2 text-sm text-sand-200/80">
            <li>{EVENT.date}</li>
            <li>{EVENT.venue}</li>
            <li>{EVENT.city}</li>
            <li>{EVENT.price}</li>
          </ul>
        </div>

        <div className="min-w-0">
          <h2 className="text-xs font-bold uppercase tracking-widest text-aqua-400">Documentos</h2>
          <ul className="mt-4 space-y-2 text-sm text-sand-200/80">
            <li>
              <a
                className="hover:text-aqua-400 inline-flex items-center gap-1"
                href={EVENT.documents.bases}
                target="_blank"
                rel="noreferrer"
              >
                Bases de la competencia ↗
              </a>
            </li>
            <li>
              <a
                className="hover:text-aqua-400 inline-flex items-center gap-1"
                href={EVENT.documents.reglamento}
                target="_blank"
                rel="noreferrer"
              >
                Reglamento oficial ↗
              </a>
            </li>
            <li>
              <a
                className="hover:text-aqua-400 inline-flex items-center gap-1"
                href={EVENT.documents.enlacesImportantes}
                target="_blank"
                rel="noreferrer"
              >
                Enlaces importantes ↗
              </a>
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <h2 className="text-xs font-bold uppercase tracking-widest text-aqua-400">Contacto y Comunidad</h2>
          <ul className="mt-4 space-y-2 text-sm text-sand-200/80">
            <li>
              <a
                className="hover:text-aqua-400 inline-flex items-center gap-1 text-emerald-400 font-semibold"
                href={EVENT.socials.whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                <span>Comunidad WhatsApp</span> ↗
              </a>
            </li>
            <li>
              <a className="hover:text-aqua-400" href={`mailto:${EVENT.socials.email}`}>
                {EVENT.socials.email}
              </a>
            </li>
            <li>
              <a className="hover:text-aqua-400" href={EVENT.socials.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a className="hover:text-aqua-400" href={EVENT.socials.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a className="hover:text-aqua-400" href={EVENT.socials.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="min-w-0 border-t border-white/10 py-5">
        <p className="container-page text-xs text-sand-200/50">
          © {new Date().getFullYear()} {EVENT.name}.Proyecto libre y comunitario.{' '}
          <Link to={ROUTES.registration} className="underline hover:text-aqua-400">
            Participa
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
