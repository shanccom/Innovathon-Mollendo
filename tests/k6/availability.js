import http from 'k6/http';
import { check, fail } from 'k6';

// Read-only smoke of the published endpoint; it never inserts participants.
export const options = {
  scenarios: { health: { executor: 'shared-iterations', vus: 2, iterations: 10, maxDuration: '60s' } },
  thresholds: { http_req_failed: ['rate==0'], checks: ['rate==1'], http_req_duration: ['p(95)<10000'] },
};
export default function () {
  if (!__ENV.HEALTH_ENDPOINT) fail('Indica HEALTH_ENDPOINT.');
  const response = http.get(__ENV.HEALTH_ENDPOINT, { timeout: '20s' });
  let body;
  try { body = response.json(); } catch { /* Semantic check below. */ }
  check(response, { 'endpoint responde JSON activo': () => response.status === 200 && body?.success === true });
}
