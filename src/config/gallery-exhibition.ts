/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Configuración de la Exhibición de Arte — Planeta Galería
 * Categorías vinculadas a la libreta del proyecto:
 *  - Contenido de Galería - Concept Art
 *  - Contenido de Galería - HUD Elements
 */

export enum GalleryCategoryId {
  ALL = 'ALL',
  CONCEPT_ART = 'CONCEPT_ART',
  HUD_ELEMENTS = 'HUD_ELEMENTS'
}

export interface GalleryArtworkItem {
  id: string;
  title: string;
  src: string;
  category: GalleryCategoryId.CONCEPT_ART | GalleryCategoryId.HUD_ELEMENTS;
  caption?: string;
  pixelArt?: boolean;
}

export interface GalleryCategoryDefinition {
  id: GalleryCategoryId.CONCEPT_ART | GalleryCategoryId.HUD_ELEMENTS;
  label: string;
  notebookSectionTitle: string;
  description: string;
}

export const GALLERY_CATEGORIES: GalleryCategoryDefinition[] = [
  {
    id: GalleryCategoryId.CONCEPT_ART,
    label: 'Arte de Mazescape',
    notebookSectionTitle: 'Arte de Mazescape',
    description: 'Diseño conceptual de niveles, criaturas, personajes y armas.'
  },
  {
    id: GalleryCategoryId.HUD_ELEMENTS,
    label: 'Otros Proyectos',
    notebookSectionTitle: 'Otros Proyectos',
    description: 'Hojas de diseño de personajes, paletas cromáticas y expresión.'
  }
];

/**
 * Piezas de la exhibición actual.
 * Archivos reales de "Concept Art" y "HUD Elements" provistos por el creador.
 */
export const GALLERY_ARTWORKS: GalleryArtworkItem[] = [
  {
    id: 'concept-art-laberinto',
    title: 'Concepto Laberinto',
    src: '/assets/gallery/concept_art_concepto_laberinto.png',
    category: GalleryCategoryId.CONCEPT_ART
  },
  {
    id: 'concept-art-cerberus-turnaround',
    title: 'Cerberus Turnaround',
    src: '/assets/gallery/concept_art_cerberus_turnaround.png',
    category: GalleryCategoryId.CONCEPT_ART
  },
  {
    id: 'concept-art-maze-protag-turnaround',
    title: 'Maze Protag Turnaround',
    src: '/assets/gallery/concept_art_maze_protag_turnaround.png',
    category: GalleryCategoryId.CONCEPT_ART
  },
  {
    id: 'concept-art-mace-turnaround',
    title: 'Mace Turnaround',
    src: '/assets/gallery/concept_art_mace_turnaround.png',
    category: GalleryCategoryId.CONCEPT_ART
  },
  {
    id: 'concept-art-sword-turnaround',
    title: 'Sword Turnaround',
    src: '/assets/gallery/concept_art_sword_turnaround.png',
    category: GalleryCategoryId.CONCEPT_ART
  },
  {
    id: 'concept-art-machete-turnaround',
    title: 'Machete Turnaround',
    src: '/assets/gallery/concept_art_machete_turnaround.png',
    category: GalleryCategoryId.CONCEPT_ART
  },
  {
    id: 'hud-elements-elvin-character-design',
    title: 'Elvin Andrades Character Design',
    src: '/assets/gallery/hud_elements_Elvin_Andrades_Character_Design.jpg',
    category: GalleryCategoryId.HUD_ELEMENTS
  },
  {
    id: 'hud-elements-portfolio-ashley',
    title: 'Portfolio - Ashley',
    src: '/assets/gallery/hud_elements_Portfolio_-_Ashley.png',
    category: GalleryCategoryId.HUD_ELEMENTS
  },
  {
    id: 'hud-elements-sir-cronus-concept',
    title: 'Sir Cronus Concept',
    src: '/assets/gallery/hud_elements_Sir_Cronus_Concept.png',
    category: GalleryCategoryId.HUD_ELEMENTS
  }
];
