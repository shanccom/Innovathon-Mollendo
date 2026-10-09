# Innovathon Mollendo

> **Las ideas también tienen marea.**

Web oficial de la Innovathon Mollendo 2026: landing del evento y formulario de inscripción
conectado a una hoja de cálculo en un Drive compartido.

- **Dominio:** [innovathonmollendo.tech](https://innovathonmollendo.tech)
- **Rutas:** `/` (evento) · `/registro` (inscripción)
- **Stack:** React 19 · Vite 8 · Tailwind CSS 4 · React Router 7 · JavaScript

## Vista del Hero

![Hero de Innovathon Mollendo con navegación e ilustración animada](docs/images/hero.png)

## Castillo interactivo

En «El evento», el castillo se construye por etapas y sus capas se separan al
pasar el cursor. También se puede explorar con los botones o el teclado.

![Castillo de Mollendo con sus capas separadas en la sección del evento](docs/images/castillo-interactivo.jpg)

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
| `npm test` | Regresión del formulario y Apps Script, incluidos workers concurrentes. |
| `npm run test:e2e` | E2E de escritorio y móvil con Playwright y backend aislado. |
| `npm run test:load` | k6: 104 envíos al backend local aislado (requiere k6 instalado). |

## Formulario de inscripción

`/registro` valida en el navegador y envía un `POST` a un Web App de **Google Apps Script**,
que agrega una fila por postulación a la hoja del Drive compartido.

```bash
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
```

- Configura el script paso a paso: [`docs/apps-script-setup.md`](docs/apps-script-setup.md).
- En desarrollo, sin la variable, la app usa un repositorio *fake* en `localStorage`.
  En producción requiere el endpoint real y comprueba que soporte celular obligatorio
  y detección atómica de duplicados antes de enviar.
- Celular peruano obligatorio: 9 dígitos, comenzando por 9. El compañero de equipo es opcional.
- El backend bloquea registros repetidos por DNI o cualquiera de los dos correos;
  reconoce variantes de Gmail con puntos, `+alias` y `googlemail.com`.
- Resultados, alcance y pruebas reproducibles: [`docs/pruebas-finales.md`](docs/pruebas-finales.md).

El código que ve el participante tiene el formato `IM-<año>-<correlativo>`.

## Contenido del evento

Fechas, cronograma, mentores, pilares y FAQ viven en `src/infrastructure/content/`. Editar
esos archivos es suficiente para actualizar la landing; no hay que tocar componentes.

## GitHub Pages

Despliegue automático a `main` con `.github/workflows/deploy.yml` (lint + regresión + E2E + build + publish).
Apps Script se actualiza por separado: el push publica el frontend, no el backend de Google.
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
