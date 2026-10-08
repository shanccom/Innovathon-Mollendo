import { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './route-transition.css';

export default function RouteTransition() {
  const location = useLocation();
  const surfaceRef = useRef(null);
  const previousPath = useRef(location.pathname);

  useLayoutEffect(() => {
    const changed = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (target) target.scrollIntoView({ behavior: changed || reduced ? 'instant' : 'smooth', block: 'start' });
    else if (changed) window.scrollTo({ top: 0, behavior: 'instant' });

    if (changed) {
      const focusTarget = target?.querySelector('h1, h2, h3') || document.querySelector('main h1, h1');
      if (focusTarget) {
        focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus({ preventScroll: true });
      }
    }
    // Browser-native snapshots bridge both pages. Older browsers get an entrance.
    if (!changed || document.startViewTransition || reduced) return;
    const animation = surfaceRef.current?.animate?.([
      { opacity: .4, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 280, easing: 'cubic-bezier(.23, 1, .32, 1)' });
    return () => animation?.cancel();
  }, [location.pathname, location.hash, location.key]);

  return <div className="route-surface" ref={surfaceRef}><Outlet /></div>;
}
