import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../apps-script/Code.gs', import.meta.url), 'utf8');

function isBlank(cell) {
  return cell === '' || cell === null || cell === undefined;
}

function createSheet(name, rows) {
  const data = rows.map((row) => row.slice());
  const ensure = (row, col) => {
    while (data.length < row) data.push([]);
    while (data[row - 1].length < col) data[row - 1].push('');
  };
  const sheet = {
    name,
    rows: data,
    getLastRow() {
      let last = 0;
      data.forEach((row, i) => { if (row.some((cell) => !isBlank(cell))) last = i + 1; });
      return last;
    },
    getLastColumn() {
      let last = 0;
      data.forEach((row) => row.forEach((cell, j) => { if (!isBlank(cell)) last = Math.max(last, j + 1); }));
      return last;
    },
    getMaxRows() { return Math.max(data.length, 1000); },
    getMaxColumns() { return 1000; },
    setFrozenRows() {},
    insertRowsAfter() {},
    insertColumnsAfter() {},
    insertColumnBefore(col) {
      const width = sheet.getLastColumn();
      data.forEach((row) => { while (row.length < width) row.push(''); row.splice(col - 1, 0, ''); });
    },
    deleteColumn(col) {
      data.forEach((row) => { while (row.length < col) row.push(''); row.splice(col - 1, 1); });
    },
    appendRow(row) { data.push(row.slice()); },
    clear() { data.length = 0; },
    getRange(row, col, numRows = 1, numCols = 1) {
      const range = {
        getValues() {
          return Array.from({ length: numRows }, (_, i) => Array.from({ length: numCols }, (_, j) => data[row - 1 + i]?.[col - 1 + j] ?? ''));
        },
        setValues(values) {
          values.forEach((r, i) => { ensure(row + i, col + r.length - 1); r.forEach((v, j) => { data[row - 1 + i][col - 1 + j] = v; }); });
          return range;
        },
        setValue(value) { ensure(row, col); data[row - 1][col - 1] = value; return range; },
        setNumberFormat() { return range; },
        setFontWeight() { return range; },
      };
      return range;
    },
    getParent() { return { getId: () => 'fixture' }; },
  };
  return sheet;
}

function createContext(initialSheets) {
  const sheets = {};
  Object.entries(initialSheets).forEach(([name, rows]) => { sheets[name] = createSheet(name, rows); });
  const book = {
    getSheetByName(name) { return sheets[name] || null; },
    insertSheet(name) { sheets[name] = createSheet(name, []); return sheets[name]; },
    getId: () => 'fixture',
  };
  const context = vm.createContext({
    console,
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => null, setProperty: () => {} }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {}, waitLock: () => {} }) },
    SpreadsheetApp: { openById: () => book, getActive: () => book, flush: () => {} },
    ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput: (text) => ({ text, setMimeType() { return this; } }) },
    UrlFetchApp: { fetch: () => { throw new Error('network disabled'); } },
    MailApp: { sendEmail: () => {} },
    GmailApp: { sendEmail: () => {} },
    Utilities: { sleep: () => {}, formatDate: (d) => String(d) },
    Session: { getScriptTimeZone: () => 'UTC' },
  });
  vm.runInContext(source, context, { filename: 'Code.gs' });
  return {
    sheets,
    context,
    get: (params) => JSON.parse(context.doGet({ parameter: params }).text),
    post: (payload) => JSON.parse(context.doPost({ postData: { contents: JSON.stringify(payload) } }).text),
  };
}

const registros = [
  ['Código', 'Fecha de registro', 'Nombres y apellidos', 'DNI', 'Correo personal'],
  ['IM-2026-0001', '2026-10-01T10:00:00Z', 'Luis Sequeiros', '72859994', 'luis@example.com'],
];

test('attendanceMatrix: ?action=data devuelve la nómina de Registros', () => {
  const harness = createContext({ Registros: registros });
  const response = harness.get({ action: 'data' });
  assert.equal(response.success, true);
  assert.equal(response.data.length, 1);
  assert.equal(response.data[0]['Código'], 'IM-2026-0001');
  assert.equal(response.data[0]['DNI'], '72859994');
});

test('attendanceMatrix: markAttendance escribe en Asistencias sin tocar la cabecera de Registros', () => {
  const harness = createContext({ Registros: registros });
  const registroHeaderBefore = JSON.stringify(harness.sheets.Registros.rows[0]);

  const result = harness.post({
    action: 'markAttendance',
    codigo: 'IM-2026-0001', dni: '72859994', nombre: 'Luis Sequeiros',
    sessionId: 'asistencia-1', sessionName: 'Asistencia 1', timestamp: '10:00:00',
  });
  assert.equal(result.success, true);

  const matrix = harness.sheets.Asistencias.rows;
  assert.deepEqual(matrix[0], ['Código', 'DNI', 'Nombres y Apellidos', 'Asistencia 1', 'Total Asistencia']);
  assert.equal(matrix[1][0], 'IM-2026-0001');
  assert.equal(matrix[1][matrix[0].indexOf('Asistencia 1')], '10:00:00');
  assert.equal(matrix[1][matrix[0].indexOf('Total Asistencia')], 1);

  // La hoja de inscripción permanece intacta
  assert.equal(JSON.stringify(harness.sheets.Registros.rows[0]), registroHeaderBefore);
  assert.equal(harness.sheets.Registros.rows.length, 2);
});

test('attendanceMatrix: una segunda sesión añade columna y recalcula el total', () => {
  const harness = createContext({ Registros: registros });
  harness.post({ action: 'markAttendance', codigo: 'IM-2026-0001', dni: '72859994', nombre: 'Luis', sessionId: 'asistencia-1', sessionName: 'Asistencia 1', timestamp: '10:00:00' });
  harness.post({ action: 'markAttendance', codigo: 'IM-2026-0001', dni: '72859994', nombre: 'Luis', sessionId: 'asistencia-2', sessionName: 'Asistencia 2', timestamp: '11:00:00' });

  const matrix = harness.sheets.Asistencias.rows;
  assert.deepEqual(matrix[0], ['Código', 'DNI', 'Nombres y Apellidos', 'Asistencia 1', 'Asistencia 2', 'Total Asistencia']);
  assert.equal(matrix[1][matrix[0].indexOf('Total Asistencia')], 2);
});

test('attendanceMatrix: unmarkAttendance limpia la marca y el total', () => {
  const harness = createContext({ Registros: registros });
  harness.post({ action: 'markAttendance', codigo: 'IM-2026-0001', dni: '72859994', nombre: 'Luis', sessionId: 'asistencia-1', sessionName: 'Asistencia 1', timestamp: '10:00:00' });
  harness.post({ action: 'markAttendance', codigo: 'IM-2026-0001', dni: '72859994', nombre: 'Luis', sessionId: 'asistencia-2', sessionName: 'Asistencia 2', timestamp: '11:00:00' });
  harness.post({ action: 'unmarkAttendance', codigo: 'IM-2026-0001', sessionName: 'Asistencia 2' });

  const matrix = harness.sheets.Asistencias.rows;
  assert.equal(matrix[1][matrix[0].indexOf('Asistencia 2')], '');
  assert.equal(matrix[1][matrix[0].indexOf('Total Asistencia')], 1);
});

test('attendanceMatrix: clearSession vacía la columna y recalcula', () => {
  const harness = createContext({ Registros: registros });
  harness.post({ action: 'markAttendance', codigo: 'IM-2026-0001', dni: '72859994', nombre: 'Luis', sessionId: 'asistencia-1', sessionName: 'Asistencia 1', timestamp: '10:00:00' });
  harness.post({ action: 'clearSession', sessionName: 'Asistencia 1' });

  const matrix = harness.sheets.Asistencias.rows;
  assert.equal(matrix[1][matrix[0].indexOf('Asistencia 1')], '');
  assert.equal(matrix[1][matrix[0].indexOf('Total Asistencia')], 0);
});

test('attendanceMatrix: send_test se enruta a campañas y no crea la hoja Asistencias', () => {
  const harness = createContext({ Registros: registros });
  const result = harness.post({ action: 'send_test', to: 'qa@example.test', subject: 'Hola', plainBody: 'Prueba' });
  assert.equal(result.success, true);
  assert.equal(harness.sheets.Asistencias, undefined);
});

test('attendanceMatrix: ?action=attendance devuelve la matriz oficial en solo lectura', () => {
  const harness = createContext({ Registros: registros });

  // Sin hoja Asistencias: matriz vacía, y NO se crea la hoja.
  const empty = harness.get({ action: 'attendance' });
  assert.equal(empty.success, true);
  assert.deepEqual(empty.headers, []);
  assert.equal(empty.total, 0);
  assert.equal(harness.sheets.Asistencias, undefined);

  harness.post({ action: 'markAttendance', codigo: 'IM-2026-0001', dni: '72859994', nombre: 'Luis', sessionId: 'asistencia-1', sessionName: 'Asistencia 1', timestamp: '10:00:00' });

  const matrix = harness.get({ action: 'attendance' });
  assert.equal(matrix.success, true);
  assert.deepEqual(matrix.headers, ['Código', 'DNI', 'Nombres y Apellidos', 'Asistencia 1', 'Total Asistencia']);
  assert.equal(matrix.total, 1);
  assert.equal(matrix.data[0]['Código'], 'IM-2026-0001');
  assert.equal(matrix.data[0]['Asistencia 1'], '10:00:00');
  assert.equal(matrix.data[0]['Total Asistencia'], '1');
});

test('attendanceMatrix: repararMatrizAsistencia elimina duplicados y restaura el total', () => {
  const harness = createContext({
    Asistencias: [
      ['Código', 'DNI', 'Nombres y Apellidos', 'Nombres y Apellidos', 'Asistencia 1', 'Asistencia 2'],
      ['IM-1', '11111111', 'Ana Flores', '', '09:00', ''],
    ],
  });
  const report = harness.context.repararMatrizAsistencia(harness.sheets.Asistencias);
  const matrix = harness.sheets.Asistencias.rows;

  assert.equal(typeof report, 'string');
  assert.deepEqual(matrix[0], ['Código', 'DNI', 'Nombres y Apellidos', 'Asistencia 1', 'Asistencia 2', 'Total Asistencia']);
  assert.equal(matrix[1][0], 'IM-1');
  assert.equal(matrix[1][matrix[0].indexOf('Total Asistencia')], 1);
});

const registrosForm = [
  ['Código', 'Fecha de registro', 'Nombres y apellidos', 'DNI', 'Correo personal'],
  ['IM-2026-0001', '2026-10-01T10:00:00Z', 'Luis Sequeiros', '72859994', 'luis@example.com'],
  ['IM-2026-0002', '2026-10-01T10:00:00Z', 'Ana Flores', '7654321', 'ana@example.com'],
];

const respuestasForm = [
  ['Marca temporal', 'Sesión', 'DNI'],
  ['11/10/2026 18:30', 'Asistencia 1', '72859994'],
  ['11/10/2026 19:00', 'Asistencia 2', '72859994'],
  ['11/10/2026 19:05', 'Asistencia 1', '7654321'],
  ['11/10/2026 19:10', 'Asistencia 3', '99999999'],
];

test('canonicalSession normaliza nombres, números y tokens a la columna oficial', () => {
  const harness = createContext({ Registros: registrosForm });
  const canon = (v) => harness.context.canonicalSession(v);
  assert.equal(canon('Asistencia 3'), 'Asistencia 3');
  assert.equal(canon('asistencia-4'), 'Asistencia 4');
  assert.equal(canon('Sesion 2'), 'Asistencia 2');
  assert.equal(canon('5'), 'Asistencia 5');
  assert.equal(canon('Asistencia 9'), '');
  assert.equal(canon(''), '');
});

test('rebuildAttendanceMatrix cruza nómina y respuestas, rellena 6 columnas y calcula total', () => {
  const harness = createContext({ Registros: registrosForm, FormAsistencia: respuestasForm });
  const report = harness.context.rebuildAttendanceMatrix();
  const matrix = harness.sheets.Asistencias.rows;

  assert.equal(report.success, true);
  assert.equal(report.rows, 2);
  assert.equal(report.matched, 3);
  assert.equal(report.unmatched, 1);

  assert.deepEqual(matrix[0], [
    'Código', 'DNI', 'Nombres y Apellidos',
    'Asistencia 1', 'Asistencia 2', 'Asistencia 3', 'Asistencia 4', 'Asistencia 5', 'Asistencia 6',
    'Total Asistencia',
  ]);

  const headers = matrix[0];
  const luis = matrix.find((row) => row[0] === 'IM-2026-0001');
  const ana = matrix.find((row) => row[0] === 'IM-2026-0002');

  assert.equal(luis[headers.indexOf('Nombres y Apellidos')], 'Luis Sequeiros');
  assert.equal(luis[headers.indexOf('Asistencia 1')], '11/10/2026 18:30');
  assert.equal(luis[headers.indexOf('Asistencia 2')], '11/10/2026 19:00');
  assert.equal(luis[headers.indexOf('Total Asistencia')], 2);

  assert.equal(ana[headers.indexOf('DNI')], '07654321');
  assert.equal(ana[headers.indexOf('Asistencia 1')], '11/10/2026 19:05');
  assert.equal(ana[headers.indexOf('Total Asistencia')], 1);

  // El DNI no reconocido no crea fila alguna.
  assert.equal(matrix.length, 3);
});

test('rebuildAttendanceMatrix preserva las marcas manuales y es idempotente', () => {
  const harness = createContext({
    Registros: registrosForm,
    FormAsistencia: respuestasForm,
    Asistencias: [
      ['Código', 'DNI', 'Nombres y Apellidos', 'Asistencia 1', 'Asistencia 4', 'Total Asistencia'],
      ['IM-2026-0001', '72859994', 'Luis Sequeiros', '', '18:00 (manual)', ''],
    ],
  });

  harness.context.rebuildAttendanceMatrix();
  const first = JSON.stringify(harness.sheets.Asistencias.rows);

  harness.context.rebuildAttendanceMatrix();
  const second = JSON.stringify(harness.sheets.Asistencias.rows);
  assert.equal(first, second);

  const matrix = harness.sheets.Asistencias.rows;
  const headers = matrix[0];
  const luis = matrix.find((row) => row[0] === 'IM-2026-0001');
  assert.equal(luis[headers.indexOf('Asistencia 4')], '18:00 (manual)');
  assert.equal(luis[headers.indexOf('Asistencia 1')], '11/10/2026 18:30');
  assert.equal(luis[headers.indexOf('Total Asistencia')], 3);
});
