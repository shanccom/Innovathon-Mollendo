// Resolves a file inside /public respecting the Vite base path (required on GitHub Pages).
export function assetUrl(path) {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const file = path.replace(/^\/+/, '');
  return `${base}/${file}`;
}
