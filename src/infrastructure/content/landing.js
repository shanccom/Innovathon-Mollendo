import { EVENT } from './event';
import { INNOVATHON_CHALLENGES } from '../../domain/entities/registrationCatalog';

// Excludes the obsolete schedule and unverified venue, prizes and speakers.
// Content provenance and confirmation gaps: docs/landing-informativa.md.
export const LANDING = {
  date: EVENT.date,
  summary: EVENT.summary,
  socials: EVENT.socials,
  documents: EVENT.documents,
  challenges: INNOVATHON_CHALLENGES.filter((challenge) => challenge.startsWith('Reto '))
    .map((challenge) => challenge.replace(/^Reto \d: /, '')),
  journey: [
    { title: 'Presenta tu postulación', description: 'Completa el formulario con tu perfil, tus áreas de aporte y el reto que te interesa. Puedes indicar un compañero de equipo.', detail: 'Postulación gratuita' },
    { title: 'Revisión del comité', description: 'La solicitud está sujeta a la verificación de cupos y perfil por el comité organizador. Postular no equivale a una plaza confirmada.', detail: 'Según los términos de participación' },
    { title: 'Nos encontramos en Mollendo', description: 'El 17 y 18 de diciembre de 2026, participa presencialmente con tu laptop y accesorios para trabajar en soluciones para la región.', detail: '17 y 18 de diciembre' },
  ],
  activities: [
    { id: 'idear', title: 'Idear', description: 'Explora problemas de la ciudad y conecta el conocimiento local con nuevas posibilidades.', icon: 'compass' },
    { id: 'prototipar', title: 'Prototipar', description: 'Convierte una idea en una solución que puedas mostrar, probar y mejorar.', icon: 'code' },
    { id: 'colaborar', title: 'Colaborar', description: 'Combina programación, diseño, negocios y gestión para construir con otras perspectivas.', icon: 'users' },
  ],
  facts: [
    { label: 'Fecha', value: EVENT.date, icon: 'calendar' },
    { label: 'Lugar', value: EVENT.city, note: 'Sede y dirección exactas por confirmar.', icon: 'pin' },
    { label: 'Modalidad', value: 'Presencial', icon: 'users' },
    { label: 'Postulación', value: 'Gratuita', note: 'Sujeta a verificación de cupos y perfil.', icon: 'check' },
    { label: 'Qué llevar', value: 'Tu laptop y accesorios', icon: 'code' },
    { label: 'Horarios', value: 'Por confirmar', note: 'Consulta los canales y documentos del evento.', icon: 'calendar' },
  ],
  faq: [
    { id: 'fechas', question: '¿Cuándo y dónde será?', answer: `El evento será presencial el ${EVENT.date} en ${EVENT.city}. La sede exacta y los horarios están pendientes de confirmación.` },
    { id: 'costo', question: '¿La postulación tiene un costo?', answer: 'No. La postulación es libre y gratuita. Completar el formulario constituye una solicitud sujeta a verificación de cupos y perfil por el comité organizador.' },
    { id: 'perfil', question: '¿Qué perfiles pueden aportar?', answer: 'El formulario contempla desarrollo de software, diseño y prototipado, negocios y marketing, hardware e IoT, conocimiento de la realidad local, gestión y liderazgo. Revisa las bases para conocer los criterios de participación.' },
    { id: 'equipo', question: '¿Debo indicar un compañero?', answer: 'Es opcional. El formulario recoge tus datos personales y permite indicar un compañero de equipo. Consulta en las bases las condiciones de conformación de equipos.' },
    { id: 'llevar', question: '¿Qué necesito para asistir?', answer: 'Debes confirmar tu disponibilidad presencial para el 17 y 18 de diciembre de 2026 y acudir con tu laptop y accesorios. Revisa los términos y documentos antes de completar tu postulación.' },
    { id: 'bases', question: '¿Dónde puedo consultar las bases y el reglamento?', answer: 'Encontrarás los enlaces a las bases del evento y al reglamento en la sección de información importante y en el formulario de inscripción.' },
  ],
};
