import { createRegistration } from '../../domain/entities/Registration';
import { getFirstInvalidField, validateRegistration } from '../../domain/validation/registrationRules';
import { RegistrationValidationError } from '../../domain/errors/registrationErrors';

// Use case orchestrating the registration flow: normalize -> validate -> persist.
export class SubmitRegistration {
  constructor(registrationRepository) {
    this.registrationRepository = registrationRepository;
  }

  async execute(input) {
    const registration = createRegistration(input);
    const fieldErrors = validateRegistration(registration);

    if (Object.keys(fieldErrors).length > 0) {
      throw new RegistrationValidationError({ ...fieldErrors, focus: getFirstInvalidField(fieldErrors) });
    }

    return this.registrationRepository.save(registration);
  }
}
