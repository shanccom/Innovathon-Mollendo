# Innovathon Mollendo

> **Las ideas también tienen marea.**

Web oficial de la Innovathon Mollendo 2026: landing del evento y formulario de inscripción
conectado a una hoja de cálculo en un Drive compartido.

- **Dominio:** [innovathonmollendo.tech](https://innovathonmollendo.tech)
- **Rutas:** `/` (evento) · `/registro` (inscripción)
- **Stack:** React 19 · Vite 8 · Tailwind CSS 4 · React Router 7 · JavaScript

## Vista del Hero

![Hero de Innovathon Mollendo con navegación e ilustración animada](docs/images/hero.png)

## Estructura

Clean Architecture: las dependencias apuntan hacia el dominio y cada capa se puede
reemplazar sin tocar las demás.

```
src/
├── domain/          Entidad, catálogos, reglas de validación y puerto del repositorio
├── application/     Caso de uso SubmitRegistration (normaliza → valida → persiste)
├── infrastructure/  Adaptadores (Apps Script, fake), DI, env y contenido del evento
├── presentation/    Páginas, componentes, secciones y hooks de React
├── app/             Composition root y rutas
└── shared/          Constantes, utilidades y estilos (tokens de marca)
apps-script/         Code.gs que escribe las inscripciones en Google Sheets
docs/                Arquitectura, despliegue y configuración de Apps Script
```

Detalle completo en [`docs/architecture.md`](docs/architecture.md).

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # opcional para desarrollo
npm run dev                  # http://localhost:5173
```

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | Build de producción en `dist/`. |
| `npm run preview` | Sirve `dist/` localmente. |
| `npm run lint` | ESLint (reglas de React Hooks incluidas). |

## Formulario de inscripción

`/registro` valida en el navegador y envía un `POST` a un Web App de **Google Apps Script**,
que agrega una fila por postulación a la hoja del Drive compartido.

```bash
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
```

- Configura el script paso a paso: [`docs/apps-script-setup.md`](docs/apps-script-setup.md).
- Si la variable no está definida, la app usa un repositorio *fake* que guarda en
  `localStorage`, útil para desarrollar sin backend.

El código que ve el participante tiene el formato `IM-<año>-<correlativo>`.

## Contenido del evento

Fechas, cronograma, mentores, pilares y FAQ viven en `src/infrastructure/content/`. Editar
esos archivos es suficiente para actualizar la landing; no hay que tocar componentes.

## GitHub Pages

Despliegue automático a `main` con `.github/workflows/deploy.yml` (lint + build + publish).
Para el dominio propio hay que crear la variable `VITE_BASE_PATH=/` en
**Settings → Secrets and variables → Actions**.

Detalles en [`docs/deployment.md`](docs/deployment.md).

## Estructura de commits

Conventional Commits en inglés:

```text
feat: add registration form and Apps Script adapter
fix: keep team fields hidden for individual signups
chore: configure GitHub Pages deployment
docs: explain architecture layers
```
