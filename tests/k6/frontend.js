import http from 'k6/http';
import { check, fail } from 'k6';

const site = __ENV.SITE_URL || 'http://127.0.0.1:5173';
export const options = {
  scenarios: { pages: { executor: 'shared-iterations', vus: 8, iterations: 40, maxDuration: '60s' } },
  thresholds: { http_req_failed: ['rate==0'], checks: ['rate==1'], http_req_duration: ['p(95)<3000'] },
};
export function setup() {
  const response = http.get(site);
  const js = response.body?.match(/<script[^>]+src="([^"]+)"/);
  const css = response.body?.match(/<link[^>]+href="([^"]+\.css)"/);
  if (!js || !css) fail('Necesita una build de producción con JS y CSS publicados.');
  return { assets: [js[1], css[1]].map((path) => path.startsWith('http') ? path : `${site.replace(/\/$/, '')}/${path.replace(/^\//, '')}`) };
}
export default function ({ assets }) {
  const responses = http.batch([
    { method: 'GET', url: `${site}/registro`, params: { responseCallback: http.expectedStatuses(200, 404) } },
    ...assets,
  ]);
  responses.forEach((response) => check(response, { 'página o recurso publicado disponible': (r) => r.status === 200 || r.status === 404 && r.body.includes('<div id="root">') }));
  // GitHub Pages serves its SPA fallback with HTTP 404 on /registro; the body
  // must still contain the app shell, while JS/CSS must return HTTP 200.
  check(responses, { 'recursos JS/CSS disponibles': (r) => r.slice(1).every((asset) => asset.status === 200) });
}
