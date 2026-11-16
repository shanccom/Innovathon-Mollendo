import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/routes';
import { assetUrl } from '../../shared/utils/assets';
import { decodeSessionToken } from '../../shared/utils/sessionToken';
import {
  fetchParticipantsRoster,
  findParticipantInRoster,
  hasAlreadyMarkedLocally,
  submitAttendance,
  normalizeIdentifier,
} from '../../application/services/attendanceService';
import { useSeo } from '../hooks/useSeo';
import {
  ArrowRightIcon,
  SingleWave,
  CornerBracket,
  Step2LeftWaves,
  Step3DotsMatrix,
} from '../components/registration/RegistrationIcons';

export default function CheckinPage() {
  const [searchParams] = useSearchParams();
  const [identificador, setIdentificador] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingRoster, setLoadingRoster] = useState(true);
  const [roster, setRoster] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' | 'success' | 'already' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedData, setConfirmedData] = useState(null);

  // Obtener parámetro de sesión (soporta 'k', 'token', 'sesion', 'session')
  const sessionParam =
    searchParams.get('k') ||
    searchParams.get('token') ||
    searchParams.get('sesion') ||
    searchParams.get('session');

  const session = useMemo(() => decodeSessionToken(sessionParam), [sessionParam]);

  useSeo({
    title: session ? `Check-in: ${session.name} | Innovathon Mollendo` : 'Registro de Asistencia | Innovathon Mollendo',
    description: 'Registro de asistencia oficial para participantes de la Innovathon Mollendo 2026.',
  });

  // Cargar el padrón oficial al montar la página
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoadingRoster(true);
        const data = await fetchParticipantsRoster();
        if (isMounted) {
          setRoster(data);
          setLoadingRoster(false);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Error al cargar nómina de participantes:', err);
          setLoadingRoster(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Previsualización en tiempo real del participante si coincide mientras escribe
  const previewParticipant = useMemo(() => {
    if (!identificador.trim() || roster.length === 0) return null;
    return findParticipantInRoster(roster, identificador);
  }, [identificador, roster]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clean = normalizeIdentifier(identificador);
    if (!clean || submitting || !session) return;

    setSubmitting(true);
    setErrorMessage('');

    // 1. Validar contra el padrón de participantes
    let matched = previewParticipant || findParticipantInRoster(roster, clean);

    // Si aún está cargando el padrón o no se encontró en memoria, reintentar una carga fresca
    if (!matched && roster.length === 0) {
      try {
        const freshRoster = await fetchParticipantsRoster(true);
        setRoster(freshRoster);
        matched = findParticipantInRoster(freshRoster, clean);
      } catch (err) {
        console.warn('Fallo reintento de padrón:', err);
      }
    }

    if (!matched) {
      setSubmitting(false);
      setStatus('error');
      setErrorMessage(
        `No se encontró ningún participante con DNI o Código "${identificador}". Revisa que tus datos coincidan o acércate a la mesa de acreditación.`
      );
      return;
    }

    // 2. Verificar si ya marcó asistencia previamente en este dispositivo
    const localCheck = hasAlreadyMarkedLocally(session.id, matched.codigo || matched.dni);
    if (localCheck.alreadyMarked) {
      setSubmitting(false);
      setStatus('already');
      setConfirmedData({
        participant: matched,
        session,
        timestamp: localCheck.record?.timestamp || 'Registrado',
      });
      return;
    }

    // 3. Enviar registro de asistencia a Apps Script
    try {
      const result = await submitAttendance({
        participant: matched,
        session,
      });

      setStatus('success');
      setConfirmedData(result);
    } catch (err) {
      console.error('Error al registrar asistencia:', err);
      setStatus('error');
      setErrorMessage('Hubo un problema al conectar con el servidor. Por favor, reintenta en unos instantes.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setIdentificador('');
    setStatus('idle');
    setErrorMessage('');
    setConfirmedData(null);
  };

  return (
    <div className="relative min-h-screen bg-[#070a18] text-white flex flex-col justify-between selection:bg-[#cbfb45] selection:text-[#070a18] overflow-x-hidden font-sans">
      {/* ----------------- ELEMENTOS GRÁFICOS Y AMBIENTE CÓSMICO ----------------- */}
      {/* Esfera Lima Superior Izquierda */}
      <div
        className="pointer-events-none absolute -left-16 sm:-left-20 top-14 sm:top-20 h-44 w-44 sm:h-52 sm:w-52 rounded-full bg-[#cbfb45] hidden sm:block opacity-90"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-16 sm:-left-20 top-28 sm:top-36 h-44 w-44 sm:h-52 sm:w-52 rounded-full bg-[#cbfb45]/70 blur-[30px] hidden sm:block"
        aria-hidden="true"
      />

      {/* Esfera Púrpura y Lima Superpuesta Inferior Izquierda */}
      <div
        className="pointer-events-none absolute -left-16 sm:-left-20 bottom-12 sm:bottom-16 h-48 w-48 sm:h-56 sm:w-56 rounded-full bg-[#652ce6] hidden sm:block opacity-85"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-16 sm:-left-20 -bottom-4 h-48 w-48 sm:h-56 sm:w-56 rounded-full bg-[#cbfb45]/80 backdrop-blur-[0.5px] hidden sm:block"
        aria-hidden="true"
      />

      {/* Resplandor Púrpura y Cyan Lateral Derecho */}
      <div
        className="pointer-events-none absolute -right-24 top-20 sm:top-28 h-[460px] w-[460px] rounded-full blur-[100px] opacity-40"
        style={{
          background: 'radial-gradient(circle, #652ce6 0%, #06b6d4 40%, rgba(101,44,230,0) 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 top-36 sm:top-48 h-64 w-64 rounded-full opacity-70 hidden lg:block"
        style={{
          background: 'linear-gradient(45deg, #6d48e5 0%, #312e81 100%)',
        }}
        aria-hidden="true"
      />

      {/* Olas decorativas en lateral izquierdo (Desktop) */}
      <div className="pointer-events-none absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 z-0 hidden lg:block opacity-70">
        <Step2LeftWaves allPurple={false} className="w-16 h-12" />
      </div>

      {/* Matriz de puntos decorativos en lateral derecho (Desktop) */}
      <div className="pointer-events-none absolute right-8 sm:right-16 bottom-24 z-0 hidden sm:block opacity-60">
        <Step3DotsMatrix />
      </div>

      {/* Sello técnico de marca (Desktop) */}
      <div className="hidden xl:flex flex-col items-start gap-1 absolute left-12 bottom-12 select-none opacity-80 pointer-events-none z-10">
        <CornerBracket className="h-4 w-7 text-[#741cf3]" />
        <div className="text-[11px] font-black tracking-[3px] text-white leading-tight">
          <p>IDEAS QUE</p>
          <p className="text-[#cbfb45]">TRANSFORMAN</p>
          <p>
            EL FUTURO<span className="text-[#741cf3]">.</span>
          </p>
        </div>
        <div className="pt-1">
          <SingleWave className="h-2.5 w-8 text-[#cbfb45]" />
        </div>
      </div>

      {/* ----------------- BARRA SUPERIOR (HEADER) ----------------- */}
      <header className="relative z-20 w-full border-b border-white/10 bg-[#070a18]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link to={ROUTES.home} className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <img
              src={assetUrl('/assets/brand-logo-transparent.png')}
              alt="Innovathon Mollendo"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to={ROUTES.home}
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-xl bg-[#652ce6] text-white text-xs sm:text-sm font-semibold tracking-wide hover:bg-[#741cf3] active:scale-95 transition-all shadow-[0_0_16px_rgba(101,44,230,0.3)]"
            >
              Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* ----------------- CONTENIDO PRINCIPAL (CARD) ----------------- */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 my-auto">
        <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl border border-[#1b254b]/90 bg-[#0a0f26]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_45px_rgba(101,44,230,0.14)] relative">
          {/* Encabezado */}
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Registro de Asistencia
            </h1>
            <p className="text-sm font-normal text-slate-400">
              Innovathon Mollendo 2026
            </p>
          </div>

          {/* Estado: Sin sesión o código inválido */}
          {!session && (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 text-amber-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-amber-200">
                  Código de sesión no detectado
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para registrar tu asistencia, por favor escanea el código QR que se encuentra proyectado en la pantalla del auditorio.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to={ROUTES.home}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-xs bg-white/10 hover:bg-white/15 text-white transition"
                >
                  Ir a la página principal
                </Link>
              </div>
            </div>
          )}

          {/* Estado: Con sesión activa */}
          {session && (
            <>

              {/* PANTALLA DE ÉXITO */}
              {status === 'success' && confirmedData && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="rounded-2xl border border-[#cbfb45]/40 bg-[#cbfb45]/10 p-6 text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#cbfb45]/20 text-[#cbfb45]">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {confirmedData.participant?.nombre
                          ? `¡${confirmedData.participant.nombre.split(' ')[0]}, tu asistencia fue marcada con éxito!`
                          : '¡Tu asistencia fue marcada con éxito!'}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#cbfb45] font-medium mt-1">
                        Muchas gracias por tu participación · {confirmedData.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full py-3 px-4 rounded-xl font-medium text-xs sm:text-sm bg-white/10 hover:bg-white/15 text-white transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Registrar a otro compañero</span>
                    </button>
                    <Link
                      to={ROUTES.home}
                      className="w-full text-center py-2 text-xs text-slate-400 hover:text-slate-200 transition"
                    >
                      Volver al inicio
                    </Link>
                  </div>
                </div>
              )}

              {/* PANTALLA DE YA REGISTRADO */}
              {status === 'already' && confirmedData && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="rounded-2xl border border-[#06b6d4]/40 bg-[#06b6d4]/10 p-5 sm:p-6 text-center space-y-2.5">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#06b6d4]/20 text-[#06b6d4]">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {confirmedData.participant?.nombre
                          ? `${confirmedData.participant.nombre.split(' ')[0]}, ya registraste tu asistencia`
                          : 'Ya registraste tu asistencia'}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                        Tu asistencia para esta sesión ya fue registrada previamente ({confirmedData.timestamp}).
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-3 px-4 rounded-xl font-medium text-xs sm:text-sm bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
                  >
                    Registrar a otro participante
                  </button>
                </div>
              )}

              {/* FORMULARIO DE INGRESO */}
              {(status === 'idle' || status === 'error') && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Banner de error si hubo fallo */}
                  {status === 'error' && errorMessage && (
                    <div
                      role="alert"
                      className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-xs text-rose-200 font-medium"
                    >
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-1.5 text-left">
                    <label htmlFor="checkin-input" className="block text-xs sm:text-sm font-semibold text-slate-200">
                      DNI o Código de Participante <span className="text-[#cbfb45]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="checkin-input"
                        type="text"
                        autoComplete="off"
                        autoFocus
                        value={identificador}
                        onChange={(e) => setIdentificador(e.target.value)}
                        placeholder="Ej: 72859994 o IM-2026-0003"
                        disabled={submitting}
                        className="w-full rounded-xl border border-white/15 bg-[#070a18]/85 px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 font-sans tracking-normal transition focus:border-[#cbfb45] focus:outline-none focus:ring-2 focus:ring-[#cbfb45]/30"
                      />
                      {loadingRoster && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-[#cbfb45] rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Ingresa los 8 dígitos de tu DNI o el código asignado en tu registro.
                    </p>
                  </div>

                  {/* Botón de Envío */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting || !identificador.trim()}
                      className="w-full flex items-center justify-between py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base bg-[#cbfb45] text-[#070a18] hover:bg-[#d9ff78] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none shadow-[0_6px_25px_rgba(203,251,69,0.22)] hover:shadow-[0_8px_35px_rgba(203,251,69,0.38)] cursor-pointer"
                    >
                      <span>{submitting ? 'Confirmando...' : 'Confirmar Asistencia'}</span>
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#070a18] text-[#cbfb45] shrink-0">
                        {submitting ? (
                          <span className="inline-block w-3.5 h-3.5 border-2 border-[#cbfb45]/30 border-t-[#cbfb45] rounded-full animate-spin" />
                        ) : (
                          <ArrowRightIcon className="w-3.5 h-3.5" />
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </main>

      {/* ----------------- PIE DE PÁGINA (FOOTER) ----------------- */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-1.5">
          <SingleWave className="h-2 w-6 text-[#818cf8]/40" />
        </div>
        <p>© 2026 Innovathon Mollendo. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
