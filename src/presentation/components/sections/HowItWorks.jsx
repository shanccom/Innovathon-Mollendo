import { EVENT } from '../../../infrastructure/content/event';
import { SectionHeading } from '../ui/SectionHeading';

// Step-by-step dynamics of the event, from registration to the awards.
export function HowItWorks() {
  return (
    <section className="bg-sand-200/60 py-20 dark:bg-navy-900/40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Dinámica"
          title="Cómo funciona la Innovathon"
          description="Siete etapas que convierten una idea en un proyecto presentable."
        />

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EVENT.timeline.map((item) => (
            <li key={item.step} className="surface-card relative p-6">
              <span className="font-display text-3xl font-extrabold text-aqua-500/40">{item.step}</span>
              <h3 className="mt-2 text-base font-extrabold text-navy-900 dark:text-sand-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-700/75 dark:text-sand-200/70">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
