import { EVENT } from '../../../infrastructure/content/event';
import { SectionHeading } from '../ui/SectionHeading';
import { assetUrl } from '../../../shared/utils/assets';

// Brand pillars grid: mar, historia, innovación, colaboración e impacto.
export function Pillars() {
  return (
    <section className="bg-navy-900 py-20 text-sand-100 dark:bg-navy-950">
      <div className="container-page">
        <SectionHeading
          eyebrow="Identidad"
          title="Los pilares que nos mueven"
          description="Cinco ideas que ordenan todo lo que hacemos durante y después del evento."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {EVENT.pillars.map((pillar) => (
            <li
              key={pillar.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-aqua-400/50 hover:bg-white/10"
            >
              <img src={assetUrl(pillar.icon)} alt="" className="h-11 w-11" />
              <h3 className="mt-4 text-lg font-extrabold">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sand-200/70">{pillar.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
