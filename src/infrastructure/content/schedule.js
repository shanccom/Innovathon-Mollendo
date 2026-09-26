// Event schedule grouped by day; edit times and speakers here.
export const SCHEDULE = [
  {
    id: 'dia-1',
    label: 'Viernes 24',
    theme: 'Bienvenida, inspiración y marea de ideas',
    activities: [
      { time: '15:00 - 16:30', title: 'Acreditación y kit de bienvenida', description: 'Recepción de participantes, entrega de credenciales y swag oficial.', speaker: 'Equipo organizador' },
      { time: '16:30 - 17:30', title: 'Ceremonia de inauguración', description: 'Apertura, presentación del lema y anuncio de los retos regionales.', speaker: 'Directorio y autoridades' },
      { time: '17:30 - 19:00', title: 'Team matching y rompehielos playero', description: 'Dinámica para conectar participantes individuales y consolidar equipos.', speaker: 'Facilitadores de comunidad' },
      { time: '19:00 - 20:30', title: 'Workshop: de la problemática a la hipótesis', description: 'Design Thinking aplicado a los retos de la ciudad y el mar.', speaker: 'Mentor de UX' },
      { time: '20:30 - 00:00', title: 'Inicio del hack y primera arquitectura', description: 'Apertura de salas, configuración de repositorios y primeros bocetos técnicos.', speaker: 'Mentores técnicos' },
    ],
  },
  {
    id: 'dia-2',
    label: 'Sábado 25',
    theme: 'Desarrollo intensivo, código y validación',
    activities: [
      { time: '08:00 - 09:00', title: 'Desayuno energético', description: 'Energía matutina con productos de la costa y café de especialidad.', speaker: 'Equipo de bienestar' },
      { time: '09:30 - 12:30', title: 'Ronda de mentorías 1:1', description: 'Feedback en arquitectura de software, IA, modelos de datos y viabilidad.', speaker: 'Pool de mentores' },
      { time: '13:00 - 14:30', title: 'Almuerzo tradicional de Mollendo', description: 'Espacio de descanso con gastronomía marina de la provincia de Islay.', speaker: 'Comunidad anfitriona' },
      { time: '15:00 - 16:30', title: 'Lightning talks: buenas prácticas de pitching', description: 'Cómo estructurar una demo efectiva en menos de cuatro minutos.', speaker: 'Especialista en pitch' },
      { time: '17:00 - 20:00', title: 'Checkpoint de progreso (50%)', description: 'Validación del prototipo con mentores asignados.', speaker: 'Comité de evaluación' },
      { time: '21:00 - Noche', title: 'Noche de código frente al océano', description: 'Sprint nocturno con snacks, música chill y soporte de guardia.', speaker: 'Comunidad de hackers' },
    ],
  },
  {
    id: 'dia-3',
    label: 'Domingo 26',
    theme: 'Demos en vivo, evaluación y premiación',
    activities: [
      { time: '08:30 - 10:30', title: 'Sprint final y cierre de código', description: 'Últimos retoques de despliegue y preparación de la presentación.', speaker: 'Comité técnico' },
      { time: '11:00 - 13:30', title: 'Demo Day: presentaciones en vivo', description: 'Pitch de tres minutos más dos de preguntas del jurado por equipo.', speaker: 'Finalistas y jurado' },
      { time: '14:00 - 15:00', title: 'Deliberación del jurado', description: 'Evaluación por impacto, viabilidad técnica, originalidad y diseño.', speaker: 'Mesa de jurados' },
      { time: '15:30 - 17:00', title: 'Premiación y clausura', description: 'Entrega de premios, anuncios de incubación y despedida frente al mar.', speaker: 'Organizadores y ganadores' },
    ],
  },
];
