import { useEffect } from 'react';

// Native scrolling stays in control. Observers choreograph arrivals and the
// background; WAAPI lets a new navigation interrupt an unfinished entrance.
export function useLandingMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reveals = [...root.querySelectorAll('[data-reveal]')];
    const stages = [...root.querySelectorAll('[data-journey-step]')];
    const progress = root.querySelector('[data-journey-progress]');
    const scene = root.querySelector('[data-tide-scene]');
    const sections = [...root.querySelectorAll('main > section, #retos')];
    const links = [...root.querySelectorAll('.event-navbar__links a[href^="#"]')];
    const animations = new Map();
    let navigationTarget = null;
    let navigationTimeout = 0;
    let sceneVisible = false;
    const enter = (element, index = 0) => {
      element.removeAttribute('data-pending');
      animations.get(element)?.cancel();
      if (preference.matches || !element.animate) return;
      const horizontal = element.matches('h2') ? -28 : index % 2 ? 24 : 0;
      const vertical = horizontal ? 14 : 36;
      const animation = element.animate([
        { opacity: 0.4, transform: `translate3d(${horizontal}px, ${vertical}px, 0)` },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ], {
        duration: 680,
        delay: Math.min(index, 5) * 65,
        easing: 'cubic-bezier(.16, 1, .3, 1)',
        fill: 'backwards',
      });
      animations.set(element, animation);
      const finish = () => {
        if (animations.get(element) === animation) animations.delete(element);
      };
      animation.finished.then(finish, finish);
    };
    const enterGroup = (section) => {
      const group = section.matches('[data-reveal]') ? [section] : [...section.querySelectorAll('[data-reveal]')];
      group.forEach((element, index) => enter(element, index));
    };
    const setActiveSection = (section) => {
      const index = sections.indexOf(section);
      root.dataset.section = section.id === 'inicio' ? 'hero' : section.id;
      root.style.setProperty('--orb-travel', `${index % 2 ? 70 : 0}px`);
      root.style.setProperty('--orb-rise', `${index % 3 * -32}px`);
      links.forEach((link) => {
        if (link.hash === `#${section.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    const updateMotion = () => {
      if (scene) scene.dataset.running = String(sceneVisible && !document.hidden && !preference.matches);
      if (preference.matches || document.hidden) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
        reveals.forEach((element) => element.removeAttribute('data-pending'));
      }
    };
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        enter(target, Number(target.dataset.revealOrder || 0));
        revealObserver.unobserve(target);
      });
    }, { threshold: 0.08 });
    // Read all geometry before writing pending states.
    const upcoming = reveals.filter((element) => element.getBoundingClientRect().top > window.innerHeight);
    upcoming.forEach((element, index) => {
      if (!preference.matches) {
        element.dataset.revealOrder = String(index % 3);
        element.dataset.pending = '';
        revealObserver.observe(element);
      }
    });
    const journeyObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.dataset.discovered = 'true';
        const index = stages.indexOf(target);
        if (progress) {
          const previous = Number(progress.dataset.discovered || 0);
          const discovered = Math.max(previous, (index + 1) / stages.length);
          progress.dataset.discovered = String(discovered);
          progress.style.transform = `scaleY(${discovered})`;
        }
        journeyObserver.unobserve(target);
      });
    }, { threshold: 0.3 });
    stages.forEach((element) => journeyObserver.observe(element));
    const sceneObserver = new IntersectionObserver(([entry]) => {
      sceneVisible = entry.isIntersecting;
      updateMotion();
    });
    if (scene) sceneObserver.observe(scene);
    const sectionObserver = new IntersectionObserver(() => {
      const band = sections.map((section) => ({ section, bounds: section.getBoundingClientRect() }))
        .filter(({ bounds }) => bounds.top < window.innerHeight * 0.55 && bounds.bottom > window.innerHeight * 0.15)
        .sort((a, b) => Math.abs(a.bounds.top - window.innerHeight * 0.2) - Math.abs(b.bounds.top - window.innerHeight * 0.2));
      if (band[0]) setActiveSection(band[0].section);
      if (navigationTarget) {
        const bounds = navigationTarget.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 0.7 && bounds.bottom > 0) {
          enterGroup(navigationTarget);
          navigationTarget = null;
          clearTimeout(navigationTimeout);
        }
      }
    }, { rootMargin: '-15% 0px -45% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
    const navigate = (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(anchor.hash.slice(1));
      if (!target || !root.contains(target) || target.id === 'contenido') return;
      // Do not preventDefault: URL hashes, history and keyboard behavior stay native.
      navigationTarget = target;
      clearTimeout(navigationTimeout);
      const bounds = target.getBoundingClientRect();
      if (bounds.top >= 0 && bounds.top < window.innerHeight * 0.7) {
        enterGroup(target);
        navigationTarget = null;
      } else {
        // Arrival fallback for very small/nested anchor targets between observer bands.
        navigationTimeout = window.setTimeout(() => {
          if (navigationTarget) enterGroup(navigationTarget);
          navigationTarget = null;
        }, 1000);
      }
    };
    const revealFocus = (event) => {
      const element = event.target.closest('[data-reveal]');
      element?.removeAttribute('data-pending');
      animations.get(element)?.cancel();
    };
    root.addEventListener('click', navigate);
    root.addEventListener('focusin', revealFocus);
    document.addEventListener('visibilitychange', updateMotion);
    preference.addEventListener('change', updateMotion);
    return () => {
      revealObserver.disconnect();
      journeyObserver.disconnect();
      sceneObserver.disconnect();
      sectionObserver.disconnect();
      clearTimeout(navigationTimeout);
      animations.forEach((animation) => animation.cancel());
      root.removeEventListener('click', navigate);
      root.removeEventListener('focusin', revealFocus);
      document.removeEventListener('visibilitychange', updateMotion);
      preference.removeEventListener('change', updateMotion);
      reveals.forEach((element) => element.removeAttribute('data-pending'));
      delete root.dataset.section;
      root.style.removeProperty('--orb-travel');
      root.style.removeProperty('--orb-rise');
      links.forEach((link) => link.removeAttribute('aria-current'));
    };
  }, [rootRef]);
}
