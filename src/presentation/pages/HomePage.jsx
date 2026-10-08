import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { LANDING } from '../../infrastructure/content/landing';
import { ROUTES } from '../../shared/constants/routes';
import { useSeo } from '../hooks/useSeo';
import { useLandingMotion } from '../hooks/useLandingMotion';
import { RegistrationNavbar } from '../components/registration/RegistrationNavbar';
import { TideScene } from '../components/landing/TideScene';
import { CastleConstruction } from '../components/landing/CastleConstruction';
import { EventFaq } from '../components/landing/EventFaq';
import {
  SingleWave, ArrowRightIcon, CalendarIcon, MapPinIcon, CodeIcon,
  CompassIcon, UsersIcon, CheckIcon, ExternalLinkIcon, BookOpenIcon, ScaleIcon,
  CornerBracket, DotMatrix,
} from '../components/registration/RegistrationIcons';
import './landing.css';

const ICONS = { calendar: CalendarIcon, pin: MapPinIcon, code: CodeIcon, compass: CompassIcon, users: UsersIcon, check: CheckIcon };

function LandingIcon({ name }) {
  const Icon = ICONS[name];
  return <span className="landing-icon" aria-hidden="true"><Icon className="landing-icon__svg" /></span>;
}

export default function HomePage() {
  const rootRef = useRef(null);
  useLandingMotion(rootRef);
  useSeo({
    title: 'Innovathon Mollendo 2026 | Una marea de ideas',
    description: `${LANDING.summary} ${LANDING.date}. Descubre el evento, los retos y cómo postular.`,
  });

  return (
    <div className="registration-scope landing-scope" ref={rootRef}>
      <div className="landing-atmosphere" aria-hidden="true">
        <div className="landing-orb landing-orb--lime" />
        <div className="landing-orb landing-orb--lime-glow" />
        <div className="landing-orb landing-orb--purple" />
        <div className="landing-orb landing-orb--overlap" />
        <div className="landing-orb landing-orb--ambient" />
        <DotMatrix className="landing-atmosphere__dots" rows={4} cols={3} />
        <SingleWave className="landing-atmosphere__wave" />
      </div>
      <a href="#contenido" className="landing-skip">Saltar al contenido</a>
      <RegistrationNavbar />
      <main id="contenido" tabIndex={-1}>
        <section id="inicio" className="landing-hero landing-container" aria-labelledby="hero-title">
          <div className="landing-hero__copy">
            <h1 id="hero-title" className="landing-hero__title">
              <span>INNOVATHON</span>{' '}
              <span><span className="landing-hero__purple">MOL</span><span className="landing-hero__lime">LENDO</span></span>
            </h1>
            <p className="landing-hero__statement">Una marea de ideas<br className="landing-desktop-break" /> que transforma el futuro.</p>
            <p className="landing-hero__description">Tecnología, creatividad y colaboración para construir soluciones sostenibles para Mollendo y la región sur.</p>
            <div className="landing-hero__actions">
              <a href="#evento" className="landing-button landing-button--primary">Descubre el evento <ArrowRightIcon className="landing-button__arrow" /></a>
              <a href="#informacion" className="landing-text-link">Fecha y detalles <ArrowRightIcon className="landing-small-arrow" /></a>
            </div>
            <div className="landing-brand-seal" aria-hidden="true">
              <CornerBracket className="landing-brand-seal__corner" />
              <p>IDEAS QUE<br /><span>TRANSFORMAN</span><br />EL FUTURO<span className="landing-brand-seal__period">.</span></p>
              <SingleWave className="landing-brand-seal__wave" />
            </div>
          </div>
          <TideScene />
          <div className="landing-hero__details">
            <p><CalendarIcon className="landing-small-icon" /><span><strong>17 y 18 de diciembre</strong>2026</span></p>
            <p><MapPinIcon className="landing-small-icon" /><span><strong>Mollendo, Arequipa</strong>Presencial</span></p>
            <a href="#evento" className="landing-scroll-link" aria-label="Continuar a qué es Innovathon Mollendo"><span>Una idea puede cambiarlo todo</span><ArrowRightIcon className="landing-small-arrow" /></a>
          </div>
        </section>

        <section id="evento" className="landing-section landing-container landing-about" aria-labelledby="about-title">
          <div className="landing-about__visual"><div data-reveal><h2 id="about-title">¿Qué es<br />Innovathon Mollendo?</h2><SingleWave className="landing-about__wave" /></div><CastleConstruction /></div>
          <div className="landing-about__body" data-reveal><p className="landing-lead">El futuro de nuestra ciudad también se construye desde aquí.</p><p>{LANDING.summary}</p><p>Conectamos distintas formas de pensar para abordar desafíos de nuestra comunidad. El mar, la historia portuaria y el talento local son el punto de partida.</p><div className="landing-about__signature"><span>Una ciudad.</span><span>Muchas perspectivas.</span><strong>Una marea de ideas.</strong></div></div>
        </section>

        <section id="participar" className="landing-section landing-container" aria-labelledby="benefits-title">
          <h2 id="benefits-title" data-reveal>¿Por qué participar?<br /><span className="landing-muted-heading">Tu perspectiva suma.</span></h2>
          <div className="landing-benefits">
            <article className="landing-benefit landing-benefit--featured" data-reveal><LandingIcon name="compass" /><h3>Trabaja en algo<br />que importa.</h3><p>Acerca tus ideas a los desafíos de Mollendo: su economía, su costa, su entorno y su futuro digital.</p><a href="#retos" className="landing-text-link">Explora los retos <ArrowRightIcon className="landing-small-arrow" /></a><svg className="landing-benefit__wave" viewBox="0 0 420 180" fill="none" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6].map((line) => <path key={line} d={`M-20 ${65 + line * 14}C95 ${-50 + line * 14} 200 ${225 + line * 14} 450 ${30 + line * 14}`} />)}</svg></article>
            <div className="landing-benefits__side">
              <article className="landing-benefit landing-benefit--open" data-reveal><LandingIcon name="code" /><div><h3>Aprende construyendo.</h3><p>Practica ideación y prototipado al desarrollar una solución tecnológica. Pon a prueba lo que sabes.</p></div></article>
              <article className="landing-benefit landing-benefit--open" data-reveal><LandingIcon name="users" /><div><h3>Conecta otras miradas.</h3><p>Colabora con perfiles de tecnología, diseño, negocios y gestión. Comparte conocimientos y amplía tu red.</p></div></article>
              <p className="landing-benefits__note" data-reveal>El conocimiento de la realidad local también es una forma de innovar.</p>
            </div>
          </div>
        </section>

        <section id="recorrido" className="landing-section landing-container landing-journey" aria-labelledby="journey-title">
          <div className="landing-journey__intro" data-reveal><h2 id="journey-title">¿Cómo funciona?<br /><span className="landing-muted-heading">De tu interés<br />al encuentro.</span></h2><p>Este es el recorrido de participación. La programación de los dos días se publicará cuando esté confirmada.</p><a href={LANDING.documents.bases} target="_blank" rel="noopener noreferrer" className="landing-text-link">Consultar las bases <ExternalLinkIcon className="landing-small-arrow" /><span className="sr-only"> (abre una nueva pestaña)</span></a></div>
          <div className="landing-journey__flow">
          <div className="landing-journey__track" aria-hidden="true"><span data-journey-progress /></div>
          <ol className="landing-journey__steps">
            {LANDING.journey.map(({ title, description, detail }, index) => <li key={title} data-journey-step data-reveal><span className="landing-journey__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{description}</p><span className="landing-journey__detail">{detail}</span></div></li>)}
          </ol>
          </div>
        </section>

        <section id="actividades" className="landing-section landing-container" aria-labelledby="activities-title">
          <div className="landing-section-intro" data-reveal><h2 id="activities-title">Ideas en movimiento.</h2><p>La experiencia combina ideación, prototipado y colaboración. La agenda de talleres, charlas y presentaciones está pendiente de confirmación.</p></div>
          <div className="landing-activities">{LANDING.activities.map(({ id, title, description, icon }) => <article className={`landing-activity landing-activity--${id}`} key={id} data-reveal><LandingIcon name={icon} /><h3>{title}<span aria-hidden="true">.</span></h3><p>{description}</p></article>)}</div>
          <div id="retos" className="landing-challenges"><div data-reveal><h3>Retos con raíces en Mollendo.</h3><p>Estas son las líneas de reto disponibles en la postulación. Puedes elegir dónde aportar.</p></div><ul data-reveal>{LANDING.challenges.map((challenge) => <li key={challenge}><ArrowRightIcon className="landing-small-arrow" /><span>{challenge}</span></li>)}</ul></div>
        </section>

        <section id="informacion" className="landing-section landing-container" aria-labelledby="info-title">
          <div className="landing-section-intro" data-reveal><h2 id="info-title">Todo lo que necesitas saber.</h2><p>La información esencial, antes de dar el siguiente paso.</p></div>
          <dl className="landing-facts" data-reveal>{LANDING.facts.map(({ label, value, note, icon }) => <div key={label}><dt><LandingIcon name={icon} />{label}</dt><dd>{value}{note && <span>{note}</span>}</dd></div>)}</dl>
          <div className="landing-participants" data-reveal><h3>Distintos perfiles. Un mismo propósito.</h3><p>El registro recoge perfiles de estudiantes y egresados de educación superior, de tecnología, administración, marketing y otras especialidades. Consulta los criterios de elegibilidad en las bases.</p></div>
          <div className="landing-documents" data-reveal>
            <a href={LANDING.documents.bases} target="_blank" rel="noopener noreferrer"><BookOpenIcon className="landing-documents__icon" /><span><strong>Bases del evento</strong><span>Criterios de participación y retos</span></span><ExternalLinkIcon className="landing-small-arrow" /><span className="sr-only"> (abre una nueva pestaña)</span></a>
            <a href={LANDING.documents.reglamento} target="_blank" rel="noopener noreferrer"><ScaleIcon className="landing-documents__icon" /><span><strong>Reglamento oficial</strong><span>Normas y condiciones del evento</span></span><ExternalLinkIcon className="landing-small-arrow" /><span className="sr-only"> (abre una nueva pestaña)</span></a>
          </div>
        </section>

        <section id="preguntas" className="landing-section landing-container landing-faq-section" aria-labelledby="faq-title"><div data-reveal><h2 id="faq-title">Preguntas<br />frecuentes.</h2><p>Resuelve tus dudas antes de postular.</p><SingleWave className="landing-about__wave" /></div><EventFaq items={LANDING.faq} /></section>

        <section id="postular" className="landing-closing" aria-labelledby="closing-title"><div className="landing-container" data-reveal><SingleWave className="landing-closing__wave" /><h2 id="closing-title">Las grandes ideas<br />comienzan con<br /><span>una pequeña ola.</span></h2><p>Tu perspectiva puede ser el comienzo de algo que transforme Mollendo.</p><Link to={ROUTES.registration} viewTransition className="landing-button landing-button--primary">Quiero postular <ArrowRightIcon className="landing-button__arrow" /></Link><a href="#informacion" className="landing-text-link">Revisar la información del evento</a></div><svg className="landing-closing__tides" viewBox="0 0 1440 240" fill="none" preserveAspectRatio="none" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6].map((line) => <path key={line} d={`M-40 ${80 + line * 20}C280 ${-150 + line * 20} 820 ${360 + line * 20} 1500 ${20 + line * 20}`} />)}</svg></section>
      </main>
      <footer className="landing-footer landing-container"><p><SingleWave className="landing-small-icon" /> INNOVATHON MOLLENDO 2026</p><a href="#contenido" className="landing-text-link">Volver al inicio <ArrowRightIcon className="landing-small-arrow" /></a></footer>
    </div>
  );
}
