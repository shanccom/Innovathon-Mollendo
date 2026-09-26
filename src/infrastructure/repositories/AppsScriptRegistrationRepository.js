import { RegistrationRepository } from '../../domain/repositories/RegistrationRepository';
import { RegistrationRepositoryError } from '../../domain/errors/registrationErrors';
import { assertRegistrationEndpoint, env } from '../config/env';

// Adapter that persists registrations into a Google Sheet through an Apps Script web app.
export class AppsScriptRegistrationRepository extends RegistrationRepository {
  constructor(endpoint = env.appsScriptUrl) {
    super();
    this.endpoint = endpoint;
  }

  async save(registration) {
    if (!this.endpoint) assertRegistrationEndpoint();

    // `text/plain` keeps the request "simple", so the browser does not send a CORS preflight.
    let response;

    try {
      response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...registration, source: 'web_innovathonmollendo' }),
      });
    } catch {
      throw new RegistrationRepositoryError('No pudimos conectar con el servidor. Revisa tu conexión e intenta nuevamente.');
    }

    if (!response.ok) {
      throw new RegistrationRepositoryError('El servidor de registro respondió con un error. Inténtalo más tarde.');
    }

    const payload = await parseJson(response);

    if (!payload?.success) {
      throw new RegistrationRepositoryError(payload?.error ?? 'No se pudo completar el registro.');
    }

    return { registrationId: payload.registrationId, registeredAt: payload.registeredAt };
  }
}

// Apps Script may answer with a JSON body or a redirect wrapped in HTML.
async function parseJson(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new RegistrationRepositoryError('El servidor devolvió una respuesta inesperada.');
  }
}
