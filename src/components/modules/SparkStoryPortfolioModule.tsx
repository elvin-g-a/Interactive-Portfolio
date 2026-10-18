/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO SGX.Spark × SGX.Story: Portafolio Interactivo del Observador Cósmico
 * Arquitectura Three.js PBR a 60 FPS · Ciencia Ficción Acogedora (#0A1128, #51E6C4, #5E53CC)
 * Personaje geométrico en 3ra persona observando Viewport rectangular y planetas interactivos.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { soundEngine } from '../../services/sound-effects';
import {
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Send,
  Zap,
  Compass,
  Download,
  Code2,
  Eye,
  Maximize2,
  ChevronRight,
  ExternalLink,
  Github,
  Mail,
  CheckCircle2,
  Sliders,
  Layers,
  Radio,
  X
} from 'lucide-react';

interface SparkStoryPortfolioModuleProps {
  onOpenRemix: () => void;
  isMuted: boolean;
}

// Portfolio Chapters linked to Celestial Bodies
export interface CelestialPlanet {
  id: string;
  name: string;
  subtitle: string;
  domain: 'SPARK' | 'STORY' | 'NEXUS' | 'MATRIX' | 'BEACON';
  color: string;
  secondaryColor: string;
  radius: number;
  orbitRadiusX: number;
  orbitRadiusY: number;
  orbitSpeed: number;
  orbitAngle: number;
  inclination: number;
  hasRings?: boolean;
  ringsRadius?: number;
  isWireframe?: boolean;
  description: string;
  chapterNumber: number;
}

const CELESTIAL_PLANETS: CelestialPlanet[] = [
  {
    id: 'planet-spark',
    name: 'Planeta Spark',
    subtitle: 'El Crisol · Motor Interactivo & Físicas',
    domain: 'SPARK',
    color: '#51E6C4',
    secondaryColor: '#00BFA5',
    radius: 0.65,
    orbitRadiusX: 2.8,
    orbitRadiusY: 1.4,
    orbitSpeed: 0.45,
    orbitAngle: 0.2,
    inclination: 0.15,
    description: 'Mecánicas de fricción cero, bucles de simulación a 60 FPS y gamificación interactiva.',
    chapterNumber: 1
  },
  {
    id: 'planet-story',
    name: 'Planeta Story',
    subtitle: 'El Archivo · Crónicas & Manifiesto',
    domain: 'STORY',
    color: '#5E53CC',
    secondaryColor: '#8C82FF',
    radius: 0.85,
    orbitRadiusX: 4.2,
    orbitRadiusY: 1.9,
    orbitSpeed: 0.25,
    orbitAngle: 2.1,
    inclination: -0.22,
    hasRings: true,
    ringsRadius: 1.6,
    description: 'Narrativa cinemática, la travesía del arquitecto creador y el diseño con alma humana.',
    chapterNumber: 2
  },
  {
    id: 'planet-nexus',
    name: 'Planeta Nexus',
    subtitle: 'La Bóveda · Proyectos & Obras Insignia',
    domain: 'NEXUS',
    color: '#51E6C4',
    secondaryColor: '#5E53CC',
    radius: 0.75,
    orbitRadiusX: 5.6,
    orbitRadiusY: 2.4,
    orbitSpeed: 0.18,
    orbitAngle: 3.8,
    inclination: 0.1,
    isWireframe: true,
    description: 'Colección de aplicaciones espaciales interactivas, herramientas creativas y gemelos digitales.',
    chapterNumber: 3
  },
  {
    id: 'planet-matrix',
    name: 'Planeta Matrix',
    subtitle: 'El Bastión · Stack Tecnológico & Arcana',
    domain: 'MATRIX',
    color: '#6366F1',
    secondaryColor: '#51E6C4',
    radius: 0.58,
    orbitRadiusX: 7.0,
    orbitRadiusY: 3.0,
    orbitSpeed: 0.12,
    orbitAngle: 5.0,
    inclination: -0.15,
    description: 'Maestría en Three.js, shaders GLSL, arquitecturas full-stack y optimización GPU.',
    chapterNumber: 4
  },
  {
    id: 'planet-beacon',
    name: 'Planeta Beacon',
    subtitle: 'El Faro · Enlace & Transmisión',
    domain: 'BEACON',
    color: '#51E6C4',
    secondaryColor: '#FFFFFF',
    radius: 0.5,
    orbitRadiusX: 8.2,
    orbitRadiusY: 3.5,
    orbitSpeed: 0.08,
    orbitAngle: 1.1,
    inclination: 0.28,
    description: 'Canal directo de contacto, colaboración profesional y disponibilidad de misiones.',
    chapterNumber: 5
  }
];

export const SparkStoryPortfolioModule: React.FC<SparkStoryPortfolioModuleProps> = ({
  onOpenRemix,
  isMuted
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // UI States
  const [selectedPlanet, setSelectedPlanet] = useState<CelestialPlanet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<CelestialPlanet | null>(null);
  const [activeChapterTab, setActiveChapterTab] = useState<number>(1);
  const [orbitSpeedFactor, setOrbitSpeedFactor] = useState<number>(1.0);
  const [isDroneActive, setIsDroneActive] = useState<boolean>(false);
  const [isHUDCollapsed, setIsHUDCollapsed] = useState<boolean>(false);
  const [isWireframeScanner, setIsWireframeScanner] = useState<boolean>(false);
  const [probesCount, setProbesCount] = useState<number>(0);
  const [telemetryLog, setTelemetryLog] = useState<string>('OBSERVATORIO ESTABLE · SECTOR-7 EN LÍNEA');
  const [transmissionSent, setTransmissionSent] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [isSingleFileModalOpen, setIsSingleFileModalOpen] = useState<boolean>(false);

  // References to keep mutable 3D state out of re-render closures
  const stateRef = useRef({
    orbitSpeedFactor: 1.0,
    isWireframeScanner: false,
    selectedPlanetId: null as string | null,
    hoveredPlanetId: null as string | null,
    pointer: new THREE.Vector2(-9999, -9999),
    raycaster: new THREE.Raycaster(),
    planetsMeshes: new Map<string, THREE.Group>(),
    planetTargetPositions: new Map<string, THREE.Vector3>(),
    characterHead: null as THREE.Mesh | null,
    characterSpine: null as THREE.Mesh | null,
    probes: [] as {
      mesh: THREE.Mesh;
      targetPlanetId: string;
      progress: number;
      orbitAngle: number;
    }[],
    gravityWave: null as THREE.Mesh | null,
    gravityWaveRadius: 0,
    gravityWaveActive: false
  });

  // Toggle ambient warm cozy sci-fi drone
  const toggleAmbientDrone = useCallback(() => {
    const running = soundEngine.toggleCozyDrone();
    setIsDroneActive(running);
    setTelemetryLog(running ? 'SINTETIZADOR AMBIENTAL: ONDAS EB2/BB2 ACTIVAS' : 'SINTETIZADOR AMBIENTAL: STANDBY');
  }, []);

  // Launch a light probe towards the active planet (Spark mechanic)
  const handleLaunchProbe = useCallback(() => {
    const target = stateRef.current.selectedPlanetId || 'planet-spark';
    soundEngine.playProbeLaunchSound();
    setProbesCount((prev) => prev + 1);
    setTelemetryLog(`SONDA KINÉTICA DESPACHADA >> ${target.toUpperCase()}`);
  }, []);

  // Trigger gravity pulse (Spark mechanic)
  const handleGravityPulse = useCallback(() => {
    soundEngine.playPulseSound();
    stateRef.current.gravityWaveActive = true;
    stateRef.current.gravityWaveRadius = 0.5;
    setTelemetryLog('PULSO GRAVITATORIO RESONANTE DISPARADO');
  }, []);

  // Select planet
  const handleSelectPlanet = useCallback((planet: CelestialPlanet) => {
    setSelectedPlanet(planet);
    setActiveChapterTab(planet.chapterNumber);
    stateRef.current.selectedPlanetId = planet.id;
    soundEngine.playPlanetResonance(planet.chapterNumber);
    setTelemetryLog(`ENFOQUE TELEMÉTRICO >> ${planet.name.toUpperCase()}`);
  }, []);

  // Build the complete standalone Single-File HTML bundle
  const generateSingleFileHtml = (): string => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portafolio Interactivo SGX: Showcase x System</title>
  
  <!-- Import Maps Fundacionales SGX (Grimorio V2026.5) -->
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
    }
  }
  </script>

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0A1128;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      height: 100vh;
      width: 100vw;
    }
    #canvas-container {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    .hud-header {
      position: absolute;
      top: 16px;
      left: 20px;
      z-index: 10;
      background: rgba(14, 23, 54, 0.85);
      border: 1px solid rgba(81, 230, 196, 0.3);
      padding: 10px 18px;
      border-radius: 8px;
      backdrop-filter: blur(12px);
      font-size: 13px;
    }
    .hud-header h1 {
      font-size: 14px;
      color: #51E6C4;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .hud-header p {
      color: #94a3b8;
      font-size: 11px;
      margin-top: 2px;
    }
    .hud-dock {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      display: flex;
      gap: 12px;
      background: rgba(14, 23, 54, 0.9);
      border: 1px solid rgba(81, 230, 196, 0.35);
      padding: 10px 18px;
      border-radius: 30px;
      backdrop-filter: blur(14px);
    }
    .btn {
      background: rgba(81, 230, 196, 0.12);
      border: 1px solid #51E6C4;
      color: #51E6C4;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .btn:hover {
      background: #51E6C4;
      color: #0A1128;
    }
    .btn-purple {
      background: rgba(94, 83, 204, 0.15);
      border-color: #5E53CC;
      color: #b8b1ff;
    }
    .btn-purple:hover {
      background: #5E53CC;
      color: #ffffff;
    }
    .drawer {
      position: absolute;
      top: 20px;
      right: 20px;
      bottom: 20px;
      width: 440px;
      max-width: calc(100vw - 40px);
      background: rgba(14, 23, 54, 0.96);
      border: 1px solid rgba(81, 230, 196, 0.35);
      border-radius: 12px;
      z-index: 20;
      display: none;
      flex-direction: column;
      padding: 24px;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
    .drawer.active { display: flex; }
    .close-btn {
      align-self: flex-end;
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 18px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div id="canvas-container"></div>
  
  <div class="hud-header">
    <h1>SGX.SHOWCASE × SGX.SYSTEM</h1>
    <p>Portafolio Interactivo · Observatorio Cósmico (60 FPS)</p>
  </div>

  <div class="hud-dock">
    <button class="btn" id="btn-probe">✦ Lanzar Sonda</button>
    <button class="btn btn-purple" id="btn-pulse">◎ Pulso de Espacio</button>
    <button class="btn" id="btn-audio">♫ Audio Drone</button>
  </div>

  <div class="drawer" id="portfolio-drawer">
    <button class="close-btn" id="btn-close-drawer">✕</button>
    <div id="drawer-content" style="margin-top: 12px;"></div>
  </div>

  <script type="module">
    import * as THREE from 'three';
    import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

    // Scene & Renderer
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A1128);
    scene.fog = new THREE.FogExp2(0x0A1128, 0.012);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.4, 4.8);
    camera.lookAt(0, 0.8, -2.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xdef8ff, 1.8);
    keyLight.position.set(4, 8, 5);
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x51E6C4, 0x5E53CC, 0.7);
    scene.add(hemiLight);

    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 80;
      starPos[i + 1] = (Math.random() - 0.5) * 60;
      starPos[i + 2] = -10 - Math.random() * 50;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x51E6C4, size: 0.18, transparent: true, opacity: 0.65 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Observation Platform
    const floorGeo = new THREE.CylinderGeometry(4.5, 5, 0.4, 32);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0e1736, roughness: 0.35, metalness: 0.85 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.2, 2.5);
    scene.add(floor);

    // Geometric Character (Third-Person, Back to Camera)
    const charGroup = new THREE.Group();
    charGroup.position.set(0, 0, 3.2);

    const helmetGeo = new THREE.DodecahedronGeometry(0.24);
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0x141f45, roughness: 0.25, metalness: 0.85 });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.set(0, 1.25, 0);
    charGroup.add(helmet);

    const visorGeo = new THREE.BoxGeometry(0.22, 0.05, 0.06);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x51E6C4 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.25, -0.12);
    charGroup.add(visor);

    const torsoGeo = new THREE.BoxGeometry(0.48, 0.65, 0.28);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x0f1833, roughness: 0.4, metalness: 0.7 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.set(0, 0.75, 0);
    charGroup.add(torso);

    const spineGeo = new THREE.BoxGeometry(0.08, 0.55, 0.05);
    const spineMat = new THREE.MeshBasicMaterial({ color: 0x5E53CC });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(0, 0.78, 0.15);
    charGroup.add(spine);

    scene.add(charGroup);

    // Rectangular Holographic Viewport
    const vpGroup = new THREE.Group();
    vpGroup.position.set(0, 1.2, 0.2);

    const frameOuterGeo = new THREE.BoxGeometry(7.2, 4.2, 0.08);
    const frameEdges = new THREE.EdgesGeometry(frameOuterGeo);
    const frameLineMat = new THREE.LineBasicMaterial({ color: 0x51E6C4, linewidth: 2 });
    const frameLines = new THREE.LineSegments(frameEdges, frameLineMat);
    vpGroup.add(frameLines);

    const paneGeo = new THREE.PlaneGeometry(7.1, 4.1);
    const paneMat = new THREE.MeshPhysicalMaterial({
      color: 0x51E6C4,
      transmission: 0.85,
      opacity: 0.15,
      transparent: true,
      roughness: 0.1
    });
    const pane = new THREE.Mesh(paneGeo, paneMat);
    vpGroup.add(pane);
    scene.add(vpGroup);

    // Planetary System
    const planets = [
      { id: 'spark', name: 'Planeta Spark', color: 0x51E6C4, r: 0.55, ox: 2.6, oy: 1.3, speed: 0.45, chapter: 'Mecánicas Lúdicas & Físicas SGX.Spark' },
      { id: 'story', name: 'Planeta Story', color: 0x5E53CC, r: 0.75, ox: 4.0, oy: 1.8, speed: 0.25, hasRing: true, chapter: 'Narrativa & Manifiesto SGX.Story' },
      { id: 'nexus', name: 'Planeta Nexus', color: 0x51E6C4, r: 0.65, ox: 5.4, oy: 2.2, speed: 0.18, isWire: true, chapter: 'Bóveda de Proyectos de Portafolio' }
    ];

    const planetMeshes = [];
    planets.forEach((p, idx) => {
      const pGroup = new THREE.Group();
      const pGeo = new THREE.SphereGeometry(p.r, 32, 32);
      const pMat = new THREE.MeshStandardMaterial({
        color: p.color,
        roughness: 0.3,
        metalness: 0.6,
        wireframe: !!p.isWire
      });
      const mesh = new THREE.Mesh(pGeo, pMat);
      mesh.userData = p;
      pGroup.add(mesh);

      if (p.hasRing) {
        const ringGeo = new THREE.RingGeometry(p.r * 1.4, p.r * 2.2, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x8C82FF, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI * 0.4;
        pGroup.add(ring);
      }

      scene.add(pGroup);
      planetMeshes.push({ group: pGroup, mesh, data: p, angle: idx * 2 });
    });

    // Raycaster for click selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    window.addEventListener('pointerdown', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const targets = planetMeshes.map(pm => pm.mesh);
      const hits = raycaster.intersectObjects(targets);
      if (hits.length > 0) {
        const p = hits[0].object.userData;
        openDrawer(p);
      }
    });

    const drawer = document.getElementById('portfolio-drawer');
    const drawerContent = document.getElementById('drawer-content');
    function openDrawer(p) {
      drawer.classList.add('active');
      drawerContent.innerHTML = \`
        <h2 style="color: #51E6C4; font-size: 18px; margin-bottom: 8px;">\${p.name}</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-bottom: 16px;">\${p.chapter}</p>
        <div style="background: rgba(255,255,255,0.05); padding: 14px; border-radius: 8px; border-left: 3px solid #51E6C4; margin-bottom: 16px;">
          <strong style="color: #e2e8f0; font-size: 13px;">Exploración del Portafolio:</strong>
          <p style="color: #cbd5e1; font-size: 12px; margin-top: 6px; line-height: 1.5;">
            Este mundo integra la interacción en tiempo real del pilar Spark con la fuerza narrativa de Story. Código optimizado a 60 FPS sin dependencias externas.
          </p>
        </div>
      \`;
    }
    document.getElementById('btn-close-drawer').addEventListener('click', () => {
      drawer.classList.remove('active');
    });

    // Web Audio Synthesizer
    let audioCtx = null;
    document.getElementById('btn-audio').addEventListener('click', () => {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(77.78, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      setTimeout(() => osc.stop(), 3000);
    });

    // 60 FPS Render Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Gentle character breathing
      helmet.position.y = 1.25 + Math.sin(time * 1.5) * 0.015;
      torso.position.y = 0.75 + Math.sin(time * 1.5) * 0.008;

      // Orbit planets
      planetMeshes.forEach(pm => {
        pm.angle += pm.data.speed * delta;
        const x = Math.cos(pm.angle) * pm.data.ox;
        const y = Math.sin(pm.angle) * pm.data.oy + 1.2;
        const z = -2.5 + Math.sin(pm.angle) * 0.6;
        pm.group.position.set(x, y, z);
        pm.mesh.rotation.y += 0.8 * delta;
      });

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>`;
  };

  const handleDownloadSingleFile = () => {
    soundEngine.playClickSound();
    const html = generateSingleFileHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sgx-spark-story-portfolio-single-file.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTelemetryLog('PAQUETE DESCARGADO: SGX Single-File HTML Standalone');
  };

  // Main Three.js Scene Setup & Loop (PBR, RoomEnvironment, Zero-GC, 60 FPS)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Cozy Sci-Fi Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A1128); // Deep space blue #0A1128
    scene.fog = new THREE.FogExp2(0x0A1128, 0.012);

    // 2. Camera Setup (3rd-Person behind the character gazing at the viewport)
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 120);
    camera.position.set(0, 1.45, 5.0);
    const cameraLookTarget = new THREE.Vector3(0, 0.95, -2.5);
    camera.lookAt(cameraLookTarget);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. RoomEnvironment for pristine PBR reflection (Grimoire Cap II & Three.js skill)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig
    // Warm key light
    const keyLight = new THREE.DirectionalLight(0xdef8ff, 1.8);
    keyLight.position.set(4, 7, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cool fill & rim lights in #51E6C4 and #5E53CC
    const hemiLight = new THREE.HemisphereLight(0x51E6C4, 0x5E53CC, 0.65);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x5E53CC, 1.4);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    // 6. Deep Space Particle Dust & Stars (Zero External Files)
    const starCount = 1400;
    const starGeometry = new THREE.BufferGeometry();
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
      const c = pick < 0.45 ? colCyan : pick < 0.85 ? colPurple : colWhite;
      starColors[i3] = c.r;
      starColors[i3 + 1] = c.g;
      starColors[i3 + 2] = c.b;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 7. Observatory Deck (Platform with recessed cybernetic lighting)
    const deckGroup = new THREE.Group();
    deckGroup.position.set(0, 0, 2.8);

    // Hexagonal chamfered floor slab
    const floorGeo = new THREE.CylinderGeometry(4.8, 5.2, 0.45, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0e1736,
      roughness: 0.35,
      metalness: 0.85
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.22, 0);
    floor.receiveShadow = true;
    deckGroup.add(floor);

    // Glowing border inlay ring in #51E6C4
    const ringInlayGeo = new THREE.RingGeometry(4.2, 4.28, 36);
    const ringInlayMat = new THREE.MeshBasicMaterial({
      color: 0x51E6C4,
      side: THREE.DoubleSide
    });
    const ringInlay = new THREE.Mesh(ringInlayGeo, ringInlayMat);
    ringInlay.rotation.x = -Math.PI / 2;
    ringInlay.position.set(0, 0.015, 0);
    deckGroup.add(ringInlay);

    // Secondary purple inlay in #5E53CC
    const ringInlay2Geo = new THREE.RingGeometry(3.6, 3.65, 36);
    const ringInlay2Mat = new THREE.MeshBasicMaterial({
      color: 0x5E53CC,
      side: THREE.DoubleSide
    });
    const ringInlay2 = new THREE.Mesh(ringInlay2Geo, ringInlay2Mat);
    ringInlay2.rotation.x = -Math.PI / 2;
    ringInlay2.position.set(0, 0.016, 0);
    deckGroup.add(ringInlay2);

    // Observation Console / Balustrade Rail
    const railGeo = new THREE.BoxGeometry(2.4, 0.12, 0.35);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x141f45,
      roughness: 0.25,
      metalness: 0.9
    });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(0, 0.86, -0.9);
    rail.castShadow = true;
    deckGroup.add(rail);

    // Console holographic display strip
    const consoleDisplayGeo = new THREE.PlaneGeometry(2.1, 0.08);
    const consoleDisplayMat = new THREE.MeshBasicMaterial({
      color: 0x51E6C4,
      transparent: true,
      opacity: 0.85
    });
    const consoleDisplay = new THREE.Mesh(consoleDisplayGeo, consoleDisplayMat);
    consoleDisplay.rotation.x = -Math.PI * 0.35;
    consoleDisplay.position.set(0, 0.93, -0.88);
    deckGroup.add(consoleDisplay);

    scene.add(deckGroup);

    // 8. Geometric Sci-Fi Character (Third-Person, Back to Camera)
    // Assembled as a composite 8-part procedural model
    const characterGroup = new THREE.Group();
    characterGroup.position.set(0, 0, 3.1);

    // 8a. Faceted Helmet
    const helmetGeo = new THREE.DodecahedronGeometry(0.25, 1);
    const helmetMat = new THREE.MeshStandardMaterial({
      color: 0x121c3b,
      roughness: 0.28,
      metalness: 0.88
    });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.set(0, 1.35, 0);
    helmet.castShadow = true;
    characterGroup.add(helmet);
    stateRef.current.characterHead = helmet;

    // Rear luminescent sensor strip (#51E6C4)
    const sensorStripGeo = new THREE.BoxGeometry(0.2, 0.04, 0.06);
    const sensorStripMat = new THREE.MeshBasicMaterial({ color: 0x51E6C4 });
    const sensorStrip = new THREE.Mesh(sensorStripGeo, sensorStripMat);
    sensorStrip.position.set(0, 1.36, -0.16);
    helmet.add(sensorStrip);

    // 8b. Neck & Collar
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.12, 12);
    const neckMat = new THREE.MeshStandardMaterial({ color: 0x0a1024, roughness: 0.5, metalness: 0.6 });
    const neck = new THREE.Mesh(neckGeo, neckMat);
    neck.position.set(0, 1.18, 0);
    characterGroup.add(neck);

    // 8c. Torso Armor & Cyber Spine
    const torsoGeo = new THREE.BoxGeometry(0.52, 0.68, 0.32);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: 0x0e1736,
      roughness: 0.35,
      metalness: 0.8
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.set(0, 0.82, 0);
    torso.castShadow = true;
    characterGroup.add(torso);

    // Dorsal luminescent power spine in #5E53CC
    const spineGeo = new THREE.BoxGeometry(0.09, 0.58, 0.05);
    const spineMat = new THREE.MeshBasicMaterial({ color: 0x5E53CC });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(0, 0.84, 0.17);
    characterGroup.add(spine);
    stateRef.current.characterSpine = spine;

    // 8d. Shoulder Pauldrons (Left & Right)
    const pauldronGeo = new THREE.BoxGeometry(0.18, 0.22, 0.26);
    const pauldronMat = new THREE.MeshStandardMaterial({
      color: 0x141f45,
      roughness: 0.2,
      metalness: 0.9
    });
    const leftPauldron = new THREE.Mesh(pauldronGeo, pauldronMat);
    leftPauldron.position.set(-0.35, 1.05, 0);
    characterGroup.add(leftPauldron);

    const rightPauldron = new THREE.Mesh(pauldronGeo, pauldronMat);
    rightPauldron.position.set(0.35, 1.05, 0);
    characterGroup.add(rightPauldron);

    // 8e. Cybernetic Arms resting gracefully on the rail
    const armGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.52, 10);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x0a1024, roughness: 0.4, metalness: 0.7 });

    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.rotation.set(-Math.PI * 0.28, 0, Math.PI * 0.08);
    leftArm.position.set(-0.32, 0.78, -0.22);
    characterGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.rotation.set(-Math.PI * 0.28, 0, -Math.PI * 0.08);
    rightArm.position.set(0.32, 0.78, -0.22);
    characterGroup.add(rightArm);

    // 8f. Waist & Cyber Greaves (Lower Body)
    const waistGeo = new THREE.BoxGeometry(0.44, 0.18, 0.28);
    const waistMat = new THREE.MeshStandardMaterial({ color: 0x141f45, roughness: 0.3, metalness: 0.85 });
    const waist = new THREE.Mesh(waistGeo, waistMat);
    waist.position.set(0, 0.42, 0);
    characterGroup.add(waist);

    const legGeo = new THREE.BoxGeometry(0.16, 0.46, 0.2);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x0e1736, roughness: 0.4, metalness: 0.8 });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.16, 0.2, 0);
    characterGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.16, 0.2, 0);
    characterGroup.add(rightLeg);

    scene.add(characterGroup);

    // 9. The Rectangular Holographic Viewport (Framing the Cosmic Vista)
    const viewportGroup = new THREE.Group();
    viewportGroup.position.set(0, 1.25, 0.0);

    const vpWidth = 7.6;
    const vpHeight = 4.4;

    // Outer neon wireframe border
    const vpBoxGeo = new THREE.BoxGeometry(vpWidth, vpHeight, 0.04);
    const vpEdges = new THREE.EdgesGeometry(vpBoxGeo);
    const vpLineMat = new THREE.LineBasicMaterial({
      color: 0x51E6C4,
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });
    const vpLines = new THREE.LineSegments(vpEdges, vpLineMat);
    viewportGroup.add(vpLines);

    // 4 High-tech Corner Brackets in #5E53CC & #51E6C4
    const cornerSize = 0.45;
    const bracketGeo = new THREE.BufferGeometry();
    const bracketPoints = new Float32Array([
      // Top-Left bracket
      -vpWidth / 2 + cornerSize, vpHeight / 2, 0.02,
      -vpWidth / 2, vpHeight / 2, 0.02,
      -vpWidth / 2, vpHeight / 2 - cornerSize, 0.02,
      // Top-Right bracket
      vpWidth / 2 - cornerSize, vpHeight / 2, 0.02,
      vpWidth / 2, vpHeight / 2, 0.02,
      vpWidth / 2, vpHeight / 2 - cornerSize, 0.02,
      // Bottom-Left bracket
      -vpWidth / 2 + cornerSize, -vpHeight / 2, 0.02,
      -vpWidth / 2, -vpHeight / 2, 0.02,
      -vpWidth / 2, -vpHeight / 2 + cornerSize, 0.02,
      // Bottom-Right bracket
      vpWidth / 2 - cornerSize, -vpHeight / 2, 0.02,
      vpWidth / 2, -vpHeight / 2, 0.02,
      vpWidth / 2, -vpHeight / 2 + cornerSize, 0.02,
    ]);
    bracketGeo.setAttribute('position', new THREE.BufferAttribute(bracketPoints, 3));
    const bracketMat = new THREE.LineBasicMaterial({ color: 0x5E53CC, linewidth: 3 });
    const cornerBrackets = new THREE.LineSegments(bracketGeo, bracketMat);
    viewportGroup.add(cornerBrackets);

    // Semi-translucent holographic glass pane
    const glassPaneGeo = new THREE.PlaneGeometry(vpWidth - 0.05, vpHeight - 0.05);
    const glassPaneMat = new THREE.MeshPhysicalMaterial({
      color: 0x51E6C4,
      transmission: 0.92,
      opacity: 0.12,
      transparent: true,
      roughness: 0.08,
      ior: 1.35,
      depthWrite: false
    });
    const glassPane = new THREE.Mesh(glassPaneGeo, glassPaneMat);
    glassPane.position.set(0, 0, 0.01);
    viewportGroup.add(glassPane);

    // Subtle laser grid markers on glass
    const gridHelper = new THREE.GridHelper(vpWidth, 12, 0x51E6C4, 0x5E53CC);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(0, 0, 0.015);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.08;
    viewportGroup.add(gridHelper);

    scene.add(viewportGroup);

    // 10. The Floating Planetary System (Interactive Celestial Bodies)
    stateRef.current.planetsMeshes.clear();
    stateRef.current.planetTargetPositions.clear();

    const planetMeshesList: { group: THREE.Group; mesh: THREE.Mesh; planet: CelestialPlanet }[] = [];

    CELESTIAL_PLANETS.forEach((planet) => {
      const pGroup = new THREE.Group();

      // Planet Sphere Geometry
      const sphereGeo = new THREE.SphereGeometry(planet.radius, 36, 36);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(planet.color),
        roughness: 0.28,
        metalness: 0.65,
        wireframe: !!planet.isWireframe
      });
      const pMesh = new THREE.Mesh(sphereGeo, sphereMat);
      pMesh.castShadow = true;
      pMesh.receiveShadow = true;
      pMesh.userData = { planetId: planet.id, planet };
      pGroup.add(pMesh);

      // Atmospheric Glow Shell
      const glowGeo = new THREE.SphereGeometry(planet.radius * 1.14, 24, 24);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(planet.color),
        transparent: true,
        opacity: 0.18,
        wireframe: true
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      pGroup.add(glowMesh);

      // Celestial Rings if defined (e.g. Planet Story)
      if (planet.hasRings && planet.ringsRadius) {
        const ringGeo = new THREE.RingGeometry(planet.radius * 1.3, planet.ringsRadius, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(planet.secondaryColor),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.55
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI * 0.42;
        ring.rotation.y = Math.PI * 0.1;
        pGroup.add(ring);
      }

      // Orbiting Spark Particles for Planet Spark
      if (planet.domain === 'SPARK') {
        const sparkOrbitGeo = new THREE.BufferGeometry();
        const sparkCount = 32;
        const sparkPositions = new Float32Array(sparkCount * 3);
        for (let s = 0; s < sparkCount; s++) {
          const sTheta = (s / sparkCount) * Math.PI * 2;
          const sDist = planet.radius * 1.45 + (Math.random() - 0.5) * 0.2;
          sparkPositions[s * 3] = Math.cos(sTheta) * sDist;
          sparkPositions[s * 3 + 1] = (Math.random() - 0.5) * 0.3;
          sparkPositions[s * 3 + 2] = Math.sin(sTheta) * sDist;
        }
        sparkOrbitGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
        const sparkMat = new THREE.PointsMaterial({
          color: 0x51E6C4,
          size: 0.08,
          transparent: true,
          opacity: 0.9
        });
        const sparkMesh = new THREE.Points(sparkOrbitGeo, sparkMat);
        pGroup.add(sparkMesh);
      }

      // Data satellite shard for Planet Nexus
      if (planet.domain === 'NEXUS') {
        const shardGeo = new THREE.OctahedronGeometry(0.18);
        const shardMat = new THREE.MeshBasicMaterial({ color: 0x5E53CC, wireframe: true });
        const shard = new THREE.Mesh(shardGeo, shardMat);
        shard.position.set(planet.radius * 1.7, 0.3, 0);
        pGroup.add(shard);
      }

      scene.add(pGroup);
      stateRef.current.planetsMeshes.set(planet.id, pGroup);
      planetMeshesList.push({ group: pGroup, mesh: pMesh, planet });
    });

    // 11. Gravity Shockwave Mesh (Spark mechanic)
    const waveGeo = new THREE.RingGeometry(0.1, 0.25, 64);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x51E6C4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const gravityWave = new THREE.Mesh(waveGeo, waveMat);
    gravityWave.rotation.x = Math.PI / 2;
    gravityWave.position.set(0, 1.2, 0);
    gravityWave.visible = false;
    scene.add(gravityWave);
    stateRef.current.gravityWave = gravityWave;

    // 12. Mouse / Touch Pointer Tracking & Raycasting
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      stateRef.current.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      stateRef.current.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      onPointerMove(e);
      stateRef.current.raycaster.setFromCamera(stateRef.current.pointer, camera);

      const hitTargets = planetMeshesList.map((item) => item.mesh);
      const intersects = stateRef.current.raycaster.intersectObjects(hitTargets, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const planetData = hit.object.userData.planet as CelestialPlanet;
        if (planetData) {
          handleSelectPlanet(planetData);
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);

    // 13. High-Performance 60 FPS Render Loop (Zero GC)
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const _vec = new THREE.Vector3();
    const _targetPos = new THREE.Vector3();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();
      const speedMult = stateRef.current.orbitSpeedFactor;

      // Subtle gentle breathing & idle swaying of character
      if (characterGroup) {
        const breath = Math.sin(time * 1.4) * 0.012;
        characterGroup.position.y = breath;
        if (stateRef.current.characterHead) {
          // Head subtly tracks mouse pointer X
          stateRef.current.characterHead.rotation.y = THREE.MathUtils.damp(
            stateRef.current.characterHead.rotation.y,
            -stateRef.current.pointer.x * 0.28,
            4,
            delta
          );
        }
      }

      // Viewport subtle ambient floating
      if (viewportGroup) {
        viewportGroup.position.y = 1.25 + Math.sin(time * 0.8) * 0.025;
      }

      // Orbital calculation for planets
      planetMeshesList.forEach((item, index) => {
        const { group, mesh, planet } = item;
        const currentAngle = planet.orbitAngle + time * planet.orbitSpeed * 0.45 * speedMult;

        // Position along elliptical orbit inside & through the viewport
        const x = Math.cos(currentAngle) * planet.orbitRadiusX;
        const y = Math.sin(currentAngle) * planet.orbitRadiusY + 1.25;
        const z = -2.6 + Math.sin(currentAngle * 0.8) * 0.85;

        _targetPos.set(x, y, z);
        group.position.copy(_targetPos);
        stateRef.current.planetTargetPositions.set(planet.id, _targetPos.clone());

        // Self rotation
        mesh.rotation.y += 0.65 * delta;

        // Check if selected or hovered to pulse subtle scale
        const isSelected = stateRef.current.selectedPlanetId === planet.id;
        const isHovered = stateRef.current.hoveredPlanetId === planet.id;
        const targetScale = isSelected ? 1.2 : isHovered ? 1.12 : 1.0;
        mesh.scale.setScalar(THREE.MathUtils.damp(mesh.scale.x, targetScale, 6, delta));
      });

      // Raycast pointer hover check (throttled smoothly)
      if (stateRef.current.pointer.x > -2) {
        stateRef.current.raycaster.setFromCamera(stateRef.current.pointer, camera);
        const hitTargets = planetMeshesList.map((item) => item.mesh);
        const intersects = stateRef.current.raycaster.intersectObjects(hitTargets, false);

        if (intersects.length > 0) {
          const hovered = intersects[0].object.userData.planet as CelestialPlanet;
          if (hovered && hovered.id !== stateRef.current.hoveredPlanetId) {
            stateRef.current.hoveredPlanetId = hovered.id;
            setHoveredPlanet(hovered);
          }
        } else if (stateRef.current.hoveredPlanetId !== null) {
          stateRef.current.hoveredPlanetId = null;
          setHoveredPlanet(null);
        }
      }

      // Gravity shockwave expansion (Spark mechanic)
      if (stateRef.current.gravityWaveActive && stateRef.current.gravityWave) {
        stateRef.current.gravityWaveRadius += delta * 12;
        const scale = stateRef.current.gravityWaveRadius;
        stateRef.current.gravityWave.scale.set(scale, scale, scale);
        stateRef.current.gravityWave.visible = true;

        const mat = stateRef.current.gravityWave.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 1 - scale / 14);

        if (scale > 14) {
          stateRef.current.gravityWaveActive = false;
          stateRef.current.gravityWave.visible = false;
        }
      }

      // Smooth camera interpolation towards selected planet
      if (stateRef.current.selectedPlanetId) {
        const targetPos = stateRef.current.planetTargetPositions.get(stateRef.current.selectedPlanetId);
        if (targetPos) {
          cameraLookTarget.x = THREE.MathUtils.damp(cameraLookTarget.x, targetPos.x * 0.35, 3, delta);
          cameraLookTarget.y = THREE.MathUtils.damp(cameraLookTarget.y, targetPos.y * 0.4 + 0.6, 3, delta);
          camera.lookAt(cameraLookTarget);
        }
      } else {
        cameraLookTarget.x = THREE.MathUtils.damp(cameraLookTarget.x, 0, 3, delta);
        cameraLookTarget.y = THREE.MathUtils.damp(cameraLookTarget.y, 0.95, 3, delta);
        camera.lookAt(cameraLookTarget);
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup (Capítulo II.4 del Grimorio SGX: Desechar geometrías y texturas)
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [handleSelectPlanet]);

  // Sync orbitSpeedFactor to ref
  useEffect(() => {
    stateRef.current.orbitSpeedFactor = orbitSpeedFactor;
  }, [orbitSpeedFactor]);

  // Handle transmission send
  const handleSendTransmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    soundEngine.playPulseSound();
    setTransmissionSent(true);
    setTelemetryLog('TRANSMISIÓN INTERESTELAR ENCRIPTADA >> ENVIADA CON ÉXITO');
    setTimeout(() => {
      setMessageText('');
      setSenderEmail('');
      setTransmissionSent(false);
    }, 4500);
  };

  return (
    <div className="relative w-full h-full min-h-full flex flex-col bg-[#0A1128] text-slate-100 overflow-hidden select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 cursor-crosshair" />

      {/* Top Left Minimalist Spec Badge (Three.js Directive: Unobstructed Center) */}
      <div className="absolute top-4 left-6 z-20 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2.5 bg-[#0e1736]/85 border border-[#51E6C4]/35 px-4 py-2 rounded-lg backdrop-blur-md pointer-events-auto shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-[#51E6C4] shadow-[0_0_8px_#51E6C4]" />
          <span className="text-xs font-bold text-white font-heading tracking-wide">
            SHOWCASE × SYSTEM
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-xs font-mono-telemetry text-[#51E6C4]">
            60 FPS · 3RA PERSONA
          </span>
        </div>

        {/* Telemetry Status Line */}
        <div className="text-[11px] font-mono-telemetry text-slate-400 bg-[#0e1736]/70 px-3 py-1 rounded border border-[#5E53CC]/30 self-start pointer-events-auto">
          {telemetryLog}
        </div>
      </div>

      {/* Top Right Quick Actions (Single-File HTML & Ambient Audio) */}
      <div className="absolute top-4 right-6 z-20 flex items-center gap-2.5">
        <button
          onClick={handleDownloadSingleFile}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#51E6C4]/15 border border-[#51E6C4]/50 text-[#51E6C4] hover:bg-[#51E6C4] hover:text-[#0A1128] transition-all shadow-md"
          title="Descargar el portafolio completo en un solo archivo index.html listo para navegador"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Descargar Single-File</span>
        </button>

        <button
          onClick={() => setIsSingleFileModalOpen(true)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#5E53CC]/20 border border-[#5E53CC]/50 text-[#b8b1ff] hover:bg-[#5E53CC] hover:text-white transition-all shadow-md"
          title="Ver código Vanilla JS/CSS Single-File optimizado a 60 FPS"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Código Vanilla</span>
        </button>

        <button
          onClick={toggleAmbientDrone}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            isDroneActive
              ? 'bg-[#51E6C4] text-[#0A1128] border-[#51E6C4]'
              : 'bg-[#0e1736]/85 text-slate-300 border-[#51E6C4]/30 hover:border-[#51E6C4]'
          }`}
          title="Activar drone armónico acogedor Web Audio (Eb2 / Bb2)"
        >
          {isDroneActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isDroneActive ? 'Drone Activo' : 'Audio Drone'}</span>
        </button>
      </div>

      {/* Planet Hover Telemetry Tooltip */}
      {hoveredPlanet && !selectedPlanet && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-[#0e1736]/90 border border-[#51E6C4]/60 px-5 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: hoveredPlanet.color, boxShadow: `0 0 10px ${hoveredPlanet.color}` }}
          />
          <div>
            <div className="text-xs font-bold text-white font-heading">
              {hoveredPlanet.name.toUpperCase()} · {hoveredPlanet.subtitle}
            </div>
            <div className="text-[11px] text-slate-400 font-mono-telemetry">
              Clic para revelar capítulo de portafolio
            </div>
          </div>
        </div>
      )}

      {/* Unified Bottom Control Dock (Three.js Directive 5: Zero Viewport Occlusion) */}
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-30 transition-transform duration-300 max-w-[94vw] ${
          isHUDCollapsed ? 'translate-y-[calc(100%+20px)]' : 'translate-y-0'
        }`}
      >
        {/* Toggle Collapse Tab */}
        <button
          onClick={() => setIsHUDCollapsed(!isHUDCollapsed)}
          className="absolute -top-7 right-6 text-[10px] font-mono-telemetry tracking-wider bg-[#0e1736]/95 border border-[#51E6C4]/40 text-[#51E6C4] hover:text-white px-3 py-1 rounded-t-lg backdrop-blur-md shadow-lg"
        >
          {isHUDCollapsed ? '▴ MOSTRAR CONTROLES' : '▾ MODO ZEN'}
        </button>

        <div className="bg-[#0e1736]/92 border border-[#51E6C4]/40 px-5 py-3 rounded-2xl backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-4">
          {/* Planet Switcher Quick Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono-telemetry text-slate-400 mr-1.5 hidden md:inline">
              PLANETAS:
            </span>
            {CELESTIAL_PLANETS.map((planet) => {
              const isSelected = selectedPlanet?.id === planet.id;
              return (
                <button
                  key={planet.id}
                  onClick={() => handleSelectPlanet(planet)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#51E6C4] text-[#0A1128] font-bold shadow-[0_0_12px_rgba(81,230,196,0.5)]'
                      : 'bg-[#141f45]/70 text-slate-300 hover:text-white hover:bg-[#141f45]'
                  }`}
                  style={{
                    borderLeft: `3px solid ${planet.color}`
                  }}
                >
                  <span>{planet.name.replace('Planeta ', '')}</span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Spark Interactive Mechanics Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLaunchProbe}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#51E6C4]/15 border border-[#51E6C4]/40 text-[#51E6C4] hover:bg-[#51E6C4] hover:text-[#0A1128] transition-all"
              title="Lanzar sonda de reconocimiento hacia el planeta objetivo"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Sonda ({probesCount})</span>
            </button>

            <button
              onClick={handleGravityPulse}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#5E53CC]/20 border border-[#5E53CC]/40 text-[#b8b1ff] hover:bg-[#5E53CC] hover:text-white transition-all"
              title="Disparar pulso gravitacional resonante"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Pulso</span>
            </button>

            {/* Orbit Speed Selector */}
            <div className="flex items-center gap-1 bg-[#141f45]/80 p-1 rounded-lg border border-slate-700">
              {[0.4, 1.0, 2.2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    setOrbitSpeedFactor(spd);
                    soundEngine.playClickSound();
                  }}
                  className={`px-2 py-0.5 text-[10px] rounded font-mono-telemetry transition-colors ${
                    orbitSpeedFactor === spd
                      ? 'bg-[#51E6C4] text-[#0A1128] font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd === 0.4 ? 'Zen' : spd === 1.0 ? '1x' : 'Warp'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Story Drawer / Modal for Selected Planet */}
      {selectedPlanet && (
        <div className="fixed top-16 right-6 bottom-24 w-[460px] max-w-[calc(100vw-3rem)] z-40 bg-[#0e1736]/96 border border-[#51E6C4]/45 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0A1128]/70">
            <div className="flex items-center gap-3">
              <div
                className="w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: selectedPlanet.color, boxShadow: `0 0 10px ${selectedPlanet.color}` }}
              />
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  {selectedPlanet.name}
                </h3>
                <p className="text-xs text-[#51E6C4] font-mono-telemetry">
                  {selectedPlanet.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedPlanet(null);
                stateRef.current.selectedPlanetId = null;
                soundEngine.playClickSound();
              }}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chapter Navigation Tabs */}
          <div className="flex border-b border-slate-800/80 bg-[#141f45]/50 px-3 overflow-x-auto">
            {CELESTIAL_PLANETS.map((planet) => (
              <button
                key={planet.id}
                onClick={() => handleSelectPlanet(planet)}
                className={`py-2 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-all ${
                  selectedPlanet.id === planet.id
                    ? 'border-[#51E6C4] text-[#51E6C4] font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Cap. {planet.chapterNumber}
              </button>
            ))}
          </div>

          {/* Drawer Body (Scrollytelling & Portfolio Content) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300 leading-relaxed">
            {/* CHAPTER 1: SPARK */}
            {selectedPlanet.domain === 'SPARK' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-[#51E6C4]/10 border-l-4 border-[#51E6C4] p-4 rounded-r-lg">
                  <h4 className="text-xs font-bold text-[#51E6C4] font-heading tracking-wider uppercase mb-1">
                    Capítulo I: La Chispa Mecánica (SGX.Spark)
                  </h4>
                  <p className="text-xs text-slate-300">
                    "La gravedad y la cinemática no son restricciones matemáticas; son el pulso que convierte una pantalla pasiva en una extensión del tacto humano."
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-bold text-white mb-2">Filosofía de Fricción Cero</h5>
                  <p className="text-xs text-slate-300 mb-3">
                    En este portafolio, cada interacción está calculada con bucles a 60 FPS garantizados vía <code className="text-[#51E6C4] bg-slate-900 px-1 py-0.5 rounded">requestAnimationFrame</code>, contención estricta de inputs de teclado/mouse y gestión de memoria GPU con <code className="text-[#51E6C4] bg-slate-900 px-1 py-0.5 rounded">.dispose()</code> para erradicar cualquier fuga de memoria.
                  </p>
                </div>

                {/* Interactive Kinetic Gravity Simulator Playground */}
                <div className="bg-[#141f45]/70 border border-[#51E6C4]/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-heading">
                      Micro-Simulador Gravitatorio
                    </span>
                    <span className="text-[10px] font-mono-telemetry text-[#51E6C4]">
                      60 FPS LIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Interactúa con el campo de gravedad pulsando los comandos o lanzando una sonda física al viewport:
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleLaunchProbe}
                      className="flex-1 py-2 text-xs font-bold rounded-lg bg-[#51E6C4] text-[#0A1128] hover:bg-[#51E6C4]/90 transition-all text-center"
                    >
                      Lanzar Sonda a Órbita
                    </button>
                    <button
                      onClick={handleGravityPulse}
                      className="flex-1 py-2 text-xs font-bold rounded-lg bg-[#5E53CC] text-white hover:bg-[#5E53CC]/90 transition-all text-center"
                    >
                      Onda Gravitacional
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-sm font-bold text-white">Capacidades del Motor Spark</h5>
                  <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300">
                    <li>Detección de colisiones OBB y esferas continuas sin túnel cuántico.</li>
                    <li>Sintetizador Web Audio sin latencia de red (cero archivos .mp3/wav externos).</li>
                    <li>Física exponencial suave con amortiguamiento <code className="text-[#51E6C4]">damp</code>.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* CHAPTER 2: STORY */}
            {selectedPlanet.domain === 'STORY' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-[#5E53CC]/15 border-l-4 border-[#5E53CC] p-4 rounded-r-lg">
                  <h4 className="text-xs font-bold text-[#b8b1ff] font-heading tracking-wider uppercase mb-1">
                    Capítulo II: Las Crónicas del Viajero (SGX.Story)
                  </h4>
                  <p className="text-xs text-slate-300">
                    "Un portafolio no es una lista de enlaces; es el diario de navegación de un ingeniero que aprendió a construir mundos donde la ciencia ficción se siente como el hogar."
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-bold text-white">El Viaje del Creador</h5>
                  <p className="text-xs text-slate-300">
                    Formado en la intersección de la arquitectura espacial, el diseño algorítmico y los sistemas gráficos en tiempo real. Este observador en tercera persona representa la mirada contemplativa: el creador que no compite con el espectador, sino que contempla junto a él la inmensidad del código vivo.
                  </p>
                  <p className="text-xs text-slate-300">
                    Bajo el <strong>Grimorio V2026.5</strong>, cada componente respeta la paz visual: fondo azul profundo <span className="text-[#51E6C4] font-mono-telemetry">#0A1128</span>, acentos turquesa y morado equilibrados, y ausencia total de ruido parpadeante o distracciones innecesarias.
                  </p>
                </div>

                <div className="bg-[#141f45]/70 border border-[#5E53CC]/40 rounded-xl p-4 space-y-2">
                  <h6 className="text-xs font-bold text-[#b8b1ff] font-heading">
                    Manifiesto de Arquitectura Espacial
                  </h6>
                  <p className="text-xs text-slate-300">
                    1. Fricción cero en el navegador: todo carga en menos de 1 segundo.<br/>
                    2. Belleza matemática con geometrías PBR limpias.<br/>
                    3. Integración orgánica de música procedural y sonido cinemático.
                  </p>
                </div>
              </div>
            )}

            {/* CHAPTER 3: NEXUS (SHOWCASE / PROJECTS) */}
            {selectedPlanet.domain === 'NEXUS' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-[#51E6C4]/10 border-l-4 border-[#51E6C4] p-4 rounded-r-lg">
                  <h4 className="text-xs font-bold text-[#51E6C4] font-heading tracking-wider uppercase mb-1">
                    Capítulo III: Bóveda de Obras (Proyectos Espaciales)
                  </h4>
                  <p className="text-xs text-slate-300">
                    Selección de proyectos emblemáticos que fusionan interactividad en 3D, interfaces cinematográficas y arquitecturas de alto rendimiento.
                  </p>
                </div>

                {/* Project 1 */}
                <div className="bg-[#141f45]/80 border border-slate-700/80 rounded-xl p-4 space-y-2.5 hover:border-[#51E6C4]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-white">01. Omni-Canvas Holodeck</h5>
                    <span className="text-[10px] font-mono-telemetry text-[#51E6C4] bg-[#51E6C4]/15 px-2 py-0.5 rounded">
                      THREE.JS · PBR
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Entorno 3D con iluminación de estudio RoomEnvironment oficial, navegación orbital fluida y renderizado de materiales dieléctricos y metálicos sin caídas de frame.
                  </p>
                  <div className="flex gap-2 text-[11px] font-mono-telemetry text-slate-400">
                    <span>• 60 FPS Estable</span>
                    <span>• Carga Blob CORS-Free</span>
                  </div>
                </div>

                {/* Project 2 */}
                <div className="bg-[#141f45]/80 border border-slate-700/80 rounded-xl p-4 space-y-2.5 hover:border-[#5E53CC]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-white">02. Aetheria Kinetic Runner</h5>
                    <span className="text-[10px] font-mono-telemetry text-[#b8b1ff] bg-[#5E53CC]/20 px-2 py-0.5 rounded">
                      GAME ENGINE · AUDIO
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Juego de plataformas cinemático con motor de rotación angular de cubos, orbes elásticos gravitatorios y síntesis de audio retro en tiempo real.
                  </p>
                  <div className="flex gap-2 text-[11px] font-mono-telemetry text-slate-400">
                    <span>• Web Audio Osciladores</span>
                    <span>• Cero Dependencias</span>
                  </div>
                </div>

                {/* Project 3 */}
                <div className="bg-[#141f45]/80 border border-slate-700/80 rounded-xl p-4 space-y-2.5 hover:border-[#51E6C4]/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-white">03. Celestial Scrollytelling Engine</h5>
                    <span className="text-[10px] font-mono-telemetry text-[#51E6C4] bg-[#51E6C4]/15 px-2 py-0.5 rounded">
                      SCROLLYTELLING
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Sistema de capítulos narrativos en parallax con modulación de opacidad mediante transforms del compositor, asegurando lectura fluida en móviles y escritorio.
                  </p>
                </div>
              </div>
            )}

            {/* CHAPTER 4: MATRIX (TECH STACK & ARCHITECTURE) */}
            {selectedPlanet.domain === 'MATRIX' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-[#6366F1]/15 border-l-4 border-[#6366F1] p-4 rounded-r-lg">
                  <h4 className="text-xs font-bold text-[#b8b1ff] font-heading tracking-wider uppercase mb-1">
                    Capítulo IV: El Grimorio Técnico & Competencias
                  </h4>
                  <p className="text-xs text-slate-300">
                    Dominio exhaustivo de tecnologías de vanguardia web, gráficos espaciales y cloud computing.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Three.js / WebGL / Shaders GLSL', pct: '98%', color: '#51E6C4' },
                    { label: 'TypeScript / React / Arquitectura Frontend', pct: '95%', color: '#5E53CC' },
                    { label: 'Web Audio API / Síntesis Sonora Procedural', pct: '92%', color: '#51E6C4' },
                    { label: 'Optimización GPU & 60 FPS Profiling', pct: '96%', color: '#6366F1' },
                    { label: 'Firebase / Firestore / Cloud Datastores', pct: '90%', color: '#51E6C4' },
                  ].map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-200 font-medium">{skill.label}</span>
                        <span className="font-mono-telemetry text-[#51E6C4]">{skill.pct}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0A1128] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: skill.pct, backgroundColor: skill.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-[#141f45]/70 border border-slate-700 rounded-xl">
                  <h5 className="text-xs font-bold text-white font-heading mb-2">
                    Leyes de Conformidad SGX
                  </h5>
                  <p className="text-xs text-slate-400">
                    ✓ Bypass CORS 100% garantizado con Blob URLs locales.<br/>
                    ✓ Cero dependencias npm en distribución Vanilla Single-File.<br/>
                    ✓ Respeto absoluto del viewport central sin oclusiones molestas.
                  </p>
                </div>
              </div>
            )}

            {/* CHAPTER 5: BEACON (TRANSMISSION & CONTACT) */}
            {selectedPlanet.domain === 'BEACON' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-[#51E6C4]/10 border-l-4 border-[#51E6C4] p-4 rounded-r-lg">
                  <h4 className="text-xs font-bold text-[#51E6C4] font-heading tracking-wider uppercase mb-1">
                    Capítulo V: Canal de Transmisión Directa
                  </h4>
                  <p className="text-xs text-slate-300">
                    ¿Tienes una visión para un proyecto de ciencia ficción, una experiencia web 3D o una misión tecnológica? Establece contacto inmediato.
                  </p>
                </div>

                {transmissionSent ? (
                  <div className="p-6 bg-[#51E6C4]/15 border border-[#51E6C4] rounded-xl text-center space-y-2 animate-in zoom-in-95">
                    <CheckCircle2 className="w-8 h-8 text-[#51E6C4] mx-auto" />
                    <h5 className="text-sm font-bold text-white font-heading">
                      TRANSMISIÓN ENCRIPTADA
                    </h5>
                    <p className="text-xs text-slate-300">
                      Tu mensaje ha sido enrutado a través de la baliza cósmica hacia el creador.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSendTransmission} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Tu Señal de Origen (Correo o Identificador):
                      </label>
                      <input
                        type="email"
                        required
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        placeholder="viajero@cosmos.org"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-[#0A1128] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#51E6C4]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Mensaje o Propuesta de Misión:
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Saludos desde el observatorio. Me gustaría colaborar en..."
                        className="w-full px-3 py-2 text-xs rounded-lg bg-[#0A1128] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#51E6C4] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-lg bg-[#51E6C4] text-[#0A1128] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#51E6C4]/90 transition-all shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmitir Señal Interestelar</span>
                    </button>
                  </form>
                )}

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Canal PGP Activo</span>
                  <div className="flex gap-3">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#51E6C4] transition-colors"
                    >
                      GitHub
                    </a>
                    <a
                      href="mailto:creator@spatialgineers.com"
                      className="hover:text-[#51E6C4] transition-colors"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Ver Código Vanilla JS/CSS Single-File */}
      {isSingleFileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0e1736] border border-[#51E6C4]/40 w-full max-w-4xl max-h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0A1128]/80">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#51E6C4]" />
                <h3 className="text-sm font-bold text-white font-heading">
                  Código Fuente Vanilla JS/CSS Single-File (Grimorio V2026.5)
                </h3>
              </div>
              <button
                onClick={() => setIsSingleFileModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#070c1e] text-[11px] font-mono-telemetry text-slate-300 flex-1 overflow-y-auto">
              <pre className="whitespace-pre-wrap select-text">{generateSingleFileHtml()}</pre>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-[#0A1128]/90">
              <span className="text-xs text-slate-400">
                100% autocontenido · Cero instalaciones Node.js · Ejecutable con doble clic
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generateSingleFileHtml());
                    soundEngine.playClickSound();
                    setTelemetryLog('CÓDIGO COPIADO AL PORTAPAPELES');
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#5E53CC]/30 border border-[#5E53CC] text-white hover:bg-[#5E53CC] transition-colors"
                >
                  Copiar Todo el Código
                </button>
                <button
                  onClick={handleDownloadSingleFile}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[#51E6C4] text-[#0A1128] hover:bg-[#51E6C4]/90 transition-colors"
                >
                  Descargar Archivo HTML
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
