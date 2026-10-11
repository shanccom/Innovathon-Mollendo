// Append only in a standalone QA project. Never include in production.
function initializeQa() {
  if (SpreadsheetApp.getActive()) throw new Error('QA debe ser un proyecto independiente.');
  const properties = PropertiesService.getScriptProperties();
  let id = properties.getProperty('QA_SPREADSHEET_ID');
  if (!id) {
    const book = SpreadsheetApp.create('Innovathon QA · concurrencia · 2026-10-09');
    book.getSheets()[0].setName('Registros');
    id = book.getId();
    properties.setProperty('QA_SPREADSHEET_ID', id);
  }
  properties.setProperty('REGISTRATION_TEST_MODE', 'true');
  setup();
  console.log(JSON.stringify({ testMode: true, spreadsheetId: id, url: SpreadsheetApp.openById(id).getUrl() }));
}

function auditQa() {
  if (!isTestMode()) throw new Error('Auditoría solo disponible en QA.');
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  const field = (row, label) => row[headerIndex(headers, label)];
  const rows = values.filter(row => String(field(row, 'Origen')).startsWith('qa_'));
  const origins = {};
  rows.forEach(row => {
    const origin = field(row, 'Origen');
    origins[origin] = (origins[origin] || 0) + 1;
  });
  console.log(JSON.stringify({
    spreadsheetId: sheet.getParent().getId(),
    rows: rows.length,
    uniqueCodes: new Set(rows.map(row => field(row, 'Código'))).size,
    uniqueDni: new Set(rows.map(row => field(row, 'DNI'))).size,
    uniqueEmail: new Set(rows.map(row => emailIdentity(field(row, 'Correo personal')))).size,
    phonesStoredAsText: rows.every(row => typeof field(row, 'Número de celular') === 'string' && /^9\d{8}$/.test(field(row, 'Número de celular'))),
    origins,
  }));
}

// Functional storage smoke test, executed privately in the QA editor.
// It cannot send emails or touch the production spreadsheet.
function smokeQa() {
  if (!isTestMode()) throw new Error('Prueba solo disponible en QA.');
  const sheet = getSheet();
  if (sheet.getParent().getId() === REGISTRATION_CONFIG.PRODUCTION_SPREADSHEET_ID) throw new Error('Destino prohibido.');
  const run = String(Date.now());
  const base = {
    fullName: 'Participante Prueba', dni: '99000001', phone: '900000001',
    personalEmail: 'qa.storage.' + run + '@example.test', institutionalEmail: '',
    institution: 'Institución QA', academicLevel: '5.º año', sede: 'Mollendo / Provincia de Islay',
    career: 'Tecnología', skills: 'Prueba de almacenamiento', contributionAreas: ['Programación'],
    challengeInterest: 'Reto QA', availability: true, termsAccepted: true, source: 'qa_smoke_' + run,
  };
  function post(patch) {
    return JSON.parse(doPost({ postData: { contents: JSON.stringify(Object.assign({}, base, patch)) } }).getContent());
  }
  // The fixed synthetic DNI makes reruns fail visibly instead of silently duplicating records.
  const first = post({});
  if (!first.success || first.emailSent) throw new Error('No se confirmó guardado QA sin correo.');
  const dni = post({ personalEmail: 'qa.other.' + run + '@example.test' });
  const email = post({ dni: '99000002' });
  const gmail = post({ dni: '99000003', personalEmail: 'qa.storage.' + run + '@gmail.com' });
  const alias = post({ dni: '99000004', personalEmail: 'QASTORAGE' + run + '+alias@googlemail.com' });
  if (!dni.isDuplicate || !email.isDuplicate || !gmail.success || !alias.isDuplicate) throw new Error('Falló la deduplicación QA.');
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  const rows = values.filter(row => row[headers.indexOf('Origen')] === base.source);
  if (rows.length !== 2 || !rows.every(row => typeof row[headers.indexOf('Número de celular')] === 'string' && row[headers.indexOf('Número de celular')] === base.phone)) throw new Error('La lectura de Sheets no coincide.');
  console.log(JSON.stringify({ passed: 5, created: 2, duplicates: 3, phoneVerified: true, emailSent: false, source: base.source }));
}
