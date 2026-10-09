import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { startQaApi } from './qa-api-server.mjs';
await mkdir('test-results', { recursive: true });
const api = await startQaApi(0);
try {
  const child = spawn('k6', ['run', '--summary-export=test-results/k6-local.json', 'tests/k6/registration.js'], {
    stdio: 'inherit', env: { ...process.env, QA_ENDPOINT: api.url, QA_RUN_ID: String(Date.now()).slice(-6) },
  });
  const code = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', resolve); });
  if (code !== 0) process.exitCode = code || 1;
} finally { await api.close(); }
