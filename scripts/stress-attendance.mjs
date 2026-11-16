/**
 * Prueba de estrés LOCAL del check-in de asistencia.
 *
 * Ejecuta el Code.gs REAL (apps-script/Code.gs) en workers paralelos contra una
 * hoja en memoria con un lock compartido — el mismo mecanismo que usa Apps Script
 * (LockService.getScriptLock). No toca ninguna hoja de producción ni la red.
 *
 * Uso:
 *   node scripts/stress-attendance.mjs
 *
 * Variables opcionales:
 *   STRESS_USERS    número de check-ins simultáneos (default: 100)
 *   STRESS_WORKERS  workers paralelos que ejecutan Code.gs (default: 8)
 *   STRESS_SESSION  nombre de la sesión/columna (default: 'Asistencia 1')
 */
import { createWorkerPool } from '../tests/helpers/worker-pool.mjs';

const USERS = Number(process.env.STRESS_USERS || 100);
const WORKERS = Number(process.env.STRESS_WORKERS || 8);
const SESSION = process.env.STRESS_SESSION || 'Asistencia 1';

function payloadFor(i) {
  return {
    action: 'markAttendance',
    codigo: `IM-2026-${String(i).padStart(4, '0')}`,
    dni: String(70000000 + i),
    nombre: `Participante ${i}`,
    equipo: `Equipo ${i % 10}`,
    sessionName: SESSION,
    timestamp: `09:${String(i % 60).padStart(2, '0')}:00`,
  };
}

function pct(sorted, p) {
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
}

// ---------------------------------------------------------------------------
// Parte A — Correctitud e integridad bajo concurrencia real (in-memory, sin red)
// ---------------------------------------------------------------------------
const pool = createWorkerPool(WORKERS);
// El doble del harness usa una sola hoja en memoria; sembramos el layout real de
// la hoja 'Asistencias' (base + Total) para que la matriz se comporte igual que en producción.
pool.store.write({
  rows: [['Código', 'DNI', 'Nombres y Apellidos', 'Equipo', 'Total Asistencia']],
  properties: {},
});
const started = Date.now();
const results = await Promise.all(
  Array.from({ length: USERS }, (_, k) => {
    const t0 = Date.now();
    return pool.post(payloadFor(k + 1)).then(
      (r) => ({ ...r, ms: Date.now() - t0 }),
      (e) => ({ success: false, code: 'HARNESS_ERROR', error: e.message, ms: Date.now() - t0 })
    );
  })
);
const wallMs = Date.now() - started;
const rows = pool.store.read().rows;
await pool.close();

const tally = results.reduce((acc, r) => {
  const key = r.success ? 'ok' : r.code || 'desconocido';
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});
const lat = results.map((r) => r.ms).sort((a, b) => a - b);

const body = rows.slice(1);
const codes = body.map((r) => r[0]);
const uniqueCodes = new Set(codes).size;
const dupCodes = codes.length - uniqueCodes;
const headerRow = rows[0];
const sessionCol = headerRow.indexOf(SESSION);
const totalCol = headerRow.indexOf('Total Asistencia');
const marked = body.filter((r) => sessionCol >= 0 && String(r[sessionCol] ?? '').trim() !== '').length;
const totalsOk = body.filter((r) => totalCol >= 0 && Number(r[totalCol]) === 1).length;

console.log(`\n=== ESTRÉS LOCAL · ${USERS} check-ins simultáneos (${WORKERS} workers) ===`);
console.log(`Sesión: ${SESSION}`);
console.log(`Tiempo total (muro): ${wallMs} ms`);
console.log(`Latencia p50 / p95 / máx: ${pct(lat, 50)} / ${pct(lat, 95)} / ${lat[lat.length - 1]} ms`);
console.log(`Resultado de las respuestas: ${JSON.stringify(tally)}`);
console.log(`Filas creadas: ${body.length} · códigos únicos: ${uniqueCodes} · duplicados: ${dupCodes}`);
console.log(`Con marca en '${SESSION}': ${marked}`);
console.log(`'Total Asistencia' == 1: ${totalsOk}`);

const integrityOk =
  tally.ok === USERS && dupCodes === 0 && marked === USERS && totalsOk === USERS;
console.log(
  integrityOk
    ? 'INTEGRIDAD OK: 0 pérdidas, 0 duplicados, 0 filas corruptas.'
    : 'REVISAR: la integridad no cuadra.'
);

// ---------------------------------------------------------------------------
// Parte B — Modelo de latencia (Apps Script real). El harness no simula la
// latencia de red de flush()/lectura de Google, así que estimamos la cola del
// lock. Parámetros típicos observados en Apps Script para una hoja con cientos
// de filas. Tiempo de servicio S por check-in ≈ 0.4–0.8 s (bottleneck: flush).
// Lock wait timeout del script = 10 s (tryLock(10000) -> devuelve BUSY).
// ---------------------------------------------------------------------------
const LOCK_TIMEOUT_S = 10;
console.log('\n--- Modelo de cola del lock (Apps Script real, sin red local) ---');
console.log('S(s)  ráfaga-OK/100  BUSY  duración mín. para 0 BUSY (100 en D s)');
for (const s of [0.4, 0.6, 0.8, 1.0]) {
  const burstOk = Math.min(USERS, 1 + Math.floor(LOCK_TIMEOUT_S / s));
  const spreadNeeded = Math.ceil(USERS * s);
  console.log(`${s.toFixed(1)}   ${String(burstOk).padStart(6)}        ${String(USERS - burstOk).padStart(4)}  ${spreadNeeded}s (≈${(USERS / spreadNeeded).toFixed(2)} check-in/s)`);
}
console.log('\nNotas de plataforma Apps Script:');
console.log('- Cuenta de consumo: ~30 ejecuciones SIMULTÁNEAS del script. Una ráfaga de 100');
console.log('  al mismo instante puede devolver errores de "demasiadas invocaciones".');
console.log('- El POST del frontend usa mode:no-cors: NO puede leer la respuesta, así que un');
console.log('  BUSY/error del servidor es invisible para el participante (la UI igual dice "éxito").');
console.log('- Si los 100 escaneos se reparten en >= ~1 minuto, la cola desaparece.');

process.exit(integrityOk ? 0 : 1);
