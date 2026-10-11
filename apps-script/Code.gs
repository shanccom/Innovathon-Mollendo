/**
 * Innovathon Mollendo · Web App que recibe postulaciones y las guarda en Google Sheets.
 * Despliega como "Ejecutarse como:Yo" y "Quién tiene acceso:Cualquier persona".
 */

var CONFIG = {
  PRODUCTION_SPREADSHEET_ID: '1U48ftJJns3-4waJrt4A4uaI4OBNQoeyg1sOzzvXllI8',
  SHEET_NAME: 'Registros',
  CODE_PREFIX: 'IM',
  FIELDS: [
    'fullName',
    'dni',
    'institutionalEmail',
    'personalEmail',
    'institution',
    'otherInstitution',
    'academicLevel',
    'sede',
    'otherSede',
    'career',
    'otherCareer',
    'skills',
    'contributionAreas',
    'challengeInterest',
    'referencePerson',
    'portfolioUrl',
    'availability',
    'termsAccepted',
    'source',
    'phone',
  ],
  HEADERS: [
    'Código',
    'Fecha de registro',
    'Nombres y apellidos',
    'DNI',
    'Correo institucional',
    'Correo personal',
    'Institución de procedencia',
    'Otra institución',
    'Nivel académico',
    'Sede',
    'Otra sede',
    'Carrera / Especialidad',
    'Otra carrera',
    'Habilidades principales',
    'Áreas de aporte',
    'Eje temático / Reto',
    'Compañero',
    'LinkedIn / Portafolio',
    'Disponibilidad presencial',
    'Aceptó términos',
    'Origen',
    'Número de celular',
  ],
};

// Health check: confirma que el Web App está desplegado y responde.
function doGet() {
  return jsonResponse({
    success: true,
    version: 'v3.1-urls-directas',
    capabilities: { phone: true, atomicDuplicates: true },
    testMode: isTestMode(),
    testSpreadsheetId: isTestMode() ? PropertiesService.getScriptProperties().getProperty('QA_SPREADSHEET_ID') : undefined,
    message: 'Innovathon Mollendo · endpoint activo',
    headers: CONFIG.HEADERS,
  });
}

// Entrada principal: valida, verifica duplicados, guarda en Google Sheets y envía correo de confirmación.
function doPost(event) {
  let lock;
  let locked = false;
  let saved = null;
  try {
    const body = event && event.postData && event.postData.contents;
    if (!body || body.length > 16384) return jsonResponse({ success: false, code: 'VALIDATION', error: 'Solicitud vacía o demasiado grande.' });
    const data = normalizePayload(readPayload(event));
    const invalidField = validate(data);
    if (invalidField) {
      return jsonResponse({ success: false, code: 'VALIDATION', error: invalidField });
    }
    lock = LockService.getScriptLock();
    locked = lock.tryLock(10000);
    if (!locked) return jsonResponse({ success: false, code: 'BUSY', retryable: true, error: 'Hay muchas inscripciones en este momento. Espera unos segundos y vuelve a intentar con los mismos datos.' });
    const sheet = getSheet();
    const headers = ensureHeaders(sheet);
    // La consulta y la escritura comparten el mismo bloqueo: solo un ganador.
    const duplicate = findDuplicate(sheet, data, headers);
    if (duplicate) {
      return jsonResponse({
        success: false,
        isDuplicate: true,
        code: 'DUPLICATE',
        error: 'Este correo o DNI ya ha sido registrado previamente. La postulación ya fue recibida y está en proceso de revisión.',
      });
    }

    const code = nextRegistrationCode(sheet, headers);
    const now = new Date();
    const row = new Array(headers.length).fill('');
    row[headers.indexOf('Código')] = code;
    row[headers.indexOf('Fecha de registro')] = now;
    CONFIG.FIELDS.forEach(function(field, index) {
      row[headerIndex(headers, CONFIG.HEADERS[index + 2])] = formatValue(data[field]);
    });
    const nextRow = sheet.getLastRow() + 1;
    if (nextRow > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 100);
    // Impide perder el cero inicial del DNI y mantiene el celular como texto.
    const dniCol = headers.indexOf('DNI') + 1;
    if (dniCol > 0) sheet.getRange(nextRow, dniCol).setNumberFormat('@');
    const phoneCol = headers.indexOf('Número de celular') + 1;
    if (phoneCol > 0) sheet.getRange(nextRow, phoneCol).setNumberFormat('@');
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    SpreadsheetApp.flush();
    saved = { data: data, code: code, registeredAt: now.toISOString() };
  } catch (error) {
    console.error('No se pudo completar el registro: ' + error.name);
    return jsonResponse({ success: false, code: 'STORAGE_ERROR', retryable: true, error: 'No pudimos confirmar el registro. Reintenta con el mismo DNI y correo.' });
  } finally {
    if (locked) lock.releaseLock();
  }
  // El correo nunca mantiene el bloqueo de Sheets ni invalida un registro guardado.
  let emailSent = false;
  if (!isTestMode()) {
    try { emailSent = sendConfirmationEmail(saved.data, saved.code) === true; }
    catch (_error) { console.warn('Inscripción guardada; correo pendiente.'); }
  }
  return jsonResponse({ success: true, registrationId: saved.code, registeredAt: saved.registeredAt, emailSent: emailSent });
}

// Busca si el DNI o el correo personal ya existen en los registros previos de la hoja.
function findDuplicate(sheet, data, headers) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null; // Solo cabeceras

  const cleanDni = data.dni;
  const emails = [data.personalEmail, data.institutionalEmail].map(emailIdentity).filter(Boolean);
  const width = Math.max(headers.indexOf('DNI'), headers.indexOf('Correo institucional'), headers.indexOf('Correo personal')) + 1;
  const range = sheet.getRange(2, 1, lastRow - 1, width);
  const rows = range.getValues();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const value = row[headers.indexOf('DNI')];
    const existingDni = typeof value === 'number' ? String(value).padStart(8, '0') : String(value || '').trim();
    const existingInstEmail = emailIdentity(row[headers.indexOf('Correo institucional')]);
    const existingPersEmail = emailIdentity(row[headers.indexOf('Correo personal')]);

    if (cleanDni && existingDni === cleanDni) {
      return { type: 'dni' };
    }

    if (emails.some(function(email) { return email === existingPersEmail || email === existingInstEmail; })) {
      return { type: 'email' };
    }
  }

  return null;
}

function emailIdentity(value) {
  const email = String(value || '').trim().toLowerCase();
  const parts = email.split('@');
  if (parts[1] === 'gmail.com' || parts[1] === 'googlemail.com') {
    return parts[0].split('+')[0].replace(/\./g, '') + '@gmail.com';
  }
  return email;
}

function normalizePayload(input) {
  const data = {};
  CONFIG.FIELDS.forEach(function(field) {
    const val = input ? input[field] : '';
    data[field] = val !== undefined && val !== null ? String(val).trim() : '';
  });
  data.personalEmail = data.personalEmail.toLowerCase();
  data.institutionalEmail = data.institutionalEmail.toLowerCase();
  data.contributionAreas = input && Array.isArray(input.contributionAreas) ? input.contributionAreas.filter(function(v) { return typeof v === 'string' && v.trim(); }).map(function(v) { return v.trim(); }) : [];
  data.availability = Boolean(input && input.availability === true);
  data.termsAccepted = Boolean(input && input.termsAccepted === true);
  return data;
}

function headerIndex(headers, label) {
  const index = headers.indexOf(label);
  return index >= 0 ? index : label === 'Compañero' ? headers.indexOf('Compañero / Recomendación') : -1;
}

function ensureHeaders(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) {
    sheet.appendRow(CONFIG.HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, CONFIG.HEADERS.length).setFontWeight('bold');
    return CONFIG.HEADERS.slice();
  }
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  // Reconoce el esquema de 18 columnas existente; nunca reordena sus datos.
  const missing = CONFIG.HEADERS.filter(function(header) { return headerIndex(headers, header) < 0; });
  if (missing.length) {
    const needed = headers.length + missing.length;
    if (needed > sheet.getMaxColumns()) sheet.insertColumnsAfter(sheet.getMaxColumns(), needed - sheet.getMaxColumns());
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]).setFontWeight('bold');
    return headers.concat(missing);
  }
  return headers;
}

function nextRegistrationCode(sheet, headers) {
  const prefix = CONFIG.CODE_PREFIX + '-' + new Date().getFullYear() + '-';
  const properties = PropertiesService.getScriptProperties();
  const key = 'SEQUENCE_' + sheet.getParent().getId() + '_' + prefix;
  let sequence = Number(properties.getProperty(key)) || 0;
  if (sheet.getLastRow() > 1) {
    const codeCol = headers.indexOf('Código') + 1;
    if (codeCol > 0) {
      sheet.getRange(2, codeCol, sheet.getLastRow() - 1, 1).getValues().forEach(function(row) {
        const code = String(row[0]);
        if (code.indexOf(prefix) === 0) sequence = Math.max(sequence, Number(code.slice(prefix.length)) || 0);
      });
    }
  }
  properties.setProperty(key, String(sequence + 1));
  return prefix + String(sequence + 1).padStart(4, '0');
}

function isTestMode() {
  return PropertiesService.getScriptProperties().getProperty('REGISTRATION_TEST_MODE') === 'true';
}

// Envía notificación por correo electrónico al participante tras registrarse con éxito.
function sendConfirmationEmail(data, code) {
  try {
    const recipient = String(data.personalEmail || data.institutionalEmail || '').trim();
    if (!recipient || !recipient.includes('@')) return;

    const fullName = String(data.fullName || 'Participante').trim();
    const dni = String(data.dni || '').trim();
    const sede = String(data.sede || 'Mollendo / Islay').trim();
    const career = String(data.career || '').trim();

    const subject = '¡Inscripción Recibida! · Innovathon Mollendo 2026';

    const topBannerUrl = 'https://innovathonmollendo.tech/assets/email-banner-top.png';
    const bottomBannerUrl = 'https://innovathonmollendo.tech/assets/email-banner-bottom.png';
    const barcodeUrl = 'https://bwipjs-api.metafloor.com/?bcid=code128&text=' + encodeURIComponent(code) + '&scale=2&height=12&includetext';

    const htmlBody = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070a18; color: #ffffff; margin: 0; padding: 24px 12px;">
  <div style="max-width: 580px; margin: 0 auto; background: #0a0f26; border: 1px solid #1b254b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
    
    <!-- Top Hero Banner Oficial (banner_tally_25_oficial.png) -->
    <div style="background-color: #070c20; text-align: center; border-bottom: 1px solid #1b254b; line-height: 0;">
      <img src="${topBannerUrl}" alt="Innovathon Mollendo 2026" width="580" border="0" style="width: 100%; max-width: 580px; height: auto; display: block; margin: 0 auto; border: 0;" />
    </div>

    <!-- Header Section con Badge y Título -->
    <div style="background: linear-gradient(180deg, rgba(13, 22, 51, 0.9) 0%, rgba(10, 15, 38, 0.95) 100%); padding: 28px 24px 20px; text-align: center; border-bottom: 1px solid #162044;">
      <span style="display: inline-block; background: rgba(203, 251, 69, 0.12); border: 1px solid rgba(203, 251, 69, 0.35); color: #cbfb45; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 6px 14px; border-radius: 9999px;">
        Postulación Recibida
      </span>
      <h1 style="margin: 16px 0 6px; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">¡Inscripción Exitosa!</h1>
      <p style="color: #94a3b8; font-size: 13px; margin: 0;">Innovathon Mollendo 2026 · 17 y 18 de Diciembre</p>
    </div>

    <div style="padding: 28px 24px; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
      <p style="margin-top: 0; font-size: 15px;">Hola <strong style="color: #ffffff;">${fullName}</strong>,</p>
      <p>Tu postulación para la <strong>Innovathon Mollendo 2026</strong> ha sido enviada y registrada correctamente en nuestro sistema.</p>

      <!-- Ficha de Datos Registrados -->
      <div style="background: #070a18; border: 1px solid #1e295d; border-radius: 14px; padding: 18px; margin: 20px 0;">
        <div style="margin-bottom: 10px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">DNI</div>
          <div style="font-size: 13px; font-weight: 600; color: #ffffff;">${dni}</div>
        </div>
        <div style="margin-bottom: 10px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Sede</div>
          <div style="font-size: 13px; font-weight: 600; color: #ffffff;">${sede}</div>
        </div>
        ${career ? `
        <div style="margin-bottom: 10px;">
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Carrera / Especialidad</div>
          <div style="font-size: 13px; font-weight: 600; color: #ffffff;">${career}</div>
        </div>` : ''}
        <div>
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Correo Registrado</div>
          <div style="font-size: 13px; font-weight: 600; color: #03c4c5;">${recipient}</div>
        </div>
      </div>

      <!-- Pase de Acreditación con Código de Barras (Code 128) -->
      <div style="background: #070a18; border: 1px dashed #741cf3; border-radius: 14px; padding: 18px; text-align: center; margin: 22px 0;">
        <div style="font-size: 10px; color: #c4b5fd; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 700; margin-bottom: 12px;">
          Pase de Acreditación Presencial
        </div>
        <div style="display: inline-block; background: #ffffff; padding: 10px 18px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
          <img src="${barcodeUrl}" alt="Código: ${code}" width="280" border="0" style="display: block; max-width: 280px; height: auto;" />
        </div>
        <p style="color: #94a3b8; font-size: 11px; margin: 10px 0 0;">
          Presenta este código en la mesa de ingreso el 17 y 18 de Diciembre.
        </p>
      </div>

      <p><strong style="color: #ffffff;">¿Qué sigue ahora?</strong><br>
      El equipo organizador revisará tu postulación y te contactará a este correo electrónico con los detalles para unirte a la comunidad oficial de participantes.</p>

      <div style="text-align: center; margin: 26px 0 10px;">
        <a href="https://innovathonmollendo.tech" style="display: inline-block; background: #cbfb45; color: #070a18; text-decoration: none; font-weight: 800; font-size: 13px; padding: 12px 28px; border-radius: 10px;">
          Visitar Web Oficial
        </a>
      </div>
    </div>

    <!-- Pie de Correo con Banner Castillo Forga (banner_tally_25_castillo.png) -->
    <div style="background-color: #060a1c; border-top: 1px solid #1b254b;">
      <div style="line-height: 0; text-align: center;">
        <img src="${bottomBannerUrl}" alt="Innovathon Mollendo 2026 · Castillo Forga" width="580" border="0" style="width: 100%; max-width: 580px; height: auto; display: block; margin: 0 auto; border: 0;" />
      </div>
      <div style="text-align: center; padding: 18px 24px 22px;">
        <p style="font-size: 11px; color: #94a3b8; margin: 0 0 6px; font-weight: 500;">
          <em>«Las ideas también tienen marea»</em>
        </p>
        <div style="font-size: 11px; color: #64748b; line-height: 1.5;">
          Innovathon Mollendo 2026 · Construyendo el futuro de Mollendo e Islay.<br>
          Este es un correo automático de confirmación de postulación.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const plainText = '¡Hola ' + fullName + '! Tu postulación para Innovathon Mollendo 2026 ha sido recibida con éxito.\n\n' +
      'Código de Acreditación: ' + code + '\n' +
      'DNI: ' + dni + '\n' +
      'Sede: ' + sede + '\n' +
      (career ? 'Carrera: ' + career + '\n' : '') +
      'Correo registrado: ' + recipient + '\n\n' +
      'Visita la web oficial: https://innovathonmollendo.tech';

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: plainText,
      htmlBody: htmlBody,
      name: 'Innovathon Mollendo 2026',
    });

    console.log('Correo de confirmación enviado para ' + code);
    return true;
  } catch (error) {
    // Si falla el envío (por cuotas diarias o filtros), la inscripción no se detiene.
    console.error('No se pudo enviar el correo de confirmación: ' + error.name);
    return false;
  }
}

// Crea la hoja con sus encabezados; ejecuta esta función una sola vez.
function setup() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet();
    ensureHeaders(sheet);
    sheet.setFrozenRows(1);
    SpreadsheetApp.flush();
    return CONFIG.SHEET_NAME;
  } finally {
    lock.releaseLock();
  }
}

// Devuelve la hoja de destino creándola si todavía no existe.
function getSheet() {
  let book;
  if (isTestMode()) {
    const bound = SpreadsheetApp.getActive();
    const testId = PropertiesService.getScriptProperties().getProperty('QA_SPREADSHEET_ID');
    if (!testId || testId === CONFIG.PRODUCTION_SPREADSHEET_ID || (bound && testId === bound.getId())) throw new Error('QA necesita una hoja separada.');
    book = SpreadsheetApp.openById(testId);
  } else {
    // Un Web App no tiene una hoja activa: usa el destino fijo autorizado.
    book = SpreadsheetApp.openById(CONFIG.PRODUCTION_SPREADSHEET_ID);
  }
  if (!book) throw new Error('No hay hoja vinculada.');
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
  if (!data.fullName || String(data.fullName).trim().length < 3) return 'Ingresa tus nombres y apellidos completos.';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(String(data.fullName).trim())) return 'El nombre solo debe contener letras y espacios (sin números).';
  if (!/^\d{8}$/.test(String(data.dni || '').trim())) return 'El DNI debe tener 8 dígitos numéricos.';
  if (!/^9\d{8}$/.test(data.phone)) return 'Ingresa un número de celular peruano de 9 dígitos que empiece con 9.';
  
  // Correo personal obligatorio
  const personalEmail = String(data.personalEmail || '').trim();
  if (!personalEmail) return 'El correo personal es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalEmail) || personalEmail.indexOf('..') >= 0) return 'El correo personal no es válido.';

  // Correo institucional opcional
  const instEmail = String(data.institutionalEmail || '').trim();
  if (instEmail && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(instEmail) || instEmail.indexOf('..') >= 0)) {
    return 'El formato del correo institucional no es válido.';
  }

  if (!data.sede) return 'Selecciona una sede o localidad.';
  if (!data.career) return 'Selecciona tu carrera o área.';
  if (!data.institution) return 'Selecciona tu institución de procedencia.';
  if (!data.academicLevel) return 'Selecciona tu nivel académico.';
  if (data.sede === 'Otra localidad' && !data.otherSede) return 'Especifica tu localidad.';
  if (data.career === 'Otra carrera o especialidad' && !data.otherCareer) return 'Especifica tu carrera.';
  if (data.institution === 'Otra institución de educación superior' && !data.otherInstitution) return 'Especifica tu institución.';
  if (!data.contributionAreas.length) return 'Selecciona al menos un área de aporte.';
  if (!data.challengeInterest) return 'Selecciona un reto de interés.';
  if (!data.skills || String(data.skills).trim().length === 0) return 'Describe tus habilidades principales.';
  if (data.skills.length > 500) return 'Las habilidades no pueden superar los 500 caracteres.';
  if (!data.availability) return 'Debes confirmar tu disponibilidad presencial.';
  if (!data.termsAccepted) return 'Debes aceptar los términos y condiciones.';
  return '';
}

// Normaliza los valores antes de escribirlos en la hoja y previene Formula Injection.
function formatValue(value) {
  if (Array.isArray(value)) {
    return value.map(formatValue).join(', ');
  }
  if (value === true) return 'Sí';
  if (value === false || value === null || value === undefined || value === '') return '';

  const str = String(value).trim();

  // Neutraliza fórmulas no autorizadas (=, +, -, @, tabulaciones o retornos de carro)
  if (/^[=+\-@\t\r\n]/.test(str)) {
    return "'" + str;
  }

  return str;
}

// Siempre responde JSON para que el frontend pueda parsearlo.
function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

// Función directa para forzar la ventana emergente de autorización de Google.
// Al ejecutarse SIN try/catch, Google detecta la llamada y muestra el diálogo modal de autorización.
function autorizarPermisos() {
  const miCorreo = Session.getActiveUser().getEmail() || 'fgarambelm@gmail.com';
  MailApp.sendEmail(miCorreo, 'Autorización exitosa · Innovathon Mollendo 2026', '¡Los permisos de envío de correos han sido autorizados correctamente!');
  Logger.log('¡Permisos autorizados y correo enviado a ' + miCorreo + '!');
}

// Función de prueba para enviar el correo completo con diseño HTML y banners.
function testEmail() {
  sendConfirmationEmail({
    fullName: 'Fernando Garambel',
    personalEmail: 'fgarambelm@gmail.com',
    dni: '73268408',
    phone: '958342111',
    sede: 'Mollendo / Provincia de Islay',
    career: 'Tecnología: Ingeniería de Sistemas, Software, Informática y afines'
  }, 'IM-2026-TEST');
  Logger.log('Proceso de testEmail finalizado. Revisa tu bandeja de entrada en fgarambelm@gmail.com');
}

// Función auxiliar para reiniciar el contador si limpias tu hoja de cálculo.
function resetearSecuencia() {
  const sheet = getSheet();
  const prefix = CONFIG.CODE_PREFIX + '-' + new Date().getFullYear() + '-';
  const properties = PropertiesService.getScriptProperties();
  const key = 'SEQUENCE_' + sheet.getParent().getId() + '_' + prefix;
  properties.deleteProperty(key);
  Logger.log('Contador reiniciado. El próximo código generado será ' + prefix + '0001');
}



