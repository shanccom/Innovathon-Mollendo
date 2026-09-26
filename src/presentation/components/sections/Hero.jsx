import { Link } from 'react-router-dom';
import { EVENT } from '../../../infrastructure/content/event';
import { ROUTES } from '../../../shared/constants/routes';
import { Badge } from '../ui/Badge';
import { assetUrl } from '../../../shared/utils/assets';

// Above the fold: event identity, key data and primary calls to action.
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={assetUrl('/assets/mollendo-coast.jpg')}
        alt="Malecón de Mollendo frente al mar"
        className="absolute inset-0 h-full w-full object-cover opacity-25 dark:opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sand-100 via-sand-100/85 to-sand-100 dark:from-navy-950/90 dark:via-navy-950/75 dark:to-navy-950" />

      <div className="container-page relative grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div>
          <Badge>{EVENT.edition}</Badge>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] text-navy-900 sm:text-5xl lg:text-6xl dark:text-sand-100">
            Las ideas también <span className="text-aqua-700 dark:text-aqua-400">tienen marea</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-700/85 dark:text-sand-200/80">{EVENT.summary}</p>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {[
              ['Fecha', EVENT.date],
              ['Sede', EVENT.venue],
              ['Duración', EVENT.duration],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-bold uppercase tracking-widest text-aqua-700 dark:text-aqua-400">{label}</dt>
                <dd className="mt-1 font-semibold text-navy-900 dark:text-sand-100">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to={ROUTES.registration}
              className="rounded-full bg-aqua-500 px-7 py-3 text-sm font-bold text-navy-950 transition hover:bg-aqua-400"
            >
              Registrarme ahora
            </Link>
            <Link
              to={{ pathname: ROUTES.home, hash: '#cronograma' }}
              className="rounded-full border border-navy-900/20 px-7 py-3 text-sm font-bold text-navy-900 transition hover:border-aqua-500 hover:text-aqua-700 dark:border-white/25 dark:text-sand-100 dark:hover:text-aqua-400"
            >
              Ver cronograma
            </Link>
          </div>
        </div>

        <div className="relative">
          <img
            src={assetUrl('/assets/castillo-3d-hero.png')}
            alt="Castillo Forga de Mollendo"
            className="animate-float-soft mx-auto w-full max-w-md drop-shadow-2xl"
          />
        </div>
      </div>

      <dl className="container-page relative grid grid-cols-2 gap-4 pb-16 sm:grid-cols-4">
        {EVENT.stats.map((stat) => (
          <div key={stat.label} className="surface-card px-4 py-5 text-center">
            <dt className="font-display text-2xl font-extrabold text-aqua-700 dark:text-aqua-400">{stat.value}</dt>
            <dd className="mt-1 text-xs font-semibold uppercase tracking-widest text-navy-700/70 dark:text-sand-200/60">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
