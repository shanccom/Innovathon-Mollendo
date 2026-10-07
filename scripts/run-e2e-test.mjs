import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = '/home/fernando/.gemini/antigravity/brain/2022b717-2c5b-41a6-bfa1-17d9f861d17d';

async function run() {
  console.log('🚀 Iniciando pruebas Playwright E2E...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  // 1. Navegar y limpiar localStorage para asegurar estado inicial
  console.log('1️⃣ Navegando a http://localhost:5173/registro ...');
  await page.goto('http://localhost:5173/registro', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  // Capturar Paso 1 vacío
  console.log('📸 Capturando Paso 1 vacío...');
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'e2e_step1_empty.png'),
    fullPage: true,
  });

  // 2. Llenar Paso 1: Datos Personales
  console.log('✍️ Llenando Paso 1 (Datos Personales)...');
  await page.fill('#field-fullName', 'Fernando Garambel');
  await page.fill('#field-dni', '73268408');
  await page.fill('#field-personalEmail', 'fgarambelm@gmail.com');
  // Dejamos campo institucional vacío para validar que es opcional
  await page.selectOption('#field-sede', 'Mollendo / Provincia de Islay');
  await page.selectOption('#field-career', 'Tecnología: Ingeniería de Sistemas, Software, Informática y afines');
  await page.selectOption('#field-institution', 'Universidad Nacional de San Agustín (UNSA) - Filial Mollendo');
  await page.selectOption('#field-academicLevel', '5.º año');

  console.log('📸 Capturando Paso 1 completado...');
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'e2e_step1_filled.png'),
    fullPage: true,
  });

  // Avanzar a Paso 2
  console.log('➡️ Avanzando al Paso 2...');
  await page.click('button:has-text("Siguiente")');
  await page.waitForSelector('#field-skills');

  // 3. Llenar Paso 2: Habilidades y Equipo
  console.log('✍️ Llenando Paso 2 (Habilidades y Equipo)...');
  await page.fill(
    '#field-skills',
    'Desarrollo web Full Stack, arquitectura de software, React, Node.js y trabajo colaborativo en equipos de innovación tecnológica.'
  );

  // Seleccionar área de aporte: Desarrollo de Software
  await page.click('button:has-text("Desarrollo de Software / Programación")');

  // Seleccionar reto de interés
  await page.selectOption('#field-challengeInterest', 'Reto 1: Desarrollo Económico, Turismo y Comercio Local');

  console.log('📸 Capturando Paso 2 completado...');
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'e2e_step2_filled.png'),
    fullPage: true,
  });

  // Avanzar a Paso 3
  console.log('➡️ Avanzando al Paso 3...');
  await page.click('button:has-text("Siguiente →")');
  await page.waitForSelector('#field-availability');

  // 4. Llenar Paso 3: Términos y Confirmación
  console.log('✍️ Llenando Paso 3 (Disponibilidad y Términos)...');
  await page.click('#field-availability', { force: true });
  await page.click('#field-termsAccepted', { force: true });

  console.log('📸 Capturando Paso 3 completado...');
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'e2e_step3_filled.png'),
    fullPage: true,
  });

  // Enviar Inscripción
  console.log('🚀 Enviando Formulario de Inscripción...');
  await page.click('button:has-text("Enviar Inscripción")');

  // Esperar pantalla de confirmación
  await page.waitForSelector('text=¡Inscripción Exitosa!', { timeout: 10000 });
  console.log('✅ Pantalla de éxito alcanzada!');

  // Validar datos en pantalla de éxito
  const successText = await page.textContent('body');
  if (!successText.includes('fgarambelm@gmail.com')) {
    throw new Error('❌ El correo personal fgarambelm@gmail.com no apareció en la pantalla de éxito.');
  }
  if (!successText.includes('Fernando Garambel')) {
    throw new Error('❌ El nombre Fernando Garambel no apareció en la pantalla de éxito.');
  }

  console.log('📸 Capturando pantalla de éxito...');
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'e2e_success.png'),
    fullPage: true,
  });

  // 5. Test de Registro Duplicado
  console.log('🔄 Probando detección de duplicados con fgarambelm@gmail.com y DNI 73268408...');
  await page.goto('http://localhost:5173/registro', { waitUntil: 'networkidle' });

  // Llenar nuevamente Paso 1 con el mismo correo y DNI
  await page.fill('#field-fullName', 'Fernando Garambel');
  await page.fill('#field-dni', '73268408');
  await page.fill('#field-personalEmail', 'fgarambelm@gmail.com');
  await page.selectOption('#field-sede', 'Mollendo / Provincia de Islay');
  await page.selectOption('#field-career', 'Tecnología: Ingeniería de Sistemas, Software, Informática y afines');
  await page.selectOption('#field-institution', 'Universidad Nacional de San Agustín (UNSA) - Filial Mollendo');
  await page.selectOption('#field-academicLevel', '5.º año');
  await page.click('button:has-text("Siguiente")');

  await page.waitForSelector('#field-skills');
  await page.fill('#field-skills', 'Segunda postulación de prueba para validar que no permita duplicados.');
  await page.click('button:has-text("Desarrollo de Software / Programación")');
  await page.selectOption('#field-challengeInterest', 'Reto 1: Desarrollo Económico, Turismo y Comercio Local');
  await page.click('button:has-text("Siguiente →")');

  await page.waitForSelector('#field-availability');
  await page.click('#field-availability', { force: true });
  await page.click('#field-termsAccepted', { force: true });

  await page.click('button:has-text("Enviar Inscripción")');

  // Esperar banner de duplicado
  await page.waitForSelector('text=¡Tu postulación ya se encuentra registrada!', { timeout: 10000 });
  console.log('✅ Banner de duplicado detectado!');

  const duplicateContent = await page.textContent('body');
  if (duplicateContent.includes('¡Tu cupo está a salvo!')) {
    throw new Error('❌ El texto "¡Tu cupo está a salvo!" sigue apareciendo cuando no debería.');
  }

  console.log('📸 Capturando banner de duplicado...');
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'e2e_duplicate.png'),
    fullPage: true,
  });

  console.log('🎉 Todas las pruebas E2E con Playwright concluyeron exitosamente!');
  await browser.close();
}

run().catch((err) => {
  console.error('❌ Error en prueba E2E:', err);
  process.exit(1);
});
