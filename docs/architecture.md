# Arquitectura

El frontend sigue **Clean Architecture** adaptada a una SPA: las dependencias apuntan hacia
adentro y cada capa se puede probar o reemplazar por separado.

```
src/
├── domain/          Reglas del negocio. Cero dependencias externas.
├── application/     Casos de uso. Orquestan el dominio, no conocen el navegador.
├── infrastructure/  Adaptadores externos: HTTP, variables de entorno, contenido.
├── presentation/    UI de React: páginas, componentes, hooks.
├── app/             Composition root y rutas.
└── shared/          Constantes, utilidades y estilos globales.
```

## Regla de dependencia

```
presentation ──▶ application ──▶ domain ◀── infrastructure
```

- `domain` no importa nada de las otras capas (ni React, ni `fetch`).
- `application` solo usa `domain`.
- `infrastructure` implementa los puertos definidos en `domain` y se inyecta en `application`.
- `presentation` muestra datos y dispara casos de uso; no habla con `fetch` directamente.

## Capas y archivos

### `domain` — el negocio

| Archivo | Responsabilidad |
| --- | --- |
| `entities/Registration.js` | Normaliza el input del formulario a la entidad canónica. |
| `entities/registrationCatalog.js` | Valores permitidos (modalidades, áreas, edades, tamaño de equipo). |
| `validation/registrationRules.js` | Reglas de validación puras, campo por campo y completas. |
| `repositories/RegistrationRepository.js` | **Puerto**: contrato que debe cumplir cualquier adaptador. |
| `errors/registrationErrors.js` | Errores de dominio (`RegistrationValidationError`, `RegistrationRepositoryError`). |

### `application` — los casos de uso

`useCases/SubmitRegistration.js` orquesta el flujo: normaliza → valida → persiste. Si la
validación falla lanza `RegistrationValidationError` con un mapa campo → mensaje; nunca devuelve
`null` ni lanza errores "mágicos".

### `infrastructure` — el mundo exterior

| Archivo | Responsabilidad |
| --- | --- |
| `repositories/AppsScriptRegistrationRepository.js` | `POST` al Web App de Apps Script. |
| `repositories/FakeRegistrationRepository.js` | Guardado en `localStorage` para desarrollo. |
| `di/container.js` | Composition root: decide qué adaptador usar según el entorno. |
| `config/env.js` | Lectura tipada de `import.meta.env`. |
| `content/*.js` | Datos editables del evento (fechas, cronograma, mentores, FAQ). |

El `AppsScriptRegistrationRepository` envía `Content-Type: text/plain` porque Apps Script no
responde el preflight de CORS que dispara `application/json`. El JSON viaja dentro del cuerpo.

### `presentation` — la UI

- `layouts/MainLayout.jsx`: shell con navbar, `Outlet` y footer.
- `pages/`: `HomePage` (landing), `RegistrationPage` (`/registro`), `NotFoundPage` (404).
- `components/sections/`: secciones de la landing.
- `components/registration/`: formulario, campos, selector de modalidad y confirmación.
- `hooks/`: `useTheme`, `useSeo`, `useRegistrationForm` (estado y envío del formulario).

## Flujo de una postulación

```
RegistrationForm
  → useRegistrationForm.handleSubmit()
    → container.submitRegistration.execute(values)      [application]
      → createRegistration(values)                     [domain]
      → validateRegistration(registration)              [domain]
      → registrationRepository.save(registration)       [puerto]
        → AppsScriptRegistrationRepository              [adapter]
          → POST Web App → Google Sheets
  ← { registrationId, registeredAt }
  → RegistrationSuccess
```

Cambiar de Google Sheets a Supabase o a una API propia solo requiere escribir un nuevo
adaptador que extienda `RegistrationRepository` y registrarlo en `container.js`.

## Rutas

| Ruta | Página | Notas |
| --- | --- | --- |
| `/` | Landing | Hero, manifiesto, pilares, experiencias, dinámica, cronograma, mentores, FAQ y CTA. |
| `/registro` | Formulario | Validación en vivo, bloque condicional de equipo y confirmación con código. |
| `*` | 404 | Enlace de vuelta al inicio y al registro. |

## GitHub Pages

- `vite.config.js` usa `base` (variable `VITE_BASE_PATH`) para que los assets funcionen en el
  subdirectorio del proyecto.
- `BrowserRouter` recibe `basename={import.meta.env.BASE_URL}`.
- Un plugin local copia `dist/index.html` a `dist/404.html`: GitHub Pages no tiene reglas de
  reescritura, así que una recarga en `/registro` devuelve 404 con el HTML de la SPA, que luego
  React hydratea correctamente.
- `public/CNAME` declara el dominio y `public/.nojekyll` evita que Jekyll procese `dist`.
