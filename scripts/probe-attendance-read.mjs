/**
 * Fase A — Sonda de LECTURA contra el endpoint REAL de Apps Script.
 * Solo hace GET (no escribe nada):
 *   - ?action=attendance  -> getAttendanceMatrix() (solo lee)
 *   - ?action=data        -> getRosterData() (solo lee)
 *
 * Mide latencia real (p50/p95/máx) y tasa de error con concurrencia.
 *
 * Uso:
 *   npm run test:probe
 *   PROBE_ENDPOINT=<url> PROBE_USERS=50 node scripts/probe-attendance-read.mjs
 */
const ENDPOINT =
  process.env.PROBE_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbyw7LsfMZlhDWTDmCjXg-MhHlsqjIqWLnVUtQEaje1CJ-g7pgijFo2ayLeiMjrjuHx6VA/exec';
const USERS = Number(process.env.PROBE_USERS || 50);

const withParam = (action) => `${ENDPOINT}${ENDPOINT.includes('?') ? '&' : '?'}action=${action}`;
const HEALTH = ENDPOINT;

async function timed(url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(45000) });
    const text = await res.text();
    return { ms: Date.now() - t0, status: res.status, ok: res.ok, bytes: text.length, text };
  } catch (err) {
    return { ms: Date.now() - t0, ok: false, error: err.name || err.message };
  }
}

function pct(sorted, p) {
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
}

function summarize(label, results) {
  const ok = results.filter((r) => r.ok);
  const lat = ok.map((r) => r.ms).sort((a, b) => a - b);
  const errors = results.filter((r) => !r.ok);
  const errorKinds = errors.reduce((acc, r) => {
    const k = r.error || `HTTP ${r.status}`;
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  console.log(`\n— ${label} —`);
  console.log(`  peticiones: ${results.length} · ok: ${ok.length} · error: ${errors.length} (${((errors.length / results.length) * 100).toFixed(1)}%)`);
  console.log(`  latencia p50 / p95 / máx: ${pct(lat, 50)} / ${pct(lat, 95)} / ${lat[lat.length - 1] || 0} ms`);
  if (errors.length) console.log(`  errores: ${JSON.stringify(errorKinds)}`);
}

async function batch(label, action, n) {
  const url = withParam(action);
  const started = Date.now();
  const results = await Promise.all(Array.from({ length: n }, () => timed(url)));
  const wall = Date.now() - started;
  summarize(`${label} (${n} × ?action=${action})`, results);
  console.log(`  tiempo de muro: ${wall} ms · throughput: ${(n / (wall / 1000)).toFixed(2)} req/s`);
  return results;
}

// 1) Health check: versión y capacidades del endpoint desplegado.
console.log(`\n=== FASE A · Sonda de lectura ===\nEndpoint: ${ENDPOINT}`);
const health = await timed(HEALTH);
if (!health.ok) {
  console.log(`El endpoint no responde: ${health.error || `HTTP ${health.status}`}`);
  process.exit(1);
}
let healthJson = null;
try {
  healthJson = JSON.parse(health.text);
} catch {
  /* no es JSON */
}
console.log(`Health (${health.ms} ms): ${healthJson ? JSON.stringify(healthJson) : health.text.slice(0, 200)}`);

// 2) ¿El endpoint soporta las lecturas esperadas?
const attProbe = await timed(withParam('attendance'));
let attJson = null;
try {
  attJson = JSON.parse(attProbe.text);
} catch {
  /* no es JSON */
}
const supportsAttendance = Boolean(attJson && attJson.success === true && Array.isArray(attJson.headers));
console.log(`\n?action=attendance soportado: ${supportsAttendance ? 'SÍ' : 'NO (devuelve health u otra cosa)'}`);
if (supportsAttendance) {
  console.log(`  hoja: ${attJson.sheet} · columnas: ${(attJson.headers || []).length} · filas: ${attJson.total}`);
} else {
  console.log(`  ⚠️ El deployment actual quizá no tiene el módulo de asistencia nuevo. Respuesta: ${attProbe.text.slice(0, 200)}`);
}

const dataProbe = await timed(withParam('data'));
let dataJson = null;
try {
  dataJson = JSON.parse(dataProbe.text);
} catch {
  /* no es JSON */
}
const supportsRoster = Boolean(dataJson && dataJson.success === true && Array.isArray(dataJson.data));
console.log(`?action=data soportado: ${supportsRoster ? 'SÍ' : 'NO'}`);
if (supportsRoster) console.log(`  participantes en nómina: ${dataJson.data.length}`);

// 3) Calentamiento.
await batch('Calentamiento', 'attendance', 5);

// 4) Cargas concurrentes.
await batch('Batch 1', 'attendance', USERS);
await batch('Batch 2', 'data', USERS);
await batch('Batch 3 (100 cargas de página)', 'attendance', 100);

console.log('\nSonda completada. No se escribió nada en la hoja.');
