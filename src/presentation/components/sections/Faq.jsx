import { useState } from 'react';
import { FAQ } from '../../../infrastructure/content/faq';
import { SectionHeading } from '../ui/SectionHeading';

// Accessible FAQ accordion with a single open item at a time.
export function Faq() {
  const [openId, setOpenId] = useState(FAQ[0].id);

  return (
    <section id="faq" className="scroll-mt-20 py-20">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Preguntas frecuentes" description="Resolvemos las dudas más comunes antes de que te inscribas." />

        <ul className="mt-12 divide-y divide-navy-900/10 border-y border-navy-900/10 dark:divide-white/10 dark:border-white/10">
          {FAQ.map((item) => {
            const isOpen = item.id === openId;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-base font-bold text-navy-900 dark:text-sand-100">{item.question}</span>
                  <span className={`shrink-0 text-xl text-aqua-500 transition ${isOpen ? 'rotate-45' : ''}`}>+</span>
                </button>
                {isOpen && <p className="pb-6 pr-8 text-sm leading-relaxed text-navy-700/80 dark:text-sand-200/70">{item.answer}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
