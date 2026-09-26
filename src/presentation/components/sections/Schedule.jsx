import { useState } from 'react';
import { SCHEDULE } from '../../../infrastructure/content/schedule';
import { SectionHeading } from '../ui/SectionHeading';

// Three-day agenda with a day switcher and the activities of the selected day.
export function Schedule() {
  const [activeDay, setActiveDay] = useState(SCHEDULE[0].id);
  const day = SCHEDULE.find((item) => item.id === activeDay) ?? SCHEDULE[0];

  return (
    <section id="cronograma" className="scroll-mt-20 py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Cronograma" title="Tres días frente al océano" description="Horarios sujetos a confirmación: cualquier cambio se hace en un solo archivo." />

        <div role="tablist" aria-label="Días del evento" className="mt-12 flex flex-wrap justify-center gap-3">
          {SCHEDULE.map((item) => (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={item.id === day.id}
              onClick={() => setActiveDay(item.id)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                item.id === day.id
                  ? 'bg-aqua-500 text-navy-950'
                  : 'border border-navy-900/15 text-navy-700 hover:border-aqua-500 dark:border-white/20 dark:text-sand-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-sm font-semibold text-aqua-600 dark:text-aqua-400">{day.theme}</p>

        <ol className="mt-8 space-y-4">
          {day.activities.map((activity) => (
            <li key={`${day.id}-${activity.time}`} className="surface-card grid gap-3 p-6 sm:grid-cols-[10rem_1fr]">
              <span className="font-display text-sm font-extrabold text-aqua-600 dark:text-aqua-400">{activity.time}</span>
              <div>
                <h3 className="text-base font-extrabold text-navy-900 dark:text-sand-100">{activity.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-navy-700/80 dark:text-sand-200/70">{activity.description}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-navy-700/50 dark:text-sand-200/40">
                  {activity.speaker}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
