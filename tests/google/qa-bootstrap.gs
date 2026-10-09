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
