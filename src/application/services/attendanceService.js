/**
 * Servicio de Asistencia para participantes en Innovathon Mollendo 2026.
 * Gestiona la carga de la nómina oficial, validación de DNI/Código y envío a Google Apps Script.
 */

import { env } from '../../infrastructure/config/env.js';

export const ATTENDANCE_APPS_SCRIPT_URL =
  env.appsScriptUrl ||
  'https://script.google.com/macros/s/AKfycbyw7LsfMZlhDWTDmCjXg-MhHlsqjIqWLnVUtQEaje1CJ-g7pgijFo2ayLeiMjrjuHx6VA/exec';

const CACHE_KEY = 'innovathon_roster_cache';
const LOCAL_HISTORY_KEY = 'innovathon_checkin_history';

/**
 * Normaliza un identificador (DNI o código) para búsquedas tolerantes.
 * Soporta entradas escaneadas con URLs completas o parámetros.
 * @param {string} raw
 * @returns {string}
 */
export function normalizeIdentifier(raw) {
  if (!raw) return '';
  let clean = String(raw).trim();

  // Si se pegó o escaneó una URL con query params (ej. ?code=IM-2026-0003 o ?dni=72859994)
  if (clean.includes('?') || clean.includes('/')) {
    const queryMatch = clean.match(/[?&](?:code|codigo|dni|id)=([A-Za-z0-9_-]+)/i);
    if (queryMatch && queryMatch[1]) {
      clean = queryMatch[1].trim();
    } else {
      const codeOrDniMatch = clean.match(/(IM-\d{4}-\d+|[0-9]{8})/i);
      if (codeOrDniMatch && codeOrDniMatch[1]) {
        clean = codeOrDniMatch[1].trim();
      }
    }
  }

  return clean.toUpperCase();
}

/**
 * Normaliza DNI asegurando 8 dígitos numéricos si aplica.
 * @param {string} str
 * @returns {string}
 */
export function normalizeDni(str) {
  if (!str) return '';
  const clean = String(str).trim();
  const digits = clean.replace(/\D/g, '');
  if (digits.length > 0 && digits.length <= 8) {
    return digits.padStart(8, '0');
  }
  return clean.toUpperCase();
}

/**
 * Obtiene el padrón de participantes oficiales desde Apps Script (o fallback GViz).
 * @param {boolean} [forceRefresh=false]
 * @returns {Promise<Array<{ id: string, codigo: string, dni: string, nombre: string, equipo: string, institucion: string }>>}
 */
export async function fetchParticipantsRoster(forceRefresh = false) {
  // Intentar caché en sesión
  if (!forceRefresh && typeof sessionStorage !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignorar error de caché
    }
  }

  // 1. Intentar endpoint de Apps Script
  try {
    const separator = ATTENDANCE_APPS_SCRIPT_URL.includes('?') ? '&' : '?';
    const res = await fetch(`${ATTENDANCE_APPS_SCRIPT_URL}${separator}action=data`, {
      method: 'GET',
      mode: 'cors',
    });

    if (res.ok) {
      const json = await res.json();
      const rawRows = Array.isArray(json) ? json : json.data || json.rows || [];
      if (Array.isArray(rawRows) && rawRows.length > 0) {
        const roster = normalizeRosterRows(rawRows);
        if (roster.length > 0) {
          saveRosterCache(roster);
          return roster;
        }
      }
    }
  } catch (err) {
    console.warn('No se pudo conectar a Apps Script directamente:', err);
  }

  // 2. Fallback a Google Sheets GViz endpoint público
  try {
    const spreadsheetId = '1U48ftJJns3-4waJrt4A4uaI4OBNQoeyg1sOzzvXllI8';
    const sheetName = 'Registros';
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(gvizUrl);
    const text = await response.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);?/);
    if (match && match[1]) {
      const parsed = JSON.parse(match[1]);
      const table = parsed.table;
      if (table && table.cols && table.rows) {
        const cols = table.cols.map((c, idx) => (c && c.label ? c.label.trim() : `Columna ${idx + 1}`));
        const rows = [];
        table.rows.forEach((r) => {
          if (!r || !r.c) return;
          const obj = {};
          r.c.forEach((cell, idx) => {
            const colName = cols[idx] || `col_${idx}`;
            const val = cell ? (cell.f !== undefined && cell.f !== null ? cell.f : cell.v ?? '') : '';
            obj[colName] = typeof val === 'string' ? val.trim() : val;
          });
          rows.push(obj);
        });
        const roster = normalizeRosterRows(rows);
        if (roster.length > 0) {
          saveRosterCache(roster);
          return roster;
        }
      }
    }
  } catch (gvizErr) {
    console.warn('Fallback GViz falló:', gvizErr);
  }

  return [];
}

/**
 * Normaliza las filas de datos recibidas en objetos de participantes uniformes.
 */
function normalizeRosterRows(rows) {
  return rows.map((row, idx) => {
    const keys = Object.keys(row);
    const findKey = (...terms) => {
      for (const term of terms) {
        const match = keys.find((k) => {
          const lower = k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return lower.includes(term);
        });
        if (match) return match;
      }
      return undefined;
    };

    const codigoKey = findKey('codigo', 'code', 'ticket');
    const dniKey = findKey('dni', 'documento', 'identificacion');
    const nombreKey = findKey('nombres y apellidos', 'nombre y apellido', 'nombre completo', 'participante', 'nombres');
    const instKey = findKey('institucion de procedencia', 'institucion', 'universidad');
    const retoKey = findKey('eje tematico / reto', 'reto', 'eje', 'proyecto');
    const equipoKey = findKey('equipo', 'team', 'grupo');

    const getVal = (k) => (k && row[k] !== undefined && row[k] !== null ? String(row[k]).trim() : '');

    const codigo = getVal(codigoKey) || `IM-2026-${String(idx + 1).padStart(4, '0')}`;
    const dni = getVal(dniKey) || '';
    const nombre = getVal(nombreKey) || `Participante #${idx + 1}`;
    const institucion = getVal(instKey) || 'Innovathon Mollendo';
    const equipo = getVal(equipoKey) || getVal(retoKey) || 'Participante Individual';

    return {
      id: `p-${idx + 1}`,
      codigo,
      dni,
      nombre,
      institucion,
      equipo,
    };
  });
}

function saveRosterCache(data) {
  if (typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch {
      // Ignorar errores de quota
    }
  }
}

/**
 * Busca un participante en la nómina por DNI o Código.
 * @param {Array} roster
 * @param {string} query
 * @returns {object | null}
 */
export function findParticipantInRoster(roster, query) {
  if (!Array.isArray(roster) || roster.length === 0 || !query) return null;
  const clean = normalizeIdentifier(query);
  const cleanDni = normalizeDni(clean);

  return (
    roster.find((p) => {
      const pCod = normalizeIdentifier(p.codigo);
      const pDni = normalizeDni(p.dni);
      return pCod === clean || pDni === cleanDni || p.id.toLowerCase() === clean.toLowerCase();
    }) || null
  );
}

/**
 * Obtiene el historial de asistencias marcadas localmente en este navegador.
 * @returns {Record<string, { timestamp: string, sessionId: string, sessionName: string, participantId: string }>}
 */
export function getLocalCheckinHistory() {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Verifica si el participante ya marcó asistencia para esta sesión en este dispositivo.
 * @param {string} sessionId
 * @param {string} participantCodeOrDni
 * @returns {{ alreadyMarked: boolean, record?: object }}
 */
export function hasAlreadyMarkedLocally(sessionId, participantCodeOrDni) {
  const history = getLocalCheckinHistory();
  const key = `${sessionId}_${normalizeIdentifier(participantCodeOrDni)}`;
  if (history[key]) {
    return { alreadyMarked: true, record: history[key] };
  }
  return { alreadyMarked: false };
}

/**
 * Registra y sincroniza la asistencia con Google Apps Script.
 * @param {object} params
 * @param {object} params.participant
 * @param {object} params.session
 * @returns {Promise<{ success: boolean, timestamp: string, participant: object, session: object }>}
 */
export async function submitAttendance({ participant, session }) {
  const timestamp = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const payload = {
    action: 'markAttendance',
    codigo: participant.codigo,
    dni: participant.dni,
    nombre: participant.nombre,
    equipo: participant.equipo,
    sessionId: session.id,
    sessionName: session.name,
    timestamp,
  };

  // Enviar a Google Apps Script usando text/plain y no-cors para sortear CORS de Google Apps Script
  try {
    await fetch(ATTENDANCE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });
  } catch (err) {
    console.warn('Advertencia al enviar asistencia a Apps Script:', err);
    // Aunque falle la red momentáneamente, el registro local permanece guardado
  }

  // Guardar en el historial local para prevención de dobles envíos y feedback inmediato
  if (typeof localStorage !== 'undefined') {
    try {
      const history = getLocalCheckinHistory();
      const keyCod = `${session.id}_${normalizeIdentifier(participant.codigo)}`;
      const keyDni = `${session.id}_${normalizeIdentifier(participant.dni)}`;
      const record = {
        timestamp,
        sessionId: session.id,
        sessionName: session.name,
        participantCode: participant.codigo,
        participantName: participant.nombre,
      };
      history[keyCod] = record;
      if (participant.dni) {
        history[keyDni] = record;
      }
      localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(history));
    } catch {
      // Ignorar errores de almacenamiento
    }
  }

  return {
    success: true,
    timestamp,
    participant,
    session,
  };
}
