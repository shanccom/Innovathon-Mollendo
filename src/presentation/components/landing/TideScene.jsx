import { useEffect, useId, useRef } from 'react';

const CONTOURS = Array.from({ length: 22 }, (_, index) => Array.from({ length: 85 }, (_, point) => {
  const x = point * 18 - 260;
  const y = 355 + index * 8
    + Math.sin((x / 840) * Math.PI * 2 + index * 0.032) * (58 + index * 1.7)
    - Math.exp(-Math.pow((x - 465) / 200, 2)) * (118 - index * 2.1);
  return `${point === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
}).join(' '));

const NODES = [
  { x: 215, y: 215, radius: 9 }, { x: 374, y: 113, radius: 12 },
  { x: 545, y: 188, radius: 9 }, { x: 655, y: 91, radius: 6 },
];

export function TideScene() {
  const sceneRef = useRef(null);
  const artworkId = useId().replace(/:/g, '');
  useEffect(() => {
    const scene = sceneRef.current;
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let bounds;
    const enter = () => { bounds = scene.getBoundingClientRect(); };
    const move = (event) => {
      if (!pointer.matches || reduced.matches || !bounds) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
        const y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
        scene.style.setProperty('--tide-x', `${x * 28}px`);
        scene.style.setProperty('--tide-y', `${y * 20}px`);
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      scene.style.setProperty('--tide-x', '0px');
      scene.style.setProperty('--tide-y', '0px');
      bounds = null;
    };
    scene.addEventListener('pointerenter', enter);
    scene.addEventListener('pointermove', move);
    scene.addEventListener('pointerleave', reset);
    reduced.addEventListener('change', reset);
    reset();
    return () => {
      reset();
      scene.removeEventListener('pointerenter', enter);
      scene.removeEventListener('pointermove', move);
      scene.removeEventListener('pointerleave', reset);
      reduced.removeEventListener('change', reset);
    };
  }, []);

  return (
    <div className="tide-scene" ref={sceneRef} data-tide-scene data-running="false">
      <div className="tide-scene__art" aria-hidden="true">
        <svg viewBox="0 0 840 620" fill="none" className="tide-scene__svg">
          <defs>
            <linearGradient id={`${artworkId}-fade`} x1="-260" y1="0" x2="1260" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="white" stopOpacity="0" />
              <stop offset=".22" stopColor="white" />
              <stop offset=".85" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id={`${artworkId}-flow`} x="-280" y="-100" width="1580" height="900" maskUnits="userSpaceOnUse">
              <rect x="-280" y="-100" width="1580" height="900" fill={`url(#${artworkId}-fade)`} />
            </mask>
          </defs>
          <circle className="tide-sun" cx="470" cy="277" r="146" />
          <g className="tide-orbit">
            <ellipse cx="470" cy="277" rx="217" ry="116" transform="rotate(-28 470 277)" />
            <circle cx="295" cy="385" r="5" />
            <circle cx="660" cy="174" r="6" />
          </g>
          <g mask={`url(#${artworkId}-flow)`}>
          <g className="tide-ribbon tide-ribbon--back"><path d="M-260 450C90 710 195 122 495 276S950 672 1260 270L1260 284C950 686 800 470 495 294S90 730-260 466Z" /></g>
          <g className="tide-contours tide-contours--back">{CONTOURS.map((path, index) => <path key={index} d={path} opacity={0.24 + index * 0.023} />)}</g>
          <g className="tide-contours tide-contours--front">{CONTOURS.filter((_, index) => index % 3 === 0).map((path, index) => <path key={index} d={path} transform="translate(0 23)" />)}</g>
          <g className="tide-ribbon tide-ribbon--front"><path d="M-260 504C54 685 286 172 540 346S945 594 1260 343" /></g>
          </g>
          <g className="tide-connections"><path d="M215 215L374 113L545 188L655 91" /><path d="M374 113L470 277L545 188M215 215L470 277" opacity=".5" /></g>
          {NODES.map(({ x, y, radius }, index) => <g key={x} className="tide-node" style={{ '--node-delay': `${index * 100}ms` }}><g className="tide-node__float" style={{ '--node-phase': `${index * -1.2}s` }}><circle cx={x} cy={y} r={radius + 15} className="tide-node__ring" /><circle cx={x} cy={y} r={radius} className="tide-node__core" /></g></g>)}
          <circle cx="470" cy="277" r="5" className="tide-node__core" />
        </svg>
      </div>
      <div className="tide-scene__caption"><span>Las ideas también tienen marea.</span></div>
    </div>
  );
}
