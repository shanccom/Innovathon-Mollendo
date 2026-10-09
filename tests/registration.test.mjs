import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmptyRegistration, createRegistration } from '../src/domain/entities/Registration.js';
import { emailIdentity, registrationsOverlap } from '../src/domain/entities/registrationIdentity.js';
import { validateRegistration, validateStep } from '../src/domain/validation/registrationRules.js';
import { AppsScriptRegistrationRepository } from '../src/infrastructure/repositories/AppsScriptRegistrationRepository.js';
import { FakeRegistrationRepository } from '../src/infrastructure/repositories/FakeRegistrationRepository.js';
import { RegistrationDuplicateError } from '../src/domain/errors/registrationErrors.js';
import { validRegistration as valid, liveHeaders } from './fixtures/registration.mjs';
import { createHarness } from './helpers/apps-script-harness.mjs';
import { createWorkerPool } from './helpers/worker-pool.mjs';

test('celular obligatorio y válido en el paso 1 y entidad enviada', () => {
  assert.equal(createEmptyRegistration().phone, '');
  for (const phone of ['', '800000000', '90000000', '9abcdefgh', '+51900000000']) {
    assert.ok(validateStep(1, { ...valid, phone }).phone);
    assert.equal(createHarness().post({ ...valid, phone }).code, 'VALIDATION');
  }
  assert.deepEqual(validateRegistration(valid), {});
  assert.equal(createRegistration({ ...valid, phone: ' 900000001 ' }).phone, '900000001');
});

test('correo Gmail: mayúsculas, puntos, alias + y googlemail; otros dominios mantienen puntos y +', () => {
  assert.equal(emailIdentity(' Q.A+evento@GoogleMail.com '), 'qa@gmail.com');
  assert.equal(emailIdentity('q.a+evento@unsa.edu.pe'), 'q.a+evento@unsa.edu.pe');
  assert.equal(registrationsOverlap({ dni: '90000002', personalEmail: 'q.a+e@gmail.com' }, { dni: '90000001', institutionalEmail: 'QA@gmail.com' }), true);
});

test('cada campo obligatorio se valida también cuando se omite en un POST directo', () => {
  for (const field of ['fullName', 'dni', 'phone', 'personalEmail', 'institution', 'academicLevel', 'sede', 'career', 'skills', 'contributionAreas', 'challengeInterest', 'availability', 'termsAccepted']) {
    const payload = { ...valid };
    delete payload[field];
    const h = createHarness();
    assert.equal(h.post(payload).code, 'VALIDATION', field);
    assert.equal(h.rows.length, 1);
    assert.equal(h.trace.includes('acquire'), false);
  }
  for (const payload of ['{broken', 'null', '[]', '"hello"', ' '.repeat(16385)]) {
    assert.equal(createHarness().post(payload).code, 'VALIDATION');
  }
});

test('booleanos falsos en texto y campos de Otra institución/localidad/carrera no pasan', () => {
  for (const field of ['availability', 'termsAccepted']) {
    assert.ok(validateRegistration(createRegistration({ ...valid, [field]: 'false' }))[field]);
    assert.equal(createHarness().post({ ...valid, [field]: 'true' }).code, 'VALIDATION');
  }
  for (const [field, value] of [['institution', 'Otra institución de educación superior'], ['sede', 'Otra localidad'], ['career', 'Otra carrera o especialidad']]) {
    assert.equal(createHarness().post({ ...valid, [field]: value }).code, 'VALIDATION');
  }
  assert.equal(createHarness().post({ ...valid, skills: 'a'.repeat(501) }).code, 'VALIDATION');
});

test('migración de las 18 columnas conserva el orden y escribe cada dato bajo su encabezado', () => {
  const h = createHarness();
  assert.equal(h.post(valid).success, true);
  assert.deepEqual(h.rows[0].slice(0, 18), liveHeaders);
  for (const [header, value] of [['DNI', valid.dni], ['Número de celular', valid.phone], ['Nivel académico', valid.academicLevel], ['Sede', valid.sede], ['Carrera / Especialidad', valid.career]]) {
    assert.equal(h.rows[1][h.rows[0].indexOf(header)], value, header);
  }
  assert.equal(h.rows[0].length, 22);
  assert.equal(new Set(h.rows[0]).size, 22);
});

test('DNI con cero inicial, correo personal/institucional cruzado y variantes Gmail bloquean duplicados', () => {
  const h = createHarness();
  assert.equal(h.post({ ...valid, dni: '01234567', personalEmail: 'qa.test@gmail.com', institutionalEmail: 'qa@unsa.edu.pe' }).success, true);
  for (const data of [
    { dni: '01234567', personalEmail: 'other@example.test' },
    { dni: '90000002', personalEmail: 'QATEST+evento@googlemail.com' },
    { dni: '90000003', personalEmail: ' QA@UNSA.EDU.PE ' },
    { dni: '90000004', personalEmail: 'new@example.test', institutionalEmail: 'qa@unsa.edu.pe' },
  ]) assert.equal(h.post({ ...valid, ...data }).isDuplicate, true);
  assert.equal(h.rows.length, 2);
  // Sheets antiguos pueden haber convertido el DNI a número.
  const row = Array(18).fill(''); row[3] = 1234567;
  assert.equal(createHarness({ rows: [liveHeaders, row] }).post({ ...valid, dni: '01234567' }).isDuplicate, true);
});

test('la hoja se amplía al superar su cantidad inicial de filas y columnas', () => {
  const h = createHarness({ maxRows: 1, maxColumns: 18 });
  assert.equal(h.post(valid).success, true);
  assert.ok(h.trace.includes('expand-rows'));
  assert.ok(h.trace.includes('expand-columns'));
});

test('bloqueo libera tras flush y antes del correo; fallo de correo conserva registro', () => {
  const h = createHarness({ mailFailure: true });
  const result = h.post(valid);
  assert.equal(result.success, true);
  assert.equal(result.emailSent, false);
  assert.ok(h.trace.indexOf('acquire') < h.trace.indexOf('write'));
  assert.ok(h.trace.indexOf('flush') < h.trace.indexOf('release'));
  assert.ok(h.trace.indexOf('release') < h.trace.indexOf('email'));
  assert.equal(h.post(valid).isDuplicate, true);
});

test('saturación y fallo de almacenamiento responden JSON sin éxito falso y liberan bloqueo', () => {
  const busy = createHarness({ busy: true });
  assert.equal(busy.post(valid).code, 'BUSY');
  assert.equal(busy.rows.length, 1);
  assert.equal(busy.trace.includes('release'), false);
  const failure = createHarness({ storageFailure: true });
  assert.equal(failure.post(valid).code, 'STORAGE_ERROR');
  assert.equal(failure.trace.at(-1), 'release');
});

test('códigos no se reutilizan al borrar una fila y datos no ejecutan fórmulas', () => {
  const h = createHarness();
  const first = h.post({ ...valid, skills: '=IMPORTXML("bad")' });
  assert.equal(h.rows[1][h.rows[0].indexOf('Habilidades principales')], '\'=IMPORTXML("bad")');
  h.rows.pop();
  const second = h.post({ ...valid, dni: '90000002', personalEmail: 'second@example.test' });
  assert.notEqual(second.registrationId, first.registrationId);
});

test('80 envíos en 8 workers: DNI repetido, Gmail repetido y registros distintos', async () => {
  const pool = createWorkerPool();
  try {
    const sameDni = await Promise.all(Array.from({ length: 24 }, (_, i) => pool.post({ ...valid, personalEmail: `dni-${i}@example.test` })));
    assert.equal(sameDni.filter((r) => r.success).length, 1);
    assert.equal(sameDni.filter((r) => r.isDuplicate).length, 23);
    const sameGmail = await Promise.all(Array.from({ length: 24 }, (_, i) => pool.post({ ...valid, dni: String(91000000 + i), personalEmail: `Q.A+${i}@gmail.com` })));
    assert.equal(sameGmail.filter((r) => r.success).length, 1);
    assert.equal(sameGmail.filter((r) => r.isDuplicate).length, 23);
    const unique = await Promise.all(Array.from({ length: 32 }, (_, i) => pool.post({ ...valid, dni: String(92000000 + i), personalEmail: `unique-${i}@example.test` })));
    assert.equal(unique.filter((r) => r.success).length, 32);
    const rows = pool.store.read().rows;
    assert.equal(rows.length, 35);
    assert.equal(new Set(rows.slice(1).map((row) => row[0])).size, 34);
  } finally { await pool.close(); }
});

test('adaptador HTTP: éxito, duplicado, BUSY, respuesta inválida, caída y timeout', async () => {
  const original = globalThis.fetch;
  try {
    const repo = new AppsScriptRegistrationRepository('https://qa.example.test');
    globalThis.fetch = async () => new Response(JSON.stringify({ success: true, capabilities: { phone: true, atomicDuplicates: true } }));
    const healthResponse = globalThis.fetch;
    globalThis.fetch = async (_url, options) => options.method === 'POST'
      ? new Response(JSON.stringify({ success: true, registrationId: 'IM-QA-1', registeredAt: '2026-10-09T00:00:00.000Z' })) : healthResponse();
    assert.equal((await repo.save(valid)).registrationId, 'IM-QA-1');
    globalThis.fetch = async () => new Response(JSON.stringify({ success: false, isDuplicate: true }));
    await assert.rejects(repo.save(valid), RegistrationDuplicateError);
    globalThis.fetch = async () => new Response(JSON.stringify({ success: false, code: 'BUSY', error: 'Servidor ocupado' }));
    await assert.rejects(repo.save(valid), /Servidor ocupado/);
    globalThis.fetch = async () => new Response('<html>bad</html>');
    await assert.rejects(repo.save(valid), /inesperada/);
    globalThis.fetch = async () => new Response('{"success":true}');
    await assert.rejects(repo.save(valid), /no confirma/);
    globalThis.fetch = async () => { throw new Error('Network'); };
    await assert.rejects(repo.save(valid), /conectar/);
    globalThis.fetch = (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('Aborted'))));
    await assert.rejects(new AppsScriptRegistrationRepository('https://qa.example.test', 10).save(valid), /podría haberse guardado/);
  } finally { globalThis.fetch = original; }
});

test('backend anterior bloquea el envío para no perder el celular ni escribir en columnas incorrectas', async () => {
  const original = globalThis.fetch;
  let posts = 0;
  try {
    const repo = new AppsScriptRegistrationRepository('https://qa.example.test');
    globalThis.fetch = async (_url, options) => {
      if (options.method === 'POST') posts++;
      return new Response('{"success":true,"version":"v2.2-sin-codigo"}');
    };
    await assert.rejects(repo.save(valid), /actualizando/);
    assert.equal(posts, 0);
  } finally { globalThis.fetch = original; }
});

test('repositorio local reproduce duplicados sin borrar almacenamiento corrupto', async () => {
  const original = globalThis.localStorage;
  let stored = null;
  globalThis.localStorage = { getItem: () => stored, setItem: (_key, value) => { stored = value; } };
  try {
    const repo = new FakeRegistrationRepository();
    await repo.save({ ...valid, personalEmail: 'q.a@gmail.com' });
    await assert.rejects(repo.save({ ...valid, dni: '90000002', personalEmail: 'QA+test@gmail.com' }), RegistrationDuplicateError);
    stored = '{bad';
    await assert.rejects(repo.save(valid), /guardar/);
    assert.equal(stored, '{bad');
  } finally { globalThis.localStorage = original; }
});
