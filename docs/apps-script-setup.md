# Conectar el formulario con Google Sheets (Apps Script)

El frontend **no** habla con Sheets directamente: envía un `POST` a un Web App de Google Apps
Script y ese script escribe una fila por postulación. Solo hay que seguir estos pasos una vez.

## 1. Crear la hoja de cálculo

1. Crea una hoja en el Drive compartido del equipo (por ejemplo `Innovathon Mollendo 2026 · Registros`).
2. Opcional: importa `apps-script/registros-plantilla.csv` para tener los encabezados ya listos.

## 2. Añadir el script

1. Menú **Extensiones → Apps Script**.
2. Borra el contenido de `Code.gs` y pega el archivo [`apps-script/Code.gs`](../apps-script/Code.gs).
3. **Configuración del proyecto → Mostrar el archivo de manifiesto `appsscript.json`** y pega
   [`apps-script/appsscript.json`](../apps-script/appsscript.json).
4. Ejecuta la función `setup` una vez (te pedirá autorizar el acceso a la hoja) y acepta los permisos.

## 3. Desplegar el Web App

1. **Implementar → Nueva implementación → Aplicación web**.
2. **Ejecutar como:** `Yo` (o `Anyone with Google account` si la hoja es de una cuenta de servicio).
3. **Quién tiene acceso:** `Cualquier persona`. Es obligatorio: sin esto el navegador recibe `403`.
4. Copia la **URL `/exec`** y ponla en el `.env`:

```bash
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
```

5. Reinicia `npm run dev`. Sin la variable, el frontend usa el repositorio *fake* (localStorage).

## 4. Verificar

```bash
# Debe responder {"success":true,...}
curl "https://script.google.com/macros/s/AKfycb.../exec"

# Simula una postulación real
curl -X POST "https://script.google.com/macros/s/AKfycb.../exec" \
  -H "Content-Type: text/plain" \
  -d '{"fullName":"Camila Valdivia","email":"camila@correo.com","phone":"987654321","city":"Mollendo","age":22,"occupation":"UNSA","participationType":"individual","termsAccepted":true}'
```

Los códigos de registro tienen el formato `IM-<año>-<correlativo>` (ej. `IM-2026-0007`).

## 5. Configurar secreto en GitHub Pages (CI/CD)

Para el despliegue automático en producción:
1. Ve al repositorio en GitHub: **Settings → Secrets and variables → Actions**.
2. Crea o actualiza el secreto de repositorio **`APPS_SCRIPT_URL`** con la URL del Web App (`/exec`).
3. El workflow `.github/workflows/deploy.yml` inyectará automáticamente `VITE_APPS_SCRIPT_URL` durante `npm run build`.

## Notas importantes

- **CORS:** el frontend envía `Content-Type: text/plain` a propósito. Google Apps Script no responde
  al `preflight` de `OPTIONS` que dispara un `application/json`, por eso se usa JSON dentro de
  `text/plain`.
- **Vista previa (`/preview`):** siempre responde 200, así que úsala solo para revisar, nunca en producción.
- **Actualizar el script:** tras cada cambio debes crear una **nueva versión** (`Implementar → Nueva
  implementación` o `Administrar implementaciones → Editar → Versión nueva`) y volver a copiar la URL
  si cambia.
- **Privacidad:** la hoja debe vivir en el Drive compartido del equipo y solo con acceso para
  responsables de la organización. Nadie más debe tener el enlace de edición.

