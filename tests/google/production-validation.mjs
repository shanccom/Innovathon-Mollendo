import assert from 'node:assert/strict';
import { validRegistration } from '../fixtures/registration.mjs';

// All cases are deliberately invalid and must fail before storage or email.
const endpoint = process.env.HEALTH_ENDPOINT;
if (!endpoint) throw new Error('Indica HEALTH_ENDPOINT para comprobar la validación publicada.');
const health = await (await fetch(endpoint, { signal: AbortSignal.timeout(30000) })).json();
assert.equal(health.capabilities?.phone, true);
const cases = [
  ['celular ausente', { phone: '' }],
  ['celular incompleto', { phone: '90000000' }],
  ['términos enviados como texto', { termsAccepted: 'true' }],
  ['disponibilidad enviada como texto', { availability: 'true' }],
];
const results = [];
for (const [name, patch] of cases) {
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...validRegistration, ...patch, source: 'qa_validation_invalid' }),
    signal: AbortSignal.timeout(30000),
  });
  const result = await response.json();
  assert.equal(result.success, false, name);
  assert.equal(result.code, 'VALIDATION', name);
  results.push({ name, code: result.code });
}
console.log(JSON.stringify({ version: health.version, passed: results.length, results }, null, 2));
