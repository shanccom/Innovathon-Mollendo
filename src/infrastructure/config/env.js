// Typed access to Vite env vars, with defaults safe for local development.
const rawEnv = import.meta.env ?? {};

export const env = {
  siteUrl: rawEnv.VITE_SITE_URL ?? 'https://innovathonmollendo.tech',
  appsScriptUrl: rawEnv.VITE_APPS_SCRIPT_URL?.trim() ?? '',
  useFakeRegistration: String(rawEnv.VITE_USE_FAKE_REGISTRATION).toLowerCase() === 'true',
  isDev: Boolean(rawEnv.DEV),
};

// Guards misconfigured deployments before any request is attempted.
export function assertRegistrationEndpoint() {
  if (!env.appsScriptUrl) {
    throw new Error('Las inscripciones no están disponibles en este momento. Inténtalo más tarde.');
  }
}
