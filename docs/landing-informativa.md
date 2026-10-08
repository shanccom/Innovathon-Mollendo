# Landing informativa: Una marea de ideas

La ruta `/` reemplaza el estado «Muy pronto» por el Hero y las siete secciones
informativas solicitadas. El CTA final utiliza la ruta existente `/registro`.
No se añadieron dependencias.

## Archivos y alcance

- `src/presentation/pages/HomePage.jsx`: composición, navegación por anclas,
  contenido semántico y SEO mediante el hook existente.
- `src/presentation/pages/landing.css`: estilos exclusivos de esta superficie,
  adaptación móvil y movimiento.
- `src/presentation/components/landing/TideScene.jsx`: mareas y conexiones SVG,
  respuesta discreta al puntero y control de pausa.
- `src/presentation/components/landing/EventFaq.jsx`: acordeón accesible.
- `src/presentation/hooks/useLandingMotion.js`: revelados, progreso de lectura
  del recorrido y suspensión de las olas fuera del viewport/en segundo plano.
- `src/infrastructure/content/landing.js`: contenido conservador para la landing.

Se reutilizan los iconos de inscripción, `ROUTES`, `useSeo`, los datos compatibles
de `EVENT` y el catálogo de retos. A petición posterior del usuario, el navbar
compartido reúne las secciones y el router habilita las transiciones nativas.
Registro cambia únicamente `overflow-x-hidden` por `overflow-x-clip` para que
funcione el navbar sticky. Se conservan formulario, backend y estilos globales.
Los cambios previos en `package-lock.json` y `.codex/` se conservaron.

## Identidad y dirección

Se mantiene Inter en la superficie activa y la familia de iconos existente.
Los alias locales recogen los colores ya usados por HomePage y registro:
fondo `#070a18`, superficie `#0a0f26`, violeta `#741cf3`, violeta claro
`#8a64ff`, lima `#cbfb45`, texto secundario `#9aa7ca` y el token global
`--color-lime-500`. No se reemplazan variables globales.

El inicio toma como referencia directa la inscripción: círculos lima y violeta
superpuestos en el fondo, sello de marca y paneles azul oscuro con bordes suaves.
El Hero usa una escena SVG sin marco; las ondas sobrepasan su columna y se
extienden hacia el texto y los bordes. El resto alterna composición editorial,
un beneficio destacado, recorrido vertical, bloques de actividades de distinto
tamaño y una lista de datos. En móvil las acciones preceden a la escena.

## Fuentes del contenido y pendientes

La verificación del contenido se hizo contra el código del proyecto, no contra
una agenda externa recientemente publicada:

| Dato | Fuente utilizada |
| --- | --- |
| 17 y 18 de diciembre de 2026, presencial, laptop y accesorios | Términos de `Step3Terms.jsx` y metadatos existentes |
| Postulación gratuita; verificación de cupos y perfil | Términos de `Step3Terms.jsx` |
| Perfil académico y áreas de aporte | Formulario activo y `registrationCatalog.js` |
| Compañero o docente de referencia opcional | `Step2SkillsTeam.jsx` |
| Cuatro líneas de reto | `INNOVATHON_CHALLENGES` |
| Propósito, ideación, prototipado y colaboración | `EVENT.summary`, manifiesto y experiencias existentes |
| Bases y reglamento | URLs existentes en `EVENT.documents` |

Los enlaces de Canva/Google Docs no pudieron leerse mediante la herramienta web.
Se conservan los enlaces del proyecto; no se afirma que su contenido externo
haya sido revisado. El cronograma heredado indica días 24, 25 y 26 y contradice
las fechas vigentes, por lo que no se incorpora.

Pendientes de confirmación por la organización: sede/dirección exacta, horarios,
agenda de talleres y charlas, criterios completos de elegibilidad, formación de
equipos, premios y servicios incluidos. No se publican como confirmados el
Malecón Ratti, los mentores, jurados, incubación ni beneficios materiales.
La timeline muestra el recorrido documentado de postulación y participación,
no una programación inventada de actividades. «Por confirmar» aparece en los
datos correspondientes de la página.

## Movimiento y accesibilidad

- Entrada del Hero: desplazamiento de 12 px y opacidad, 700 ms; escalonado de
  títulos, descripción, acciones y sello. Nodos y conexiones aparecen progresivamente.
- Mareas y cintas: desplazamiento de hasta 18 px, ciclos de 8 a 12 s; órbita
  de 20 s y nodos flotantes de 5 s. Todas estas capas se pausan mediante botón,
  fuera de pantalla y con la página oculta.
- Respuesta al puntero: hasta 14/10 px, solo con puntero fino y hover; sin estado
  React por frame. Se cancelan los frames y listeners al desmontar.
- Entradas de secciones: opacidad y desplazamiento vertical/lateral de 14 a
  36 px, 680 ms, escalonado de 65 ms. IntersectionObserver revela al recorrer;
  la navegación por anclas repite la entrada del destino mediante WAAPI.
  Una nueva entrada cancela la anterior y el foco elimina movimientos del bloque.
  El contenido visible al cargar no depende de recibir un callback.
- Barra de anclas sticky con sección activa; los círculos cambian de posición
  suavemente según la sección. Se conservan scroll, hashes e historial nativos.
- Progreso del recorrido: `scaleY`, 400 ms; indica lectura de etapas, nunca
  aprobación de la postulación.
- Botones: presión 140 ms y respuesta de flecha 180 ms.
- FAQ: expansión de fila CSS de 220 ms; excepción acotada de animación de layout.
  Permite invertir una transición. Activación por teclado sin animación.
- `prefers-reduced-motion`: elimina animaciones/transiciones y conserva contenido,
  estados y jerarquía. No hay scroll hijacking.
- Salto al contenido, foco visible, encabezados, listas y datos semánticos;
  botones con `aria-expanded`/`aria-controls` y paneles cerrados `inert` y ocultos
  para tecnologías de asistencia. Controles nuevos con altura mínima de 44 px.

El navbar compartido incluye Inicio, El evento, Actividades, Información y Preguntas, junto
al botón de inscripción. Reemplaza la barra secundaria de la landing. El menú móvil tiene
botón de 44 px, nombre en español, estado expandido y Escape con retorno de foco.
La altura medida del navbar establece el margen de los destinos por ancla.
La cabecera se simplificó por solicitud del usuario: logo, cinco enlaces y CTA
en una sola fila en escritorio. Las demás secciones permanecen en el contenido.
Inscripción destaca con un botón lima sólido de 56 px, «Inscríbete ahora», con
flecha circular. En móvil, logo, botón compacto «Inscríbete» y menú también
comparten una sola fila. La fecha sigue disponible en el Hero y en Información.
«Información» abre `#informacion`, donde se muestran los datos esenciales,
las bases y el reglamento, tanto desde Inicio como desde Inscripción.

`RouteTransition.jsx` y `route-transition.css` conectan un layout con Outlet al
data router de React Router. Los Link de cambio de ruta usan
`viewTransition`: salida de 180 ms y entrada de 280 ms con opacidad y desplazamientos
de 8/12 px. El navbar conserva su propia instantánea. Navegadores sin la API
reciben una entrada WAAPI de 280 ms; la preferencia reducida omite movimiento.
Los cambios de página restablecen scroll o abren la sección solicitada y colocan
el foco en su encabezado. No se instalaron dependencias.

## Skills aplicadas

Se leyeron las instrucciones instaladas. Se utilizaron criterios de:

- Emil: `emil-design-eng`, `animate`, `animation-vocabulary`,
  `find-animation-opportunities`, `review-animations`, `mobile-native`, `break-ui`.
- Impeccable: audit, critique, layout, typeset, polish, adapt, optimize y harden,
  más contexto del proyecto, craft floor y detector sobre la superficie.
  Se aplicaron como criterios de implementación/revisión; no se ejecutó el
  comando formal de critique ni se generó una evaluación con subagentes.
- Taste: `design-taste-frontend`, `gpt-taste`, `high-end-visual-design`,
  `minimalist-ui` para reducir ruido y `full-output-enforcement`.

La instrucción del usuario de conservar identidad y navegación prevalece sobre
prescripciones incompatibles de fonts, paletas, nuevo header, librerías GSAP o
scroll controlado. No se simulan sorteos, mediciones ni validaciones.

## Verificaciones ejecutadas

### Castillo interactivo en El evento

La sección «¿Qué es Innovathon Mollendo?» incorpora, debajo de su título, una
ilustración dimensional del castillo, generada a partir
de la fotografía de referencia proporcionada por el usuario. Conserva su fachada
ocre, arcadas, torre y base rocosa. Es una interpretación ilustrada de la
referencia; no se presenta como fotografía ni modelo arquitectónico exacto.

`CastleConstruction.jsx` ensambla cuatro máscaras complementarias de la misma
imagen: acantilado, arcadas, fachada superior y torre. WAAPI anima únicamente
opacidad y desplazamiento, durante 900 ms por pieza con intervalos de 650 ms;
el conjunto termina en 2,85 segundos. Se inicia una vez al entrar en pantalla,
después de cargar la imagen. El botón permite repetir la construcción.
La construcción se pausa al salir de pantalla o al ocultar la pestaña.
La preferencia de movimiento reducido
muestra directamente el castillo completo. Se cancelan animaciones, observadores
y listeners al desmontar; sin WAAPI/IntersectionObserver se conserva la imagen.

El WebP transparente pesa aproximadamente 360 KB y se sirve desde `public/assets/`
respetando `BASE_URL`, con carga diferida. Las capas comparten el mismo recurso
en la caché del navegador. El Hero conserva su ilustración original de olas;
el castillo no aparece en el Hero ni tiene un recuadro.

Con cursor fino, pasar sobre el modelo separa sus cuatro capas con transiciones
de transform de 400 ms; al salir se ensamblan de nuevo. La construcción inicial
y la interacción usan contenedores diferentes para evitar competir por la misma
transformación. Los controles «Separar capas»/«Unir capas» ofrecen la misma
exploración en móvil y teclado, con `aria-pressed`. «Reconstruir» repite la entrada.
Se reserva espacio para la torre elevada y la base desplazada. Teclado y movimiento
reducido cambian el estado de las capas inmediatamente, sin transición.

Verificación específica: lint y build pasan; inspección de la composición a
320/768/1024/1440 px sin overflow horizontal, construcción y repetición observadas
en navegador; hover de separación y retorno, estados del botón y teclado comprobados.
Consola sin errores ni advertencias. Un harness del efecto
real verifica duración, carga diferida, repetición, visibilidad, preferencia
reducida y limpieza. No se modificó la preferencia del sistema operativo ni se
realizó una prueba en dispositivo físico.

### Landing y navegación

- `npm run lint`: pasó.
- `npm run build`: pasó (Vite); sin script de typecheck en este proyecto JavaScript.
- `git diff --check`: pasó.
- Impeccable detect sobre HomePage y componentes de landing: `[]`.
- Navegador integrado: inspección visual en 1440, 1024, 768, 390 y 320 px.
  Sin desbordamiento horizontal en los anchos comprobados. Las anclas resuelven
  destinos existentes y el CTA final abre `/registro`.
- FAQ mediante Enter, Espacio y clic: apertura exclusiva, cierre del panel
  anterior, foco visible y atributos accesibles correctos.
- Pausa manual y pausa fuera del viewport: verificadas en navegador.
- Fixture temporal a 320 px, raíz tipográfica al 200 %, pregunta extensa,
  respuesta de 1.429 caracteres y URL sin espacios: sin overflow; respuesta y
  panel de 4.920 px de altura, sin recorte. La fixture se eliminó.
- Prueba del hook real con entorno DOM/observers simulado en Node: contenido
  inicialmente visible, revelados, pausa en segundo plano/fuera de pantalla,
  progreso monotónico, preferencia reducida inicial y al cambiar, y cleanup.
- Refinamiento visual: se repitieron lint/build, anchos 1440/1024/768/390/320,
  navegación con sección activa y barra sticky, FAQ con Enter/Espacio y pausa de
  las nueve capas animadas. El hook real también pasó pruebas de repetición de
  entradas, cancelación al interrumpir, foco y limpieza de timers/listeners.
- Navbar unificado: destinos existentes, estado de sección, regreso desde
  Inscripción a Retos/Información/FAQ, scroll bajo la cabecera y foco en el
  encabezado. Menú móvil a 390/320 px con cierre por selección y Escape.
  Inspección a 768/1024/1440 px y consola limpia en una sesión nueva.
  El layout real pasó un harness Node para navegación sin hash, hash existente
  o inexistente, fallback WAAPI, cleanup y preferencia reducida. Durante la
  revisión se corrigió un error por hash vacío; las rutas finales funcionan.
- Navbar final simplificado: una sola fila comprobada a 900/1024/1440 px,
  sin overflow; cabecera móvil de 73 px a 320/390 px. Menú, destino Preguntas
  y acceso directo a Inscripción comprobados; lint/build pasan.
- Consola de la carga final: sin errores ni advertencias. Hubo un mensaje HMR
  transitorio durante la escritura secuencial de archivos; no se reproduce al cargar.

No se realizó prueba en teléfonos físicos, Safari ni lector de pantalla real.
La preferencia reducida se verificó en lógica y CSS; no se cambió la preferencia
del sistema operativo. No hay test automatizado existente para esta landing.
El E2E heredado es de registro y usa rutas Linux y envíos; no se ejecutó.

Las comprobaciones son de layout en navegador y acciones de clic/teclado; no
constituyen pruebas de gestos táctiles sintetizados ni mediciones de FPS o
Core Web Vitals en dispositivos reales.
