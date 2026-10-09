# Despliegue en GitHub Pages

## Primera publicación

1. Sube el código a `main` (el workflow `.github/workflows/deploy.yml` ya está incluido).
2. En el repo: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Espera el primer deploy y abre
   `https://shanccom.github.io/Innovathon-Mollendo/`.

El workflow ejecuta `npm ci`, lint, regresión y E2E, compila y publica `dist/`.

## Conectar el dominio `innovathonmollendo.tech`

1. **Settings → Pages → Custom domain**: escribe `innovathonmollendo.tech`, guarda y espera la
   verificación. El archivo `public/CNAME` ya lo declara en cada build.
2. En el registrador de dominio, agrega los registros que GitHub indique (normalmente:

   | Tipo | Nombre | Valor |
   | --- | --- | --- |
   | A | `@` | `shanccom.github.io` |
   | CNAME | `www` | `innovathonmollendo.tech` |

3. En **Settings → Pages**, marca **Enforce HTTPS**.

### Importante: cambia el `base` cuando el dominio esté activo

Con el dominio propio la web se sirve desde la raíz, no desde `/Innovathon-Mollendo/`.

1. **Settings → Secrets and variables → Actions → Variables → New repository variable**
   - Name: `VITE_BASE_PATH`, Value: `/`
2. Si quieres cambiar textos, crea `VITE_SITE_URL` con `https://innovathonmollendo.tech`.
3. Vuelve a hacer push a `main` (o `workflow_dispatch`).

Si no creas la variable, el workflow usa `/Innovathon-Mollendo/` y la web funciona, pero con URLs
tipo `innovathonmollendo.tech/Innovathon-Mollendo/`.

## Configurar el endpoint de registros

1. **Settings → Secrets and variables → Actions → Secrets → New repository secret**
   - Name: `APPS_SCRIPT_URL`, Value: la URL `/exec` del Web App (ver
   [`apps-script-setup.md`](./apps-script-setup.md)).
2. Cada build inyecta ese valor en `VITE_APPS_SCRIPT_URL`, así que **nunca** queda en el
   repositorio.
3. Si el secreto no existe, el formulario muestra que las inscripciones no están disponibles;
   producción nunca confirma registros guardados solo en el navegador.
4. Despliega primero `apps-script/Code.gs` y su manifiesto. El frontend exige las capacidades
   `phone` y `atomicDuplicates` del health check; una implementación anterior muestra
   «Las inscripciones se están actualizando» y evita escribir datos incompletos.

## Variables de entorno

| Variable | Dónde | Para qué |
| --- | --- | --- |
| `VITE_BASE_PATH` | Actions (variable) o `.env.local` | Subruta de publicación: `/Innovathon-Mollendo/` o `/`. |
| `VITE_SITE_URL` | Actions (variable) o `.env.local` | Canonical y Open Graph. |
| `VITE_APPS_SCRIPT_URL` | Actions (**secreto**) o `.env.local` | Web App de Google Apps Script. |
| `VITE_USE_FAKE_REGISTRATION` | `.env.local` | `true` fuerza el repositorio local solo en desarrollo. |
