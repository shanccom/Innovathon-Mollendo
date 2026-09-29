import { MAX_SKILLS_LENGTH } from '../entities/registrationCatalog.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Common personal webmail providers that should not be used as the institutional email
const FREE_PERSONAL_PROVIDERS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'outlook.es',
  'yahoo.com',
  'yahoo.es',
  'icloud.com',
  'live.com',
  'mail.com',
  'proton.me',
  'protonmail.com',
];

// Recognized educational and technical institution domains in Peru
const RECOGNIZED_INSTITUTIONAL_DOMAINS = [
  'unsa.edu.pe',
  'senati.pe',
  'senati.edu.pe',
  'tecsup.edu.pe',
  'isil.pe',
  'isil.edu.pe',
  'certus.edu.pe',
  'cibertec.edu.pe',
  'sencico.gob.pe',
  'sencico.edu.pe',
  'ucsm.edu.pe',
  'ucsp.edu.pe',
  'utp.edu.pe',
  'pucp.edu.pe',
  'pucp.pe',
  'uni.edu.pe',
  'unmsm.edu.pe',
  'ulima.edu.pe',
  'upc.edu.pe',
  'usil.edu.pe',
  'upch.edu.pe',
  'continental.edu.pe',
  'iestpjorgebasadre.edu.pe',
];

const DNI_PATTERN = /^\d{8}$/;

/**
 * Validates whether an email belongs to an educational or technical institution.
 */
export function isValidInstitutionalEmail(email) {
  if (!email || !EMAIL_PATTERN.test(email)) return false;

  const domain = email.split('@')[1]?.toLowerCase() || '';

  // Reject free personal consumer webmail
  if (FREE_PERSONAL_PROVIDERS.includes(domain)) {
    return false;
  }

  // Matches .edu.pe, .edu, .edu.*, .ac.*, .gob.pe, .org.pe, etc.
  if (/\.(edu\.pe|edu|edu\.[a-z]{2,}|ac\.[a-z]{2,}|gob\.pe|org\.pe)$/i.test(domain)) {
    return true;
  }

  // Matches explicitly recognized institute domains (e.g. senati.pe, isil.pe, etc.)
  if (RECOGNIZED_INSTITUTIONAL_DOMAINS.some((d) => domain === d || domain.endsWith('.' + d))) {
    return true;
  }

  // Matches any domain ending in an educational or institutional technical extension
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)*\.(pe|edu|org)$/i.test(domain)) {
    return true;
  }

  return false;
}

// Field-level rules kept pure so any UI or test can reuse them.
export const registrationRules = {
  fullName: (value) => {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    if (!trimmed) return 'Ingresa tus nombres y apellidos.';
    if (trimmed.length < 3) return 'Ingresa tu nombre completo (mínimo 3 caracteres).';
    return '';
  },
  dni: (value) => {
    const clean = typeof value === 'string' ? value.trim() : String(value ?? '').trim();
    if (!clean) return 'El número de DNI es obligatorio.';
    return DNI_PATTERN.test(clean) ? '' : 'El DNI debe contener exactamente 8 dígitos numéricos.';
  },
  institutionalEmail: (value) => {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    if (!trimmed) return 'El correo institucional es obligatorio.';
    if (!EMAIL_PATTERN.test(trimmed)) {
      return 'Ingresa un formato de correo válido (ej. usuario@unsa.edu.pe).';
    }
    const domain = trimmed.split('@')[1]?.toLowerCase() || '';
    if (FREE_PERSONAL_PROVIDERS.includes(domain)) {
      return 'El correo institucional debe ser de tu universidad o instituto (ej. @unsa.edu.pe o @senati.pe). Para correos de Gmail personales, usa el campo "Correo personal".';
    }
    if (!isValidInstitutionalEmail(trimmed)) {
      return 'El correo institucional debe ser educativo o técnico (ej. @unsa.edu.pe, @senati.pe o dominio .edu.pe).';
    }
    return '';
  },
  personalEmail: (value) => {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    if (!trimmed) return ''; // Opcional
    if (!EMAIL_PATTERN.test(trimmed)) {
      return 'Ingresa un correo electrónico válido.';
    }
    return '';
  },
  sede: (value) => (value && String(value).trim() ? '' : 'Selecciona una sede o localidad.'),
  otherSede: (value, reg) => {
    if (reg?.sede === 'Otra localidad') {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) return 'Especifica tu localidad de residencia.';
    }
    return '';
  },
  career: (value) => (value && String(value).trim() ? '' : 'Selecciona tu carrera o área.'),
  otherCareer: (value, reg) => {
    if (reg?.career === 'Otra carrera o especialidad') {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) return 'Especifica tu carrera o especialidad.';
    }
    return '';
  },
  institution: (value) => (value && String(value).trim() ? '' : 'Selecciona tu institución de procedencia.'),
  otherInstitution: (value, reg) => {
    if (reg?.institution === 'Otra institución de educación superior') {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) return 'Especifica el nombre de tu institución.';
    }
    return '';
  },
  academicLevel: (value) => (value && String(value).trim() ? '' : 'Selecciona tu nivel académico.'),
  skills: (value) => {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    if (!trimmed) return 'Describe tus habilidades principales.';
    if (trimmed.length > MAX_SKILLS_LENGTH) {
      return `Las habilidades no pueden superar los ${MAX_SKILLS_LENGTH} caracteres.`;
    }
    return '';
  },
  contributionAreas: (value) => {
    if (Array.isArray(value) && value.length > 0) return '';
    if (typeof value === 'string' && value.trim()) return '';
    return 'Selecciona al menos una área de aporte.';
  },
  challengeInterest: (value) =>
    value && String(value).trim()
      ? ''
      : 'Selecciona un eje temático o reto de interés (o elige Abierto).',
  referencePerson: () => '',
  portfolioUrl: () => '',
  availability: (value) =>
    value ? '' : 'Debes confirmar tu disponibilidad presencial para las fechas del evento (17 y 18 de diciembre).',
  termsAccepted: (value) =>
    value ? '' : 'Debes aceptar los Términos y Condiciones y el Tratamiento de Datos Personales.',
};

export const STEP_FIELDS = {
  1: [
    'fullName',
    'dni',
    'institutionalEmail',
    'personalEmail',
    'sede',
    'otherSede',
    'career',
    'otherCareer',
    'institution',
    'otherInstitution',
    'academicLevel',
  ],
  2: ['skills', 'contributionAreas', 'challengeInterest', 'referencePerson', 'portfolioUrl'],
  3: ['availability', 'termsAccepted'],
};

// Validates fields for a specific step (1, 2, or 3).
export function validateStep(step, registration) {
  const fields = STEP_FIELDS[step] ?? [];
  const errors = {};

  for (const field of fields) {
    const rule = registrationRules[field];
    if (rule) {
      const message = rule(registration[field] ?? '', registration);
      if (message) errors[field] = message;
    }
  }

  return errors;
}

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
