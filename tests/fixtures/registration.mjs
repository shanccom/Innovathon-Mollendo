export const validRegistration = {
  fullName: 'Participante Prueba', dni: '90000001', phone: '900000001',
  personalEmail: 'qa@example.test', institutionalEmail: '',
  institution: 'Universidad Nacional de San Agustín (UNSA) - Filial Mollendo',
  academicLevel: '5.º año', sede: 'Mollendo / Provincia de Islay',
  career: 'Tecnología: Ingeniería de Sistemas, Software, Informática y afines',
  skills: 'Prueba automatizada de inscripción',
  contributionAreas: ['Desarrollo de Software / Programación'],
  challengeInterest: 'Reto 1: Desarrollo Económico, Turismo y Comercio Local',
  referencePerson: '', portfolioUrl: '', availability: true, termsAccepted: true,
  source: 'qa_automatizado',
};

// Header order verified in the user's sheet, without copying participants.
export const liveHeaders = [
  'Código', 'Fecha de registro', 'Nombres y apellidos', 'DNI',
  'Correo institucional', 'Correo personal', 'Institución de procedencia',
  'Nivel académico', 'Sede', 'Carrera / Especialidad', 'Habilidades principales',
  'Áreas de aporte', 'Eje temático / Reto', 'Compañero / Recomendación',
  'LinkedIn / Portafolio', 'Disponibilidad presencial', 'Aceptó términos', 'Origen',
];
