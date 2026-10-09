# Conectar el formulario con Google Sheets

Hoja de producción: [Innovathon Mollendo 2026 - Inscripciones](https://docs.google.com/spreadsheets/d/1U48ftJJns3-4waJrt4A4uaI4OBNQoeyg1sOzzvXllI8/edit).

1. Abre **Extensiones → Apps Script** con una cuenta autorizada para editar y desplegar el proyecto.
2. Actualiza únicamente el archivo que contiene `doGet` y `doPost` con [`Code.gs`](../apps-script/Code.gs). Conserva los módulos de campañas, asistencia y correos existentes.
3. Para un proyecto nuevo, usa [`appsscript.json`](../apps-script/appsscript.json). El acceso explícito por ID requiere el alcance `spreadsheets`; `spreadsheets.currentonly` no basta. En un proyecto existente, conserva sus permisos y añade los de Sheets/correo/URL Fetch si faltan; no reemplaces un manifiesto que otros módulos necesitan. Google puede solicitar autorización al propietario.
4. Ejecuta `setup`: añade las columnas que falten al final, sin reordenar las 18 columnas originales ni modificar participantes anteriores. Guarda celular y DNI como texto.
5. **Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar**. Mantén la URL `/exec` que usa la web, la cuenta ejecutora y la configuración de acceso existente.
6. Consulta `/exec`: debe devolver `version: "v3.0-registro-concurrente"` y `capabilities: { phone: true, atomicDuplicates: true }`.

Un push a GitHub publica el frontend; no actualiza Apps Script. Despliega el backend antes de publicar el frontend: una versión anterior del backend mostrará «Las inscripciones se están actualizando» y no recibirá el POST, para evitar perder el celular o guardar columnas desalineadas.

## Frontend

Configura el secreto de GitHub Actions `APPS_SCRIPT_URL` con la URL existente `/exec`. Para desarrollo local puedes usar:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/TU_IMPLEMENTACION/exec
```

Sin endpoint, solo el servidor de desarrollo usa `localStorage`. Producción nunca confirma un registro local como si se hubiera guardado en Sheets.

## Duplicados y concurrencia

La consulta por DNI y los dos correos y la escritura comparten un `ScriptLock`. Se compara Gmail sin puntos ni sufijos `+alias`, también con `googlemail.com`. Para otros dominios se conservan puntos y sufijos. El bloqueo se libera después de `SpreadsheetApp.flush()` y antes de enviar el correo. Si se agota la espera, responde JSON `BUSY`; un fallo de correo no elimina una inscripción guardada.

Todos los escritores del registro deben pertenecer al mismo proyecto de Apps Script. El bloqueo de un proyecto no coordina otro proyecto independiente ni ediciones manuales.

## Pruebas reales aisladas

1. Crea una hoja nueva de QA sin copiar participantes.
2. Crea un **proyecto independiente** de Apps Script de QA y copia `Code.gs`. Usa `appsscript.qa.json` como su manifiesto `appsscript.json`.
3. En las propiedades de **ese proyecto de QA** configura `REGISTRATION_TEST_MODE=true` y `QA_SPREADSHEET_ID=<ID_DE_LA_HOJA_QA>`.
4. Autoriza y despliega únicamente el proyecto QA. En este modo no se envían correos.
5. Sigue los comandos de [`pruebas-finales.md`](pruebas-finales.md) y verifica las filas de QA con el conector de Sheets.

Nunca actives TEST_MODE en el proyecto de producción: las propiedades se comparten entre sus implementaciones. El backend y k6 rechazan la hoja de producción como destino QA.
