/**
 * SGX PORTAFOLIO ESPACIAL — APLICACIÓN MODULAR EN JAVASCRIPT NATIVO
 * Archivo único editable a mano: configuración superior, audio Web Audio API,
 * escena 3D PBR (Three.js a 60 FPS) e interfaz responsiva.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* ============================================================================
   1. CONFIGURACIÓN EDITABLE (MODELOS 3D WIX, MEDIOS LOCALES, TEXTOS Y GALERÍA)
   Edita aquí enlaces, modelos, textos o piezas de galería sin tocar el motor.
   ============================================================================ */

const ASSETS = {
  overlayHorizontal: './assets/overlays/viewport-horizontal.webp',
  overlayVertical: './assets/overlays/viewport-vertical.webp',
  introGif: './assets/intro/bienvenidos.gif',
  gamesCover: './assets/juegos/mazescape_icon.png',
  bioGif: './assets/biografia/heading.gif',
  bioPhoto: './assets/biografia/foto.jpg'
};

/**
 * Catálogo de los 5 planetas interactivos (Modelos 2.0 cargados desde Wix CDN).
 * Nombres de sección: Introduccion, Juegos, Galeria, Biografia, Contactos.
 */
const PLANETS = [
  {
    id: 'planeta-introduccion',
    section: 'Introduccion',
    name: 'Introducción',
    subtitle: 'Bienvenida & Visión del Portafolio',
    color: '#D8C39D',
    radius: 0.72,
    screenX: 0.4948,
    screenY: 0.4741,
    verticalScreenX: 0.3912,
    verticalScreenY: 0.4953,
    hasRings: true,
    chapterNumber: 1,
    modelUrl: 'https://static.wixstatic.com/3d/06361e_968472237ff14ce49099d980a5fb9467.glb'
  },
  {
    id: 'planeta-juegos',
    section: 'Juegos',
    name: 'Juegos',
    subtitle: 'Experiencias Interactivas & Videojuegos',
    color: '#4A90E2',
    radius: 0.66,
    screenX: 0.7258,
    screenY: 0.3199,
    verticalScreenX: 0.6894,
    verticalScreenY: 0.3302,
    hasRings: false,
    chapterNumber: 2,
    modelUrl: 'https://static.wixstatic.com/3d/06361e_04dd2853553440ca9c08d03ef60aa335.glb'
  },
  {
    id: 'planeta-galeria',
    section: 'Galeria',
    name: 'Galería',
    subtitle: 'Archivo Visual & Exhibición Espacial',
    color: '#A0A0A0',
    radius: 0.63,
    screenX: 0.2529,
    screenY: 0.3157,
    verticalScreenX: 0.3458,
    verticalScreenY: 0.2104,
    hasRings: false,
    chapterNumber: 3,
    modelUrl: 'https://static.wixstatic.com/3d/06361e_edab7517a8a94eb0a249f502dd4b21f2.glb'
  },
  {
    id: 'planeta-biografia',
    section: 'Biografia',
    name: 'Biografía',
    subtitle: 'Arte Digital, Diseño 3D & UI · Spatialgineers',
    color: '#41729F',
    radius: 0.65,
    screenX: 0.2529,
    screenY: 0.6810,
    verticalScreenX: 0.3505,
    verticalScreenY: 0.7823,
    hasRings: false,
    chapterNumber: 4,
    modelUrl: 'https://static.wixstatic.com/3d/06361e_b60eb5038a9044b99242a9ab67d77c11.glb'
  },
  {
    id: 'planeta-contactos',
    section: 'Contactos',
    name: 'Contactos',
    subtitle: 'Mensaje Directo & Redes Sociales',
    color: '#E06D53',
    radius: 0.68,
    screenX: 0.7294,
    screenY: 0.6810,
    verticalScreenX: 0.6653,
    verticalScreenY: 0.6688,
    hasRings: false,
    chapterNumber: 5,
    modelUrl: 'https://static.wixstatic.com/3d/06361e_eccac59d52044676884a981e435e7c7d.glb'
  }
];

const PORTFOLIO_CONTENT = {
  Introduccion: {
    heading: '¡Bienvenidos!',
    body: 'Soy Elvin G. Andrades. Resuelvo la falta de impacto visual en plataformas digitales a través de SGX.Showcase y SGX.System, creando conceptos y visuales optimizados en 2D y 3D que convierten proyectos visualmente estáticos en experiencias inmersivas inolvidables.',
    gifAlt: 'Animación de bienvenida de Elvin G. Andrades'
  },
  Juegos: {
    heading: 'Mazescape',
    coverAlt: 'Portada de Mazescape',
    body: 'Te encuentras atrapado en un laberinto con monstruos. Tienes que pelear para escapar, ¿pero podras hacerlo a tiempo?',
    ctaLabel: 'Juega Mazescape Ahora',
    ctaUrl: 'https://ale-studio.itch.io/mazescape'
  },
  Biografia: {
    gifAlt: 'Animación de Elvin G. Andrades',
    body: 'Elvin G. Andrades es un diseñador con talento excepcional en las artes digitales y una pasión tremenda para completar. Él especializa en el diseño de personajes, texturas y UV para modelos 3D, y diseños gráficos tales como logos e interfaces de usuario (UI). Recientemente, el artista fue ingresado en la compañía de Spatialgineers en el rango de Initiate después de haber completado los SGX Trials, su programa interno con el propósito de entrenar reclutas nuevos.',
    photoAlt: 'Fotografía de Elvin G. Andrades'
  },
  Contactos: {
    paragraphs: [
      '¿Quieres apoyo para tu proyecto? ¿Tienes preguntas? ¿Quieres seguirme en redes sociales?',
      'Envía un mensaje o chequea como voy en proyectos actuales. ¡Espero verte pronto!'
    ],
    email: 'elvingandrades@gmail.com',
    instagramHandle: '@elvinga.sgx',
    instagramUrl: 'https://www.instagram.com/elvinga.sgx'
  },
  Galeria: {
    heading: 'Exhibición de Arte',
    description: 'Archivo visual de arte conceptual y diseño de interfaz. Selecciona cualquier obra para verla ampliada en pantalla.'
  }
};

const GALLERY_FILTER_ALL = 'todo';

const GALLERY_CATEGORIES = [
  {
    id: 'arte-mazescape',
    label: 'Arte de Mazescape',
    description: 'Diseño conceptual de niveles, criaturas, personajes y armas.'
  },
  {
    id: 'otros-proyectos',
    label: 'Otros Proyectos',
    description: 'Hojas de diseño de personajes, paletas cromáticas y expresión.'
  }
];

const GALLERY_ARTWORKS = [
  {
    id: 'concept-art-laberinto',
    title: 'Concepto Laberinto',
    src: './assets/gallery/concept_art_concepto_laberinto.png',
    category: 'arte-mazescape'
  },
  {
    id: 'concept-art-cerberus-turnaround',
    title: 'Cerberus Turnaround',
    src: './assets/gallery/concept_art_cerberus_turnaround.png',
    category: 'arte-mazescape'
  },
  {
    id: 'concept-art-maze-protag-turnaround',
    title: 'Maze Protag Turnaround',
    src: './assets/gallery/concept_art_maze_protag_turnaround.png',
    category: 'arte-mazescape'
  },
  {
    id: 'concept-art-mace-turnaround',
    title: 'Mace Turnaround',
    src: './assets/gallery/concept_art_mace_turnaround.png',
    category: 'arte-mazescape'
  },
  {
    id: 'concept-art-sword-turnaround',
    title: 'Sword Turnaround',
    src: './assets/gallery/concept_art_sword_turnaround.png',
    category: 'arte-mazescape'
  },
  {
    id: 'concept-art-machete-turnaround',
    title: 'Machete Turnaround',
    src: './assets/gallery/concept_art_machete_turnaround.png',
    category: 'arte-mazescape'
  },
  {
    id: 'hud-elements-elvin-character-design',
    title: 'Elvin Andrades Character Design',
    src: './assets/gallery/hud_elements_Elvin_Andrades_Character_Design.jpg',
    category: 'otros-proyectos'
  },
  {
    id: 'hud-elements-portfolio-ashley',
    title: 'Portfolio - Ashley',
    src: './assets/gallery/hud_elements_Portfolio_-_Ashley.png',
    category: 'otros-proyectos'
  },
  {
    id: 'hud-elements-sir-cronus-concept',
    title: 'Sir Cronus Concept',
    src: './assets/gallery/hud_elements_Sir_Cronus_Concept.png',
    category: 'otros-proyectos'
  }
];

/* ============================================================================
   2. CONSULTAS RESPONSIVAS DE VIEWPORT (4 FORMATOS + MÓVIL COMPACTO)
   ============================================================================ */

const MEDIA_QUERIES = {
  vertical: '(orientation: portrait)',
  mobileOnly: '(max-width: 639px) and (orientation: portrait)',
  tabletLandscape:
    '(orientation: landscape) and (min-width: 640px) and (max-width: 1368px) and (min-height: 501px), (orientation: landscape) and (min-height: 501px) and (hover: none) and (pointer: coarse)',
  desktopOrTabletLandscape:
    '(orientation: landscape) and (min-width: 640px) and (min-height: 501px), (orientation: landscape) and (min-width: 640px) and (hover: hover) and (pointer: fine)',
  mobileOrTabletDevice:
    '(orientation: portrait), (orientation: landscape) and (max-width: 1368px), (orientation: landscape) and (max-height: 500px), (hover: none) and (pointer: coarse)'
};

/** Desplazamiento izquierdo del overlay vertical en móvil al abrir panel (120 / 1920 = 6.25vh) */
const MOBILE_SELECTED_OVERLAY_SHIFT_PX = 120;

const mqVertical = window.matchMedia(MEDIA_QUERIES.vertical);
const mqMobileOnly = window.matchMedia(MEDIA_QUERIES.mobileOnly);
const mqTabletLandscape = window.matchMedia(MEDIA_QUERIES.tabletLandscape);
const mqDesktopOrTabletLandscape = window.matchMedia(MEDIA_QUERIES.desktopOrTabletLandscape);
const mqMobileOrTabletDevice = window.matchMedia(MEDIA_QUERIES.mobileOrTabletDevice);

function getViewportFlags() {
  const isVertical = mqVertical.matches;
  return {
    isVertical,
    isMobileOnly: isVertical && mqMobileOnly.matches,
    isTabletLandscape: !isVertical && mqTabletLandscape.matches,
    isDesktopOrTabletLandscape: !isVertical && mqDesktopOrTabletLandscape.matches,
    isMobileOrTabletDevice: mqMobileOrTabletDevice.matches
  };
}

/* ============================================================================
   3. MOTOR DE SONIDO SINTETIZADO (WEB AUDIO API — SIN ARCHIVOS MP3/WAV)
   ============================================================================ */

class AudioFX {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.volume = 0.65;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return true;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  playClick() {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.08 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Respaldo silencioso si el navegador bloquea Web Audio
    }
  }

  playPlanetResonance(chapterIndex = 1) {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    try {
      const pentatonicScale = [261.63, 311.13, 349.23, 392.0, 466.16, 523.25];
      const baseFreq = pentatonicScale[Math.abs(chapterIndex) % pentatonicScale.length];
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * 2, now);

      gain.gain.setValueAtTime(0.12 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch {
      // Respaldo silencioso
    }
  }
}

const audioFX = new AudioFX();

/* ============================================================================
   4. ESTADO CENTRAL Y REFERENCIAS DEL DOM
   ============================================================================ */

const state = {
  selectedPlanet: null,
  hoveredPlanetId: null,
  activeGalleryFilter: GALLERY_FILTER_ALL,
  activeArtwork: null,
  viewport: getViewportFlags(),
  overlayModeKey: ''
};

const dom = {
  canvasContainer: document.getElementById('space-canvas'),
  crtOverlay: document.getElementById('crt-overlay'),
  drawer: document.getElementById('planet-drawer'),
  drawerTitle: document.getElementById('drawer-title'),
  drawerSubtitle: document.getElementById('drawer-subtitle'),
  drawerCloseBtn: document.getElementById('drawer-close-btn'),
  planetTabs: document.getElementById('planet-tabs'),
  drawerBody: document.getElementById('drawer-body'),
  lightbox: document.getElementById('artwork-lightbox'),
  lightboxMeta: document.getElementById('lightbox-meta'),
  lightboxTitle: document.getElementById('lightbox-title'),
  lightboxCategory: document.getElementById('lightbox-category'),
  lightboxCloseBtn: document.getElementById('lightbox-close-btn'),
  lightboxImage: document.getElementById('lightbox-image')
};

const planetTabButtons = new Map();

/* ============================================================================
   5. RENDERIZADOR DE OVERLAY ANIMADO WEBP Y PAREDES CONTINUAS
   Evita reconstruir el <img> animado al abrir/cerrar planetas para no reiniciar frames.
   ============================================================================ */

function renderOverlay() {
  const { isVertical, isMobileOnly, isTabletLandscape } = state.viewport;
  const shouldCenterTabletLandscape = !isVertical && isTabletLandscape;
  const shouldShiftMobile = isVertical && isMobileOnly && state.selectedPlanet !== null;

  const modeKey = shouldCenterTabletLandscape
    ? 'tablet-centered'
    : isVertical
      ? 'vertical'
      : 'horizontal';

  if (state.overlayModeKey !== modeKey) {
    state.overlayModeKey = modeKey;
    dom.crtOverlay.innerHTML = '';

    if (shouldCenterTabletLandscape) {
      const track = document.createElement('div');
      track.className = 'crt-track-centered';

      const leftWall = document.createElement('div');
      leftWall.className = 'crt-wall-left-tablet';

      const img = document.createElement('img');
      img.src = ASSETS.overlayHorizontal;
      img.alt = '';
      img.draggable = false;
      img.decoding = 'async';
      img.className = 'crt-overlay-img';

      const rightWall = document.createElement('div');
      rightWall.className = 'crt-wall-right-tablet crt-wall-right--horizontal';

      track.append(leftWall, img, rightWall);
      dom.crtOverlay.appendChild(track);
    } else {
      const track = document.createElement('div');
      track.className = 'crt-track';
      track.id = 'crt-track-active';

      const img = document.createElement('img');
      img.src = isVertical ? ASSETS.overlayVertical : ASSETS.overlayHorizontal;
      img.alt = '';
      img.draggable = false;
      img.decoding = 'async';
      img.className = 'crt-overlay-img';

      const rightWall = document.createElement('div');
      rightWall.className = isVertical
        ? 'crt-wall-right crt-wall-right--vertical'
        : 'crt-wall-right crt-wall-right--horizontal';

      track.append(img, rightWall);
      dom.crtOverlay.appendChild(track);
    }
  }

  const activeTrack = document.getElementById('crt-track-active');
  if (activeTrack) {
    activeTrack.classList.toggle('is-shifted', shouldShiftMobile);
  }
}

/* ============================================================================
   6. INTERFAZ DEL PANEL PLANETARIO, PESTAÑAS Y VISOR LIGHTBOX
   ============================================================================ */

function createExpandIconSvg() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');

  const paths = [
    'M15 3h6v6',
    'M9 21H3v-6',
    'M21 3l-7 7',
    'M3 21l7-7'
  ];
  paths.forEach((d) => {
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', d);
    svg.appendChild(p);
  });
  return svg;
}

function buildPlanetTabs() {
  dom.planetTabs.innerHTML = '';
  planetTabButtons.clear();

  PLANETS.forEach((planet) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'planet-tab-btn';
    btn.textContent = planet.name;
    btn.dataset.planetId = planet.id;
    btn.addEventListener('click', () => selectPlanet(planet));
    planetTabButtons.set(planet.id, btn);
    dom.planetTabs.appendChild(btn);
  });

  // Traduce rueda vertical a desplazamiento horizontal en pestañas desbordadas
  dom.planetTabs.addEventListener(
    'wheel',
    (event) => {
      if (dom.planetTabs.scrollWidth <= dom.planetTabs.clientWidth) return;
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        dom.planetTabs.scrollLeft += event.deltaY;
      }
    },
    { passive: false }
  );
}

function syncPlanetTabsLayout() {
  const isScrollable = state.viewport.isMobileOrTabletDevice;
  dom.planetTabs.classList.toggle('planet-tabs--scrollable', isScrollable);
  dom.planetTabs.classList.toggle('planet-tabs--desktop', !isScrollable);

  planetTabButtons.forEach((btn, id) => {
    const isActive = state.selectedPlanet?.id === id;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
}

function revealActivePlanetTab() {
  if (!state.selectedPlanet) return;
  const container = dom.planetTabs;
  const activeTab = planetTabButtons.get(state.selectedPlanet.id);
  if (!container || !activeTab) return;
  if (container.scrollWidth <= container.clientWidth) return;

  const tabLeft = activeTab.offsetLeft;
  const tabRight = tabLeft + activeTab.offsetWidth;
  const viewLeft = container.scrollLeft;
  const viewRight = viewLeft + container.clientWidth;
  const edgePadding = 12;

  if (tabLeft - edgePadding < viewLeft) {
    container.scrollTo({ left: Math.max(0, tabLeft - edgePadding), behavior: 'smooth' });
  } else if (tabRight + edgePadding > viewRight) {
    container.scrollTo({
      left: Math.min(
        container.scrollWidth - container.clientWidth,
        tabRight - container.clientWidth + edgePadding
      ),
      behavior: 'smooth'
    });
  }
}

function attachImageFallback(img, fallbackText, hideOnFail = false) {
  img.addEventListener('error', () => {
    if (hideOnFail) {
      const parent = img.parentElement;
      img.remove();
      if (parent && parent.children.length === 0) {
        parent.remove();
      }
      return;
    }
    const fallback = document.createElement('div');
    fallback.className = 'media-fallback';
    fallback.textContent = fallbackText;
    img.replaceWith(fallback);
  });
}

function renderIntroduccionContent(container) {
  const copy = PORTFOLIO_CONTENT.Introduccion;
  const isLandscapeFit = state.viewport.isDesktopOrTabletLandscape;

  if (isLandscapeFit) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chapter-content intro-landscape';

    const header = document.createElement('div');
    header.className = 'intro-landscape-header';

    const h3 = document.createElement('h3');
    h3.className = 'chapter-heading';
    h3.textContent = copy.heading;

    const p = document.createElement('p');
    p.className = 'chapter-copy';
    p.textContent = copy.body;

    header.append(h3, p);

    const stage = document.createElement('div');
    stage.className = 'intro-gif-stage';

    const inner = document.createElement('div');
    inner.className = 'intro-gif-stage-inner';

    const img = document.createElement('img');
    img.src = ASSETS.introGif;
    img.alt = copy.gifAlt;
    img.width = 240;
    img.height = 476;
    img.referrerPolicy = 'no-referrer';
    img.className = 'mii-gif--landscape';
    attachImageFallback(img, copy.gifAlt, true);

    inner.appendChild(img);
    stage.appendChild(inner);
    wrapper.append(header, stage);
    container.appendChild(wrapper);
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'chapter-content chapter-stack';

  const textBlock = document.createElement('div');
  textBlock.className = 'chapter-stack';
  textBlock.style.gap = '0.625rem';

  const h3 = document.createElement('h3');
  h3.className = 'chapter-heading';
  h3.textContent = copy.heading;

  const p = document.createElement('p');
  p.className = 'chapter-copy';
  p.textContent = copy.body;

  textBlock.append(h3, p);

  const gifWrap = document.createElement('div');
  gifWrap.className = 'media-center media-center--padded';

  const img = document.createElement('img');
  img.src = ASSETS.introGif;
  img.alt = copy.gifAlt;
  img.width = 240;
  img.height = 476;
  img.referrerPolicy = 'no-referrer';
  img.className = 'mii-gif--portrait';
  attachImageFallback(img, copy.gifAlt, true);

  gifWrap.appendChild(img);
  wrapper.append(textBlock, gifWrap);
  container.appendChild(wrapper);
}

function renderJuegosContent(container) {
  const copy = PORTFOLIO_CONTENT.Juegos;
  const wrapper = document.createElement('div');
  wrapper.className = 'chapter-content chapter-stack';

  const h3 = document.createElement('h3');
  h3.className = 'chapter-heading';
  h3.textContent = copy.heading;

  const coverWrap = document.createElement('div');
  coverWrap.className = 'media-center';

  const img = document.createElement('img');
  img.src = ASSETS.gamesCover;
  img.alt = copy.coverAlt;
  img.width = 252;
  img.height = 200;
  img.referrerPolicy = 'no-referrer';
  img.className = 'games-cover-img';
  attachImageFallback(img, copy.coverAlt, true);
  coverWrap.appendChild(img);

  const p = document.createElement('p');
  p.className = 'chapter-copy';
  p.textContent = copy.body;

  const cta = document.createElement('a');
  cta.href = copy.ctaUrl;
  cta.target = '_blank';
  cta.rel = 'noopener noreferrer';
  cta.className = 'primary-cta primary-cta--games';
  cta.textContent = copy.ctaLabel;
  cta.addEventListener('click', () => audioFX.playClick());

  wrapper.append(h3, coverWrap, p, cta);
  container.appendChild(wrapper);
}

function renderBiografiaContent(container) {
  const copy = PORTFOLIO_CONTENT.Biografia;
  const wrapper = document.createElement('div');
  wrapper.className = 'chapter-content chapter-stack';

  const gifWrap = document.createElement('div');
  gifWrap.className = 'media-center';

  const gifImg = document.createElement('img');
  gifImg.src = ASSETS.bioGif;
  gifImg.alt = copy.gifAlt;
  gifImg.width = 240;
  gifImg.height = 480;
  gifImg.referrerPolicy = 'no-referrer';
  gifImg.className = state.viewport.isDesktopOrTabletLandscape
    ? 'mii-gif--landscape'
    : 'mii-gif--portrait';
  attachImageFallback(gifImg, copy.gifAlt, true);
  gifWrap.appendChild(gifImg);

  const p = document.createElement('p');
  p.className = 'chapter-copy';
  p.textContent = copy.body;

  const photoWrap = document.createElement('div');
  photoWrap.className = 'media-center media-center--padded';

  const photoImg = document.createElement('img');
  photoImg.src = ASSETS.bioPhoto;
  photoImg.alt = copy.photoAlt;
  photoImg.width = 379;
  photoImg.height = 379;
  photoImg.referrerPolicy = 'no-referrer';
  photoImg.className = 'bio-photo-img';
  attachImageFallback(photoImg, copy.photoAlt, true);
  photoWrap.appendChild(photoImg);

  wrapper.append(gifWrap, p, photoWrap);
  container.appendChild(wrapper);
}

function renderContactosContent(container) {
  const copy = PORTFOLIO_CONTENT.Contactos;
  const wrapper = document.createElement('div');
  wrapper.className = 'chapter-content chapter-stack';

  const introBlock = document.createElement('div');
  introBlock.className = 'contact-intro';
  copy.paragraphs.forEach((line) => {
    const p = document.createElement('p');
    p.className = 'chapter-copy';
    p.textContent = line;
    introBlock.appendChild(p);
  });

  const list = document.createElement('div');
  list.className = 'contact-list';

  // Gmail en texto plano seleccionable
  const gmailItem = document.createElement('div');
  gmailItem.className = 'contact-item';

  const gmailLabel = document.createElement('div');
  gmailLabel.className = 'contact-label';
  gmailLabel.textContent = 'Gmail:';

  const gmailText = document.createElement('p');
  gmailText.className = 'contact-email';
  gmailText.textContent = copy.email;

  gmailItem.append(gmailLabel, gmailText);

  // Instagram con enlace directo
  const igItem = document.createElement('div');
  igItem.className = 'contact-item contact-item--action';

  const igLabel = document.createElement('div');
  igLabel.className = 'contact-label';
  igLabel.textContent = 'Instagram:';

  const igLink = document.createElement('a');
  igLink.href = copy.instagramUrl;
  igLink.target = '_blank';
  igLink.rel = 'noopener noreferrer';
  igLink.className = 'primary-cta';
  igLink.textContent = copy.instagramHandle;
  igLink.addEventListener('click', () => audioFX.playClick());

  igItem.append(igLabel, igLink);
  list.append(gmailItem, igItem);

  wrapper.append(introBlock, list);
  container.appendChild(wrapper);
}

function renderGaleriaContent(container) {
  const copy = PORTFOLIO_CONTENT.Galeria;
  const wrapper = document.createElement('div');
  wrapper.className = 'chapter-content gallery-wrapper';

  // Tarjeta introductoria
  const introCard = document.createElement('div');
  introCard.className = 'gallery-intro-card';

  const introTitle = document.createElement('h3');
  introTitle.className = 'gallery-intro-title';
  introTitle.textContent = copy.heading;

  const introDesc = document.createElement('p');
  introDesc.className = 'gallery-intro-copy';
  introDesc.textContent = copy.description;

  introCard.append(introTitle, introDesc);

  // Filtros de categoría
  const filterBar = document.createElement('div');
  filterBar.className = 'gallery-filters';

  const filterTabs = [
    { id: GALLERY_FILTER_ALL, label: 'Todo' },
    ...GALLERY_CATEGORIES.map((cat) => ({ id: cat.id, label: cat.label }))
  ];

  filterTabs.forEach((tab) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-filter-btn';
    if (state.activeGalleryFilter === tab.id) {
      btn.classList.add('is-active');
    }
    btn.textContent = tab.label;
    btn.addEventListener('click', () => {
      if (state.activeGalleryFilter === tab.id) return;
      state.activeGalleryFilter = tab.id;
      audioFX.playClick();
      renderDrawerBody();
    });
    filterBar.appendChild(btn);
  });

  // Secciones categorizadas
  const sectionsContainer = document.createElement('div');
  sectionsContainer.className = 'gallery-sections';

  const visibleCategories = GALLERY_CATEGORIES.filter(
    (cat) => state.activeGalleryFilter === GALLERY_FILTER_ALL || cat.id === state.activeGalleryFilter
  );

  visibleCategories.forEach((category) => {
    const items = GALLERY_ARTWORKS.filter((art) => art.category === category.id);

    const section = document.createElement('section');
    section.className = 'gallery-section';

    const header = document.createElement('div');
    header.className = 'gallery-section-header';

    const topRow = document.createElement('div');
    topRow.className = 'gallery-section-top';

    const title = document.createElement('h4');
    title.className = 'gallery-section-title';
    title.textContent = category.label;

    const count = document.createElement('span');
    count.className = 'gallery-section-count';
    count.textContent = `${items.length} ${items.length === 1 ? 'archivo' : 'archivos'}`;

    topRow.append(title, count);

    const desc = document.createElement('p');
    desc.className = 'gallery-section-desc';
    desc.textContent = category.description;

    header.append(topRow, desc);
    section.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'gallery-grid';

    items.forEach((artwork) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'artwork-card';
      card.addEventListener('click', () => openLightbox(artwork));

      const thumbBox = document.createElement('div');
      thumbBox.className = 'artwork-thumb-box';

      const img = document.createElement('img');
      img.src = artwork.src;
      img.alt = artwork.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.className = 'artwork-thumb-img';
      attachImageFallback(img, artwork.title, false);

      const expandBadge = document.createElement('span');
      expandBadge.className = 'artwork-expand-icon';
      expandBadge.appendChild(createExpandIconSvg());

      thumbBox.append(img, expandBadge);

      const footer = document.createElement('div');
      footer.className = 'artwork-card-footer';

      const artTitle = document.createElement('div');
      artTitle.className = 'artwork-card-title';
      artTitle.textContent = artwork.title;

      footer.appendChild(artTitle);
      card.append(thumbBox, footer);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    sectionsContainer.appendChild(section);
  });

  wrapper.append(introCard, filterBar, sectionsContainer);
  container.appendChild(wrapper);
}

function renderDrawerBody() {
  const planet = state.selectedPlanet;
  if (!planet) return;

  const isContactos = planet.section === 'Contactos';
  const isIntroLandscape =
    planet.section === 'Introduccion' && state.viewport.isDesktopOrTabletLandscape;

  dom.drawerBody.className = 'drawer-body';
  if (isContactos) dom.drawerBody.classList.add('drawer-body--contactos');
  if (isIntroLandscape) dom.drawerBody.classList.add('drawer-body--intro-landscape');

  dom.drawerBody.innerHTML = '';

  switch (planet.section) {
    case 'Introduccion':
      renderIntroduccionContent(dom.drawerBody);
      break;
    case 'Juegos':
      renderJuegosContent(dom.drawerBody);
      break;
    case 'Galeria':
      renderGaleriaContent(dom.drawerBody);
      break;
    case 'Biografia':
      renderBiografiaContent(dom.drawerBody);
      break;
    case 'Contactos':
      renderContactosContent(dom.drawerBody);
      break;
  }
}

function syncDrawerShell() {
  const planet = state.selectedPlanet;

  if (!planet) {
    dom.drawer.hidden = true;
    renderOverlay();
    return;
  }

  dom.drawer.hidden = false;
  dom.drawer.classList.toggle('planet-drawer--contactos', planet.section === 'Contactos');
  dom.drawer.classList.toggle(
    'planet-drawer--mobile-portrait',
    state.viewport.isVertical && state.viewport.isMobileOnly
  );

  dom.drawerTitle.textContent = planet.name;
  dom.drawerSubtitle.textContent = planet.subtitle;

  syncPlanetTabsLayout();
  renderOverlay();
}

function selectPlanet(planet) {
  const changed = state.selectedPlanet?.id !== planet.id;
  state.selectedPlanet = planet;
  audioFX.playPlanetResonance(planet.chapterNumber);
  syncDrawerShell();
  if (changed) {
    renderDrawerBody();
    dom.drawerBody.scrollTop = 0;
  }
  requestAnimationFrame(revealActivePlanetTab);
}

function clearPlanetSelection(playSound = false) {
  if (!state.selectedPlanet) return;
  state.selectedPlanet = null;
  if (playSound) audioFX.playClick();
  syncDrawerShell();
}

function openLightbox(artwork) {
  state.activeArtwork = artwork;
  const catObj = GALLERY_CATEGORIES.find((c) => c.id === artwork.category);
  dom.lightboxTitle.textContent = artwork.title;
  dom.lightboxCategory.textContent = catObj ? catObj.label : 'Galería';
  dom.lightboxImage.src = artwork.src;
  dom.lightboxImage.alt = artwork.title;
  dom.lightbox.hidden = false;
  audioFX.playClick();
}

function closeLightbox() {
  if (!state.activeArtwork) return;
  state.activeArtwork = null;
  dom.lightbox.hidden = true;
  dom.lightboxImage.removeAttribute('src');
  audioFX.playClick();
}

/* ============================================================================
   7. MOTOR 3D THREE.JS (PBR, ROOM ENVIRONMENT, WIX GLB, 60 FPS ZERO-GC)
   ============================================================================ */

function initSpaceScene() {
  const container = dom.canvasContainer;
  if (!container) return;

  THREE.Cache.enabled = true;

  const getSafeDimensions = () => {
    const rawW = container.clientWidth || window.innerWidth || document.documentElement.clientWidth || 1280;
    const rawH = container.clientHeight || window.innerHeight || document.documentElement.clientHeight || 720;
    return {
      width: Math.max(Math.round(rawW), 1),
      height: Math.max(Math.round(rawH), 1)
    };
  };

  const { width, height } = getSafeDimensions();

  // Escena y atmósfera espacial acogedora
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0A1128);
  scene.fog = new THREE.FogExp2(0x0A1128, 0.012);

  // Cámara de referencia fija (Home) + cámara animada en vivo
  const HOME_CAM_POS = new THREE.Vector3(0, 2.55, 5.2);
  const HOME_LOOK_TARGET = new THREE.Vector3(0, 0.65, -2.5);

  const homeCamera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
  homeCamera.position.copy(HOME_CAM_POS);
  homeCamera.lookAt(HOME_LOOK_TARGET);
  homeCamera.updateProjectionMatrix();
  homeCamera.updateMatrixWorld(true);

  const _homeRight = new THREE.Vector3();
  const _homeUp = new THREE.Vector3();
  const _homeBack = new THREE.Vector3();
  homeCamera.matrixWorld.extractBasis(_homeRight, _homeUp, _homeBack);

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
  camera.position.copy(HOME_CAM_POS);
  camera.lookAt(HOME_LOOK_TARGET);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);

  // Vectores pre-asignados fuera del bucle de animación (Zero-GC)
  const currentCamPos = HOME_CAM_POS.clone();
  const currentLookTarget = HOME_LOOK_TARGET.clone();
  const _desiredCamPos = HOME_CAM_POS.clone();
  const _desiredLookTarget = HOME_LOOK_TARGET.clone();
  const _axisWorldPos = new THREE.Vector3();
  const _camSpacePos = new THREE.Vector3();

  // Detección de WebGL por software (SwiftShader / llvmpipe / WARP)
  const isSoftwareGl = (() => {
    try {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2') || probe.getContext('webgl');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      return false;
    }
  })();

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: false,
      powerPreference: 'high-performance',
      depth: true
    });
  } catch {
    renderer = new THREE.WebGLRenderer({ alpha: false });
  }

  renderer.setClearColor(0x0A1128, 1);
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, true);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.domElement.addEventListener(
    'webglcontextlost',
    (event) => {
      event.preventDefault();
    },
    false
  );

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Entorno PBR de estudio (RoomEnvironment a intensidad 0.5)
  try {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.5;
    pmremGenerator.dispose();
  } catch (envErr) {
    console.warn('Respaldo de entorno PBR activo:', envErr);
  }

  // Iluminación equilibrada (calibrada a la mitad para preservar texturas planetarias)
  scene.add(new THREE.AmbientLight(0x8fa8ff, 0.19));

  const keyLight = new THREE.DirectionalLight(0xdef8ff, 0.925);
  keyLight.position.set(4, 7, 5);
  keyLight.castShadow = !isSoftwareGl;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.left = -8;
  keyLight.shadow.camera.right = 8;
  keyLight.shadow.camera.top = 8;
  keyLight.shadow.camera.bottom = -8;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  scene.add(new THREE.HemisphereLight(0x51E6C4, 0x5E53CC, 0.36));

  const rimLight = new THREE.DirectionalLight(0x5E53CC, 0.675);
  rimLight.position.set(-5, 3, -4);
  scene.add(rimLight);

  // Campo estelar espacial procedural (1400 partículas)
  const starCount = 1400;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  const colCyan = new THREE.Color(0x51E6C4);
  const colPurple = new THREE.Color(0x5E53CC);
  const colWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    const radius = 18 + Math.random() * 55;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i3 + 2] = -radius * Math.abs(Math.cos(phi)) - 6;

    const pick = Math.random();
    const color = pick < 0.45 ? colCyan : pick < 0.85 ? colPurple : colWhite;
    starColors[i3] = color.r;
    starColors[i3 + 1] = color.g;
    starColors[i3 + 2] = color.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    fog: false
  });
  scene.add(new THREE.Points(starGeo, starMat));

  // Sistema de 5 planetas 3D cargados directamente desde Wix CDN con reintento
  const planetItems = [];
  const planetById = new Map();
  const hitTargets = [];
  const gltfLoader = new GLTFLoader();
  gltfLoader.setCrossOrigin('anonymous');

  const loadPlanetModel = (url, retriesLeft = 2) =>
    new Promise((resolve, reject) => {
      gltfLoader.load(url, resolve, undefined, (err) => {
        if (retriesLeft > 0) {
          window.setTimeout(() => {
            loadPlanetModel(url, retriesLeft - 1).then(resolve, reject);
          }, 900);
        } else {
          reject(err);
        }
      });
    });

  PLANETS.forEach((planet) => {
    const group = new THREE.Group();

    // Esfera de colisión invisible para raycasting rápido y preciso
    const hitRadius = planet.radius * (planet.hasRings ? 1.45 : 1.15);
    const hitMesh = new THREE.Mesh(
      new THREE.SphereGeometry(hitRadius, 16, 16),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      })
    );
    hitMesh.userData = { planet };
    group.add(hitMesh);
    hitTargets.push(hitMesh);

    // Eje rotacional por defecto y esfera PBR mientras descarga el modelo GLB
    const defaultRotAxis = new THREE.Group();
    defaultRotAxis.name = 'rotation_axis';
    group.add(defaultRotAxis);

    const placeholderGeo = new THREE.SphereGeometry(planet.radius, 28, 28);
    const placeholderMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(planet.color),
      roughness: 0.45,
      metalness: 0.1
    });
    const placeholderMesh = new THREE.Mesh(placeholderGeo, placeholderMat);
    defaultRotAxis.add(placeholderMesh);

    scene.add(group);

    const item = {
      group,
      hitMesh,
      rotAxis: defaultRotAxis,
      planet,
      baseScale: 1.0
    };
    planetItems.push(item);
    planetById.set(planet.id, item);

    loadPlanetModel(planet.modelUrl)
      .then((gltf) => {
        defaultRotAxis.remove(placeholderMesh);
        placeholderGeo.dispose();
        placeholderMat.dispose();

        const modelScene = gltf.scene;
        modelScene.updateMatrixWorld(true);

        const authoredAxis = modelScene.getObjectByName('rotation_axis');
        if (authoredAxis) {
          authoredAxis.scale.set(1, 1, 1);
          modelScene.updateMatrixWorld(true);

          const siblingNodes = [...modelScene.children].filter((child) => child !== authoredAxis);
          siblingNodes.forEach((child) => authoredAxis.attach(child));

          group.remove(defaultRotAxis);
          group.add(modelScene);
          item.rotAxis = authoredAxis;
        } else {
          defaultRotAxis.add(modelScene);
          item.rotAxis = defaultRotAxis;
        }

        modelScene.scale.setScalar(planet.radius);
        modelScene.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = !isSoftwareGl;
            node.receiveShadow = !isSoftwareGl;
          }
        });
      })
      .catch((error) => {
        console.warn(`No se pudo cargar el modelo 3D de ${planet.name} desde Wix:`, error);
      });
  });

  // Posicionamiento estático de planetas sincronizado con cada formato de overlay
  const PLANE_DEPTH = 8.0;

  const updateStaticPlanetLayout = () => {
    const { width: vw, height: vh } = getSafeDimensions();
    const safeAspect = Number.isFinite(camera.aspect) && camera.aspect > 0 ? camera.aspect : vw / vh;
    homeCamera.aspect = safeAspect;
    homeCamera.updateProjectionMatrix();
    homeCamera.updateMatrixWorld(true);

    const halfHeight = PLANE_DEPTH * Math.tan(THREE.MathUtils.degToRad(homeCamera.fov * 0.5));
    const halfWidth = halfHeight * safeAspect;
    const { isVertical, isTabletLandscape } = state.viewport;

    if (isVertical) {
      const minFullVerticalCrtAspect = 960 / 1920;
      const refFrameWidth =
        vw >= vh * minFullVerticalCrtAspect ? vh * (1080 / 1920) : vw * (1080 / 960);
      const responsiveScale = THREE.MathUtils.clamp(refFrameWidth / vh, 0.44, 0.5625);

      planetItems.forEach((item) => {
        const screenFracX = (item.planet.verticalScreenX * refFrameWidth) / vw;
        const screenFracY = item.planet.verticalScreenY;
        const ndcX = screenFracX * 2 - 1;
        const ndcY = 1 - screenFracY * 2;

        _camSpacePos.set(ndcX * halfWidth, ndcY * halfHeight, -PLANE_DEPTH);
        _camSpacePos.applyMatrix4(homeCamera.matrixWorld);

        item.group.position.copy(_camSpacePos);
        item.baseScale = responsiveScale;
        const activeFactor = state.selectedPlanet?.id === item.planet.id ? 1.14 : 1.0;
        item.group.scale.setScalar(responsiveScale * activeFactor);
      });
    } else if (isTabletLandscape) {
      const frameWidth = vh * (16 / 9);
      const frameOffsetX = (vw - frameWidth) * 0.5;
      const responsiveScale = THREE.MathUtils.clamp(vw / vh / (16 / 9), 0.84, 1.0);

      planetItems.forEach((item) => {
        const screenFracX = (frameOffsetX + item.planet.screenX * frameWidth) / vw;
        const screenFracY = item.planet.screenY;
        const ndcX = screenFracX * 2 - 1;
        const ndcY = 1 - screenFracY * 2;

        _camSpacePos.set(ndcX * halfWidth, ndcY * halfHeight, -PLANE_DEPTH);
        _camSpacePos.applyMatrix4(homeCamera.matrixWorld);

        item.group.position.copy(_camSpacePos);
        item.baseScale = responsiveScale;
        const activeFactor = state.selectedPlanet?.id === item.planet.id ? 1.14 : 1.0;
        item.group.scale.setScalar(responsiveScale * activeFactor);
      });
    } else {
      const minFullCrtAspect = 1560 / 1080;
      const refFrameWidth = vw >= vh * minFullCrtAspect ? vh * (16 / 9) : vw * (1920 / 1560);
      const responsiveScale = THREE.MathUtils.clamp(refFrameWidth / vh / (16 / 9), 0.68, 1.0);

      planetItems.forEach((item) => {
        const screenFracX = (item.planet.screenX * refFrameWidth) / vw;
        const screenFracY = item.planet.screenY;
        const ndcX = screenFracX * 2 - 1;
        const ndcY = 1 - screenFracY * 2;

        _camSpacePos.set(ndcX * halfWidth, ndcY * halfHeight, -PLANE_DEPTH);
        _camSpacePos.applyMatrix4(homeCamera.matrixWorld);

        item.group.position.copy(_camSpacePos);
        item.baseScale = responsiveScale;
        const activeFactor = state.selectedPlanet?.id === item.planet.id ? 1.14 : 1.0;
        item.group.scale.setScalar(responsiveScale * activeFactor);
      });
    }
  };

  updateStaticPlanetLayout();

  // Raycasting acotado exclusivamente al cristal transparente del CRT (excluye silueta frontal)
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(-9999, -9999);
  let pointerInGlass = false;

  const isPointerInsideCrtGlass = (localX, localY, rectWidth, rectHeight) => {
    const { isVertical, isMobileOnly, isTabletLandscape } = state.viewport;

    if (isVertical) {
      const scale = Math.max(rectHeight, 1) / 1920;
      const shiftPx =
        isMobileOnly && state.selectedPlanet !== null
          ? MOBILE_SELECTED_OVERLAY_SHIFT_PX * scale
          : 0;
      const inCharacterSilhouette =
        localX >= 468 * scale - shiftPx &&
        localX <= 612 * scale - shiftPx &&
        localY >= 1656 * scale;

      return (
        !inCharacterSilhouette &&
        localX >= Math.max(0, 141 * scale - shiftPx) &&
        localX <= Math.min(938 * scale - shiftPx, rectWidth) &&
        localY >= 165 * scale &&
        localY <= 1754 * scale
      );
    }

    const scale = Math.max(rectHeight, 1) / 1080;
    const overlayOffsetX = isTabletLandscape ? rectWidth * 0.5 - 960 * scale : 0;
    const inCharacterSilhouette =
      localX >= 888 * scale + overlayOffsetX &&
      localX <= 1031 * scale + overlayOffsetX &&
      localY >= 816 * scale;

    return (
      !inCharacterSilhouette &&
      localX >= Math.max(0, 165 * scale + overlayOffsetX) &&
      localX <= Math.min(rectWidth, 1754 * scale + overlayOffsetX) &&
      localY >= 129 * scale &&
      localY <= 926 * scale
    );
  };

  const updatePointer = (event) => {
    const rect = container.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    pointerInGlass = isPointerInsideCrtGlass(localX, localY, rect.width, rect.height);
    pointer.x = (localX / Math.max(rect.width, 1)) * 2 - 1;
    pointer.y = -(localY / Math.max(rect.height, 1)) * 2 + 1;
  };

  container.addEventListener('pointermove', updatePointer);

  container.addEventListener('pointerdown', (event) => {
    updatePointer(event);

    if (!pointerInGlass) {
      clearPlanetSelection(false);
      return;
    }

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(hitTargets, false);

    if (intersects.length > 0) {
      const planetData = intersects[0].object.userData.planet;
      if (planetData) {
        selectPlanet(planetData);
      }
    } else {
      clearPlanetSelection(false);
    }
  });

  // Bucle de renderizado a 60 FPS (amortiguación exponencial + afterDraw en software WebGL)
  const clock = new THREE.Clock();
  const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
  const CAM_ZOOM_LAMBDA = 4.8;
  const SPIN_RAD_PER_SEC = (Math.PI * 2) / 40; // 1 vuelta completa cada 40 segundos

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      clock.getDelta();
    }
  });

  const afterDraw = (callback) => {
    const gl = renderer.getContext();
    if (gl && typeof gl.fenceSync === 'function') {
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          window.setTimeout(callback, 80);
        }
      };
      window.setTimeout(poll, 5);
    } else {
      window.setTimeout(callback, 80);
    }
  };

  const renderLoop = () => {
    const rawDelta = clock.getDelta();
    const delta = Number.isFinite(rawDelta) ? Math.min(Math.max(rawDelta, 0), 0.1) : 0.016;

    // Rotación dextrorsa (sentido horario) sobre rotation_axis + escala táctil
    planetItems.forEach((item) => {
      const { group, rotAxis, planet, baseScale } = item;

      if (rotAxis) {
        rotAxis.rotateY(-SPIN_RAD_PER_SEC * delta);
      }

      const isSelected = state.selectedPlanet?.id === planet.id;
      const isHovered = state.hoveredPlanetId === planet.id;
      const safeBase = Number.isFinite(baseScale) && baseScale > 0 ? baseScale : 1.0;
      const targetScale = safeBase * (isSelected ? 1.14 : isHovered ? 1.08 : 1.0);
      const nextScale =
        Number.isFinite(group.scale.x) && group.scale.x > 0
          ? THREE.MathUtils.damp(group.scale.x, targetScale, 6, delta)
          : targetScale;

      group.scale.setScalar(nextScale);
    });

    // Encuadre cinematográfico hacia el planeta seleccionado
    const selectedItem = state.selectedPlanet ? planetById.get(state.selectedPlanet.id) : null;

    if (selectedItem) {
      selectedItem.group.updateMatrixWorld(true);
      selectedItem.rotAxis.getWorldPosition(_axisWorldPos);

      const { width: vw, height: vh } = getSafeDimensions();
      const aspect = Number.isFinite(camera.aspect) && camera.aspect > 0 ? camera.aspect : vw / vh;
      const activeScale = (Number.isFinite(selectedItem.baseScale) ? selectedItem.baseScale : 1.0) * 1.14;
      const sphereWorldRadius = selectedItem.planet.radius * activeScale;
      const vertWorldRadius = sphereWorldRadius * 1.1;
      const horizWorldRadius = selectedItem.planet.hasRings
        ? sphereWorldRadius * 1.58
        : sphereWorldRadius * 1.08;

      const { isVertical, isMobileOnly, isTabletLandscape } = state.viewport;
      let targetScreenX;
      let targetScreenY;
      let maxVertScreenRadius;
      let maxHorizScreenRadius;
      let maxZoomDist = 7.0;

      if (isVertical) {
        const overlayScale = vh / 1920;

        if (!isMobileOnly) {
          const crtSafeLeftPx = 170 * overlayScale;
          const crtSafeRightPx = Math.min(905 * overlayScale, vw * 0.88);
          const drawerRightPx = vw >= 1024 ? 32 : 24;
          const drawerWidthPx = Math.min(390, vw * 0.44);
          const panelSafeLeftPx = vw - drawerRightPx - drawerWidthPx - 20;

          const availableRightPx = Math.max(
            crtSafeLeftPx + 120,
            Math.min(crtSafeRightPx, panelSafeLeftPx)
          );
          const leftSafe = THREE.MathUtils.clamp(crtSafeLeftPx / vw, 0.08, 0.24);
          const rightSafe = THREE.MathUtils.clamp(availableRightPx / vw, leftSafe + 0.14, 0.68);

          targetScreenX = THREE.MathUtils.clamp(THREE.MathUtils.lerp(leftSafe, rightSafe, 0.46), 0.22, 0.36);
          targetScreenY = 0.46;
          maxVertScreenRadius = 0.18;
          maxHorizScreenRadius = Math.max(
            0.15,
            Math.min(targetScreenX - leftSafe, rightSafe - targetScreenX) * 0.9
          );
          maxZoomDist = 5.8;
        } else {
          const shiftPx = MOBILE_SELECTED_OVERLAY_SHIFT_PX * overlayScale;
          const crtSafeLeftPx = Math.max(6, 141 * overlayScale - shiftPx + 3);
          const drawerRightPx = 10;
          const drawerWidthPx = Math.min(vw - 104, vw * 0.61);
          const panelSafeLeftPx = vw - drawerRightPx - drawerWidthPx - 4;

          const leftSafe = THREE.MathUtils.clamp(crtSafeLeftPx / vw, 0.02, 0.12);
          const rightSafe = THREE.MathUtils.clamp(panelSafeLeftPx / vw, leftSafe + 0.18, 0.42);

          targetScreenX = THREE.MathUtils.clamp(THREE.MathUtils.lerp(leftSafe, rightSafe, 0.5), 0.15, 0.25);
          targetScreenY = 0.45;
          maxVertScreenRadius = 0.16;
          maxHorizScreenRadius = Math.max(
            0.14,
            Math.min(targetScreenX - leftSafe, rightSafe - targetScreenX) * 1.06
          );
          maxZoomDist = 6.5;
        }
      } else {
        const overlayScale = vh / 1080;
        const overlayOffsetX = isTabletLandscape ? vw * 0.5 - 960 * overlayScale : 0;
        const crtSafeLeftPx = Math.max(32, 205 * overlayScale + overlayOffsetX);
        const crtSafeRightPx = Math.min(1700 * overlayScale + overlayOffsetX, vw * 0.88);

        const drawerRightPx = vw >= 1024 ? 32 : vw >= 640 ? 24 : 16;
        const drawerWidthPx = Math.min(390, vw * 0.44);
        const panelGapPx = Math.max(12, Math.round(28 * Math.min(1, vw / 1280)));
        const panelSafeLeftPx = vw - drawerRightPx - drawerWidthPx - panelGapPx;

        const minWindowSpanPx = 180 * Math.min(1, overlayScale * 1.4);
        const availableRightPx = Math.max(
          crtSafeLeftPx + minWindowSpanPx,
          Math.min(crtSafeRightPx, panelSafeLeftPx)
        );
        const leftSafe = THREE.MathUtils.clamp(crtSafeLeftPx / vw, 0.06, 0.28);
        const rightSafe = THREE.MathUtils.clamp(availableRightPx / vw, leftSafe + 0.16, 0.78);

        targetScreenX = THREE.MathUtils.clamp(THREE.MathUtils.lerp(leftSafe, rightSafe, 0.43), 0.22, 0.39);
        targetScreenY = 0.49;
        maxVertScreenRadius = 0.25;
        maxHorizScreenRadius = Math.max(
          0.14,
          Math.min(targetScreenX - leftSafe, rightSafe - targetScreenX) * 0.9
        );
        maxZoomDist = 7.0;
      }

      const minHalfHVert = vertWorldRadius / (2 * maxVertScreenRadius);
      const minHalfHHoriz = horizWorldRadius / (2 * maxHorizScreenRadius * aspect);
      const zoomDist = Math.min(
        Math.max(minHalfHVert / tanHalfFov, minHalfHHoriz / tanHalfFov, 2.5),
        maxZoomDist
      );

      const halfH = zoomDist * tanHalfFov;
      const halfW = halfH * aspect;
      const ndcX = targetScreenX * 2 - 1;
      const ndcY = 1 - targetScreenY * 2;

      _desiredLookTarget
        .copy(_axisWorldPos)
        .addScaledVector(_homeRight, -ndcX * halfW)
        .addScaledVector(_homeUp, -ndcY * halfH);

      _desiredCamPos.copy(_desiredLookTarget).addScaledVector(_homeBack, zoomDist);
    } else {
      _desiredCamPos.copy(HOME_CAM_POS);
      _desiredLookTarget.copy(HOME_LOOK_TARGET);
    }

    currentCamPos.x = THREE.MathUtils.damp(currentCamPos.x, _desiredCamPos.x, CAM_ZOOM_LAMBDA, delta);
    currentCamPos.y = THREE.MathUtils.damp(currentCamPos.y, _desiredCamPos.y, CAM_ZOOM_LAMBDA, delta);
    currentCamPos.z = THREE.MathUtils.damp(currentCamPos.z, _desiredCamPos.z, CAM_ZOOM_LAMBDA, delta);

    currentLookTarget.x = THREE.MathUtils.damp(currentLookTarget.x, _desiredLookTarget.x, CAM_ZOOM_LAMBDA, delta);
    currentLookTarget.y = THREE.MathUtils.damp(currentLookTarget.y, _desiredLookTarget.y, CAM_ZOOM_LAMBDA, delta);
    currentLookTarget.z = THREE.MathUtils.damp(currentLookTarget.z, _desiredLookTarget.z, CAM_ZOOM_LAMBDA, delta);

    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookTarget);

    // Detección hover sobre planetas dentro del cristal CRT
    if (pointerInGlass && pointer.x > -2) {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(hitTargets, false);

      if (intersects.length > 0) {
        const hovered = intersects[0].object.userData.planet;
        if (hovered && hovered.id !== state.hoveredPlanetId) {
          state.hoveredPlanetId = hovered.id;
          container.classList.add('is-hovering');
        }
      } else if (state.hoveredPlanetId !== null) {
        state.hoveredPlanetId = null;
        container.classList.remove('is-hovering');
      }
    } else if (state.hoveredPlanetId !== null) {
      state.hoveredPlanetId = null;
      container.classList.remove('is-hovering');
    }

    renderer.render(scene, camera);

    if (isSoftwareGl) {
      afterDraw(renderLoop);
    } else {
      requestAnimationFrame(renderLoop);
    }
  };

  renderLoop();

  // Sincronización ante cambio de tamaño u orientación
  const handleResize = () => {
    const rawW = container.clientWidth || window.innerWidth;
    const rawH = container.clientHeight || window.innerHeight;
    if (!rawW || !rawH) return;
    const w = Math.round(rawW);
    const h = Math.round(rawH);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, true);
    updateStaticPlanetLayout();
  };

  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(container);

  return { handleResize };
}

/* ============================================================================
   8. EVENTOS GLOBALES, ATAJOS DE TECLADO Y ARRANQUE
   ============================================================================ */

function bootstrap() {
  buildPlanetTabs();
  renderOverlay();

  const spaceScene = initSpaceScene();

  // Cierre del panel y del visor Lightbox
  dom.drawerCloseBtn.addEventListener('click', () => clearPlanetSelection(true));
  dom.lightbox.addEventListener('click', closeLightbox);
  dom.lightboxMeta.addEventListener('click', (event) => event.stopPropagation());
  dom.lightboxImage.addEventListener('click', (event) => event.stopPropagation());
  dom.lightboxCloseBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    closeLightbox();
  });

  // Sincronización de viewport (orientación y redimensionamiento)
  let orientationRaf = 0;

  const syncAllResponsiveState = () => {
    const prevLandscapeFit = state.viewport.isDesktopOrTabletLandscape;
    state.viewport = getViewportFlags();

    renderOverlay();
    syncDrawerShell();

    if (
      state.selectedPlanet &&
      prevLandscapeFit !== state.viewport.isDesktopOrTabletLandscape &&
      (state.selectedPlanet.section === 'Introduccion' ||
        state.selectedPlanet.section === 'Biografia')
    ) {
      renderDrawerBody();
    }

    spaceScene?.handleResize();
  };

  const handleOrientationChange = () => {
    syncAllResponsiveState();
    cancelAnimationFrame(orientationRaf);
    orientationRaf = requestAnimationFrame(syncAllResponsiveState);
  };

  [
    mqVertical,
    mqMobileOnly,
    mqTabletLandscape,
    mqDesktopOrTabletLandscape,
    mqMobileOrTabletDevice
  ].forEach((mq) => mq.addEventListener('change', syncAllResponsiveState));

  window.addEventListener('resize', syncAllResponsiveState);
  window.addEventListener('orientationchange', handleOrientationChange);

  // Atajos de teclado globales: M (silenciar audio) y Escape (cerrar Lightbox o panel)
  window.addEventListener('keydown', (event) => {
    const tagName = event.target?.tagName;
    if (tagName === 'INPUT' || tagName === 'TEXTAREA') return;

    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
      event.preventDefault();
    }

    if (event.code === 'KeyM') {
      event.preventDefault();
      audioFX.toggleMute();
      return;
    }

    if (event.code === 'Escape') {
      if (state.activeArtwork) {
        closeLightbox();
      } else if (state.selectedPlanet) {
        clearPlanetSelection(false);
      }
    }
  });
}

bootstrap();
