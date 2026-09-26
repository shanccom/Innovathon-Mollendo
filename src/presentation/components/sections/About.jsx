import { EVENT } from '../../../infrastructure/content/event';
import { SectionHeading } from '../ui/SectionHeading';
import { assetUrl } from '../../../shared/utils/assets';

// Manifesto block explaining the purpose of the event.
export function About() {
  return (
    <section id="manifiesto" className="scroll-mt-20 py-20">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHeading
          align="left"
          eyebrow="Manifiesto"
          title={EVENT.manifesto.title}
          description={EVENT.manifesto.paragraphs.join(' ')}
        />

        <div className="relative">
          <img
            src={assetUrl('/assets/mollendo-sunset.jpg')}
            alt="Atardecer en la costa de Mollendo"
            className="h-80 w-full rounded-3xl object-cover shadow-xl sm:h-96"
          />
          <p className="mt-6 rounded-2xl border-l-4 border-aqua-500 bg-aqua-500/5 p-5 text-sm leading-relaxed text-navy-800 dark:text-sand-200">
            {EVENT.manifesto.highlight}
          </p>
        </div>
      </div>
    </section>
  );
}
