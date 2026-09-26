import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Restores sane scroll behavior between routes and jumps to in-page anchors.
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}
