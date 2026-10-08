import { useId, useState } from 'react';

// Short, interruptible expansion; closed content leaves the accessibility tree.
export function EventFaq({ items }) {
  const [openId, setOpenId] = useState(null);
  const [keyboard, setKeyboard] = useState(false);
  const prefix = useId();
  return (
    <div className="event-faq" data-keyboard={keyboard}>
      {items.map(({ id, question, answer }) => {
        const open = openId === id;
        const buttonId = `${prefix}-${id}-button`;
        const panelId = `${prefix}-${id}-panel`;
        return <div className="event-faq__item" key={id} data-open={open}><h3><button id={buttonId} type="button" aria-expanded={open} aria-controls={panelId} onClick={(event) => { setKeyboard(event.detail === 0); setOpenId(open ? null : id); }}><span>{question}</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12H19" stroke="currentColor" strokeWidth="1.5" /><path className="event-faq__plus" d="M12 5V19" stroke="currentColor" strokeWidth="1.5" /></svg></button></h3><div id={panelId} className="event-faq__panel" role="region" aria-labelledby={buttonId} aria-hidden={!open} inert={!open}><div><p>{answer}</p></div></div></div>;
      })}
    </div>
  );
}
