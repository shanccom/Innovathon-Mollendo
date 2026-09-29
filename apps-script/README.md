# Conexión con Google Sheets · Innovathon Mollendo 2026

La hoja de cálculo oficial ya está creada en tu Google Drive:
- **Archivo:** `Innovathon Mollendo 2026 - Inscripciones`
- **Enlace directo:** [Abrir hoja en Google Sheets](https://docs.google.com/spreadsheets/d/1prmw7i86wutZxhdC8YFIZifAN1iKyKiC3gJqDnohkFM/edit)
- **Carpeta:** [Abrir carpeta en Google Drive](https://drive.google.com/drive/folders/13dGoghyU58r7sBP9e8bHS7AXULm7LgXv)

---

## Pasos para conectar el formulario con Google Sheets (2 minutos)

1. Abre la hoja de cálculo en el enlace de arriba.
2. En el menú superior de Google Sheets, haz clic en **Extensiones > Apps Script**.
3. Borra el código por defecto que aparezca y pega el contenido completo del archivo [`Code.gs`](./Code.gs).
4. Arriba a la derecha, haz clic en el botón azul **Implementar** (Deploy) y selecciona **Nueva implementación** (New deployment).
5. En el engranaje ⚙️ de la izquierda (Seleccionar tipo), elige **Aplicación web** (Web app).
6. Configura los siguientes campos:
   - **Descripción:** `Innovathon API v1`
   - **Ejecutar como:** `Yo (tu correo)`
   - **Quién tiene acceso:** `Cualquier persona` (*Anyone*, fundamental para que el frontend público pueda enviar los datos sin pedir login de Google).
7. Haz clic en **Implementar**.
8. Si Google te pide autorizar permisos ("Revisar permisos"), selecciona tu cuenta y acepta (en caso de salir alerta de seguridad de Google, dale a *Configuración avanzada > Ir a Innovathon (no seguro)*).
9. Copia la **URL de la aplicación web** que te entrega (termina en `/exec`).
10. En la raíz del proyecto web, crea o edita tu archivo `.env`:
    ```env
    VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
    ```
11. ¡Listo! A partir de ese momento, cualquier participante que complete el registro aparecerá automáticamente en una nueva fila con su código `IM-2026-XXXX`.
