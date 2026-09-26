import { useEffect } from 'react';
import { EVENT } from '../../infrastructure/content/event';

// Keeps document title and meta description in sync with the active page.
export function useSeo({ title, description }) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:title', title);
  }, [title, description]);
}

function setMeta(attribute, key, content) {
  const tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (tag) tag.setAttribute('content', content);
}

export const DEFAULT_SEO = {
  title: `${EVENT.name} ${EVENT.edition} | ${EVENT.slogan}`,
  description: EVENT.summary,
};
