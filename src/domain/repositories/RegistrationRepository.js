import { RegistrationRepositoryError } from '../errors/registrationErrors.js';

// Repository port: the domain owns the contract, infrastructure provides the adapter.
// Contract: `save(registration)` resolves with a confirmation payload
// `{ registrationId, registeredAt }` and rejects with RegistrationRepositoryError.
export class RegistrationRepository {
  async save(_registration) {
    throw new RegistrationRepositoryError('RegistrationRepository.save() must be implemented.');
  }
}
