import { createServer } from 'node:http';
import { createWorkerPool } from '../tests/helpers/worker-pool.mjs';

// Isolated local HTTP service: executes Code.gs in parallel workers against a
// shared in-memory sheet double, never against the event's real registrations.
export async function startQaApi(port = 8787) {
  const pool = createWorkerPool();
  const server = createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET') {
      const rows = pool.store.read().rows;
      if (req.url === '/metrics') {
        const dni = rows[0].indexOf('DNI');
        const phone = rows[0].indexOf('Número de celular');
        res.end(JSON.stringify({ records: rows.length - 1, uniqueCodes: new Set(rows.slice(1).map((r) => r[0])).size, uniqueDni: new Set(rows.slice(1).map((r) => r[dni])).size, phonesStored: rows.slice(1).every((r) => /^9\d{8}$/.test(r[phone])) }));
      } else res.end(JSON.stringify({ success: true, version: 'v3.0-registro-concurrente', capabilities: { phone: true, atomicDuplicates: true }, testMode: true, testSpreadsheetId: 'qa-fixture', serviceDouble: true }));
      return;
    }
    if (req.method !== 'POST') { res.writeHead(405); res.end('{}'); return; }
    let body = '';
    try {
      for await (const chunk of req) {
        body += chunk;
        if (body.length > 16384) { res.writeHead(413); res.end('{}'); return; }
      }
      res.end(JSON.stringify(await pool.post(body)));
    } catch { res.writeHead(500); res.end('{"success":false,"code":"HARNESS_ERROR"}'); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  return { url: `http://127.0.0.1:${server.address().port}`, async close() { await new Promise((resolve) => server.close(resolve)); await pool.close(); } };
}

if (process.argv[1] && new URL(import.meta.url).pathname.endsWith(process.argv[1].replaceAll('\\', '/').split('/').pop())) {
  const api = await startQaApi(Number(process.env.QA_PORT ?? 8787));
  console.log(`QA API ${api.url} (Google services are doubles)`);
  const shutdown = async () => { await api.close(); process.exit(0); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
