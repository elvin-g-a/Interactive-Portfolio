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
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { soundEngine } from '../../services/sound-effects';
import {
  Send,
  CheckCircle2,
  X,
  RotateCw
} from 'lucide-react';

interface ShowcaseSystemPortfolioModuleProps {
  onOpenRemix: () => void;
  isMuted: boolean;
}

// Portfolio Chapters linked to Celestial Bodies (Static Positions per "Posiciones de Planetas.png")
export interface CelestialPlanet {
  id: string;
  name: string;
  subtitle: string;
  domain: 'SPARK' | 'STORY' | 'NEXUS' | 'MATRIX' | 'BEACON';
  color: string;
  secondaryColor: string;
  radius: number;
  screenX: number;
  screenY: number;
  hasRings?: boolean;
  ringsRadius?: number;
  isWireframe?: boolean;
  description: string;
  chapterNumber: number;
  modelFile: string;
  fallbackModelUrl: string;
  modelName: string;
}

const CELESTIAL_PLANETS: CelestialPlanet[] = [
  {
    id: 'planet-spark',
    name: 'Planeta Spark',
    subtitle: 'El Crisol · Motor Interactivo & Físicas',
    domain: 'SPARK',
    color: '#E06D53',
    secondaryColor: '#51E6C4',
    radius: 0.68,
    screenX: 0.7294,
    screenY: 0.6810,
    description: 'Mecánicas de fricción cero, bucles de simulación a 60 FPS y gamificación interactiva.',
    chapterNumber: 1,
    modelFile: '/models/mars.glb',
    fallbackModelUrl: 'https://static.wixstatic.com/3d/06361e_58d95a433d44426aa5a65ad4c19b447c.glb',
    modelName: 'mars.glb'
  },
  {
    id: 'planet-story',
    name: 'Planeta Story',
    subtitle: 'El Archivo · Crónicas & Manifiesto',
    domain: 'STORY',
    color: '#D8C39D',
    secondaryColor: '#8C82FF',
    radius: 0.72,
    screenX: 0.4948,
    screenY: 0.4741,
    hasRings: true,
    ringsRadius: 1.35,
    description: 'Narrativa cinemática, la travesía del arquitecto creador y el diseño con alma humana.',
    chapterNumber: 2,
    modelFile: '/models/saturn.glb',
    fallbackModelUrl: 'https://static.wixstatic.com/3d/06361e_e1bdc16d3c47453193f9fa07c26d7c96.glb',
    modelName: 'saturn.glb'
  },
  {
    id: 'planet-nexus',
    name: 'Planeta Nexus',
    subtitle: 'La Bóveda · Proyectos & Obras Insignia',
    domain: 'NEXUS',
    color: '#4A90E2',
    secondaryColor: '#51E6C4',
    radius: 0.66,
    screenX: 0.7258,
    screenY: 0.3199,
    isWireframe: false,
    description: 'Colección de aplicaciones espaciales interactivas, herramientas creativas y gemelos digitales.',
    chapterNumber: 3,
    modelFile: '/models/earth.glb',
    fallbackModelUrl: 'https://static.wixstatic.com/3d/06361e_1bd1dd160e044c68b253c3a864854dcd.glb',
    modelName: 'earth.glb'
  },
  {
    id: 'planet-matrix',
    name: 'Planeta Matrix',
    subtitle: 'El Bastión · Stack Tecnológico & Arcana',
    domain: 'MATRIX',
    color: '#41729F',
    secondaryColor: '#51E6C4',
    radius: 0.65,
    screenX: 0.2484,
    screenY: 0.7093,
    description: 'Maestría en Three.js, shaders GLSL, arquitecturas full-stack y optimización GPU.',
    chapterNumber: 4,
    modelFile: '/models/neptune.glb',
    fallbackModelUrl: 'https://static.wixstatic.com/3d/06361e_a4fdaaedd8124afa93ccd77bdcc6f0c8.glb',
    modelName: 'neptune.glb'
  },
  {
    id: 'planet-beacon',
    name: 'Planeta Beacon',
    subtitle: 'El Faro · Enlace & Transmisión',
    domain: 'BEACON',
    color: '#A0A0A0',
    secondaryColor: '#FFFFFF',
    radius: 0.63,
    screenX: 0.2529,
    screenY: 0.3157,
    description: 'Canal directo de contacto, colaboración profesional y disponibilidad de misiones.',
    chapterNumber: 5,
    modelFile: '/models/moon.glb',
    fallbackModelUrl: 'https://static.wixstatic.com/3d/06361e_6ac838581067467e921a0510f23a427f.glb',
    modelName: 'moon.glb'
  }
];

export const ShowcaseSystemPortfolioModule: React.FC<ShowcaseSystemPortfolioModuleProps> = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // UI States
  const [selectedPlanet, setSelectedPlanet] = useState<CelestialPlanet | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [transmissionSent, setTransmissionSent] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');

  // References to keep mutable 3D state out of re-render closures
  const stateRef = useRef({
    selectedPlanetId: null as string | null,
    hoveredPlanetId: null as string | null,
    pointer: new THREE.Vector2(-9999, -9999),
    raycaster: new THREE.Raycaster(),
    planetsMeshes: new Map<string, THREE.Group>(),
    planetTargetPositions: new Map<string, THREE.Vector3>(),
    gravityWave: null as THREE.Mesh | null,
    gravityWaveRadius: 0,
    gravityWaveActive: false
  });

  // Emit probe signal sound (Spark mechanic)
  const handleLaunchProbe = useCallback(() => {
    soundEngine.playProbeLaunchSound();
  }, []);

  // Trigger gravity pulse (Spark mechanic)
  const handleGravityPulse = useCallback(() => {
    soundEngine.playPulseSound();
    if (stateRef.current.gravityWave && stateRef.current.selectedPlanetId) {
      const selectedPos = stateRef.current.planetTargetPositions.get(stateRef.current.selectedPlanetId);
      if (selectedPos) {
        stateRef.current.gravityWave.position.copy(selectedPos);
      }
    }
    stateRef.current.gravityWaveActive = true;
    stateRef.current.gravityWaveRadius = 0.5;
  }, []);

  // Select planet
  const handleSelectPlanet = useCallback((planet: CelestialPlanet) => {
    setSelectedPlanet(planet);
    stateRef.current.selectedPlanetId = planet.id;
    soundEngine.playPlanetResonance(planet.chapterNumber);
  }, []);

  // Close selected planet on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && stateRef.current.selectedPlanetId) {
        setSelectedPlanet(null);
        stateRef.current.selectedPlanetId = null;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Main Three.js Scene Setup & Loop (PBR, RoomEnvironment, Zero-GC, 60 FPS)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;

    const getSafeDimensions = () => {
      const rawW = container.clientWidth || window.innerWidth || document.documentElement.clientWidth || 1280;
      const rawH = container.clientHeight || window.innerHeight || document.documentElement.clientHeight || 720;
      return {
        width: Math.max(Math.round(rawW), 1),
        height: Math.max(Math.round(rawH), 1)
      };
    };

    // Dimensions (guaranteed >= 1 so aspect ratio is never NaN/0)
    const { width, height } = getSafeDimensions();

    // 1. Scene & Cozy Sci-Fi Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A1128); // Deep space blue #0A1128
    scene.fog = new THREE.FogExp2(0x0A1128, 0.012);

    // 2. Camera Setup: Fixed Reference Home Pose + Live Animated Camera
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

    const currentCamPos = HOME_CAM_POS.clone();
    const currentLookTarget = HOME_LOOK_TARGET.clone();
    const _desiredCamPos = HOME_CAM_POS.clone();
    const _desiredLookTarget = HOME_LOOK_TARGET.clone();
    const _axisWorldPos = new THREE.Vector3();

    // 3. WebGL Renderer with Software-WebGL Guard & Fallback Safety
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = (probe.getContext('webgl2') || probe.getContext('webgl')) as WebGLRenderingContext | null;
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

    let renderer: THREE.WebGLRenderer;
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
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const handleContextLost = (event: Event) => {
      event.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. RoomEnvironment for pristine PBR reflection (wrapped safely for all GPU drivers)
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch (envErr) {
      console.warn('PMREM environment fallback active:', envErr);
    }

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x8fa8ff, 0.38);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xdef8ff, 1.85);
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

    // Cool fill & rim lights in #51E6C4 and #5E53CC
    const hemiLight = new THREE.HemisphereLight(0x51E6C4, 0x5E53CC, 0.72);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x5E53CC, 1.35);
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
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      fog: false
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 7. Static Planetary System (5 Interactive Celestial GLB Bodies anchored to "Posiciones de Planetas.png")
    stateRef.current.planetsMeshes.clear();
    stateRef.current.planetTargetPositions.clear();

    interface Planet3DItem {
      group: THREE.Group;
      hitMesh: THREE.Mesh;
      rotAxis: THREE.Object3D;
      planet: CelestialPlanet;
      baseScale: number;
      loadedModel?: THREE.Group;
    }

    const planetMeshesList: Planet3DItem[] = [];
    const planetById = new Map<string, Planet3DItem>();
    const hitTargets: THREE.Object3D[] = [];
    const gltfLoader = new GLTFLoader();

    CELESTIAL_PLANETS.forEach((planet) => {
      const pGroup = new THREE.Group();

      // Invisible spherical hit proxy for accurate raycast selection
      const hitRadiusFactor = planet.hasRings ? 1.45 : 1.15;
      const hitGeo = new THREE.SphereGeometry(planet.radius * hitRadiusFactor, 16, 16);
      const hitMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { planetId: planet.id, planet };
      pGroup.add(hitMesh);
      hitTargets.push(hitMesh);

      // Default rotator axis group while GLB streams
      const defaultRotAxis = new THREE.Group();
      defaultRotAxis.name = 'rotation_axis';
      pGroup.add(defaultRotAxis);

      // High-performance placeholder sphere while GLB streams
      const placeholderGeo = new THREE.SphereGeometry(planet.radius, 28, 28);
      const placeholderMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(planet.color),
        roughness: 0.45,
        metalness: 0.1
      });
      const placeholderMesh = new THREE.Mesh(placeholderGeo, placeholderMat);
      defaultRotAxis.add(placeholderMesh);

      scene.add(pGroup);
      stateRef.current.planetsMeshes.set(planet.id, pGroup);

      const item: Planet3DItem = {
        group: pGroup,
        hitMesh,
        rotAxis: defaultRotAxis,
        planet,
        baseScale: 1.0
      };
      planetMeshesList.push(item);
      planetById.set(planet.id, item);

      // Asynchronous GLB Loader (Local asset with Wix CDN fallback)
      const onModelLoaded = (gltf: { scene: THREE.Group }) => {
        if (isDisposed) return;

        defaultRotAxis.remove(placeholderMesh);
        placeholderGeo.dispose();
        placeholderMat.dispose();

        const modelScene = gltf.scene;
        modelScene.updateMatrixWorld(true);

        // Locate existing 'rotation_axis' node in the GLTF file
        const modelRotAxis = modelScene.getObjectByName('rotation_axis');
        if (modelRotAxis) {
          // Normalize non-uniform Empty display scale while preserving authored position & orientation
          modelRotAxis.scale.set(1, 1, 1);
          modelScene.updateMatrixWorld(true);

          // Reparent sibling meshes (Sphere, and Torus rings for Saturn) into rotation_axis preserving relative transforms
          const otherChildren = [...modelScene.children].filter((c) => c !== modelRotAxis);
          otherChildren.forEach((child) => {
            modelRotAxis.attach(child);
          });

          pGroup.remove(defaultRotAxis);
          pGroup.add(modelScene);
          item.rotAxis = modelRotAxis;
        } else {
          defaultRotAxis.add(modelScene);
          item.rotAxis = defaultRotAxis;
        }

        modelScene.scale.setScalar(planet.radius);
        modelScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        item.loadedModel = modelScene;
      };

      gltfLoader.load(
        planet.modelFile,
        (gltf) => onModelLoaded(gltf),
        undefined,
        (err) => {
          console.warn(`Local model load failed for ${planet.name}, trying CDN:`, err);
          gltfLoader.load(
            planet.fallbackModelUrl,
            (gltf) => onModelLoaded(gltf),
            undefined,
            (cdnErr) => console.error(`Failed to load ${planet.name} from CDN:`, cdnErr)
          );
        }
      );
    });

    // Compute exact static 3D world positions from homeCamera so zooming & resizing never shift planet coordinates
    const PLANE_DEPTH = 8.0;
    const _camSpacePos = new THREE.Vector3();

    const updateStaticPlanetLayout = () => {
      const safeAspect = Number.isFinite(camera.aspect) && camera.aspect > 0 ? camera.aspect : 16 / 9;
      homeCamera.aspect = safeAspect;
      homeCamera.updateProjectionMatrix();
      homeCamera.updateMatrixWorld(true);

      const halfHeight = PLANE_DEPTH * Math.tan(THREE.MathUtils.degToRad(homeCamera.fov * 0.5));
      const halfWidth = halfHeight * safeAspect;
      const responsiveScale = THREE.MathUtils.clamp(safeAspect / 1.6, 0.65, 1.0);

      planetMeshesList.forEach((item) => {
        const ndcX = item.planet.screenX * 2 - 1;
        const ndcY = 1 - item.planet.screenY * 2;

        _camSpacePos.set(ndcX * halfWidth, ndcY * halfHeight, -PLANE_DEPTH);
        _camSpacePos.applyMatrix4(homeCamera.matrixWorld);

        item.group.position.copy(_camSpacePos);
        item.baseScale = responsiveScale;
        if (!Number.isFinite(item.group.scale.x) || item.group.scale.x <= 0.01) {
          item.group.scale.setScalar(responsiveScale);
        }
        stateRef.current.planetTargetPositions.set(item.planet.id, _camSpacePos.clone());
      });
    };

    updateStaticPlanetLayout();

    // 8. Gravity Shockwave Mesh (Spark mechanic)
    const waveGeo = new THREE.RingGeometry(0.1, 0.25, 64);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x51E6C4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const gravityWave = new THREE.Mesh(waveGeo, waveMat);
    gravityWave.rotation.x = Math.PI / 2;
    gravityWave.position.set(0, 0.85, -2.5);
    gravityWave.visible = false;
    scene.add(gravityWave);
    stateRef.current.gravityWave = gravityWave;

    // 9. Mouse / Touch Pointer Tracking & Raycasting
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

      const intersects = stateRef.current.raycaster.intersectObjects(hitTargets, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const planetData = hit.object.userData.planet as CelestialPlanet;
        if (planetData) {
          handleSelectPlanet(planetData);
        }
      } else if (stateRef.current.selectedPlanetId !== null) {
        setSelectedPlanet(null);
        stateRef.current.selectedPlanetId = null;
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);

    // 10. High-Performance 60 FPS Render Loop (Zero GC, Static Planet Positions + Smooth Zoom to rotation_axis)
    let frameId = 0;
    let isTimerFrame = false;
    const clock = new THREE.Clock();
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
    const CAM_ZOOM_LAMBDA = 4.8;

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext | null;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            isTimerFrame = true;
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            isTimerFrame = true;
            frameId = window.setTimeout(cb, 80);
          }
        };
        isTimerFrame = true;
        frameId = window.setTimeout(poll, 5);
      } else {
        isTimerFrame = true;
        frameId = window.setTimeout(cb, 80);
      }
    };

    const renderLoop = () => {
      if (isDisposed) return;

      const rawDelta = clock.getDelta();
      const delta = Number.isFinite(rawDelta) ? Math.min(Math.max(rawDelta, 0), 0.1) : 0.016;

      // Planets hold static positions and rotate continuously relative to their local 'rotation_axis'
      planetMeshesList.forEach((item) => {
        const { group, rotAxis, planet, baseScale } = item;

        // Continuous dextrorso (clockwise) spin around the model's local rotation_axis
        if (rotAxis) {
          rotAxis.rotateY(-0.65 * delta);
        }

        // Tactile scale response when hovered or selected while keeping static coordinates
        const isSelected = stateRef.current.selectedPlanetId === planet.id;
        const isPlanetHovered = stateRef.current.hoveredPlanetId === planet.id;
        const safeBase = Number.isFinite(baseScale) && baseScale > 0 ? baseScale : 1.0;
        const targetScale = safeBase * (isSelected ? 1.14 : isPlanetHovered ? 1.08 : 1.0);
        const nextScale =
          Number.isFinite(group.scale.x) && group.scale.x > 0
            ? THREE.MathUtils.damp(group.scale.x, targetScale, 6, delta)
            : targetScale;
        group.scale.setScalar(nextScale);
      });

      // Camera Zoom-In toward selected planet's 'rotation_axis' (keeping top of planet visible inside CRT overlay)
      // and smooth return to original camera pose when menu closes
      const activeId = stateRef.current.selectedPlanetId;
      const selectedItem = activeId ? planetById.get(activeId) : undefined;

      if (selectedItem) {
        selectedItem.group.updateMatrixWorld(true);
        selectedItem.rotAxis.getWorldPosition(_axisWorldPos);

        const vw = Math.max(container.clientWidth || window.innerWidth || 1280, 1);
        const aspect = Number.isFinite(camera.aspect) && camera.aspect > 0 ? camera.aspect : 16 / 9;
        const activeScale = (Number.isFinite(selectedItem.baseScale) ? selectedItem.baseScale : 1.0) * 1.14;
        const sphereWorldRadius = selectedItem.planet.radius * activeScale;
        const vertWorldRadius = sphereWorldRadius * 1.08;
        const horizWorldRadius = selectedItem.planet.hasRings
          ? sphereWorldRadius * 1.86
          : sphereWorldRadius * 1.05;

        let targetScreenX: number;
        let targetScreenY: number;
        let maxVertScreenRadius: number;
        let maxHorizScreenRadius: number;

        if (vw >= 640) {
          // Frame cleanly in the unobstructed CRT glass left of the open right-side panel,
          // guaranteeing the top of the planet stays well below the top CRT bezel (~14.5%)
          const leftSafe = 0.11;
          const drawerRightPx = 24;
          const drawerWidthPx = Math.min(390, vw * 0.44);
          const drawerLeftFrac = Math.min(0.89, 1.0 - (drawerRightPx + drawerWidthPx) / vw);
          const rightSafe = Math.max(0.36, drawerLeftFrac - 0.025);

          targetScreenX = THREE.MathUtils.clamp((leftSafe + rightSafe) * 0.5, 0.28, 0.41);
          targetScreenY = 0.51;
          maxVertScreenRadius = 0.27; // Top edge >= 0.24 (well inside CRT overlay top bezel at ~0.145)
          maxHorizScreenRadius = Math.max(
            0.13,
            Math.min(targetScreenX - leftSafe, rightSafe - targetScreenX) * 0.92
          );
        } else {
          targetScreenX = 0.34;
          targetScreenY = 0.48;
          maxVertScreenRadius = 0.22;
          maxHorizScreenRadius = 0.22;
        }

        const minHalfHVert = vertWorldRadius / (2 * maxVertScreenRadius);
        const minHalfHHoriz = horizWorldRadius / (2 * maxHorizScreenRadius * aspect);
        const zoomDist = Math.max(minHalfHVert / tanHalfFov, minHalfHHoriz / tanHalfFov, 2.5);

        const halfH = zoomDist * tanHalfFov;
        const halfW = halfH * aspect;
        const ndcX = targetScreenX * 2 - 1;
        const ndcY = 1 - targetScreenY * 2;

        // Shift camera ray parallel to home basis so 'rotation_axis' projects cleanly to (targetScreenX, targetScreenY)
        _desiredLookTarget
          .copy(_axisWorldPos)
          .addScaledVector(_homeRight, -ndcX * halfW)
          .addScaledVector(_homeUp, -ndcY * halfH);

        _desiredCamPos
          .copy(_desiredLookTarget)
          .addScaledVector(_homeBack, zoomDist);
      } else {
        _desiredCamPos.copy(HOME_CAM_POS);
        _desiredLookTarget.copy(HOME_LOOK_TARGET);
      }

      if (!Number.isFinite(currentCamPos.x) || !Number.isFinite(currentCamPos.y) || !Number.isFinite(currentCamPos.z)) {
        currentCamPos.copy(_desiredCamPos);
      } else {
        currentCamPos.x = THREE.MathUtils.damp(currentCamPos.x, _desiredCamPos.x, CAM_ZOOM_LAMBDA, delta);
        currentCamPos.y = THREE.MathUtils.damp(currentCamPos.y, _desiredCamPos.y, CAM_ZOOM_LAMBDA, delta);
        currentCamPos.z = THREE.MathUtils.damp(currentCamPos.z, _desiredCamPos.z, CAM_ZOOM_LAMBDA, delta);
      }

      if (!Number.isFinite(currentLookTarget.x) || !Number.isFinite(currentLookTarget.y) || !Number.isFinite(currentLookTarget.z)) {
        currentLookTarget.copy(_desiredLookTarget);
      } else {
        currentLookTarget.x = THREE.MathUtils.damp(currentLookTarget.x, _desiredLookTarget.x, CAM_ZOOM_LAMBDA, delta);
        currentLookTarget.y = THREE.MathUtils.damp(currentLookTarget.y, _desiredLookTarget.y, CAM_ZOOM_LAMBDA, delta);
        currentLookTarget.z = THREE.MathUtils.damp(currentLookTarget.z, _desiredLookTarget.z, CAM_ZOOM_LAMBDA, delta);
      }

      camera.position.copy(currentCamPos);
      camera.lookAt(currentLookTarget);

      // Raycast pointer hover check
      if (stateRef.current.pointer.x > -2) {
        stateRef.current.raycaster.setFromCamera(stateRef.current.pointer, camera);
        const intersects = stateRef.current.raycaster.intersectObjects(hitTargets, false);

        if (intersects.length > 0) {
          const hovered = intersects[0].object.userData.planet as CelestialPlanet;
          if (hovered && hovered.id !== stateRef.current.hoveredPlanetId) {
            stateRef.current.hoveredPlanetId = hovered.id;
            setIsHovered(true);
          }
        } else if (stateRef.current.hoveredPlanetId !== null) {
          stateRef.current.hoveredPlanetId = null;
          setIsHovered(false);
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

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(renderLoop);
      } else {
        isTimerFrame = false;
        frameId = requestAnimationFrame(renderLoop);
      }
    };

    renderLoop();

    // Resize Handler (keeps static planet positions aligned with the CRT overlay across aspect ratios)
    const handleResize = () => {
      if (!container || isDisposed) return;
      const rawW = container.clientWidth || window.innerWidth;
      const rawH = container.clientHeight || window.innerHeight;
      if (!rawW || !rawH || rawW <= 0 || rawH <= 0) return;
      const w = Math.round(rawW);
      const h = Math.round(rawH);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, true);
      updateStaticPlanetLayout();
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup (Capítulo II.4 del Grimorio SGX: Desechar geometrías y texturas)
    return () => {
      isDisposed = true;
      if (isTimerFrame) {
        clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

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

  // Handle transmission send
  const handleSendTransmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    soundEngine.playPulseSound();
    setTransmissionSent(true);
    setTimeout(() => {
      setMessageText('');
      setSenderEmail('');
      setTransmissionSent(false);
    }, 4500);
  };

  return (
    <div className="relative w-full h-full min-h-full text-slate-100 select-none">
      {/* 3D WebGL Canvas Container (z-10: underneath the z-30 CRT overlay, above the page background) */}
      <div
        ref={mountRef}
        className={`fixed inset-0 w-screen h-screen z-10 overflow-hidden ${isHovered ? 'cursor-pointer' : 'cursor-crosshair'}`}
      />

      {/* Portfolio Story Drawer / Modal for Selected Planet (z-50: above the z-30 CRT overlay on the right side) */}
      {selectedPlanet && (
        <div className="fixed top-4 bottom-4 right-4 sm:top-6 sm:bottom-6 sm:right-6 w-[390px] max-w-[calc(100vw-2rem)] sm:max-w-[44vw] z-50 bg-[#0e1736]/95 border border-[#51E6C4]/45 rounded-2xl shadow-2xl flex flex-col overflow-hidden select-none">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#0A1128]/90">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#51E6C4] shadow-[0_0_10px_#51E6C4]" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-heading">
                    {selectedPlanet.name}
                  </h3>
                  <span className="text-[10px] font-mono-telemetry px-2 py-0.5 rounded bg-[#5E53CC]/30 border border-[#5E53CC]/50 text-[#b8b1ff]">
                    {selectedPlanet.modelName}
                  </span>
                </div>
                <p className="text-xs text-[#51E6C4] font-mono-telemetry flex items-center gap-1.5 mt-0.5">
                  <span>{selectedPlanet.subtitle}</span>
                  <span className="text-[10px] text-slate-400">·</span>
                  <span className="text-[10px] text-emerald-400 font-mono-telemetry flex items-center gap-1">
                    <RotateCw className="w-2.5 h-2.5 animate-spin [animation-duration:6s]" />
                    eje rotation_axis (Dextrorso)
                  </span>
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
                      Emitir Pulso de Sonda
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
                    { label: 'Three.js / WebGL / Shaders GLSL', pct: '98%', barClass: 'w-[98%] bg-[#51E6C4]' },
                    { label: 'TypeScript / React / Arquitectura Frontend', pct: '95%', barClass: 'w-[95%] bg-[#5E53CC]' },
                    { label: 'Web Audio API / Síntesis Sonora Procedural', pct: '92%', barClass: 'w-[92%] bg-[#51E6C4]' },
                    { label: 'Optimización GPU & 60 FPS Profiling', pct: '96%', barClass: 'w-[96%] bg-[#6366F1]' },
                    { label: 'Firebase / Firestore / Cloud Datastores', pct: '90%', barClass: 'w-[90%] bg-[#51E6C4]' },
                  ].map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-200 font-medium">{skill.label}</span>
                        <span className="font-mono-telemetry text-[#51E6C4]">{skill.pct}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0A1128] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${skill.barClass}`} />
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
    </div>
  );
};
