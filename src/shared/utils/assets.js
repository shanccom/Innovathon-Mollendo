// Resolves a file inside /public respecting the Vite base path (required on GitHub Pages).
export function assetUrl(path) {
  const base = import.meta.env.BASE_URL;
  const file = path.startsWith('/') ? path : `/${path}`;
  return `${base}${file}`.replace(/([^:]\/)\/+/g, '$1');
}
