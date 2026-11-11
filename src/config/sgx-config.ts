/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX OMNI-CANVAS | Spatialgineers LLC
 * Panel Central de Configuración (Baseline Template)
 */

export type PillarId = 'SHOWCASE_SYSTEM';

export interface PillarMetadata {
  id: PillarId;
  name: string;
  codename: string;
  archetype: string;
  tagline: string;
  accentColor: string;
  moduleFile: string;
  iconName: string;
  scopeDescription: string;
  creativePossibilities: string[];
  challenge: string;
  promptExample: string;
}

export const PILLARS: Record<PillarId, PillarMetadata> = {
  SHOWCASE_SYSTEM: {
    id: 'SHOWCASE_SYSTEM',
    name: 'Showcase x System',
    codename: 'The Celestial Viewport',
    archetype: 'El Observador Cósmico',
    tagline: 'Portafolio interactivo de ciencia ficción acogedora (#0A1128, #51E6C4, #5E53CC) con personaje en 3ra persona y planetas interactivos a 60 FPS.',
    accentColor: '#51E6C4',
    moduleFile: 'showcase-system-portfolio.js',
    iconName: 'Sparkles',
    scopeDescription: 'Mutación insignia de los pilares SGX.Showcase y SGX.System bajo el Grimorio V2026.5: canvas Three.js con observador geométrico de espaldas contemplando un viewport rectangular con planetas vivos, sondas gravitatorias, audio sintetizado acogedor y capítulos narrativos del portafolio.',
    creativePossibilities: [
      'Personaje geométrico articulado observando el cosmos en 3ra persona',
      'Viewport rectangular holográfico con sistema solar interactivo a 60 FPS',
      'Mecánicas lúdicas y telemetría espacial (lanzar sondas, pulso gravitatorio, aceleración orbital)',
      'Narrativa y showcase de proyectos por capítulos con análisis de sistemas',
      'Exportación en un solo archivo Vanilla JS/CSS Single-File optimizado'
    ],
    challenge: 'Expandir el sistema de planetas interactivos, conectar nuevas sondas orbitales o personalizar las crónicas y proyectos del creador.',
    promptExample: 'Gemini, en showcase-system-portfolio.js añade un sexto planeta dedicado a visualizadores de sonido Web Audio con anillos fluorescentes.'
  }
};

export interface SGXConfig {
  activePillar: PillarId;
  debugMode: boolean;
  showHUD: boolean;
  audioMuted: boolean;
  audioVolume: number;
  audioReactive: boolean;
  stageMode: boolean; // Full immersion mode (Grimorio Cap XVI: tecla F)
  performanceMode: 'HIGH' | 'BALANCED' | 'BATTERY_SAVER';
}

export const DEFAULT_CONFIG: SGXConfig = {
  activePillar: 'SHOWCASE_SYSTEM',
  debugMode: false,
  showHUD: true,
  audioMuted: false,
  audioVolume: 0.65,
  audioReactive: true,
  stageMode: false,
  performanceMode: 'HIGH'
};

/**
 * Shared media query for vertical viewport format.
 * Mobile and tablet screens use the vertical layout in portrait orientation
 * and switch to the desktop (computadora) format when in landscape orientation.
 */
export const VERTICAL_VIEWPORT_MEDIA_QUERY = '(orientation: portrait)';

export function isMobileOrTabletViewport(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(VERTICAL_VIEWPORT_MEDIA_QUERY).matches;
}

/**
 * Media query targeting mobile-only portrait viewports (< 640px in portrait orientation)
 * while leaving landscape mobile, tablet, and desktop layouts on their respective formats.
 */
export const MOBILE_ONLY_MEDIA_QUERY = '(max-width: 639px) and (orientation: portrait)';

/**
 * Horizontal leftward shift (in 1920x1920 vertical-overlay source pixels) applied ONLY on
 * mobile portrait when a planet panel is open (120 / 1920 = 6.25vh), keeping the inner left CRT
 * bezel visible near the left screen edge while freeing space on the right for a wider panel.
 */
export const MOBILE_SELECTED_OVERLAY_SHIFT_PNG = 120;

export function isMobileOnlyViewport(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return isMobileOrTabletViewport() && window.matchMedia(MOBILE_ONLY_MEDIA_QUERY).matches;
}

/**
 * Media query targeting tablet viewports in landscape orientation
 * (excludes mobile landscape <= 500px tall and standard desktop monitors > 1368px with fine pointer).
 */
export const TABLET_LANDSCAPE_MEDIA_QUERY =
  '(orientation: landscape) and (min-width: 640px) and (max-width: 1368px) and (min-height: 501px), (orientation: landscape) and (min-height: 501px) and (hover: none) and (pointer: coarse)';

export function isTabletLandscapeViewport(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return !isMobileOrTabletViewport() && window.matchMedia(TABLET_LANDSCAPE_MEDIA_QUERY).matches;
}

/**
 * Media query targeting desktop (computadora) and tablet viewports in horizontal (landscape) orientation
 * while excluding portrait layouts and compact mobile landscape viewports.
 */
export const DESKTOP_OR_TABLET_LANDSCAPE_MEDIA_QUERY =
  '(orientation: landscape) and (min-width: 640px) and (min-height: 501px), (orientation: landscape) and (min-width: 640px) and (hover: hover) and (pointer: fine)';

export function isDesktopOrTabletLandscapeViewport(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return !isMobileOrTabletViewport() && window.matchMedia(DESKTOP_OR_TABLET_LANDSCAPE_MEDIA_QUERY).matches;
}

/**
 * Media query targeting all mobile and tablet viewports across both portrait and landscape orientations
 * (excludes desktop monitors > 1368px in landscape with fine pointer).
 */
export const MOBILE_OR_TABLET_DEVICE_MEDIA_QUERY =
  '(orientation: portrait), (orientation: landscape) and (max-width: 1368px), (orientation: landscape) and (max-height: 500px), (hover: none) and (pointer: coarse)';

export function isMobileOrTabletDeviceViewport(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(MOBILE_OR_TABLET_DEVICE_MEDIA_QUERY).matches;
}



