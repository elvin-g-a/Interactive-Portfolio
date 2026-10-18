# MANIFIESTO DE ALCANCE Y ESPECIFICACIONES DE LOS 6 PILARES SGX
## Guía Universal de Desarrollo para Creadores e Inteligencia Artificial (Google AI Studio / Gemini 3.8 Flash)
### Spatialgineers LLC · Ecosistema Omni-Canvas (v2026.5)

---

## 0. Filosofía Fundacional: El Código Base como Zapata, No como Molde

> **MANDATO DE SPATIALGINEERS**: El código incluido en este repositorio es un **Baseline Template (código base)** de alto rendimiento libre de errores. **No es una implementación obligatoria ni un marco rígido**. Los creadores llevarán su portafolio interactivo **a lo que les dé la gana**.
> 
> Si un estudiante desea transformar el runner de *Spark* en un juego de cartas de alquimia cósmica, o el visor de *Showcase* en un museo flotante con gravedad cero, **la Inteligencia Artificial (Gemini 3.8 Flash) debe abrazar esa metamorfosis**, respetando únicamente las leyes de rendimiento y estabilidad (Fricción Cero, 60 FPS y gestión de memoria GPU).

---

## 1. Los 6 Pilares: Dominio, Scope y Posibilidades Infinitas

### I. SGX.SPARK · Los Interactores
* **Definición de Dominio**: Gamificación, mecánicas interactivas de juego, sistemas de física en tiempo real (2D/3D), retos basados en reflejos, lógica de reglas y estados de victoria/derrota.
* **Demostración en el Baseline**: Side-runner geométrico a 60 FPS con física de gravedad, salto con rotación angular de cubo, obstáculos (picos, plataformas, orbes de salto) y efectos de sonido arcade retro.
* **Alcance Creativo (Qué puede construir el creador)**:
  * Videojuegos web completos (endless runner, roguelike de calabozos, laberinto procedural, shoot 'em up espacial).
  * Simuladores físicos (partículas gravitatorias, colisión de cuerpos elásticos, fluidos en 2D).
  * Experiencias gamificadas de portafolio (explorar los proyectos del creador recolectando llaves o desbloqueando puertas interactivas).
* **Directrices para Gemini 3.8 Flash**:
  * Mantén el bucle a 60 FPS utilizando `requestAnimationFrame`.
  * Preserva la contención del input (`e.preventDefault()` en teclas de flecha y espacio; `touch-action: none;` en el canvas).
  * Puedes cambiar libremente las formas geométricas por sprites del usuario, vectores SVG o físicas complejas de cuerdas/gravedad invertida.

---

### II. SGX.STAGE · Los Showrunners
* **Definición de Dominio**: Producción de experiencias en vivo, espacios escénicos transitables en 1ra persona, audio espacial reactivo, eventos híbridos y vinculación entre el espacio 3D y elementos interactivos del DOM.
* **Demostración en el Baseline**: Escenario Holodeck en Three.js con navegación en primera persona (WASD/arrastre de ratón) y tres balizas acústicas que calculan atenuación y paneo estéreo según la distancia euclidiana de la cámara.
* **Alcance Creativo (Qué puede construir el creador)**:
  * Galerías virtuales o museos interactivos donde cada sala es un proyecto del portafolio.
  * Escenarios para festivales virtuales con iluminación robótica sincronizada a eventos en vivo.
  * Salas de exposición inmersivas donde acercarse a un pedestal reproduce la voz del creador o un video documental.
* **Directrices para Gemini 3.8 Flash**:
  * Utiliza Web Audio API con `StereoPannerNode` o `PannerNode` para espacializar el sonido.
  * Aplica niebla exponencial (`scene.fog`) para dar profundidad atmosférica al mundo.
  * Asegura que el observador tenga límites de colisión para no caer al vacío.

---

### III. SGX.SHOWCASE · Los Arquitectos Virtuales
* **Definición de Dominio**: Arquitectura virtual, gemelos digitales (Digital Twins), entornos fotorrealistas en 3D (PBR / RoomEnvironment), configuradores de texturas y materiales, y visualizadores de productos o ingeniería.
* **Demostración en el Baseline**: Visor 3D orbital con `RoomEnvironment` oficial de Three.js (prevención del bug del "Modelo Oscuro"), geometrías arquitectónicas y forja de materiales en tiempo real con soporte de carga local de archivos `.glb/.obj` vía Blob URLs (100% bypass CORS).
* **Alcance Creativo (Qué puede construir el creador)**:
  * Portafolio fotorrealista de proyectos de arquitectura, edificios o diseño de interiores.
  * Configurador interactivo de productos (diseño industrial, moda digital, calzado, automóviles).
  * Maquetas científicas o espaciales con vistas explosionadas de sus componentes internos.
* **Directrices para Gemini 3.8 Flash**:
  * **Regla de Oro CORS**: Para archivos subidos por el usuario, convierte siempre a Blob URL local (`URL.createObjectURL(file)`); nunca uses servidores remotos bloqueados.
  * **Regla de Oro de Memoria GPU**: Al sustituir o borrar modelos o materiales, invoca siempre `.dispose()` en geometrías y texturas (Capítulo II.4 del Grimorio SGX).
  * Mantén siempre una fuente de iluminación ambiental o `RoomEnvironment` para que los materiales PBR metálicos y dieléctricos reflejen luz realista.

---

### IV. SGX.STORY · Los Loremasters
* **Definición de Dominio**: Narrativa humana y cultural inmersiva, cómics interactivos, diseño sonoro cinemático, novelas visuales y scrollytelling donde el scroll del espectador coreografía la entrada de viñetas, arte y textos.
* **Demostración en el Baseline**: Motor de scrollytelling con parallax multicapa, barra de progreso cinematográfica, cronología por capítulos y drone sonoro ambiental.
* **Alcance Creativo (Qué puede construir el creador)**:
  * Manifiesto personal de carrera donde cada sección de scroll revela un hito profesional con ilustraciones animadas.
  * Cómic o novela gráfica digital que avanza viñeta por viñeta respondiendo a la lectura del usuario.
  * Documental interactivo de una marca, proyecto o causa cultural combinando tipografía cinemática y audio.
* **Directrices para Gemini 3.8 Flash**:
  * Anima exclusivamente propiedades del compositor (`transform: translateY(...)`, `opacity`) para garantizar 60 FPS sin provocar *Layout Thrashing*.
  * Vincula eventos de revelación (*fade-up*) al porcentaje de scroll normalizado (0.0 a 1.0).

---

### V. SGX.SYSTEM · Los Code Weavers
* **Definición de Dominio**: Lógica pura, arquitecturas de backend y cloud (Firebase Firestore), dashboards de telemetría en tiempo real, integración con IA generativa, analíticas de portafolio y herramientas de fabricación digital.
* **Demostración en el Baseline**: Dashboard de analíticas de visitantes en vivo, curvas de ingestión temporal en SVG, desglose de interacciones de proyectos y simulador interactivo de telemetría.
* **Alcance Creativo (Qué puede construir el creador)**:
  * Consola cibernética de control que monitorea dispositivos IoT o servidores en vivo.
  * Portafolio interactivo de un desarrollador de software donde los reclutadores prueban APIs, ejecutan algoritmos o ven estadísticas reales de visitas.
  * Herramientas de manufactura y diseño generativo paramétrico en el navegador.
* **Directrices para Gemini 3.8 Flash**:
  * Diseña interfaces estilo Glassmorphism legibles, con cifras tabulares (`tabular-nums`) y alto contraste.
  * Para persistencia de datos, utiliza el cascarón de Firebase (Firestore) incluido o almacenamiento local `localStorage`.

---

### VI. SGX.SYNTHESIZE · Los Magos del Futuro
* **Definición de Dominio**: Proyectos Enterprise de élite que unifican dos o más pilares. Cruce monumental de arte 3D, música reactiva en vivo vía FFT, ubershaders GLSL, telemetría y controles de directo (VJ performance).
* **Demostración en el Baseline**: Escena Three.js con núcleo reactivo a frecuencias de audio graves (25–220Hz), tormenta de partículas, sintetizador rítmico integrado y atajos globales de performance (1-8 escenas, Espacio, P, M, F).
* **Alcance Creativo (Qué puede construir el creador)**:
  * Visualizador para shows de música en vivo, festivales o DJ sets que reacciona al micrófono de la sala.
  * Experiencia web audiovisual inmersiva que mezcla el videojuego de Spark con los visuales de Showcase y los datos de System.
  * Instalación de arte generativo paramétrico que muta con la voz o el movimiento del espectador.
* **Directrices para Gemini 3.8 Flash**:
  * Procesa FFT aislando bandas específicas: Graves (escala de geometría), Medios (rotación y torsión), Agudos (partículas y aberración cromática).
  * Asegura que el contexto de audio se inicie o reanude tras un clic del usuario para respetar las políticas de reproducción de los navegadores.

---

## 2. Cómo Asistir al Creador en Google AI Studio (Protocolo para Gemini 3.8 Flash)

Cuando el creador te dé una instrucción en el chat de AI Studio (ej. *"Gemini, quiero que este pilar sea un simulador de agujeros negros"* o *"Gemini, convierte esto en el portafolio de mi estudio de arquitectura"*):

1. **Identifica el Pilar Activo** en `sgx-config.js` (`ACTIVE_PILLAR`).
2. **Revisa el Scope del Pilar en este Manifiesto**: Entiende qué dominio técnico gobierna ese pilar y apoya la idea del creador sin forzarlo a conservar la demo previa.
3. **Aísla el Módulo Correspondiente**: Trabaja preferentemente sobre el archivo del módulo específico (`modules/spark-module.js`, `modules/showcase-module.js`, etc.) para que tus respuestas sean limpias, atómicas y fáciles de reemplazar.
4. **Respeta las Reglas Técnicas Inquebrantables**:
   * Sin instalaciones de servidores pesados; todo debe correr en el navegador web con *Fricción Cero*.
   * Si usas Three.js, incluye siempre limpieza de geometrías (`.dispose()`).
   * No añadas filtros CSS nativos pesados en canvas; usa cálculos directos en GPU o WebGL.
   * Mantén las interfaces limpias, accesibles y responsivas en cualquier resolución.
