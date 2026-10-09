import { parentPort, workerData } from 'node:worker_threads';
import { createHarness, createSharedStore } from './apps-script-harness.mjs';
const store = createSharedStore(workerData.buffer);
const harness = createHarness({ store, lock: store.lock, testMode: true });
parentPort.on('message', ({ id, payload }) => {
  try { parentPort.postMessage({ id, result: harness.post(payload) }); }
  catch (error) { parentPort.postMessage({ id, error: error.message }); }
});
