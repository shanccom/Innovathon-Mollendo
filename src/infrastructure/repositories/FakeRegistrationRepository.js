import { RegistrationRepository } from '../../domain/repositories/RegistrationRepository.js';
import {
  RegistrationRepositoryError,
  RegistrationDuplicateError,
} from '../../domain/errors/registrationErrors.js';
import { STORAGE_KEYS } from '../../shared/constants/storageKeys.js';

// Adapter used for local development: keeps registrations in localStorage.
export class FakeRegistrationRepository extends RegistrationRepository {
  async save(registration) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const stored = readAll();
      const cleanEmail = registration.personalEmail?.trim().toLowerCase();
      const cleanDni = registration.dni?.trim();

      const isDuplicate = stored.some((r) => {
        const storedEmail = r.personalEmail?.trim().toLowerCase() || r.institutionalEmail?.trim().toLowerCase();
        const storedDni = r.dni?.trim();
        return (cleanEmail && storedEmail === cleanEmail) || (cleanDni && storedDni === cleanDni);
      });

      if (isDuplicate) {
        throw new RegistrationDuplicateError(
          'Este correo o DNI ya ha sido registrado previamente. Tu postulación para Innovathon Mollendo 2026 ya está confirmada y en proceso de revisión.'
        );
      }

      stored.push(registration);
      localStorage.setItem(STORAGE_KEYS.registrations, JSON.stringify(stored));
    } catch (error) {
      if (error instanceof RegistrationDuplicateError) throw error;
      throw new RegistrationRepositoryError('No se pudo guardar la inscripción en este navegador.');
    }

    return {
      registrationId: `MOL-${Math.floor(100000 + Math.random() * 900000)}`,
      registeredAt: new Date().toISOString(),
    };
  }
}

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.registrations)) ?? [];
  } catch {
    return [];
  }
}
