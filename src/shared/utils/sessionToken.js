/**
 * Utilidades para ofuscación y decodificación de tokens de sesión de asistencia
 * en Innovathon Mollendo 2026.
 */

export const PRESET_SESSION_TOKENS = {
  'asistencia-1': {
    id: 'asistencia-1',
    token: 's1_k9f4e2a87d',
    name: 'Asistencia 1',
  },
  'asistencia-2': {
    id: 'asistencia-2',
    token: 's2_m8b3d1c94e',
    name: 'Asistencia 2',
  },
  'asistencia-3': {
    id: 'asistencia-3',
    token: 's3_p7c2e0b52f',
    name: 'Asistencia 3',
  },
  'asistencia-4': {
    id: 'asistencia-4',
    token: 's4_x6d1f9a38b',
    name: 'Asistencia 4',
  },
  'asistencia-5': {
    id: 'asistencia-5',
    token: 's5_z5e0a8f71c',
    name: 'Asistencia 5',
  },
  'asistencia-6': {
    id: 'asistencia-6',
    token: 's6_h4d9b1c73a',
    name: 'Asistencia 6',
  },
};

/**
 * Codifica un ID de sesión (y nombre opcional) a un token seguro.
 * @param {string} sessionId
 * @param {string} [sessionName]
 * @returns {string}
 */
export function encodeSessionToken(sessionId, sessionName) {
  if (!sessionId) return '';
  const cleanId = sessionId.trim().toLowerCase();

  if (PRESET_SESSION_TOKENS[cleanId]) {
    return PRESET_SESSION_TOKENS[cleanId].token;
  }

  try {
    const payload = JSON.stringify({
      i: sessionId.trim(),
      n: sessionName ? sessionName.trim() : sessionId.trim(),
    });
    let b64;
    if (typeof btoa !== 'undefined') {
      const utf8Bytes = encodeURIComponent(payload).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      );
      b64 = btoa(utf8Bytes);
    } else if (typeof globalThis !== 'undefined' && globalThis.Buffer) {
      b64 = globalThis.Buffer.from(payload, 'utf8').toString('base64');
    } else {
      return sessionId;
    }
    return `dyn_${b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;
  } catch {
    return sessionId;
  }
}

/**
 * Decodifica un token ofuscado o identificador a su objeto { id, name }.
 * @param {string | null | undefined} token
 * @returns {{ id: string, name: string } | null}
 */
export function decodeSessionToken(token) {
  if (!token) return null;
  const clean = String(token).trim();
  if (!clean) return null;

  // 1. Coincidencia con tokens predefinidos (o ID exacto)
  for (const item of Object.values(PRESET_SESSION_TOKENS)) {
    if (item.token.toLowerCase() === clean.toLowerCase() || item.id.toLowerCase() === clean.toLowerCase()) {
      return { id: item.id, name: item.name };
    }
  }

  // 2. Token dinámico con prefijo dyn_
  if (clean.startsWith('dyn_')) {
    try {
      let b64 = clean.slice(4).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4 !== 0) {
        b64 += '=';
      }
      let json = '';
      if (typeof atob !== 'undefined') {
        const raw = atob(b64);
        json = decodeURIComponent(
          Array.from(raw)
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      } else if (typeof globalThis !== 'undefined' && globalThis.Buffer) {
        json = globalThis.Buffer.from(b64, 'base64').toString('utf8');
      }
      const parsed = JSON.parse(json);
      if (parsed && parsed.i) {
        return {
          id: String(parsed.i),
          name: parsed.n ? String(parsed.n) : String(parsed.i),
        };
      }
    } catch {
      // Ignora fallo y pasa al fallback
    }
  }

  // 3. Fallback amigable
  return {
    id: clean,
    name: clean.charAt(0).toUpperCase() + clean.slice(1).replace(/[-_]/g, ' '),
  };
}
