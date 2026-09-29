/**
 * Innovathon Mollendo · Web App que recibe postulaciones y las guarda en Google Sheets.
 * Despliega como "Ejecutarse como:Yo" y "Quién tiene acceso:Cualquier persona".
 */

const CONFIG = {
  SHEET_NAME: 'Registros',
  CODE_PREFIX: 'IM',
  FIELDS: [
    'fullName',
    'dni',
    'institutionalEmail',
    'personalEmail',
    'institution',
    'academicLevel',
    'sede',
    'career',
    'skills',
    'contributionAreas',
    'challengeInterest',
    'referencePerson',
    'portfolioUrl',
    'availability',
    'termsAccepted',
    'source',
  ],
  HEADERS: [
    'Código',
    'Fecha de registro',
    'Nombres y apellidos',
    'DNI',
    'Correo institucional',
    'Correo personal',
    'Institución de procedencia',
    'Nivel académico',
    'Sede',
    'Carrera / Especialidad',
    'Habilidades principales',
    'Áreas de aporte',
    'Eje temático / Reto',
    'Compañero / Recomendación',
    'LinkedIn / Portafolio',
    'Disponibilidad presencial',
    'Aceptó términos',
    'Origen',
  ],
};

// Health check: confirma que el Web App está desplegado y responde.
function doGet() {
  return jsonResponse({ success: true, message: 'Innovathon Mollendo · endpoint activo', headers: CONFIG.HEADERS });
}

// Entrada principal: valida y agrega una fila por postulación bajo lock para evitar colisiones.
function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const data = readPayload(event);
    const invalidField = validate(data);

    if (invalidField) {
      return jsonResponse({ success: false, error: invalidField });
    }

    const sheet = getSheet();
    const nextRow = sheet.getLastRow();
    const code = CONFIG.CODE_PREFIX + '-' + new Date().getFullYear() + '-' + String(nextRow).padStart(4, '0');
    const row = [code, new Date()].concat(CONFIG.FIELDS.map((field) => formatValue(data[field])));

    sheet.appendRow(row);
    SpreadsheetApp.flush();

    return jsonResponse({ success: true, registrationId: code, registeredAt: new Date().toISOString() });
  } catch (error) {
    return jsonResponse({ success: false, error: 'No se pudo guardar la inscripción: ' + error.message });
  } finally {
    lock.releaseLock();
  }
}

// Crea la hoja con sus encabezados; ejecuta esta función una sola vez.
function setup() {
  const sheet = getSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CONFIG.HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, CONFIG.HEADERS.length).setFontWeight('bold');
  }

  SpreadsheetApp.getActive().toast('Hoja "' + CONFIG.SHEET_NAME + '" lista.', 'Innovathon Mollendo', 5);
  return CONFIG.SHEET_NAME;
}

// Devuelve la hoja de destino creándola si todavía no existe.
function getSheet() {
  const book = SpreadsheetApp.getActive();
  const sheet = book.getSheetByName(CONFIG.SHEET_NAME) || book.insertSheet(CONFIG.SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CONFIG.HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, CONFIG.HEADERS.length).setFontWeight('bold');
  }

  return sheet;
}


// Lee el cuerpo JSON enviado por el frontend.
function readPayload(event) {
  const body = event && event.postData && event.postData.contents;

  if (!body) return {};

  try {
    return JSON.parse(body);
  } catch (error) {
    return {};
  }
}

// Devuelve el primer error encontrado o una cadena vacía si todo está bien.
function validate(data) {
  if (!data.fullName) return 'Ingresa tus nombres y apellidos.';
  if (!/^\d{8}$/.test(String(data.dni || '').trim())) return 'El DNI debe tener 8 dígitos numéricos.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.institutionalEmail || '')) return 'El correo institucional no es válido.';
  if (!data.sede) return 'Selecciona una sede.';
  if (!data.career) return 'Selecciona tu carrera o área.';
  if (!data.skills) return 'Describe tus habilidades principales.';
  if (!data.availability) return 'Debes confirmar tu disponibilidad presencial.';
  if (!data.termsAccepted) return 'Debes aceptar los términos y condiciones.';
  return '';
}

// Normaliza los valores antes de escribirlos en la hoja.
function formatValue(value) {
  if (Array.isArray(value)) return value.join(', ');
  if (value === true) return 'Sí';
  if (value === false || value === null || value === undefined || value === '') return '';
  return value;
}

// Siempre responde JSON para que el frontend pueda parsearlo.
function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
