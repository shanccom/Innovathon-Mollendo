import { Link } from 'react-router-dom';
import { EVENT } from '../../../infrastructure/content/event';
import { ROUTES } from '../../../shared/constants/routes';
import { assetUrl } from '../../../shared/utils/assets';

// Closing call to action that routes into the registration page.
export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-navy-800 py-20 text-sand-100">
      <img src={assetUrl('/assets/mollendo-coast.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      <div className="container-page relative text-center">
        <h2 className="mx-auto max-w-3xl text-3xl font-extrabold sm:text-5xl">
          Asegura tu lugar en la marea de Mollendo
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-sand-200/80">
          {EVENT.date} · {EVENT.venue} · {EVENT.price}. Las plazas son limitadas y el team matching empieza el primer día.
        </p>
        <Link
          to={ROUTES.registration}
          className="mt-9 inline-block rounded-full bg-aqua-500 px-8 py-3.5 text-sm font-bold text-navy-950 transition hover:bg-aqua-400"
        >
          Completar mi registro
        </Link>
      </div>
    </section>
  );
}
