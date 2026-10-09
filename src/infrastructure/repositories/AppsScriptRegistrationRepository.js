import { RegistrationRepository } from '../../domain/repositories/RegistrationRepository.js';
import {
  RegistrationRepositoryError,
  RegistrationDuplicateError,
} from '../../domain/errors/registrationErrors.js';
import { assertRegistrationEndpoint, env } from '../config/env.js';

// Adapter that persists registrations into a Google Sheet through an Apps Script web app.
export class AppsScriptRegistrationRepository extends RegistrationRepository {
  constructor(endpoint = env.appsScriptUrl, timeoutMs = 30000) {
    super();
    this.endpoint = endpoint;
    this.timeoutMs = timeoutMs;
    this.healthCheckedAt = 0;
  }

  async save(registration) {
    if (!this.endpoint) assertRegistrationEndpoint();

    // `text/plain` keeps the request "simple", so the browser does not send a CORS preflight.
    let response;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      // Refuse an old deployment that would discard phone or misalign columns.
      // Only successful contract checks are cached; a backend update can recover immediately.
      if (Date.now() - this.healthCheckedAt > 60000) {
        const healthResponse = await fetch(this.endpoint, { signal: controller.signal });
        const health = await parseJson(healthResponse);
        if (!healthResponse.ok || health?.success !== true || health?.capabilities?.phone !== true || health?.capabilities?.atomicDuplicates !== true) {
          throw new RegistrationRepositoryError('Las inscripciones se están actualizando. Vuelve a intentar en unos minutos.');
        }
        this.healthCheckedAt = Date.now();
      }
      response = await fetch(this.endpoint, {
        signal: controller.signal,
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...registration, source: 'web_innovathonmollendo' }),
      });
      // Keep the timeout active until the whole response body is read.
      const payload = await parseJson(response);
      if (!response.ok) {
        throw new RegistrationRepositoryError('El servidor de registro respondió con un error. Inténtalo más tarde.');
      }
      if (!payload?.success) {
        if (payload?.isDuplicate) {
          throw new RegistrationDuplicateError(payload.error ?? 'Este correo o DNI ya está registrado.');
        }
        throw new RegistrationRepositoryError(payload?.error ?? 'No se pudo completar el registro.');
      }
      if (!payload.registrationId || !payload.registeredAt) {
        throw new RegistrationRepositoryError('La respuesta no confirma la inscripción. Inténtalo nuevamente.');
      }
      return { registrationId: payload.registrationId, registeredAt: payload.registeredAt };
    } catch (error) {
      if (controller.signal.aborted) {
        throw new RegistrationRepositoryError('El servidor está tardando en responder. Tu registro podría haberse guardado; reintenta con el mismo DNI y correo para evitar otra inscripción.');
      }
      if (error instanceof RegistrationRepositoryError || error instanceof RegistrationDuplicateError) throw error;
      throw new RegistrationRepositoryError('No pudimos conectar con el servidor. Revisa tu conexión e intenta nuevamente.');
    } finally {
      clearTimeout(timeout);
    }
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
