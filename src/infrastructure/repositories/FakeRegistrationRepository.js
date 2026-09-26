import { RegistrationRepository } from '../../domain/repositories/RegistrationRepository';
import { RegistrationRepositoryError } from '../../domain/errors/registrationErrors';
import { STORAGE_KEYS } from '../../shared/constants/storageKeys';

// Adapter used for local development: keeps registrations in localStorage.
export class FakeRegistrationRepository extends RegistrationRepository {
  async save(registration) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const stored = readAll();
      stored.push(registration);
      localStorage.setItem(STORAGE_KEYS.registrations, JSON.stringify(stored));
    } catch {
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
