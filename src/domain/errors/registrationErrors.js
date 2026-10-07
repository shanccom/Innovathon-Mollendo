// Domain error raised when a registration is submitted with invalid data.
export class RegistrationValidationError extends Error {
  constructor(errors) {
    super('Laregistration contiene datos inválidos.');
    this.name = 'RegistrationValidationError';
    this.fieldErrors = errors;
  }
}

// Port-level error raised by any repository adapter when persistence fails.
export class RegistrationRepositoryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RegistrationRepositoryError';
  }
}

// Port-level error raised when the registration already exists (duplicate email or DNI).
export class RegistrationDuplicateError extends RegistrationRepositoryError {
  constructor(message = 'Este correo o DNI ya ha sido registrado previamente.') {
    super(message);
    this.name = 'RegistrationDuplicateError';
    this.isDuplicate = true;
  }
}
