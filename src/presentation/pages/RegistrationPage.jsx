import { EVENT } from '../../infrastructure/content/event';
import { useRegistrationForm } from '../hooks/useRegistrationForm';
import { useSeo } from '../hooks/useSeo';
import { RegistrationForm } from '../components/registration/RegistrationForm';

// Registration page: form plus a sticky summary of the event data.
export default function RegistrationPage() {
  const form = useRegistrationForm();

  useSeo({
    title: `Inscripción | ${EVENT.name} ${EVENT.edition}`,
    description: 'Postula a la Innovathon Mollendo 2026 de forma gratuita. Registro individual o por equipo.',
  });

  return (
    <section className="py-16">
      <div className="container-page">
        <header className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold text-navy-900 sm:text-4xl dark:text-sand-100">Inscripción oficial</h1>
          <p className="mt-4 text-sm leading-relaxed text-navy-700/80 dark:text-sand-200/70">
            Completa el formulario para reservar tu plaza. La participación es gratuita y puedes inscribirte de forma individual o con tu equipo.
          </p>
        </header>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
          <RegistrationForm form={form} />

          <aside className="surface-card space-y-4 p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-extrabold text-navy-900 dark:text-sand-100">Datos del evento</h2>
            <dl className="space-y-3 text-sm">
              {[
                ['Fecha', EVENT.date],
                ['Sede', EVENT.venue],
                ['Dirección', EVENT.address],
                ['Modalidad', EVENT.duration],
                ['Inversión', EVENT.price],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col">
                  <dt className="text-xs font-bold uppercase tracking-widest text-aqua-600 dark:text-aqua-400">{label}</dt>
                  <dd className="mt-0.5 text-navy-800 dark:text-sand-200">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="rounded-xl bg-aqua-500/10 p-4 text-xs leading-relaxed text-navy-800 dark:text-sand-200">
              ¿Aún no tienes equipo? Postula como individual y te integramos en el team matching del primer día.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
