import test from 'node:test';
import assert from 'node:assert/strict';
import {
  encodeSessionToken,
  decodeSessionToken,
  PRESET_SESSION_TOKENS,
} from '../src/shared/utils/sessionToken.js';
import {
  normalizeIdentifier,
  normalizeDni,
  findParticipantInRoster,
  hasAlreadyMarkedLocally,
  submitAttendance,
} from '../src/application/services/attendanceService.js';

test('sessionToken: codifica sesiones predefinidas a tokens no secuenciales', () => {
  const token1 = encodeSessionToken('asistencia-1');
  const token2 = encodeSessionToken('asistencia-2');

  assert.equal(token1, PRESET_SESSION_TOKENS['asistencia-1'].token);
  assert.equal(token2, PRESET_SESSION_TOKENS['asistencia-2'].token);
  assert.notEqual(token1, token2);
  assert.ok(token1.includes('k9f4e2a87d'));
  assert.ok(token2.includes('m8b3d1c94e'));
});

test('sessionToken: decodifica tokens predefinidos recuperando id y nombre', () => {
  const decoded1 = decodeSessionToken(PRESET_SESSION_TOKENS['asistencia-1'].token);
  assert.ok(decoded1);
  assert.equal(decoded1.id, 'asistencia-1');
  assert.ok(decoded1.name.includes('Asistencia 1'));

  const decoded2 = decodeSessionToken(PRESET_SESSION_TOKENS['asistencia-2'].token);
  assert.ok(decoded2);
  assert.equal(decoded2.id, 'asistencia-2');
  assert.ok(decoded2.name.includes('Asistencia 2'));
});

test('sessionToken: soporta sesiones dinámicas y parámetros legados', () => {
  const dynamicToken = encodeSessionToken('charla-iot', 'Taller de Sensores');
  assert.ok(dynamicToken.startsWith('dyn_'));

  const decodedDynamic = decodeSessionToken(dynamicToken);
  assert.ok(decodedDynamic);
  assert.equal(decodedDynamic.id, 'charla-iot');
  assert.equal(decodedDynamic.name, 'Taller de Sensores');

  // Fallback para nombres simples
  const legacy = decodeSessionToken('asistencia-1');
  assert.equal(legacy?.id, 'asistencia-1');

  assert.equal(decodeSessionToken(null), null);
  assert.equal(decodeSessionToken(''), null);
});

test('attendanceService: normalización de identificadores y URLs escaneadas', () => {
  assert.equal(normalizeIdentifier(' 72859994 '), '72859994');
  assert.equal(normalizeIdentifier('im-2026-0003'), 'IM-2026-0003');

  // Si el lector QR escaneó una URL con parámetros de credencial
  assert.equal(
    normalizeIdentifier('https://innovathonmollendo.tech/acreditacion?code=IM-2026-0003'),
    'IM-2026-0003'
  );
  assert.equal(
    normalizeIdentifier('https://innovathonmollendo.tech/checkin?dni=72859994'),
    '72859994'
  );

  // Normalización DNI con ceros
  assert.equal(normalizeDni('72859994'), '72859994');
  assert.equal(normalizeDni('2859994'), '02859994');
});

test('attendanceService: búsqueda de participante en la nómina', () => {
  const mockRoster = [
    {
      id: 'p-1',
      codigo: 'IM-2026-0003',
      dni: '72859994',
      nombre: 'Luis Gustavo Sequeiros Condori',
      institucion: 'UNSA',
      equipo: 'Reto 4',
    },
    {
      id: 'p-2',
      codigo: 'IM-2026-0004',
      dni: '02580202',
      nombre: 'Joel Noa',
      institucion: 'UNSA',
      equipo: 'Reto 4',
    },
  ];

  // Búsqueda por DNI exacto
  const p1 = findParticipantInRoster(mockRoster, '72859994');
  assert.ok(p1);
  assert.equal(p1.codigo, 'IM-2026-0003');

  // Búsqueda por Código en minúsculas
  const p2 = findParticipantInRoster(mockRoster, 'im-2026-0003');
  assert.ok(p2);
  assert.equal(p2.dni, '72859994');

  // Búsqueda por DNI sin cero inicial
  const p3 = findParticipantInRoster(mockRoster, '2580202');
  assert.ok(p3);
  assert.equal(p3.codigo, 'IM-2026-0004');

  // Inexistente
  assert.equal(findParticipantInRoster(mockRoster, '99999999'), null);
});

test('attendanceService: registro y control local de asistencias duplicadas', async () => {
  // Simular entorno localStorage básico para pruebas
  const store = {};
  globalThis.localStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => {
      store[k] = String(v);
    },
    removeItem: (k) => {
      delete store[k];
    },
  };

  // Mock global fetch para no realizar llamadas de red reales durante pruebas unitarias
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, json: async () => ({}) });

  try {
    const participant = {
      id: 'p-1',
      codigo: 'IM-2026-0003',
      dni: '72859994',
      nombre: 'Luis Gustavo Sequeiros Condori',
      institucion: 'UNSA',
      equipo: 'Reto 4',
    };
    const session = {
      id: 'asistencia-1',
      name: 'Sesión 1 · Apertura y Acreditación',
    };

    // Antes de marcar
    const beforeCheck = hasAlreadyMarkedLocally(session.id, participant.dni);
    assert.equal(beforeCheck.alreadyMarked, false);

    // Marcar asistencia
    const result = await submitAttendance({ participant, session });
    assert.equal(result.success, true);
    assert.ok(result.timestamp);

    // Después de marcar
    const afterCheckDni = hasAlreadyMarkedLocally(session.id, participant.dni);
    assert.equal(afterCheckDni.alreadyMarked, true);

    const afterCheckCod = hasAlreadyMarkedLocally(session.id, participant.codigo);
    assert.equal(afterCheckCod.alreadyMarked, true);

    // En otra sesión no debe estar marcado
    const otherSessionCheck = hasAlreadyMarkedLocally('asistencia-2', participant.dni);
    assert.equal(otherSessionCheck.alreadyMarked, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
