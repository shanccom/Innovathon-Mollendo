import { INTEREST_AREAS, PARTICIPATION_TYPES, TEAM_SIZES } from './registrationCatalog';

// Factory with the blank shape the registration form starts from.
export function createEmptyRegistration() {
  return {
    fullName: '',
    email: '',
    phone: '',
    city: 'Mollendo',
    age: '',
    occupation: '',
    interestArea: INTEREST_AREAS[0],
    experienceLevel: 'Intermedio',
    participationType: PARTICIPATION_TYPES[0],
    teamName: '',
    teamSize: TEAM_SIZES[0],
    motivation: '',
    termsAccepted: false,
  };
}

// Normalizes raw form input into the canonical entity sent to the backend.
export function createRegistration(input = {}) {
  const participationType = PARTICIPATION_TYPES.includes(input.participationType) ? input.participationType : PARTICIPATION_TYPES[0];
  const isTeam = participationType === 'team';

  return {
    fullName: cleanText(input.fullName),
    email: cleanText(input.email).toLowerCase(),
    phone: cleanPhone(input.phone),
    city: cleanText(input.city),
    age: Number.parseInt(input.age, 10) || null,
    occupation: cleanText(input.occupation),
    interestArea: INTEREST_AREAS.includes(input.interestArea) ? input.interestArea : INTEREST_AREAS[0],
    experienceLevel: cleanText(input.experienceLevel),
    participationType,
    teamName: isTeam ? cleanText(input.teamName) : null,
    teamSize: isTeam ? TEAM_SIZES.find((size) => String(size) === String(input.teamSize)) ?? TEAM_SIZES[0] : null,
    motivation: cleanText(input.motivation),
    termsAccepted: Boolean(input.termsAccepted),
  };
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanPhone(value) {
  return cleanText(value).replace(/[\s\-()]/g, '');
}
