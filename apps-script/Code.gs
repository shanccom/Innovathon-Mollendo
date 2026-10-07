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
    'Compañero / Recomendación',
    'LinkedIn / Portafolio',
    'Disponibilidad presencial',
    'Aceptó términos',
    'Origen',
  ],
};

// Health check: confirma que el Web App está desplegado y responde.
function doGet() {
  return jsonResponse({
    success: true,
    version: 'v2.2-sin-codigo',
    message: 'Innovathon Mollendo · endpoint activo',
    headers: CONFIG.HEADERS,
  });
}

// Entrada principal: valida, verifica duplicados, guarda en Google Sheets y envía correo de confirmación.
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

    // Verificación de duplicado por DNI o Correo personal
    const duplicate = findDuplicate(sheet, data.dni, data.personalEmail);
    if (duplicate) {
      return jsonResponse({
        success: false,
        isDuplicate: true,
        registrationId: duplicate.code,
        error: 'Este correo o DNI ya ha sido registrado previamente. Tu postulación para la Innovathon Mollendo 2026 ya está confirmada y en proceso de revisión por el equipo organizador.',
      });
    }

    const nextRow = sheet.getLastRow();
    const code = CONFIG.CODE_PREFIX + '-' + new Date().getFullYear() + '-' + String(nextRow).padStart(4, '0');
    const row = [code, new Date()].concat(CONFIG.FIELDS.map((field) => formatValue(data[field])));

    sheet.appendRow(row);
    SpreadsheetApp.flush();

    // Envío de correo de confirmación (no bloqueante ante posibles cuotas de Google)
    sendConfirmationEmail(data, code);

    return jsonResponse({ success: true, registrationId: code, registeredAt: new Date().toISOString() });
  } catch (error) {
    return jsonResponse({ success: false, error: 'No se pudo guardar la inscripción: ' + error.message });
  } finally {
    lock.releaseLock();
  }
}

// Busca si el DNI o el correo personal ya existen en los registros previos de la hoja.
function findDuplicate(sheet, dni, personalEmail) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return null; // Solo cabeceras

  const cleanDni = String(dni || '').replace(/\D/g, '').trim();
  const cleanEmail = String(personalEmail || '').trim().toLowerCase();

  // Lee las columnas Código (1), Fecha (2), Nombres (3), DNI (4), Correo inst (5), Correo pers (6)
  const range = sheet.getRange(2, 1, lastRow - 1, 6);
  const rows = range.getValues();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const existingCode = String(row[0] || '').trim();
    const existingDni = String(row[3] || '').replace(/\D/g, '').trim();
    const existingInstEmail = String(row[4] || '').trim().toLowerCase();
    const existingPersEmail = String(row[5] || '').trim().toLowerCase();

    if (cleanDni && existingDni === cleanDni) {
      return { type: 'dni', code: existingCode };
    }

    if (cleanEmail && (existingPersEmail === cleanEmail || existingInstEmail === cleanEmail)) {
      return { type: 'email', code: existingCode };
    }
  }

  return null;
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

    // Banners con inlineImages (CID) para que Gmail los muestre automáticamente sin bloquearlos
    let inlineImages = {};
    let topSrc = 'https://innovathonmollendo.tech/assets/email-banner-top.png';
    let bottomSrc = 'https://innovathonmollendo.tech/assets/email-banner-bottom.png';

    try {
      const topBlob = UrlFetchApp.fetch(topSrc).getBlob().setName('bannerTop.png');
      const bottomBlob = UrlFetchApp.fetch(bottomSrc).getBlob().setName('bannerBottom.png');
      inlineImages = {
        bannerTop: topBlob,
        bannerBottom: bottomBlob,
      };
      topSrc = 'cid:bannerTop';
      bottomSrc = 'cid:bannerBottom';
    } catch (fetchErr) {
      console.warn('UrlFetchApp fallback a URLs externas: ' + fetchErr.message);
    }

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
      <img src="${topSrc}" alt="Innovathon Mollendo 2026" width="580" border="0" style="width: 100%; max-width: 580px; height: auto; display: block; margin: 0 auto; border: 0;" />
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
          <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(code)}&scale=2&height=12&includetext" 
               alt="Código: ${code}" width="280" border="0" style="display: block; max-width: 280px; height: auto;" />
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
        <img src="${bottomSrc}" alt="Innovathon Mollendo 2026 · Castillo Forga" width="580" border="0" style="width: 100%; max-width: 580px; height: auto; display: block; margin: 0 auto; border: 0;" />
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

    const emailOptions = {
      to: recipient,
      subject: subject,
      body: plainText,
      htmlBody: htmlBody,
      name: 'Innovathon Mollendo 2026',
    };

    if (Object.keys(inlineImages).length > 0) {
      emailOptions.inlineImages = inlineImages;
    }

    MailApp.sendEmail(emailOptions);

    console.log('Correo de confirmación enviado exitosamente a ' + recipient + ' con código ' + code);
  } catch (error) {
    // Si falla el envío (por cuotas diarias o filtros), la inscripción no se detiene.
    console.error('No se pudo enviar el correo de confirmación: ' + error.message);
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
  if (!data.fullName || String(data.fullName).trim().length < 3) return 'Ingresa tus nombres y apellidos completos.';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(String(data.fullName).trim())) return 'El nombre solo debe contener letras y espacios (sin números).';
  if (!/^\d{8}$/.test(String(data.dni || '').trim())) return 'El DNI debe tener 8 dígitos numéricos.';
  
  // Correo personal obligatorio
  const personalEmail = String(data.personalEmail || '').trim();
  if (!personalEmail) return 'El correo personal es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalEmail)) return 'El correo personal no es válido.';

  // Correo institucional opcional
  const instEmail = String(data.institutionalEmail || '').trim();
  if (instEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(instEmail)) {
    return 'El formato del correo institucional no es válido.';
  }

  if (!data.sede) return 'Selecciona una sede o localidad.';
  if (!data.career) return 'Selecciona tu carrera o área.';
  if (!data.skills || String(data.skills).trim().length === 0) return 'Describe tus habilidades principales.';
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
  // Provoca la detección de UrlFetchApp para autorizar imágenes embebidas
  UrlFetchApp.fetch('https://innovathonmollendo.tech/assets/email-banner-top.png');
  // Provoca la detección de MailApp
  MailApp.sendEmail(miCorreo, 'Autorización exitosa · Innovathon Mollendo 2026', '¡Los permisos de envío de correos y descarga de imágenes han sido autorizados correctamente!');
  Logger.log('¡Permisos autorizados y correo enviado a ' + miCorreo + '!');
}

// Función de prueba para enviar el correo completo con diseño HTML y banners.
function testEmail() {
  sendConfirmationEmail({
    fullName: 'Fernando Garambel',
    personalEmail: 'fgarambelm@gmail.com',
    dni: '73268408',
    sede: 'Mollendo / Provincia de Islay',
    career: 'Tecnología: Ingeniería de Sistemas, Software, Informática y afines'
  }, 'IM-2026-TEST');
  Logger.log('Proceso de testEmail finalizado.');
}


