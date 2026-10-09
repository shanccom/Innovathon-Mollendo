import http from 'k6/http';
import { check, fail } from 'k6';
import { Counter } from 'k6/metrics';
import { validRegistration } from '../fixtures/registration.mjs';

const endpoint = __ENV.QA_ENDPOINT || 'http://127.0.0.1:8787';
const run = String(__ENV.QA_RUN_ID || '');
const created = new Counter('registrations_created');
const duplicates = new Counter('registrations_duplicate');
const scenarios = {
  unique: { exec: 'unique', vus: 8, iterations: 32 },
  same_dni: { exec: 'sameDni', vus: 8, iterations: 24 },
  same_email: { exec: 'sameEmail', vus: 8, iterations: 24 },
  gmail_alias: { exec: 'gmailAlias', vus: 8, iterations: 24 },
};

export const options = {
  scenarios: Object.fromEntries(Object.entries(scenarios).map(([name, value]) => [name, { executor: 'shared-iterations', maxDuration: '60s', ...value }])),
  thresholds: {
    http_req_failed: ['rate==0'],
    checks: ['rate==1'],
    'http_req_duration{method:POST}': ['p(95)<15000'],
    'registrations_created{case:unique}': ['count==32'],
    'registrations_created{case:same_dni}': ['count==1'],
    'registrations_created{case:same_email}': ['count==1'],
    'registrations_created{case:gmail_alias}': ['count==1'],
    'registrations_duplicate{case:same_dni}': ['count==23'],
    'registrations_duplicate{case:same_email}': ['count==23'],
    'registrations_duplicate{case:gmail_alias}': ['count==23'],
  },
};

export function setup() {
  if (!/^\d{6}$/.test(run)) fail('QA_RUN_ID debe ser un identificador de 6 dígitos compartido por todos los VUs.');
  const response = http.get(endpoint);
  let health;
  try { health = response.json(); } catch { fail('El endpoint no devuelve JSON.'); }
  if (health?.testMode !== true) fail('Carga de escritura requiere una implementación aislada en TEST_MODE.');
  if (!endpoint.startsWith('http://127.0.0.1:') && !endpoint.startsWith('http://localhost:')) {
    if (!__ENV.QA_SHEET_ID || __ENV.QA_SHEET_ID === '1U48ftJJns3-4waJrt4A4uaI4OBNQoeyg1sOzzvXllI8' || health.testSpreadsheetId !== __ENV.QA_SHEET_ID) fail('QA_SHEET_ID debe coincidir con una hoja de prueba separada.');
  }
  return { run };
}

function submit(data, caseName) {
  const response = http.post(endpoint, JSON.stringify({ ...validRegistration, ...data, source: `qa_k6_${run}` }), { headers: { 'Content-Type': 'text/plain;charset=utf-8' }, timeout: '30s' });
  let result;
  try { result = response.json(); } catch { /* Check below records the failure. */ }
  check(response, {
    'JSON con resultado definido': () => result?.success === true || result?.isDuplicate === true,
    'registro confirma código y fecha': () => !result?.success || Boolean(result.registrationId && result.registeredAt),
  });
  if (result?.success) created.add(1, { case: caseName });
  else if (result?.isDuplicate) duplicates.add(1, { case: caseName });
}

function dni(offset) { return String(90000000 + ((Number(run) * 1000 + offset) % 9000000)); }
export function unique() { submit({ dni: dni(__ITER * 32 + __VU), personalEmail: `unique-${run}-${__VU}-${__ITER}@example.test` }, 'unique'); }
export function sameDni() { submit({ dni: dni(1500), personalEmail: `dni-${run}-${__VU}-${__ITER}@example.test` }, 'same_dni'); }
export function sameEmail() { submit({ dni: dni(2000 + __ITER * 32 + __VU), personalEmail: `email-${run}@example.test` }, 'same_email'); }
export function gmailAlias() { submit({ dni: dni(4000 + __ITER * 32 + __VU), personalEmail: `q.a.${run}+${__VU}-${__ITER}@gmail.com` }, 'gmail_alias'); }

export function teardown() {
  if (endpoint.startsWith('http://127.0.0.1:')) {
    const totals = http.get(`${endpoint}/metrics`).json();
    check(totals, { 'hoja simulada: 35 filas, códigos/DNI únicos y celular persistido': (r) => r.records === 35 && r.uniqueCodes === 35 && r.uniqueDni === 35 && r.phonesStored });
  }
}
