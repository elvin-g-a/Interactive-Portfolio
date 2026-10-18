/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX OMNI-CANVAS - Clean Modular Source Code Bank
 * Single-Pillar Edition: Spark × Story (The Celestial Viewport)
 */

export const SGX_CONFIG_JS = `/**
 * ========================================================
 * SGX OMNI-CANVAS: sgx-config.js (Panel de Control Central)
 * ========================================================
 * Afinidad Única Activa: 'SPARK_STORY' (Spark × Story)
 * Entorno de ciencia ficción acogedora (#0A1128, #51E6C4, #5E53CC)
 * Personaje en 3ra persona observando Viewport rectangular y planetas vivos a 60 FPS.
 */

export const ACTIVE_PILLAR = 'SPARK_STORY';

export const CREATOR_PROFILE = {
  authorName: 'Spatialgineers Creator',
  specialtyRole: 'Virtual Architect & Creative Technologist',
  projectTitle: 'Interactive Spatial Portfolio (Spark × Story)',
  contactEmail: 'creator@spatialgineers.com',
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    artstation: 'https://artstation.com'
  }
};

export const SGX_SETTINGS = {
  appName: 'SGX Omni-Canvas: Spark × Story Portfolio',
  version: '2026.5',
  debugMode: false,
  showTelemetryHUD: true,
  audioReactive: true,
  targetFPS: 60,
  palette: {
    deepSpace: '#0A1128',
    neonTurquoise: '#51E6C4',
    mysticPurple: '#5E53CC',
    surface: '#0e1736'
  }
};
`;

export const SPARK_STORY_MODULE_JS = `/**
 * ========================================================
 * MÓDULO SGX.Spark × SGX.Story: Portafolio del Observador Cósmico
 * ========================================================
 * Arquitectura Three.js PBR a 60 FPS · Ciencia Ficción Acogedora (#0A1128, #51E6C4, #5E53CC)
 * Personaje geométrico en 3ra persona observando Viewport rectangular y sistema de planetas.
 * Código Vanilla JS / ES Modules 100% libre de dependencias npm externas.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export class SparkStoryPortfolioEngine {
  constructor(container) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.orbitSpeedFactor = 1.0;
    this.probesCount = 0;
    this.activePlanetId = 'spark';

    this.initScene();
    this.initLights();
    this.initObservatory();
    this.initCharacter();
    this.initViewport();
    this.initPlanetarySystem();
    this.initRaycasting();
    this.initAudioSynthesizer();

    this.animate = this.animate.bind(this);
    this.renderLoop = requestAnimationFrame(this.animate);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0A1128);
    this.scene.fog = new THREE.FogExp2(0x0A1128, 0.012);

    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 100);
    this.camera.position.set(0, 1.45, 5.0);
    this.camera.lookAt(0, 0.95, -2.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
  }

  initLights() {
    const key = new THREE.DirectionalLight(0xdef8ff, 1.8);
    key.position.set(4, 7, 4);
    this.scene.add(key);

    const hemi = new THREE.HemisphereLight(0x51E6C4, 0x5E53CC, 0.7);
    this.scene.add(hemi);
  }

  initObservatory() {
    const floorGeo = new THREE.CylinderGeometry(4.8, 5.2, 0.45, 32);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0e1736, roughness: 0.35, metalness: 0.85 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.22, 2.8);
    this.scene.add(floor);
  }

  initCharacter() {
    this.characterGroup = new THREE.Group();
    this.characterGroup.position.set(0, 0, 3.1);

    const helmetGeo = new THREE.DodecahedronGeometry(0.25, 1);
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0x121c3b, roughness: 0.28, metalness: 0.88 });
    this.helmet = new THREE.Mesh(helmetGeo, helmetMat);
    this.helmet.position.set(0, 1.35, 0);
    this.characterGroup.add(this.helmet);

    const sensorGeo = new THREE.BoxGeometry(0.2, 0.04, 0.06);
    const sensorMat = new THREE.MeshBasicMaterial({ color: 0x51E6C4 });
    const sensor = new THREE.Mesh(sensorGeo, sensorMat);
    sensor.position.set(0, 1.36, -0.16);
    this.helmet.add(sensor);

    const torsoGeo = new THREE.BoxGeometry(0.52, 0.68, 0.32);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x0e1736, roughness: 0.35, metalness: 0.8 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.set(0, 0.82, 0);
    this.characterGroup.add(torso);

    this.scene.add(this.characterGroup);
  }

  initViewport() {
    this.viewportGroup = new THREE.Group();
    this.viewportGroup.position.set(0, 1.25, 0.0);

    const vpBoxGeo = new THREE.BoxGeometry(7.6, 4.4, 0.04);
    const vpEdges = new THREE.EdgesGeometry(vpBoxGeo);
    const vpLineMat = new THREE.LineBasicMaterial({ color: 0x51E6C4, linewidth: 2, transparent: true, opacity: 0.85 });
    const vpLines = new THREE.LineSegments(vpEdges, vpLineMat);
    this.viewportGroup.add(vpLines);

    this.scene.add(this.viewportGroup);
  }

  initPlanetarySystem() {
    this.planets = [
      { id: 'spark', name: 'Planeta Spark', color: 0x51E6C4, r: 0.65, ox: 2.8, oy: 1.4, speed: 0.45, chapter: 'Mecánicas Interactivas & Spark Engine' },
      { id: 'story', name: 'Planeta Story', color: 0x5E53CC, r: 0.85, ox: 4.2, oy: 1.9, speed: 0.25, hasRing: true, chapter: 'Crónicas del Viajero & Manifiesto' },
      { id: 'nexus', name: 'Planeta Nexus', color: 0x51E6C4, r: 0.75, ox: 5.6, oy: 2.4, speed: 0.18, isWire: true, chapter: 'Bóveda de Obras y Proyectos' }
    ];

    this.planetMeshes = [];
    this.planets.forEach((p, idx) => {
      const group = new THREE.Group();
      const geo = new THREE.SphereGeometry(p.r, 32, 32);
      const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.3, metalness: 0.6, wireframe: !!p.isWire });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = p;
      group.add(mesh);

      if (p.hasRing) {
        const ringGeo = new THREE.RingGeometry(p.r * 1.3, p.r * 1.8, 36);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x8C82FF, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI * 0.4;
        group.add(ring);
      }

      this.scene.add(group);
      this.planetMeshes.push({ group, mesh, data: p, angle: idx * 2.1 });
    });
  }

  initRaycasting() {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-999, -999);
  }

  initAudioSynthesizer() {
    // Cozy ambient harmonic synthesizer Web Audio (Eb2 / Bb2)
    this.audioCtx = null;
  }

  launchProbe() {
    this.probesCount++;
    console.log('[SGX.Spark] Sonda kinética despachada. Total:', this.probesCount);
  }

  animate() {
    this.renderLoop = requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    if (this.helmet) {
      this.helmet.position.y = 1.35 + Math.sin(time * 1.4) * 0.012;
    }

    this.planetMeshes.forEach(pm => {
      pm.angle += pm.data.speed * delta * this.orbitSpeedFactor;
      const x = Math.cos(pm.angle) * pm.data.ox;
      const y = Math.sin(pm.angle) * pm.data.oy + 1.25;
      const z = -2.6 + Math.sin(pm.angle * 0.8) * 0.85;
      pm.group.position.set(x, y, z);
      pm.mesh.rotation.y += 0.65 * delta;
    });

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this.renderLoop);
    this.renderer.dispose();
  }
}
`;
