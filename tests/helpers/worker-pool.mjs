import { Worker } from 'node:worker_threads';
import { createSharedStore } from './apps-script-harness.mjs';
export function createWorkerPool(size = 8) {
  const store = createSharedStore();
  const workers = Array.from({ length: size }, () => new Worker(new URL('./registration-worker.mjs', import.meta.url), { workerData: { buffer: store.buffer } }));
  const pending = new Map();
  let id = 0;
  workers.forEach((worker) => {
    worker.on('message', ({ id: requestId, result, error }) => {
      const task = pending.get(requestId);
      pending.delete(requestId);
      if (error) task?.reject(new Error(error)); else task?.resolve(result);
    });
    worker.on('error', (error) => { for (const task of pending.values()) task.reject(error); pending.clear(); });
  });
  return {
    store,
    post(payload) { return new Promise((resolve, reject) => { const requestId = id++; pending.set(requestId, { resolve, reject }); workers[requestId % size].postMessage({ id: requestId, payload }); }); },
    close() { return Promise.all(workers.map((worker) => worker.terminate())); },
  };
}
