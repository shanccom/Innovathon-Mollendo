import { chromium } from 'playwright';
import { createServer } from 'vite';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { startQaApi } from './qa-api-server.mjs';
import { validRegistration as valid } from '../tests/fixtures/registration.mjs';

const artifacts = resolve('test-results/e2e');
await mkdir(artifacts, { recursive: true });
const api = await startQaApi(0);
process.env.VITE_APPS_SCRIPT_URL = api.url;
process.env.VITE_USE_FAKE_REGISTRATION = 'false';
const vite = await createServer({ server: { host: '127.0.0.1', port: 0 } });
let browser;
const failures = [];
let passed = 0;

try {
  await vite.listen();
  const base = `http://127.0.0.1:${vite.httpServer.address().port}`;
  browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { channel: process.env.E2E_BROWSER || 'msedge' } : {}) });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  async function scenario(name, action) {
    try { await action(); passed++; console.log(`PASS ${name}`); }
    catch (error) { failures.push(name); await page.screenshot({ path: resolve(artifacts, `failure-${failures.length}.png`), fullPage: true }); throw error; }
  }
  async function step1(data = valid) {
    await page.goto(`${base}/registro`);
    for (const key of ['fullName', 'dni', 'phone', 'personalEmail', 'institutionalEmail']) await page.locator(`#field-${key}`).fill(data[key]);
    for (const key of ['sede', 'career', 'institution', 'academicLevel']) await page.locator(`#field-${key}`).selectOption(data[key]);
  }
  async function step2() {
    await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
    await page.locator('#field-skills').fill(valid.skills);
    await page.getByRole('button', { name: valid.contributionAreas[0] }).click();
    await page.locator('#field-challengeInterest').selectOption(valid.challengeInterest);
    await page.getByRole('button', { name: 'Siguiente →', exact: true }).click();
    await page.locator('#field-availability').check();
    // Synthetic QA persona, isolated service doubles: no real enrollment/agreement.
    await page.locator('#field-termsAccepted').check();
  }
  async function duplicate(data) {
    await step1(data); await step2();
    await page.getByRole('button', { name: 'Enviar Inscripción', exact: true }).click();
    await page.getByRole('heading', { name: '¡Tu postulación ya se encuentra registrada!' }).waitFor();
  }

  await scenario('celular vacío, corto o inválido bloquea el paso 1', async () => {
    await step1({ ...valid, phone: '' });
    assert.equal(await page.locator('#field-phone').getAttribute('required'), '');
    for (const phone of ['', '12345', '800000000', '9abcdefgh']) {
      await page.locator('#field-phone').fill(phone);
      await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
      assert.equal(await page.locator('#error-phone').isVisible(), true);
      assert.equal(await page.locator('#field-skills').count(), 0);
    }
    await page.locator('#field-phone').fill(valid.phone);
    await page.screenshot({ path: resolve(artifacts, 'phone-desktop.png'), fullPage: true });
  });

  await scenario('solo compañero, validación paso 2 y atrás conserva celular', async () => {
    await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
    assert.equal(await page.getByText(/docente/i).count(), 0);
    assert.equal(await page.getByLabel('Compañero de equipo', { exact: false }).isVisible(), true);
    await page.getByRole('button', { name: 'Siguiente →', exact: true }).click();
    assert.equal(await page.locator('#error-skills').isVisible(), true);
    await page.screenshot({ path: resolve(artifacts, 'companion.png'), fullPage: true });
    await page.getByRole('button', { name: '← Atrás', exact: true }).click();
    assert.equal(await page.locator('#field-phone').inputValue(), valid.phone);
  });

  await scenario('términos/disponibilidad obligatorios, doble clic genera una sola petición y fila', async () => {
    await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
    await page.locator('#field-skills').fill(valid.skills);
    await page.getByRole('button', { name: valid.contributionAreas[0] }).click();
    await page.locator('#field-challengeInterest').selectOption(valid.challengeInterest);
    await page.getByRole('button', { name: 'Siguiente →', exact: true }).click();
    await page.getByRole('button', { name: 'Enviar Inscripción', exact: true }).click();
    assert.equal(await page.locator('#error-termsAccepted').isVisible(), true);
    await page.locator('#field-availability').check();
    await page.locator('#field-termsAccepted').check();
    let requests = 0;
    await page.route(`${api.url}/`, async (route) => { if (route.request().method() === 'POST') requests++; await new Promise((r) => setTimeout(r, 250)); await route.continue(); });
    await page.getByRole('button', { name: 'Enviar Inscripción', exact: true }).dispatchEvent('click');
    await page.getByRole('button', { name: /Enviar Inscripción|Enviando/ }).dispatchEvent('click');
    await page.getByRole('heading', { name: '¡Inscripción Exitosa!' }).waitFor();
    assert.equal(requests, 1);
    await page.unroute(`${api.url}/`);
    const totals = await (await fetch(`${api.url}/metrics`)).json();
    assert.equal(totals.records, 1); assert.equal(totals.phonesStored, true);
    await page.screenshot({ path: resolve(artifacts, 'success.png'), fullPage: true });
  });

  await scenario('duplicado DNI con otro correo', () => duplicate({ ...valid, personalEmail: 'different@example.test' }));
  await scenario('duplicado correo con otro DNI y mayúsculas', () => duplicate({ ...valid, dni: '90000002', personalEmail: 'QA@EXAMPLE.TEST' }));

  await scenario('Gmail con puntos, +alias y googlemail se rechaza en E2E', async () => {
    await step1({ ...valid, dni: '90000003', personalEmail: 'q.a.qa@gmail.com' }); await step2();
    await page.getByRole('button', { name: 'Enviar Inscripción', exact: true }).click();
    await page.getByRole('heading', { name: '¡Inscripción Exitosa!' }).waitFor();
    await duplicate({ ...valid, dni: '90000004', personalEmail: 'QAQA+evento@googlemail.com' });
  });

  await scenario('fallo de red mantiene el formulario y permite reintentar', async () => {
    await step1({ ...valid, dni: '90000005', personalEmail: 'retry@example.test' }); await step2();
    await page.route(`${api.url}/`, (route) => route.request().method() === 'POST' ? route.abort('failed') : route.continue());
    await page.getByRole('button', { name: 'Enviar Inscripción', exact: true }).click();
    await page.getByText('No pudimos conectar con el servidor. Revisa tu conexión e intenta nuevamente.', { exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Enviar Inscripción', exact: true }).isEnabled(), true);
    await page.unroute(`${api.url}/`);
    await page.getByRole('button', { name: 'Enviar Inscripción', exact: true }).click();
    await page.getByRole('heading', { name: '¡Inscripción Exitosa!' }).waitFor();
  });

  await scenario('BUSY y HTML inesperado no muestran éxito; reintento recupera', async () => {
    await step1({ ...valid, dni: '90000006', personalEmail: 'busy@example.test' }); await step2();
    await page.route(`${api.url}/`, (route) => route.request().method() === 'POST' ? route.fulfill({ contentType: 'application/json', body: '{"success":false,"code":"BUSY","error":"Servidor ocupado; intenta otra vez."}' }) : route.continue());
    await page.getByRole('button', { name: 'Enviar Inscripción', exact: true }).click();
    await page.getByText('Servidor ocupado; intenta otra vez.', { exact: true }).waitFor();
    await page.unroute(`${api.url}/`);
    await page.route(`${api.url}/`, (route) => route.request().method() === 'POST' ? route.fulfill({ contentType: 'text/html', body: '<html>busy</html>' }) : route.continue());
    await page.getByRole('button', { name: 'Enviar Inscripción', exact: true }).click();
    await page.getByText('El servidor devolvió una respuesta inesperada.', { exact: true }).waitFor();
    await page.unroute(`${api.url}/`);
    await page.getByRole('button', { name: 'Enviar Inscripción', exact: true }).click();
    await page.getByRole('heading', { name: '¡Inscripción Exitosa!' }).waitFor();
  });

  await scenario('dos navegadores simultáneos: una inscripción y un rechazo', async () => {
    const secondContext = await browser.newContext();
    const secondPage = await secondContext.newPage();
    try {
      const data = { ...valid, dni: '90000007', personalEmail: 'parallel@example.test' };
      await step1(data); await step2();
      await secondPage.goto(`${base}/registro`);
      for (const key of ['fullName', 'dni', 'phone', 'personalEmail']) await secondPage.locator(`#field-${key}`).fill(data[key]);
      for (const key of ['sede', 'career', 'institution', 'academicLevel']) await secondPage.locator(`#field-${key}`).selectOption(data[key]);
      await secondPage.getByRole('button', { name: 'Siguiente', exact: true }).click();
      await secondPage.locator('#field-skills').fill(valid.skills);
      await secondPage.getByRole('button', { name: valid.contributionAreas[0] }).click();
      await secondPage.locator('#field-challengeInterest').selectOption(valid.challengeInterest);
      await secondPage.getByRole('button', { name: 'Siguiente →', exact: true }).click();
      await secondPage.locator('#field-availability').check();
      await secondPage.locator('#field-termsAccepted').check();
      await Promise.all([page, secondPage].map((p) => p.getByRole('button', { name: 'Enviar Inscripción', exact: true }).click()));
      await Promise.all([page, secondPage].map((p) => p.getByRole('heading', { name: /¡Inscripción Exitosa!|¡Tu postulación ya se encuentra registrada!/ }).waitFor()));
      const outcomes = await Promise.all([page, secondPage].map((p) => p.getByRole('heading', { name: '¡Inscripción Exitosa!' }).count()));
      assert.equal(outcomes.reduce((sum, count) => sum + count, 0), 1);
    } finally { await secondContext.close(); }
  });

  await scenario('backend antiguo bloquea escritura y recupera al actualizarse', async () => {
    await step1({ ...valid, dni: '90000009', personalEmail: 'version@example.test' }); await step2();
    let posts = 0;
    await page.route(`${api.url}/`, (route) => {
      if (route.request().method() === 'POST') { posts++; return route.continue(); }
      return route.fulfill({ contentType: 'application/json', body: '{"success":true,"version":"v2.2-sin-codigo"}' });
    });
    await page.getByRole('button', { name: 'Enviar Inscripción', exact: true }).click();
    await page.getByText('Las inscripciones se están actualizando. Vuelve a intentar en unos minutos.', { exact: true }).waitFor();
    assert.equal(posts, 0);
    await page.unroute(`${api.url}/`);
    await page.getByRole('button', { name: 'Enviar Inscripción', exact: true }).click();
    await page.getByRole('heading', { name: '¡Inscripción Exitosa!' }).waitFor();
  });

  await scenario('celular y compañero en móvil, sin desbordamiento', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await step1({ ...valid, dni: '90000008', personalEmail: 'mobile@example.test' });
    assert.equal(await page.locator('#field-phone').isVisible(), true);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: resolve(artifacts, 'phone-mobile.png'), fullPage: true });
    await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
    assert.equal(await page.getByLabel('Compañero de equipo', { exact: false }).isVisible(), true);
  });
  assert.deepEqual(pageErrors, []);
  console.log(`E2E: ${passed} escenarios aprobados, ${failures.length} fallidos. Backend local con servicios Google simulados.`);
} finally {
  await browser?.close();
  await vite.close();
  await api.close();
}
