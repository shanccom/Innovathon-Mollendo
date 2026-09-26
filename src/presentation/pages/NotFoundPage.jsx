import { Link } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/routes';
import { useSeo } from '../hooks/useSeo';

// Fallback route for unknown URLs.
export default function NotFoundPage() {
  useSeo({ title: 'Página no encontrada | Innovathon Mollendo', description: 'La página que buscas no existe.' });

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-6xl font-extrabold text-aqua-500">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-navy-900 dark:text-sand-100">Esta página se fue con la marea</h1>
      <p className="mt-3 max-w-md text-sm text-navy-700/80 dark:text-sand-200/70">
        No encontramos el contenido que buscabas. Vuelve al inicio o inscríbete en el evento.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={ROUTES.home} className="rounded-full border border-navy-900/20 px-6 py-2.5 text-sm font-bold dark:border-white/25">
          Volver al inicio
        </Link>
        <Link to={ROUTES.registration} className="rounded-full bg-aqua-500 px-6 py-2.5 text-sm font-bold text-navy-950">
          Ir al registro
        </Link>
      </div>
    </section>
  );
}
