import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { liveHeaders } from '../fixtures/registration.mjs';

const source = readFileSync(new URL('../../apps-script/Code.gs', import.meta.url), 'utf8');

// Runs the actual Code.gs with service doubles. It does not emulate Google quotas,
// network availability or MailApp deliverability. Shared storage supports worker tests.
export function createHarness({ rows = [liveHeaders], store, lock, busy = false, storageFailure = false, mailFailure = false, testMode = false, properties = {}, maxRows = 987, maxColumns = 26 } = {}) {
  let state = { rows: structuredClone(rows), properties: { ...properties } };
  const trace = [];
  let held = false;
  const read = () => store ? store.read() : state;
  const write = (next) => { if (store) store.write(next); else state = next; };
  const sheet = {
    getLastRow: () => read().rows.length,
    getLastColumn: () => Math.max(0, ...read().rows.map((row) => row.length)),
    getMaxRows: () => maxRows,
    getMaxColumns: () => maxColumns,
    insertRowsAfter(_row, count) { maxRows += count; trace.push('expand-rows'); },
    insertColumnsAfter(_column, count) { maxColumns += count; trace.push('expand-columns'); },
    getParent: () => ({ getId: () => 'qa-fixture' }),
    setFrozenRows() {},
    appendRow(row) { const next = read(); next.rows.push(row); write(next); },
    getRange(r, c, nr = 1, nc = 1) {
      const range = {
        getValues() {
          trace.push('read');
          const current = read().rows;
          return Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => current[r - 1 + i]?.[c - 1 + j] ?? ''));
        },
        setValues(values) {
          if (!held) throw new Error('Write without script lock');
          if (storageFailure) throw new Error('Storage unavailable');
          trace.push('write');
          const next = read();
          values.forEach((row, i) => {
            next.rows[r - 1 + i] ??= [];
            row.forEach((v, j) => { next.rows[r - 1 + i][c - 1 + j] = v; });
          });
          write(next);
          return range;
        },
        setNumberFormat() { return range; },
        setFontWeight() { return range; },
      };
      return range;
    },
  };
  const book = { getSheetByName: () => sheet, insertSheet: () => sheet, getId: () => 'production-fixture' };
  const props = {
    getProperty(key) {
      if (key === 'REGISTRATION_TEST_MODE') return String(testMode);
      if (key === 'QA_SPREADSHEET_ID') return 'qa-fixture';
      return read().properties[key] ?? null;
    },
    setProperty(key, value) { const next = read(); next.properties[key] = value; write(next); },
  };
  const context = vm.createContext({
    console: { log() {}, warn() {}, error() {} },
    PropertiesService: { getScriptProperties: () => props },
    LockService: { getScriptLock: () => ({
      tryLock(ms) { held = !busy && (lock ? lock.acquire(ms) : true); trace.push(held ? 'acquire' : 'busy'); return held; },
      releaseLock() { trace.push('release'); held = false; lock?.release(); },
      waitLock(ms) { if (!this.tryLock(ms)) throw new Error('Busy'); },
    }) },
    SpreadsheetApp: { getActive: () => book, openById: () => ({ ...book, getId: () => 'qa-fixture' }), flush() { trace.push('flush'); } },
    ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput: (text) => ({ text, setMimeType() { return this; } }) },
    UrlFetchApp: { fetch() { throw new Error('Network deliberately disabled in harness'); } },
    MailApp: { sendEmail() { if (held) throw new Error('Email holds the sheet lock'); trace.push('email'); if (mailFailure) throw new Error('Quota'); } },
  });
  vm.runInContext(source, context, { filename: 'Code.gs' });
  return {
    trace,
    get rows() { return read().rows; },
    post(data) { return JSON.parse(context.doPost({ postData: { contents: typeof data === 'string' ? data : JSON.stringify(data) } }).text); },
    health() { return JSON.parse(context.doGet().text); },
    evaluate(code) { return vm.runInContext(code, context); },
  };
}

export function createSharedStore(buffer = new SharedArrayBuffer(2 * 1024 * 1024)) {
  const control = new Int32Array(buffer, 0, 4);
  const bytes = new Uint8Array(buffer, 16);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  return {
    buffer,
    read() {
      for (;;) {
        const version = Atomics.load(control, 2);
        if (version % 2) { Atomics.wait(control, 2, version, 10); continue; }
        const length = Atomics.load(control, 1);
        const copy = bytes.slice(0, length);
        if (version === Atomics.load(control, 2)) return length ? JSON.parse(decoder.decode(copy)) : { rows: [liveHeaders], properties: {} };
      }
    },
    write(data) {
      const encoded = encoder.encode(JSON.stringify(data));
      if (encoded.length > bytes.length) throw new Error('Harness capacity exceeded');
      Atomics.add(control, 2, 1);
      bytes.set(encoded);
      Atomics.store(control, 1, encoded.length);
      Atomics.add(control, 2, 1);
      Atomics.notify(control, 2);
    },
    lock: {
      acquire(timeoutMs) {
        const deadline = Date.now() + timeoutMs;
        while (Atomics.compareExchange(control, 0, 0, 1) !== 0) {
          const remaining = deadline - Date.now();
          if (remaining <= 0) return false;
          Atomics.wait(control, 0, 1, remaining);
        }
        return true;
      },
      release() { Atomics.store(control, 0, 0); Atomics.notify(control, 0, 1); },
    },
  };
}
