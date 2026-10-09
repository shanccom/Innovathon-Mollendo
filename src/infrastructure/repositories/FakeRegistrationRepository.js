import { RegistrationRepository } from '../../domain/repositories/RegistrationRepository.js';
import {
  RegistrationRepositoryError,
  RegistrationDuplicateError,
} from '../../domain/errors/registrationErrors.js';
import { STORAGE_KEYS } from '../../shared/constants/storageKeys.js';
import { registrationsOverlap } from '../../domain/entities/registrationIdentity.js';

// Adapter used for local development: keeps registrations in localStorage.
export class FakeRegistrationRepository extends RegistrationRepository {
  async save(registration) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const stored = readAll();
      const isDuplicate = stored.some((r) => registrationsOverlap(registration, r));

      if (isDuplicate) {
        throw new RegistrationDuplicateError(
          'Este correo o DNI ya ha sido registrado previamente. Tu postulación ya fue recibida y está en proceso de revisión.'
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
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.registrations)) ?? [];
  if (!Array.isArray(stored)) throw new Error('Almacenamiento inválido');
  return stored;
}
