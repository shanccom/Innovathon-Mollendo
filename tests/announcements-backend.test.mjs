import test from 'node:test';
import assert from 'node:assert/strict';
import { createHarness } from './helpers/apps-script-harness.mjs';

test('Apps Script backend: send_test envía correo individual y valida email', () => {
  const h = createHarness();

  // Caso 1: Destinatario válido
  const resValid = h.post({
    action: 'send_test',
    to: 'fgarambelm@gmail.com',
    subject: 'Prueba de Innovathon',
    htmlBody: '<p>Hola Fernando</p>',
    plainBody: 'Hola Fernando',
  });

  assert.equal(resValid.success, true);
  assert.match(resValid.message, /fgarambelm@gmail\.com/);
  assert.equal(h.trace.includes('email'), true);

  // Caso 2: Destinatario inválido
  const resInvalid = h.post({
    action: 'send_test',
    to: 'correo-sin-arroba',
    subject: 'Fallo',
  });
  assert.equal(resInvalid.success, false);
  assert.match(resInvalid.error, /inválido/i);
});

test('Apps Script backend: send_campaign procesa lotes y registra en historial', () => {
  const h = createHarness();

  const campaignPayload = {
    action: 'send_campaign',
    campaignName: 'Convocatoria Fase 2',
    template: {
      asunto: 'Bienvenido {{primer_nombre}}',
      cuerpo: 'Hola a todos',
    },
    destinatarios: [
      {
        correo: 'participante1@gmail.com',
        nombre: 'Ana Torres',
        primerNombre: 'Ana',
        asunto: 'Bienvenido Ana',
        htmlBody: '<p>Bienvenido Ana</p>',
        plainBody: 'Bienvenido Ana',
      },
      {
        correo: 'participante2@gmail.com',
        nombre: 'Carlos Ruiz',
        primerNombre: 'Carlos',
        asunto: 'Bienvenido Carlos',
        htmlBody: '<p>Bienvenido Carlos</p>',
        plainBody: 'Bienvenido Carlos',
      },
      {
        correo: 'invalido',
        nombre: 'Error User',
        primerNombre: 'Error',
        asunto: 'Error',
        htmlBody: '<p>Error</p>',
        plainBody: 'Error',
      },
    ],
  };

  const res = h.post(campaignPayload);
  assert.equal(res.success, true);
  assert.equal(res.campaign.enviados, 2);
  assert.equal(res.campaign.errores, 1);
  assert.equal(res.campaign.totalDestinatarios, 3);
});

test('Apps Script backend: doGet reporta capacidad de anuncios', () => {
  const h = createHarness();
  const health = h.health();
  assert.equal(health.success, true);
  assert.equal(health.capabilities.announcements, true);
  assert.equal(health.capabilities.phone, true);
  assert.equal(health.capabilities.atomicDuplicates, true);
});
