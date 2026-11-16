/**
 * Fase B — Prueba de ESCRITURA contra el endpoint REAL de Apps Script en modo QA.
 *
 * SOLO escribe si el endpoint responde en TEST MODE con un spreadsheet QA distinto
 * al de producción. Si no, ABORTA sin enviar un solo POST.
 *
 * Mide: S (tiempo de una escritura secuencial bajo lock), ok / BUSY / no-JSON,
 * latencia y luego verifica la integridad de la hoja QA.
 *
 * Uso:
 *   QA_URL=<url-qa> npm run test:stress:remote
 *
 * Variables:
 *   QA_URL           URL del deployment QA en TEST MODE (obligatoria)
 *   STRESS_SESSION   sesión/columna a usar (default: 'Prueba')
 *   STRESS_SEQ       escrituras secuenciales para medir S (default: 8)
 *   STRESS_BATCH1    tamaño del primer lote concurrente (default: 30)
 *   STRESS_BATCH2    tamaño del segundo lote concurrente (default: 100)
 */
const PROD_SPREADSHEET_ID = '1U48ftJJns3-4waJrt4A4uaI4OBNQoeyg1sOzzvXllI8';
const ENDPOINT = process.env.QA_URL || process.env.PROBE_ENDPOINT || '';
const SESSION = process.env.STRESS_SESSION || 'Prueba';
const N_SEQ = Number(process.env.STRESS_SEQ || 8);
const B1 = Number(process.env.STRESS_BATCH1 || 30);
const B2 = Number(process.env.STRESS_BATCH2 || 100);
const RUN = Date.now().toString(36).slice(-5).toUpperCase();

if (!ENDPOINT) {
  console.error('Falta QA_URL. Ejemplo: QA_URL=https://script.google.com/macros/s/XXX/exec npm run test:stress:remote');
  process.exit(2);
}

const withParam = (action) => `${ENDPOINT}${ENDPOINT.includes('?') ? '&' : '?'}action=${action}`;

async function getJson(url) {
  const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(45000) });
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, json: JSON.parse(text), text };
  } catch {
    return { ok: res.ok, status: res.status, json: null, text };
  }
}

const samples = [];
async function post(url, payload) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: AbortSignal.timeout(60000),
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      if (samples.length < 3) samples.push(text.slice(0, 260));
    }
    return { ms: Date.now() - t0, ok: res.ok, status: res.status, json, text };
  } catch (err) {
    return { ms: Date.now() - t0, ok: false, error: err.name || err.message };
  }
}

function pct(sorted, p) {
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
}

function classify(r) {
  if (r.json?.success === true) return 'ok';
  if (r.json?.code) return r.json.code;
  if (r.json) return 'json-sin-flag';
  if (r.error) return r.error;
  return `HTTP ${r.status} (no-JSON)`;
}

const runSuffix = Date.now() % 80000000;
const codigoFor = (i) => `QA-${RUN}-${String(i).padStart(3, '0')}`;
const dniFor = (i) => String(10000000 + ((runSuffix + i) % 80000000)).padStart(8, '0');
const payloadFor = (i) => ({
  action: 'markAttendance',
  codigo: codigoFor(i),
  dni: dniFor(i),
  nombre: `Prueba ${RUN} ${i}`,
  equipo: `QA ${i % 5}`,
  sessionName: SESSION,
  timestamp: `10:${String(i % 60).padStart(2, '0')}:00`,
});

// ---------------------------------------------------------------------------
console.log(`\n=== FASE B · Escritura QA · corrida ${RUN} ===`);
console.log(`Endpoint: ${ENDPOINT}`);
console.log(`Sesión: ${SESSION}`);

const health = await getJson(ENDPOINT);
if (!health.json) {
  console.error('El endpoint no devuelve JSON. ABORTO.');
  process.exit(2);
}
console.log(`Health: testMode=${health.json.testMode} · testSpreadsheetId=${health.json.testSpreadsheetId} · version=${health.json.version}`);
if (health.json.testMode !== true) {
  console.error('ABORTADO: el endpoint NO está en TEST MODE. No se envía nada (protege producción).');
  process.exit(2);
}
const qaId = health.json.testSpreadsheetId;
if (!qaId || qaId === PROD_SPREADSHEET_ID) {
  console.error('ABORTADO: el spreadsheet de prueba es inválido o coincide con PRODUCCIÓN.');
  process.exit(2);
}
console.log('Guardas OK: TEST MODE activo y hoja QA separada.');

// Calentamiento.
await Promise.all(Array.from({ length: 3 }, (_, i) => post(ENDPOINT, payloadFor(1000 + i))));

// Calibración secuencial: mide S = tiempo de UNA escritura bajo lock, sin contención.
console.log(`\n— Calibración secuencial (mide S, ${N_SEQ} escrituras) —`);
const seq = [];
for (let i = 0; i < N_SEQ; i++) {
  const r = await post(ENDPOINT, payloadFor(2000 + i));
  seq.push(r.ms);
  console.log(`  #${i + 1}: ${String(r.ms).padStart(5)} ms · ${classify(r)}`);
}
const seqSorted = [...seq].sort((a, b) => a - b);
const S = pct(seqSorted, 50);
console.log(`  → S (mediana): ${S} ms · mín ${seqSorted[0]} · máx ${seqSorted[seqSorted.length - 1]}`);

async function batch(label, start, n) {
  const started = Date.now();
  const results = await Promise.all(Array.from({ length: n }, (_, k) => post(ENDPOINT, payloadFor(start + k))));
  const wall = Date.now() - started;
  const tally = results.reduce((acc, r) => {
    const key = classify(r);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const lat = results.map((r) => r.ms).sort((a, b) => a - b);
  console.log(`\n— ${label} (${n} check-ins concurrentes) —`);
  console.log(`  resultado: ${JSON.stringify(tally)}`);
  console.log(`  latencia p50 / p95 / máx: ${pct(lat, 50)} / ${pct(lat, 95)} / ${lat[lat.length - 1]} ms`);
  console.log(`  tiempo de muro: ${wall} ms · ok=${tally.ok || 0}/${n} (${(((tally.ok || 0) / n) * 100).toFixed(0)}%)`);
  return tally;
}

const t1 = await batch('Batch 1', 1, B1);
const t2 = await batch('Batch 2', 31, B2);

if (samples.length) {
  console.log('\n— Muestra de respuestas no-JSON (posible throttling de Google) —');
  samples.forEach((s, i) => console.log(`  [${i + 1}] ${JSON.stringify(s)}`));
}

const matrix = await getJson(withParam('attendance'));
const rows = matrix.json?.data || [];
const mine = rows.filter((r) => String(r['Código'] || '').startsWith(`QA-${RUN}-`));
const marked = mine.filter((r) => String(r[SESSION] ?? '').trim() !== '');
const codes = mine.map((r) => String(r['Código']));
const unique = new Set(codes).size;

const expected = 3 + N_SEQ + (t1.ok || 0) + (t2.ok || 0);
console.log('\n— Verificación en la hoja QA (?action=attendance) —');
console.log(`  filas de esta corrida: ${mine.length} · esperadas (éxitos): ${expected} · únicos: ${unique} · duplicados: ${codes.length - unique}`);
console.log(`  con marca en '${SESSION}': ${marked.length}`);

const integrity = mine.length === expected && unique === expected && marked.length === expected;
const clean = !t1.BUSY && !t2.BUSY && integrity;
console.log(integrity ? '  ✅ integridad: sin pérdidas, sin duplicados.' : '  ⚠️ integridad: revisar conteos.');
console.log(clean ? '\n✅ RESULTADO: limpio (sin BUSY).' : '\nℹ️ RESULTADO: hubo BUSY (esperado bajo esta carga). Ver S y conclusiones.');
