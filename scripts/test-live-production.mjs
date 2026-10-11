import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = '/home/fernando/.gemini/antigravity/brain/2022b717-2c5b-41a6-bfa1-17d9f861d17d';

async function run() {
  console.log('🔍 Iniciando verificación en vivo sobre https://innovathonmollendo.tech/registro ...');

  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });

  const page = await context.newPage();

  // Interceptar y monitorear todas las peticiones a script.google.com
  page.on('request', (req) => {
    if (req.url().includes('script.google.com')) {
      console.log('📡 [HTTP REQUEST EN VIVO]:', req.method(), req.url());
      console.log('📦 [PAYLOAD ENVIADO]:', req.postData());
    }
  });

  page.on('response', async (res) => {
    if (res.url().includes('script.google.com') || res.url().includes('script.googleusercontent.com')) {
      console.log('📥 [HTTP RESPONSE STATUS]:', res.status(), res.url());
      try {
        const text = await res.text();
        console.log('📄 [HTTP RESPONSE BODY]:', text.slice(0, 300));
      } catch (e) {
        console.log('⚠️ Error leyendo body:', e.message);
      }
    }
  });

  console.log('1️⃣ Cargando página en vivo...');
  await page.goto('https://innovathonmollendo.tech/registro', { waitUntil: 'networkidle' });

  // Verificar la URL de Apps Script embebida en la página
  const bundledUrl = await page.evaluate(() => {
    // Buscar en los scripts de la página
    return window.__VITE_APPS_SCRIPT_URL || 'No global var';
  });

  console.log('📸 Capturando pantalla inicial de producción...');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'live_prod_step1.png'), fullPage: true });

  // Paso 1
  console.log('✍️ Llenando Paso 1...');
  await page.fill('#field-fullName', 'Fernando Garambel');
  await page.fill('#field-dni', '73268408');
  await page.fill('#field-phone', '958342111');
  await page.fill('#field-personalEmail', 'fgarambelm@gmail.com');
  await page.selectOption('#field-sede', 'Mollendo / Provincia de Islay');
  await page.selectOption('#field-career', 'Tecnología: Ingeniería de Sistemas, Software, Informática y afines');
  await page.selectOption('#field-institution', 'Universidad Nacional de San Agustín (UNSA) - Filial Mollendo');
  await page.selectOption('#field-academicLevel', '5.º año');

  await page.click('button:has-text("Siguiente")');
  await page.waitForSelector('#field-skills');

  // Paso 2
  console.log('✍️ Llenando Paso 2...');
  await page.fill('#field-skills', 'Prueba automatizada de producción para validar endpoint y correo.');
  await page.click('button:has-text("Desarrollo de Software / Programación")');
  await page.selectOption('#field-challengeInterest', 'Reto 1: Desarrollo Económico, Turismo y Comercio Local');

  await page.click('button:has-text("Siguiente →")');
  await page.waitForSelector('#field-availability');

  // Paso 3
  console.log('✍️ Llenando Paso 3...');
  await page.click('#field-availability', { force: true });
  await page.click('#field-termsAccepted', { force: true });

  console.log('🚀 Enviando formulario en vivo a producción...');
  await page.click('button:has-text("Enviar Inscripción")');

  // Esperar respuesta
  await page.waitForTimeout(8000);

  console.log('📸 Capturando pantalla final de resultado...');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'live_prod_result.png'), fullPage: true });

  const bodyText = await page.textContent('body');
  if (bodyText.includes('¡Inscripción Exitosa!')) {
    console.log('🎉 RESULTADO EN VIVO: ¡Inscripción Exitosa!');
  } else if (bodyText.includes('ya se encuentra registrada')) {
    console.log('⚠️ RESULTADO EN VIVO: Duplicado detectado');
  } else {
    console.log('ℹ️ Estado actual en pantalla verificado en screenshot');
  }

  await browser.close();
}

run().catch((err) => {
  console.error('❌ Error en test de producción:', err);
  process.exit(1);
});
