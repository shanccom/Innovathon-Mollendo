import { useEffect, useRef, useState } from 'react';
import './castle-construction.css';

const ART = `${import.meta.env.BASE_URL}assets/castillo-mollendo-construction.webp`;
// Complementary masks follow the cliff, arcade, upper facade and tower.
// Every pixel belongs to one piece, so the finished model has no seams.
const PIECES = [
  'polygon(0 64%, 43% 55%, 85% 57%, 100% 64%, 100% 100%, 0 100%)',
  'polygon(0 43%, 43% 39%, 85% 40%, 100% 44%, 100% 64%, 85% 57%, 43% 55%, 0 64%)',
  'polygon(0 30%, 36% 25%, 58% 25%, 100% 34%, 100% 44%, 85% 40%, 43% 39%, 0 43%)',
  'polygon(0 0, 100% 0, 100% 34%, 58% 25%, 36% 25%, 0 30%)',
];

export function CastleConstruction() {
  const rootRef = useRef(null);
  const imageRef = useRef(null);
  const replayRef = useRef(() => {});
  const [building, setBuilding] = useState(false);
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const image = imageRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pieces = [...root.querySelectorAll('[data-castle-piece]')];
    let animations = [];
    let visible = false;
    let started = false;
    let loaded = image.complete && image.naturalWidth > 0;
    let disposed = false;

    const finish = () => {
      animations.forEach((animation) => animation.cancel());
      animations = [];
      delete root.dataset.building;
      if (!disposed) setBuilding(false);
    };
    const build = () => {
      if (!loaded || animations.length || disposed) return;
      started = true;
      if (reduced.matches || !root.animate) return;
      root.dataset.building = 'true';
      setBuilding(true);
      animations = pieces.map((piece, index) => piece.animate([
        { opacity: 0, transform: `translate3d(0, ${index ? -32 : 24}px, 0)` },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ], {
        duration: 900,
        delay: index * 650,
        easing: 'cubic-bezier(.23, 1, .32, 1)',
        fill: 'backwards',
      }));
      const current = animations;
      Promise.allSettled(current.map((animation) => animation.finished)).then(() => {
        if (!disposed && animations === current) finish();
      });
    };
    const arrive = () => {
      if (visible && loaded && !started && !document.hidden) build();
    };
    const onLoad = () => { loaded = true; arrive(); };
    const onVisibility = () => {
      animations.forEach((animation) => {
        if (visible && !document.hidden) animation.play();
        else animation.pause();
      });
      arrive();
    };
    const onPreference = () => { if (reduced.matches) finish(); };
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      onVisibility();
    }, { threshold: 0.35 }) : null;
    replayRef.current = build;
    image.addEventListener('load', onLoad);
    document.addEventListener('visibilitychange', onVisibility);
    reduced.addEventListener('change', onPreference);
    observer?.observe(root);
    return () => {
      disposed = true;
      finish();
      observer?.disconnect();
      image.removeEventListener('load', onLoad);
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', onPreference);
      replayRef.current = () => {};
    };
  }, []);

  return (
    <figure className="castle-construction" ref={rootRef} data-failed={failed} data-expanded={expanded} data-keyboard={keyboard}>
      <div className="castle-construction__stage">
        <div className="castle-construction__model" onPointerEnter={() => setKeyboard(false)} role="img" aria-label="Ilustración interactiva del castillo de Mollendo, con fachada ocre, arcos, torre y acantilado. Sus capas se separan al pasar el cursor o activar el botón.">
          {PIECES.map((clipPath, index) => <div key={clipPath} className={`castle-construction__layer castle-construction__layer--${index}`} aria-hidden="true"><div className="castle-construction__piece" data-castle-piece style={{ clipPath }}><img ref={index === 0 ? imageRef : undefined} src={ART} alt="" width="1254" height="1254" loading="lazy" decoding="async" onError={() => setFailed(true)} /></div></div>)}
        </div>
      </div>
      <figcaption className="castle-construction__caption">
        <p className="castle-construction__hint">Mollendo, pieza a pieza.<span>Pasa el cursor sobre el castillo.</span></p>
        <div className="castle-construction__controls">
          <button type="button" disabled={building || failed} aria-pressed={expanded} onClick={(event) => { setKeyboard(event.detail === 0); setExpanded((value) => !value); }} className="castle-toggle">{expanded ? 'Unir capas' : 'Separar capas'}</button>
          <button type="button" disabled={building || failed} onClick={() => { setExpanded(false); replayRef.current(); }} className="castle-replay">{building ? 'Construyendo…' : 'Reconstruir'}<span aria-hidden="true">↻</span></button>
        </div>
      </figcaption>
    </figure>
  );
}
