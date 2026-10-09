import { MAX_SKILLS_LENGTH } from './registrationCatalog.js';

// Factory with the blank shape the registration form starts from.
export function createEmptyRegistration() {
  return {
    // Paso 1: Datos Personales y Académicos
    fullName: '',
    dni: '',
    phone: '',
    institutionalEmail: '',
    personalEmail: '',
    sede: '',
    otherSede: '',
    career: '',
    otherCareer: '',
    institution: '',
    otherInstitution: '',
    academicLevel: '',

    // Paso 2: Habilidades y Equipo
    skills: '',
    contributionAreas: [],
    challengeInterest: '',
    referencePerson: '',
    portfolioUrl: '',

    // Paso 3: Confirmación y Términos
    availability: false,
    termsAccepted: false,
  };
}

// Normalizes raw form input into the canonical entity sent to the backend.
export function createRegistration(input = {}) {
  const contributionAreas = Array.isArray(input.contributionAreas)
    ? input.contributionAreas.map(cleanText).filter(Boolean)
    : cleanText(input.contributionAreas)
      ? [cleanText(input.contributionAreas)]
      : [];

  return {
    fullName: cleanText(input.fullName),
    dni: cleanDigits(input.dni),
    phone: cleanText(input.phone),
    institutionalEmail: cleanText(input.institutionalEmail).toLowerCase(),
    personalEmail: cleanText(input.personalEmail).toLowerCase(),
    sede: cleanText(input.sede),
    otherSede: cleanText(input.otherSede),
    career: cleanText(input.career),
    otherCareer: cleanText(input.otherCareer),
    institution: cleanText(input.institution),
    otherInstitution: cleanText(input.otherInstitution),
    academicLevel: cleanText(input.academicLevel),
    skills: cleanText(input.skills).slice(0, MAX_SKILLS_LENGTH),
    contributionAreas,
    challengeInterest: cleanText(input.challengeInterest),
    referencePerson: cleanText(input.referencePerson),
    portfolioUrl: cleanText(input.portfolioUrl),
    availability: input.availability === true,
    termsAccepted: input.termsAccepted === true,
  };
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanDigits(value) {
  return cleanText(value).replace(/\D/g, '');
}

