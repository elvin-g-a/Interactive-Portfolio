/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX OMNI-CANVAS | Spatialgineers LLC
 * Panel Central de Configuración (Baseline Template)
 */

export type PillarId = 'SPARK_STORY';

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
  SPARK_STORY: {
    id: 'SPARK_STORY',
    name: 'Showcase x System',
    codename: 'The Celestial Viewport',
    archetype: 'El Observador Cósmico',
    tagline: 'Portafolio interactivo de ciencia ficción acogedora (#0A1128, #51E6C4, #5E53CC) con personaje en 3ra persona y planetas interactivos a 60 FPS.',
    accentColor: '#51E6C4',
    moduleFile: 'spark-story-portfolio.js',
    iconName: 'Sparkles',
    scopeDescription: 'Mutación insignia de los pilares SGX.Spark y SGX.Story bajo el Grimorio V2026.5: canvas Three.js con observador geométrico de espaldas contemplando un viewport rectangular con planetas vivos, sondas gravitatorias, audio sintetizado acogedor y capítulos narrativos del portafolio.',
    creativePossibilities: [
      'Personaje geométrico articulado observando el cosmos en 3ra persona',
      'Viewport rectangular holográfico con sistema solar interactivo a 60 FPS',
      'Mecánicas lúdicas Spark (lanzar sondas, pulso gravitatorio, aceleración orbital)',
      'Narrativa Story con crónicas del viajero y showcase de proyectos por capítulos',
      'Exportación en un solo archivo Vanilla JS/CSS Single-File optimizado'
    ],
    challenge: 'Expandir el sistema de planetas interactivos, conectar nuevas sondas orbitales o personalizar las crónicas y proyectos del creador.',
    promptExample: 'Gemini, en spark-story-portfolio.js añade un sexto planeta dedicado a visualizadores de sonido Web Audio con anillos fluorescentes.'
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
  activePillar: 'SPARK_STORY',
  debugMode: false,
  showHUD: true,
  audioMuted: false,
  audioVolume: 0.65,
  audioReactive: true,
  stageMode: false,
  performanceMode: 'HIGH'
};
