import { MENTORS } from '../../../infrastructure/content/mentors';
import { SectionHeading } from '../ui/SectionHeading';

// Mentor lineup; entries marked as placeholder keep a neutral card until confirmed.
export function Mentors() {
  return (
    <section id="mentores" className="scroll-mt-20 bg-navy-900 py-20 text-sand-100 dark:bg-navy-950">
      <div className="container-page">
        <SectionHeading
          eyebrow="Mentores"
          title="Acompañamiento especializado"
          description="Sesiones 1:1 con especialistas en tecnología, producto, impacto y negocio."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MENTORS.map((mentor) => (
            <li key={mentor.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-aqua-400">{mentor.area}</div>
              <h3 className={`mt-3 text-lg font-extrabold ${mentor.isPlaceholder ? 'text-sand-200/60 italic' : ''}`}>{mentor.name}</h3>
              <p className="mt-1 text-sm text-sand-200/80">{mentor.role}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {mentor.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-lime-400/30 px-2.5 py-1 text-[11px] font-semibold text-lime-300">
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
