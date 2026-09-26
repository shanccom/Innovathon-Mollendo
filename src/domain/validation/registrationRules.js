import { MAX_AGE, MIN_AGE, TEAM_SIZES } from '../entities/registrationCatalog';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d{8,15}$/;

// Field-level rules kept pure so any UI or test can reuse them.
export const registrationRules = {
  fullName: (value) => (value.trim() ? '' : 'Ingresa tus nombres y apellidos.'),
  email: (value) => {
    if (!value.trim()) return 'El correo electrónico es obligatorio.';
    return EMAIL_PATTERN.test(value.trim()) ? '' : 'Ingresa un correo válido (ej. usuario@dominio.com).';
  },
  phone: (value) => {
    const clean = value.replace(/[\s\-()]/g, '');
    if (!clean) return 'El celular es obligatorio.';
    return PHONE_PATTERN.test(clean) ? '' : 'Ingresa un celular válido (mínimo 8 dígitos).';
  },
  city: (value) => (value.trim() ? '' : 'Indica tu ciudad de residencia.'),
  age: (value) => {
    const age = Number.parseInt(value, 10);
    if (!value) return 'Ingresa tu edad.';
    if (Number.isNaN(age) || age < MIN_AGE || age > MAX_AGE) {
      return `La edad debe estar entre ${MIN_AGE} y ${MAX_AGE} años.`;
    }
    return '';
  },
  occupation: (value) => (value.trim() ? '' : 'Indica tu ocupación, universidad o colegio.'),
  teamName: (value, registration) =>
    registration.participationType === 'team' && !value.trim() ? 'Ingresa el nombre de tu equipo.' : '',
  teamSize: (value, registration) =>
    registration.participationType === 'team' && !TEAM_SIZES.includes(Number(value)) ? 'Selecciona el número de integrantes.' : '',
  termsAccepted: (value) => (value ? '' : 'Debes aceptar el código de conducta y el tratamiento de datos.'),
};

// Runs every rule and returns a field -> message map (empty when valid).
export function validateRegistration(registration) {
  const errors = {};

  for (const [field, rule] of Object.entries(registrationRules)) {
    const message = rule(registration[field] ?? '', registration);
    if (message) errors[field] = message;
  }

  return errors;
}

// Runs a single rule so inputs can validate on blur without a full form pass.
export function validateRegistrationField(field, value, registration = {}) {
  const rule = registrationRules[field];
  return rule ? rule(value ?? '', { ...registration, [field]: value ?? '' }) : '';
}

// Returns the first field with an error so the UI can move focus to it.
export function getFirstInvalidField(errors) {
  return Object.keys(errors)[0] ?? null;
}
