# Pruebas finales del formulario — 9 de octubre de 2026

## Resultado y alcance

La regresión y los E2E locales aprobaron. Las comprobaciones de lectura del sitio y del endpoint publicado aprobaron. **La carga de escritura concurrente sobre Google Sheets real está pendiente de una implementación QA autorizada.** Los tiempos locales no representan la latencia ni las cuotas de Google.

Se publicó la **versión 4 el 9 de octubre a las 12:31 (Lima)** en la URL existente. Incluye acceso explícito a la hoja por ID, necesario fuera del editor. Se verificó por HTTP `v3.0-registro-concurrente`, `phone: true`, `atomicDuplicates: true` y `testMode: false`. `setup` terminó correctamente y la lectura real confirmó 22 columnas: las 18 originales más Otra institución, Otra sede, Otra carrera y Número de celular. Los permisos del proyecto de producción se conservaron.

El propietario autorizó el alcance de Google Sheets para el proyecto independiente «Innovathon QA · concurrencia · 2026-10-09». Se creó una hoja QA privada y `smokeQa` aprobó a las 12:32: cinco POST secuenciales, dos registros guardados y leídos, tres duplicados rechazados (DNI, email y alias Gmail), celular como texto y ningún correo enviado. Esta ejecución privada no mide concurrencia por HTTP. La revisión automática rechazó hacer público el endpoint QA sin autorización específica; la carga real con k6 queda pendiente de esa autorización.

| Prueba | Entorno | Resultado |
| --- | --- | --- |
| Regresión | Node, Code.gs real con dobles de servicios Google | 15/15 aprobadas |
| Guardado y duplicados reales | Editor privado de Apps Script y hoja QA real | 5/5; 2 filas leídas; 3 duplicados; celular como texto |
| Validación publicada | POST inválidos al endpoint de producción, versión 4 | 4/4 rechazados con VALIDATION; sin escritura/correo |
| Concurrencia con workers | 8 workers, memoria compartida | 80 envíos; 34 filas; una por grupo repetido |
| E2E | Playwright, escritorio 1280×900 y móvil 390×844 | 11/11 escenarios aprobados |
| k6 del formulario | HTTP local, 32 usuarios virtuales, 8 workers | 104 POST: 35 creados, 69 duplicados rechazados; 209/209 checks |
| k6 del frontend publicado | 8 usuarios virtuales; 40 iteraciones | 121 peticiones; 160/160 checks; p95 121,68 ms |
| k6 del endpoint real, solo GET | 2 usuarios virtuales; 10 consultas | 10/10 checks; 20 peticiones con redirecciones; p95 HTTP 1,03 s |
| k6 del endpoint v3 desplegado, solo GET | 2 usuarios virtuales; 10 consultas | 10/10 checks; 20 peticiones; p95 HTTP 1,73 s; p95 de iteración 2,18 s |

k6 local: p95 de POST **15,73 ms**, cero fallos HTTP. El endpoint real tenía la versión `v2.2-sin-codigo` durante la medición. Una consulta GET confirma que el endpoint responde, no que pueda escribir una fila o enviar un correo. En el GET real, p95 de la iteración completa con redirecciones fue 1,89 s.

La ruta `/registro` en GitHub Pages devuelve HTTP 404 con el HTML de la SPA. La prueba acepta ese caso exclusivamente para esa ruta y exige el contenedor de la aplicación; JS y CSS deben responder HTTP 200. No se interpreta cualquier 404 como éxito. Estas métricas miden red/servidor, no LCP, INP, FPS ni rendimiento gráfico en teléfonos físicos.

## Hoja real inspeccionada

Se consultaron metadatos, `Registros!A1:Z1` y el intervalo acotado `D2:F987` de la hoja proporcionada. Se observó una fila con identidad, sin DNI o correos repetidos en ese intervalo. No se copiaron identidades de participantes al informe ni a las fixtures.

La hoja usa 18 encabezados y el backend anterior escribía 21 campos por posición: riesgo de datos bajo encabezados equivocados. El código corregido identifica las columnas por nombre y agrega los campos faltantes al final. Conserva la columna histórica «Compañero / Recomendación» por compatibilidad con los módulos de campañas; el formulario dice únicamente «Compañero de equipo». No se repararon valores históricos suponiendo qué significaban.

## Cobertura funcional

- Celular peruano obligatorio de 9 dígitos comenzando por 9; validación de cliente y POST directo.
- DNI de 8 dígitos; conservación del cero inicial y detección de registros históricos convertidos a número.
- Duplicados de DNI, email personal, email institucional y cruces entre ambos campos.
- Gmail con mayúsculas, puntos, `+alias` y `googlemail.com`; otros dominios mantienen puntos y sufijos.
- Pasos obligatorios, campos «Otra…», booleanos reales y límite de habilidades.
- Doble clic: una petición y una fila; dos navegadores simultáneos: un éxito y un rechazo.
- Error de red, JSON BUSY, HTML inesperado, almacenamiento fallido, respuesta incompleta y timeout; reintento manual sin éxito falso.
- Backend anterior: aviso de actualización antes del POST; recuperación tras actualizarse.
- Compatibilidad con 18 columnas, ampliación de filas/columnas, códigos únicos y neutralización de fórmulas.
- Liberación de bloqueo después de flush y antes de correo; fallo de correo conserva el registro.
- Acceso por ID a la hoja de producción aun cuando no existe una hoja activa en el contexto Web App.

## Reproducir

```sh
npm ci
npm test
npm run lint
npm run build
npm run test:e2e
npm run test:load
```

Playwright requiere Chromium (`npx playwright install chromium`). En Windows se usa Edge instalado; puedes indicar `E2E_BROWSER=chrome`. Los E2E crean y cierran su Vite y backend HTTP aislados; nunca toman la URL real del entorno para enviar datos. k6 debe estar instalado. `test:load` crea un backend limpio y un identificador común a todos los usuarios virtuales.

Los artefactos locales quedan en `test-results/`, excluido de Git. Los resultados de k6 sin datos personales se conservan en `docs/qa-results/`.

Para repetir las lecturas de producción en PowerShell:

```powershell
$env:SITE_URL = 'https://innovathonmollendo.tech'
k6 run tests/k6/frontend.js
$env:HEALTH_ENDPOINT = '<URL /exec publicada>'
k6 run tests/k6/availability.js
node tests/google/production-validation.mjs
```

Para carga real en una hoja QA nueva, configura un proyecto independiente según [la guía](apps-script-setup.md). Empieza con menor concurrencia si la cuenta tiene cuotas limitadas:

```powershell
$env:QA_ENDPOINT = '<URL /exec del proyecto QA>'
$env:QA_SHEET_ID = '<ID de la hoja QA, distinta de producción>'
$env:QA_RUN_ID = '123456' # usa otro identificador de seis dígitos en cada ejecución
k6 run --summary-export=test-results/k6-sheets-real.json tests/k6/registration.js
```

El script rechaza endpoints sin TEST_MODE y la hoja de producción. Tras una ejecución completa deben existir exactamente 35 filas nuevas: 32 únicas y un ganador por cada grupo DNI/email/Gmail. Verifica en Sheets el mismo `Origen=qa_k6_<QA_RUN_ID>`, códigos y DNI únicos, celular y correos, antes de considerar aprobada la escritura real. Un resultado exitoso de las peticiones por sí solo no sustituye esa lectura.

## Disponibilidad: límite de la conclusión

No se certifica alta disponibilidad con estas pruebas. Apps Script/Sheets tienen cuotas, límites de ejecuciones simultáneas y no hay un almacén alternativo ni una cola duradera en esta arquitectura. El bloqueo protege la exclusión mutua dentro del mismo proyecto, no elimina esas cuotas ni coordina otro proyecto independiente. Para una garantía estricta se necesita un backend con restricciones únicas transaccionales, persistencia redundante, cola de correos y monitoreo continuo bajo un objetivo de disponibilidad definido.

El código reduce la contención y responde BUSY cuando obtiene el control de la ejecución; una cuota de Google puede interrumpirla antes de alcanzar el manejador. La espera del cliente termina a los 30 segundos; no se repite el POST automáticamente porque el registro podría haberse guardado.

Referencias: [contexto de scripts vinculados y Web Apps](https://developers.google.com/apps-script/guides/bound), [Lock y flush de Apps Script](https://developers.google.com/apps-script/reference/lock/lock), [cuotas de Apps Script](https://developers.google.com/apps-script/guides/services/quotas), [métricas de k6](https://grafana.com/docs/k6/latest/using-k6/metrics/).
