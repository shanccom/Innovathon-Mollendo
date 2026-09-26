import { EVENT } from '../../../infrastructure/content/event';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';

// "Qué vas a vivir" cards: create, learn, connect, compete, present, transform.
export function Experiences() {
  return (
    <section id="experiencias" className="scroll-mt-20 py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Experiencias"
          title="¿Qué vas a vivir?"
          description="48 horas diseñado para que saigas con un prototipo, una comunidad y un siguiente paso concreto."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT.experiences.map((experience) => (
            <li key={experience.id} className="surface-card flex flex-col p-7 transition hover:-translate-y-1 hover:shadow-glow">
              <Badge>{experience.tag}</Badge>
              <h3 className="mt-4 text-2xl font-extrabold text-navy-900 dark:text-sand-100">{experience.title}</h3>
              <p className="mt-1 text-sm font-semibold text-aqua-700 dark:text-aqua-400">{experience.highlight}</p>
              <p className="mt-3 text-sm leading-relaxed text-navy-700/80 dark:text-sand-200/70">{experience.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
