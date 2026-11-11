/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO SGX.Spark × SGX.Story: Portafolio Interactivo del Observador Cósmico
 * Arquitectura Three.js PBR a 60 FPS · Ciencia Ficción Acogedora (#0A1128, #51E6C4, #5E53CC)
 * Personaje geométrico en 3ra persona observando Viewport rectangular y planetas interactivos.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { soundEngine } from '../../services/sound-effects';
import {
  VERTICAL_VIEWPORT_MEDIA_QUERY,
  MOBILE_ONLY_MEDIA_QUERY,
  TABLET_LANDSCAPE_MEDIA_QUERY,
  MOBILE_SELECTED_OVERLAY_SHIFT_PNG,
  isMobileOrTabletViewport,
  isMobileOnlyViewport,
  isTabletLandscapeViewport
} from '../../config/sgx-config';
import {
  GALLERY_ARTWORKS,
  GALLERY_CATEGORIES,
  GalleryArtworkItem,
  GalleryCategoryId
} from '../../config/gallery-exhibition';
import {
  Maximize2,
  X
} from 'lucide-react';

interface ShowcaseSystemPortfolioModuleProps {
  onOpenRemix: () => void;
  isMuted: boolean;
  isVerticalLayout?: boolean;
  isMobileOnly?: boolean;
  isDesktopOrTabletLandscape?: boolean;
  isMobileOrTabletDevice?: boolean;
  onPlanetSelectionChange?: (hasSelectedPlanet: boolean) => void;
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
  verticalScreenX: number;
  verticalScreenY: number;
  hasRings?: boolean;
  ringsRadius?: number;
  isWireframe?: boolean;
  description: string;
  chapterNumber: number;
  modelFile: string;
  fallbackModelUrl: string;
}

const CELESTIAL_PLANETS: CelestialPlanet[] = [
  {
    id: 'planet-story',
    name: 'Introducción',
    subtitle: 'Bienvenida & Visión del Portafolio',
    domain: 'STORY',
    color: '#D8C39D',
    secondaryColor: '#8C82FF',
    radius: 0.72,
    screenX: 0.4948,
    screenY: 0.4741,
    verticalScreenX: 0.3912,
    verticalScreenY: 0.4953,
    hasRings: true,
    ringsRadius: 1.35,
    description: 'Bienvenida al portafolio espacial de Elvin G. Andrades bajo los pilares de SGX.Showcase y SGX.System.',
    chapterNumber: 1,
    modelFile: '/models/saturn.glb',
    fallbackModelUrl: 'https://static.wixstatic.com/3d/06361e_968472237ff14ce49099d980a5fb9467.glb'
  },
  {
    id: 'planet-nexus',
    name: 'Juegos',
    subtitle: 'Experiencias Interactivas & Videojuegos',
    domain: 'NEXUS',
    color: '#4A90E2',
    secondaryColor: '#51E6C4',
    radius: 0.66,
    screenX: 0.7258,
    screenY: 0.3199,
    verticalScreenX: 0.6894,
    verticalScreenY: 0.3302,
    isWireframe: false,
    description: 'Mazescape y experiencias interactivas jugables.',
    chapterNumber: 2,
    modelFile: '/models/earth.glb',
    fallbackModelUrl: 'https://static.wixstatic.com/3d/06361e_04dd2853553440ca9c08d03ef60aa335.glb'
  },
  {
    id: 'planet-beacon',
    name: 'Galería',
    subtitle: 'Archivo Visual & Exhibición Espacial',
    domain: 'BEACON',
    color: '#A0A0A0',
    secondaryColor: '#FFFFFF',
    radius: 0.63,
    screenX: 0.2529,
    screenY: 0.3157,
    verticalScreenX: 0.3458,
    verticalScreenY: 0.2104,
    description: 'Exhibición visual y canal de exploración creativa.',
    chapterNumber: 3,
    modelFile: '/models/moon.glb',
    fallbackModelUrl: 'https://static.wixstatic.com/3d/06361e_edab7517a8a94eb0a249f502dd4b21f2.glb'
  },
  {
    id: 'planet-matrix',
    name: 'Biografía',
    subtitle: 'Arte Digital, Diseño 3D & UI · Spatialgineers',
    domain: 'MATRIX',
    color: '#41729F',
    secondaryColor: '#51E6C4',
    radius: 0.65,
    screenX: 0.2529,
    screenY: 0.6810,
    verticalScreenX: 0.3505,
    verticalScreenY: 0.7823,
    description: 'Diseñador de personajes, texturas y UV para modelos 3D, logos e interfaces de usuario (UI); Initiate en Spatialgineers.',
    chapterNumber: 4,
    modelFile: '/models/neptune.glb',
    fallbackModelUrl: 'https://static.wixstatic.com/3d/06361e_3852ab5e10ff4120975dd5b5d3a0ef12.glb'
  },
  {
    id: 'planet-spark',
    name: 'Contactos',
    subtitle: 'Mensaje Directo & Redes Sociales',
    domain: 'SPARK',
    color: '#E06D53',
    secondaryColor: '#51E6C4',
    radius: 0.68,
    screenX: 0.7294,
    screenY: 0.6810,
    verticalScreenX: 0.6653,
    verticalScreenY: 0.6688,
    description: 'Contacto directo por correo electrónico y seguimiento de proyectos actuales en redes sociales.',
    chapterNumber: 5,
    modelFile: '/models/mars.glb',
    fallbackModelUrl: 'https://static.wixstatic.com/3d/06361e_eccac59d52044676884a981e435e7c7d.glb'
  }
];

const SHARED_LANDSCAPE_MII_GIF_CLASS =
  'block mx-auto w-auto h-[clamp(96px,calc(100dvh-515px),320px)] [@media(max-height:680px)]:h-[clamp(88px,calc(100dvh-435px),240px)] [@media(max-height:500px)]:h-[clamp(72px,calc(100dvh-335px),170px)] max-w-full object-contain';

export const ShowcaseSystemPortfolioModule: React.FC<ShowcaseSystemPortfolioModuleProps> = ({
  isVerticalLayout = false,
  isMobileOnly = false,
  isDesktopOrTabletLandscape = false,
  isMobileOrTabletDevice = false,
  onPlanetSelectionChange
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const planetTabsRef = useRef<HTMLDivElement | null>(null);
  const planetTabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const drawerBodyRef = useRef<HTMLDivElement | null>(null);

  // UI States
  const [selectedPlanet, setSelectedPlanet] = useState<CelestialPlanet | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState<GalleryCategoryId>(GalleryCategoryId.ALL);
  const [activeArtwork, setActiveArtwork] = useState<GalleryArtworkItem | null>(null);
  const [introGifError, setIntroGifError] = useState<boolean>(false);
  const [bioGifError, setBioGifError] = useState<boolean>(false);
  const [bioPhotoError, setBioPhotoError] = useState<boolean>(false);
  const [gamesCoverError, setGamesCoverError] = useState<boolean>(false);

  // Reset drawer body scroll position to top whenever switching planets
  useEffect(() => {
    if (drawerBodyRef.current) {
      drawerBodyRef.current.scrollTop = 0;
    }
  }, [selectedPlanet?.id]);

  // Reveal active planet tab inside the horizontal tab scroller without scrolling outer containers
  useEffect(() => {
    if (!selectedPlanet) return;
    const container = planetTabsRef.current;
    const activeTab = planetTabRefs.current.get(selectedPlanet.id);
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
  }, [selectedPlanet, isMobileOrTabletDevice]);

  const handlePlanetTabsWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.scrollWidth <= container.clientWidth) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      container.scrollLeft += e.deltaY;
    }
  }, []);

  // Notify parent overlay whenever planet selection changes (for mobile overlay shift)
  useEffect(() => {
    onPlanetSelectionChange?.(selectedPlanet !== null);
  }, [selectedPlanet, onPlanetSelectionChange]);

  useEffect(() => {
    return () => {
      onPlanetSelectionChange?.(false);
    };
  }, [onPlanetSelectionChange]);

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

  // Select planet
  const handleSelectPlanet = useCallback((planet: CelestialPlanet) => {
    setSelectedPlanet(planet);
    stateRef.current.selectedPlanetId = planet.id;
    soundEngine.playPlanetResonance(planet.chapterNumber);
  }, []);

  // Close artwork viewer first on Escape, otherwise close selected planet
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Escape') return;
      if (activeArtwork) {
        e.stopImmediatePropagation();
        setActiveArtwork(null);
        soundEngine.playClickSound();
        return;
      }
      if (stateRef.current.selectedPlanetId) {
        setSelectedPlanet(null);
        stateRef.current.selectedPlanetId = null;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeArtwork]);

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
      scene.environmentIntensity = 0.5;
      pmremGenerator.dispose();
    } catch (envErr) {
      console.warn('PMREM environment fallback active:', envErr);
    }

    // 5. Studio Lighting Rig (reduced by half for softer, non-overblown planet model brightness)
    const ambientLight = new THREE.AmbientLight(0x8fa8ff, 0.19);
    scene.add(ambientLight);

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

    // Cool fill & rim lights in #51E6C4 and #5E53CC (reduced by half)
    const hemiLight = new THREE.HemisphereLight(0x51E6C4, 0x5E53CC, 0.36);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x5E53CC, 0.675);
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
      const { width: vw, height: vh } = getSafeDimensions();
      const safeAspect = Number.isFinite(camera.aspect) && camera.aspect > 0 ? camera.aspect : vw / vh;
      homeCamera.aspect = safeAspect;
      homeCamera.updateProjectionMatrix();
      homeCamera.updateMatrixWorld(true);

      const halfHeight = PLANE_DEPTH * Math.tan(THREE.MathUtils.degToRad(homeCamera.fov * 0.5));
      const halfWidth = halfHeight * safeAspect;
      const isVerticalMode = isMobileOrTabletViewport();

      if (isVerticalMode) {
        // Mobile & Tablet Portrait: 1920x1920 vertical overlay is anchored at left:0, top:0 with height = vh (no stretching).
        // Its left 1080x1920 region matches "Posiciones de Planetas Vertical.png" (9:16 portrait CRT).
        const minFullVerticalCrtAspect = 960 / 1920;
        const refFrameWidth =
          vw >= vh * minFullVerticalCrtAspect ? vh * (1080 / 1920) : vw * (1080 / 960);
        const responsiveScale = THREE.MathUtils.clamp(refFrameWidth / vh, 0.44, 0.5625);

        planetMeshesList.forEach((item) => {
          const screenFracX = (item.planet.verticalScreenX * refFrameWidth) / vw;
          const screenFracY = item.planet.verticalScreenY;
          const ndcX = screenFracX * 2 - 1;
          const ndcY = 1 - screenFracY * 2;

          _camSpacePos.set(ndcX * halfWidth, ndcY * halfHeight, -PLANE_DEPTH);
          _camSpacePos.applyMatrix4(homeCamera.matrixWorld);

          item.group.position.copy(_camSpacePos);
          item.baseScale = responsiveScale;
          const activeFactor = stateRef.current.selectedPlanetId === item.planet.id ? 1.14 : 1.0;
          item.group.scale.setScalar(responsiveScale * activeFactor);
          stateRef.current.planetTargetPositions.set(item.planet.id, _camSpacePos.clone());
        });
      } else if (isTabletLandscapeViewport()) {
        // Tablet Landscape: 2880x1080 overlay renders at height = vh with its 1920x1080 main CRT composition centered at 50vw.
        const frameWidth = vh * (16 / 9);
        const frameOffsetX = (vw - frameWidth) * 0.5;
        const responsiveScale = THREE.MathUtils.clamp((vw / vh) / (16 / 9), 0.84, 1.0);

        planetMeshesList.forEach((item) => {
          const screenFracX = (frameOffsetX + item.planet.screenX * frameWidth) / vw;
          const screenFracY = item.planet.screenY;
          const ndcX = screenFracX * 2 - 1;
          const ndcY = 1 - screenFracY * 2;

          _camSpacePos.set(ndcX * halfWidth, ndcY * halfHeight, -PLANE_DEPTH);
          _camSpacePos.applyMatrix4(homeCamera.matrixWorld);

          item.group.position.copy(_camSpacePos);
          item.baseScale = responsiveScale;
          const activeFactor = stateRef.current.selectedPlanetId === item.planet.id ? 1.14 : 1.0;
          item.group.scale.setScalar(responsiveScale * activeFactor);
          stateRef.current.planetTargetPositions.set(item.planet.id, _camSpacePos.clone());
        });
      } else {
        // Desktop + Mobile Landscape: 2880x1080 overlay is anchored at left:0, top:0 with height = vh (no fit-to-screen stretching).
        // Its left 1920x1080 region holds the exact CRT window from "Posiciones de Planetas.png".
        const minFullCrtAspect = 1560 / 1080;
        const refFrameWidth = vw >= vh * minFullCrtAspect ? vh * (16 / 9) : vw * (1920 / 1560);
        const responsiveScale = THREE.MathUtils.clamp((refFrameWidth / vh) / (16 / 9), 0.68, 1.0);

        planetMeshesList.forEach((item) => {
          const screenFracX = (item.planet.screenX * refFrameWidth) / vw;
          const screenFracY = item.planet.screenY;
          const ndcX = screenFracX * 2 - 1;
          const ndcY = 1 - screenFracY * 2;

          _camSpacePos.set(ndcX * halfWidth, ndcY * halfHeight, -PLANE_DEPTH);
          _camSpacePos.applyMatrix4(homeCamera.matrixWorld);

          item.group.position.copy(_camSpacePos);
          item.baseScale = responsiveScale;
          const activeFactor = stateRef.current.selectedPlanetId === item.planet.id ? 1.14 : 1.0;
          item.group.scale.setScalar(responsiveScale * activeFactor);
          stateRef.current.planetTargetPositions.set(item.planet.id, _camSpacePos.clone());
        });
      }
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

    // 9. Mouse / Touch Pointer Tracking & Raycasting (bounded to the transparent CRT window of the active left-aligned overlay)
    const isPointerInsideCrtGlass = (
      localX: number,
      localY: number,
      rectWidth: number,
      rectHeight: number
    ) => {
      if (isMobileOrTabletViewport()) {
        const scale = Math.max(rectHeight, 1) / 1920;
        const shiftPx =
          isMobileOnlyViewport() && stateRef.current.selectedPlanetId !== null
            ? MOBILE_SELECTED_OVERLAY_SHIFT_PNG * scale
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
      const overlayOffsetX = isTabletLandscapeViewport() ? rectWidth * 0.5 - 960 * scale : 0;
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

    let pointerInGlass = false;

    const onPointerMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      let clientX: number;
      let clientY: number;
      if ('touches' in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      pointerInGlass = isPointerInsideCrtGlass(localX, localY, rect.width, rect.height);
      stateRef.current.pointer.x = (localX / Math.max(rect.width, 1)) * 2 - 1;
      stateRef.current.pointer.y = -(localY / Math.max(rect.height, 1)) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent | MouseEvent | TouchEvent) => {
      onPointerMove(e);

      if (!pointerInGlass) {
        if (stateRef.current.selectedPlanetId !== null) {
          setSelectedPlanet(null);
          stateRef.current.selectedPlanetId = null;
        }
        return;
      }

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

    container.addEventListener('pointermove', onPointerMove);
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

        // Continuous dextrorso (clockwise) spin: 40 seconds per full revolution (2 * PI / 40 rad/s)
        if (rotAxis) {
          rotAxis.rotateY(-((Math.PI * 2) / 40) * delta);
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

        const { width: vw, height: vh } = getSafeDimensions();
        const aspect = Number.isFinite(camera.aspect) && camera.aspect > 0 ? camera.aspect : vw / vh;
        const activeScale = (Number.isFinite(selectedItem.baseScale) ? selectedItem.baseScale : 1.0) * 1.14;
        const sphereWorldRadius = selectedItem.planet.radius * activeScale;
        const vertWorldRadius = sphereWorldRadius * 1.1;
        const horizWorldRadius = selectedItem.planet.hasRings
          ? sphereWorldRadius * 1.58
          : sphereWorldRadius * 1.08;

        const isVerticalMode = isMobileOrTabletViewport();
        let targetScreenX: number;
        let targetScreenY: number;
        let maxVertScreenRadius: number;
        let maxHorizScreenRadius: number;
        let maxZoomDist = 7.0;

        if (isVerticalMode) {
          // Mobile & Tablet Portrait (1920x1920 vertical overlay anchored at left:0, top:0 with height = vh).
          // CRT glass spans x = [141..938] * (vh/1920) and y = [165..1754] * (vh/1920).
          const overlayScale = vh / 1920;

          if (!isMobileOnlyViewport()) {
            // Tablet Portrait: extended right wall hosts the planet panel; move camera right (+_homeRight)
            // so the zoomed planet frames on the left side of the CRT glass with its top clearly visible.
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

            targetScreenX = THREE.MathUtils.clamp(
              THREE.MathUtils.lerp(leftSafe, rightSafe, 0.46),
              0.22,
              0.36
            );
            targetScreenY = 0.46;
            maxVertScreenRadius = 0.18; // Top edge >= 0.28 (clearly visible below top CRT bezel at ~0.086)
            maxHorizScreenRadius = Math.max(
              0.15,
              Math.min(targetScreenX - leftSafe, rightSafe - targetScreenX) * 0.9
            );
            maxZoomDist = 5.8;
          } else {
            // Mobile Portrait: vertical overlay shifts left by MOBILE_SELECTED_OVERLAY_SHIFT_PNG * (vh/1920),
            // giving the right-aligned panel (~61vw) extra room while shifting the camera right (+_homeRight)
            // so the corresponding planet and its top edge remain clearly visible in the left CRT window.
            const shiftPx = MOBILE_SELECTED_OVERLAY_SHIFT_PNG * overlayScale;
            const crtSafeLeftPx = Math.max(6, 141 * overlayScale - shiftPx + 3);
            const drawerRightPx = 10; // right-2.5
            const drawerWidthPx = Math.min(vw - 104, vw * 0.61);
            const panelSafeLeftPx = vw - drawerRightPx - drawerWidthPx - 4;

            const leftSafe = THREE.MathUtils.clamp(crtSafeLeftPx / vw, 0.02, 0.12);
            const rightSafe = THREE.MathUtils.clamp(panelSafeLeftPx / vw, leftSafe + 0.18, 0.42);

            targetScreenX = THREE.MathUtils.clamp(
              THREE.MathUtils.lerp(leftSafe, rightSafe, 0.5),
              0.15,
              0.25
            );
            targetScreenY = 0.45;
            maxVertScreenRadius = 0.16; // Top edge >= 0.29 (well below top CRT bezel at ~0.086)
            maxHorizScreenRadius = Math.max(
              0.14,
              Math.min(targetScreenX - leftSafe, rightSafe - targetScreenX) * 1.06
            );
            maxZoomDist = 6.5;
          }
        } else {
          // Desktop + Mobile/Tablet Landscape: 2880x1080 overlay renders with height = vh (scale = vh / 1080),
          // left-aligned on Desktop & Mobile Landscape and horizontally centered at 50vw on Tablet Landscape.
          const overlayScale = vh / 1080;
          const overlayOffsetX = isTabletLandscapeViewport() ? vw * 0.5 - 960 * overlayScale : 0;
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

          // Move camera to the right (+_homeRight) so the zoomed planet frames on the left-center
          // of the unobstructed CRT window, leaving space on the right for the panel that appears.
          targetScreenX = THREE.MathUtils.clamp(
            THREE.MathUtils.lerp(leftSafe, rightSafe, 0.43),
            0.22,
            0.39
          );
          targetScreenY = 0.49;
          maxVertScreenRadius = 0.25; // Top edge >= 0.24 (clearly visible below top CRT bezel at ~0.12)
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

        // Shift camera + lookTarget to the right (+_homeRight since ndcX < 0) parallel to home basis
        // so 'rotation_axis' projects to (targetScreenX, targetScreenY) with top of planet visible
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

      // Raycast pointer hover check (only through transparent CRT glass)
      if (pointerInGlass && stateRef.current.pointer.x > -2) {
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
      } else if (stateRef.current.hoveredPlanetId !== null) {
        stateRef.current.hoveredPlanetId = null;
        setIsHovered(false);
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

    // Resize & Orientation Handler (keeps static planet positions aligned with the active CRT overlay)
    let orientationRafId = 0;
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
    const handleOrientationChange = () => {
      handleResize();
      cancelAnimationFrame(orientationRafId);
      orientationRafId = requestAnimationFrame(handleResize);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    const viewportMediaQuery = window.matchMedia(VERTICAL_VIEWPORT_MEDIA_QUERY);
    const mobileMediaQuery = window.matchMedia(MOBILE_ONLY_MEDIA_QUERY);
    const tabletLandscapeMediaQuery = window.matchMedia(TABLET_LANDSCAPE_MEDIA_QUERY);
    viewportMediaQuery.addEventListener('change', handleResize);
    mobileMediaQuery.addEventListener('change', handleResize);
    tabletLandscapeMediaQuery.addEventListener('change', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup (Capítulo II.4 del Grimorio SGX: Desechar geometrías y texturas)
    return () => {
      isDisposed = true;
      cancelAnimationFrame(orientationRafId);
      if (isTimerFrame) {
        clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      viewportMediaQuery.removeEventListener('change', handleResize);
      mobileMediaQuery.removeEventListener('change', handleResize);
      tabletLandscapeMediaQuery.removeEventListener('change', handleResize);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
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

  const handleOpenArtwork = useCallback((artwork: GalleryArtworkItem) => {
    setActiveArtwork(artwork);
    soundEngine.playClickSound();
  }, []);

  const handleCloseArtwork = useCallback(() => {
    setActiveArtwork(null);
    soundEngine.playClickSound();
  }, []);

  const visibleGalleryCategories = GALLERY_CATEGORIES.filter(
    (category) => activeGalleryFilter === GalleryCategoryId.ALL || category.id === activeGalleryFilter
  );

  return (
    <div className="relative w-full h-full min-h-full text-slate-100 select-none">
      {/* 3D WebGL Canvas Container (z-10: underneath the z-30 CRT overlay, above the page background) */}
      <div
        ref={mountRef}
        className={`fixed inset-0 w-screen h-screen z-10 overflow-hidden ${isHovered ? 'cursor-pointer' : 'cursor-crosshair'}`}
      />

      {/* Portfolio Story Drawer / Modal for Selected Planet (z-50: above the z-30 overlay in the expanded right wall area) */}
      {selectedPlanet && (
        <div
          className={`fixed z-50 bg-[#0e1736]/95 border border-[#51E6C4]/45 rounded-2xl shadow-2xl flex flex-col overflow-hidden select-none ${
            isVerticalLayout && isMobileOnly
              ? selectedPlanet.domain === 'SPARK'
                ? 'top-1/2 -translate-y-1/2 right-2.5 w-[61vw] max-w-[calc(100vw-6.5rem)] h-auto max-h-[calc(100dvh-1.5rem)]'
                : 'top-3 bottom-3 right-2.5 w-[61vw] max-w-[calc(100vw-6.5rem)]'
              : selectedPlanet.domain === 'SPARK'
                ? 'top-1/2 -translate-y-1/2 right-4 sm:right-6 lg:right-8 w-[390px] max-w-[44vw] h-auto max-h-[calc(100dvh-3rem)] [@media(max-height:500px)]:max-h-[calc(100dvh-1.25rem)]'
                : 'top-6 bottom-6 [@media(max-height:500px)]:top-2.5 [@media(max-height:500px)]:bottom-2.5 right-4 sm:right-6 lg:right-8 w-[390px] max-w-[44vw]'
          }`}
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between gap-2 p-3 sm:p-4 [@media(max-height:500px)]:p-2.5 border-b border-slate-800 bg-[#0A1128]/90">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-3 h-3 shrink-0 rounded-full bg-[#51E6C4] shadow-[0_0_10px_#51E6C4]" />
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-white font-heading truncate">
                  {selectedPlanet.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#51E6C4] font-mono-telemetry truncate mt-0.5">
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
              className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chapter Navigation Tabs */}
          <div
            ref={planetTabsRef}
            onWheel={handlePlanetTabsWheel}
            className={
              isMobileOrTabletDevice
                ? 'shrink-0 flex items-center justify-start gap-2 border-b border-slate-800/80 bg-[#141f45]/50 px-3 overflow-x-auto touch-pan-x overscroll-x-contain'
                : 'shrink-0 flex items-center justify-between gap-0.5 border-b border-slate-800/80 bg-[#141f45]/50 px-2.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
            }
          >
            {CELESTIAL_PLANETS.map((planet) => (
              <button
                key={planet.id}
                ref={(el) => {
                  if (el) {
                    planetTabRefs.current.set(planet.id, el);
                  } else {
                    planetTabRefs.current.delete(planet.id);
                  }
                }}
                onClick={() => handleSelectPlanet(planet)}
                className={`shrink-0 whitespace-nowrap border-b-2 font-medium transition-all ${
                  isMobileOrTabletDevice
                    ? 'py-2.5 [@media(max-height:500px)]:py-1.5 px-3 text-xs'
                    : 'py-2 px-2 text-xs'
                } ${
                  selectedPlanet.id === planet.id
                    ? 'border-[#51E6C4] text-[#51E6C4] font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {planet.name}
              </button>
            ))}
          </div>

          {/* Drawer Body (Scrollytelling & Portfolio Content) */}
          <div
            ref={drawerBodyRef}
            className={
              selectedPlanet.domain === 'SPARK'
                ? 'min-h-0 overflow-y-auto p-4 sm:p-5 [@media(max-height:500px)]:p-3.5 text-sm text-slate-200 leading-relaxed'
                : selectedPlanet.domain === 'STORY' && isDesktopOrTabletLandscape
                  ? 'flex-1 min-h-0 flex flex-col overflow-hidden [@media(max-height:380px)]:overflow-y-auto px-5 py-4 [@media(max-height:680px)]:p-4 [@media(max-height:500px)]:p-3.5 text-sm text-slate-300 leading-relaxed'
                  : 'flex-1 overflow-y-auto p-3.5 sm:p-6 [@media(max-height:500px)]:p-3.5 space-y-4 sm:space-y-6 [@media(max-height:500px)]:space-y-3.5 text-sm text-slate-300 leading-relaxed'
            }
          >
            {/* CONTACTOS (formerly SPARK) */}
            {selectedPlanet.domain === 'SPARK' && (
              <div className="space-y-4 [@media(max-height:500px)]:space-y-3 animate-in fade-in duration-200 select-text">
                <div className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <p>
                    ¿Quieres apoyo para tu proyecto? ¿Tienes preguntas? ¿Quieres seguirme en redes sociales?
                  </p>
                  <p>
                    Envía un mensaje o chequea como voy en proyectos actuales. ¡Espero verte pronto!
                  </p>
                </div>

                <div className="border-t border-slate-800/80 pt-3.5 [@media(max-height:500px)]:pt-2.5 space-y-3.5 [@media(max-height:500px)]:space-y-2.5">
                  <div className="space-y-0.5">
                    <div className="text-xs sm:text-[13px] font-semibold text-white">
                      Gmail:
                    </div>
                    <p className="break-all text-xs sm:text-sm text-slate-200">
                      elvingandrades@gmail.com
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs sm:text-[13px] font-semibold text-white">
                      Instagram:
                    </div>
                    <a
                      href="https://www.instagram.com/elvinga.sgx"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.playClickSound()}
                      className="inline-flex items-center justify-center max-w-full px-4 py-2 rounded-lg bg-[#51E6C4] text-[#0A1128] text-xs sm:text-sm font-bold hover:bg-[#6ef0d2] active:scale-[0.98] transition-all shadow-sm select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1736]"
                    >
                      @elvinga.sgx
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* INTRODUCCIÓN (formerly STORY) */}
            {selectedPlanet.domain === 'STORY' && (
              isDesktopOrTabletLandscape ? (
                <div className="flex-1 min-h-0 flex flex-col gap-3 [@media(max-height:680px)]:gap-2 animate-in fade-in duration-200 select-text">
                  <div className="shrink-0 space-y-2 [@media(max-height:680px)]:space-y-1.5 [@media(max-height:500px)]:space-y-1">
                    <h4 className="text-base sm:text-lg [@media(max-height:680px)]:text-base [@media(max-height:500px)]:text-sm font-bold text-white font-heading tracking-tight [text-wrap:balance]">
                      ¡Bienvenidos!
                    </h4>
                    <p className="text-sm [@media(max-height:680px)]:text-[13px] [@media(max-height:500px)]:text-xs text-slate-200 leading-relaxed [@media(max-height:680px)]:leading-snug">
                      (PLACEHOLDER) Soy Elvin G. Andrades. Mi orden de Little Caesar's es la siguiente: una pizza Stuffed Crust grande con pepperoni y setas, doble de todo. Se acompaña con otra orden de Crazy Cups de pepperoni y un litro de Sprite. Si te apetéce, ¡ordenala y pruebala!
                    </p>
                  </div>

                  {!introGifError && (
                    <div className="relative flex-1 min-h-0 w-full select-none">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src="/assets/intro/bienvenidos.gif"
                          alt="Animación de bienvenida de Elvin G. Andrades"
                          width={240}
                          height={476}
                          referrerPolicy="no-referrer"
                          onError={() => setIntroGifError(true)}
                          className={`${SHARED_LANDSCAPE_MII_GIF_CLASS} max-h-full`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200 select-text">
                  <div className="space-y-2.5">
                    <h4 className="text-base sm:text-lg font-bold text-white font-heading tracking-tight [text-wrap:balance]">
                      ¡Bienvenidos!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      (PLACEHOLDER) Soy Elvin G. Andrades. Mi misión es resolver la falta de imaginación y la rigidez visual en los entornos creativos actuales. Usando los pilares de SGX.Showcase y SGX.System, estoy creando un portafolio con un diseño innovador: una vista espacial inmersiva desde una nave donde cada planeta explora una faceta diferente del portfolio, completo con una atmósfera de serenidad y curiosidad, invitando a explorar todo lo que el portafolio tiene para ofrecer.
                    </p>
                  </div>

                  {!introGifError && (
                    <div className="pt-1 flex justify-center select-none">
                      <img
                        src="/assets/intro/bienvenidos.gif"
                        alt="Animación de bienvenida de Elvin G. Andrades"
                        width={240}
                        height={476}
                        referrerPolicy="no-referrer"
                        onError={() => setIntroGifError(true)}
                        className="block mx-auto w-auto h-auto max-h-[476px] max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              )
            )}

            {/* JUEGOS (formerly NEXUS) */}
            {selectedPlanet.domain === 'NEXUS' && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200 select-text">
                <h4 className="text-base sm:text-lg font-bold text-white font-heading tracking-tight [text-wrap:balance]">
                  Mazescape
                </h4>

                {!gamesCoverError && (
                  <div className="flex justify-center select-none">
                    <img
                      src="/assets/aistudio/mazescape_icon_24c5a4bd.png"
                      alt="Portada de Mazescape"
                      width={252}
                      height={200}
                      referrerPolicy="no-referrer"
                      onError={() => setGamesCoverError(true)}
                      className="block mx-auto w-[252px] max-w-[80%] h-auto rounded-xl border border-slate-700/80 shadow-md object-contain"
                    />
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Te encuentras atrapado en un laberinto con monstruos. Tienes que pelear para escapar, ¿pero podras hacerlo a tiempo?
                </p>

                <div className="pt-1">
                  <a
                    href="https://ale-studio.itch.io/mazescape"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.playClickSound()}
                    className="inline-flex items-center justify-center max-w-full px-4 py-2.5 rounded-lg bg-[#51E6C4] text-[#0A1128] text-xs sm:text-sm font-bold text-center hover:bg-[#6ef0d2] active:scale-[0.98] transition-all shadow-sm select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1736]"
                  >
                    Juega Mazescape Ahora
                  </a>
                </div>
              </div>
            )}

            {/* BIOGRAFÍA (formerly MATRIX) */}
            {selectedPlanet.domain === 'MATRIX' && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200 select-text">
                {!bioGifError && (
                  <div className="flex justify-center select-none">
                    <img
                      src="/assets/biografia/heading.gif"
                      alt="Animación de Elvin G. Andrades"
                      width={240}
                      height={480}
                      referrerPolicy="no-referrer"
                      onError={() => setBioGifError(true)}
                      className={
                        isDesktopOrTabletLandscape
                          ? SHARED_LANDSCAPE_MII_GIF_CLASS
                          : 'block mx-auto w-auto h-auto max-h-[476px] max-w-full object-contain'
                      }
                    />
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Elvin G. Andrades es un diseñador con talento excepcional en las artes digitales y una pasión tremenda para completar. Él especializa en el diseño de personajes, texturas y UV para modelos 3D, y diseños gráficos tales como logos e interfaces de usuario (UI). Recientemente, el artista fue ingresado en la compañía de Spatialgineers en el rango de Initiate después de haber completado los SGX Trials, su programa interno con el propósito de entrenar reclutas nuevos.
                </p>

                {!bioPhotoError && (
                  <div className="pt-1 flex justify-center select-none">
                    <img
                      src="/assets/aistudio/biografia_foto_8228eabb.jpg"
                      alt="Fotografía de Elvin G. Andrades"
                      width={379}
                      height={379}
                      referrerPolicy="no-referrer"
                      onError={() => setBioPhotoError(true)}
                      className="block mx-auto w-auto h-auto max-w-full rounded-xl border border-slate-700/80 shadow-md object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* GALERÍA (formerly BEACON) */}
            {selectedPlanet.domain === 'BEACON' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-[#141f45]/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
                  <h4 className="text-sm font-semibold text-white font-heading">
                    Exhibición de Arte
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Archivo visual de arte conceptual y diseño de interfaz. Selecciona cualquier obra para verla ampliada en pantalla.
                  </p>
                </div>

                {/* Interactive Category Filter Controls */}
                <div className="flex flex-wrap items-center gap-1 p-1 bg-[#0A1128]/90 border border-slate-800/90 rounded-lg">
                  {[
                    { id: GalleryCategoryId.ALL, label: 'Todo' },
                    ...GALLERY_CATEGORIES.map((category) => ({
                      id: category.id,
                      label: category.label
                    }))
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveGalleryFilter(tab.id);
                        soundEngine.playClickSound();
                      }}
                      className={`flex-auto py-1.5 px-2.5 text-[11px] sm:text-xs font-medium rounded-md transition-colors text-center whitespace-nowrap ${
                        activeGalleryFilter === tab.id
                          ? 'bg-[#141f45] text-[#51E6C4] shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Categorized Exhibition Sections */}
                <div className="space-y-6">
                  {visibleGalleryCategories.map((category) => {
                    const categoryItems = GALLERY_ARTWORKS.filter(
                      (item) => item.category === category.id
                    );

                    return (
                      <section key={category.id} className="space-y-3">
                        <div className="space-y-0.5 border-b border-slate-800/80 pb-2">
                          <div className="flex items-baseline justify-between gap-2">
                            <h5 className="text-xs sm:text-sm font-semibold text-white font-heading">
                              {category.label}
                            </h5>
                            <span className="text-[11px] text-slate-400 font-mono-telemetry">
                              {categoryItems.length} {categoryItems.length === 1 ? 'archivo' : 'archivos'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {category.description}
                          </p>
                        </div>

                        {categoryItems.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3">
                            {categoryItems.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleOpenArtwork(item)}
                                className="group w-full text-left bg-[#0A1128]/85 border border-slate-800/90 hover:border-[#51E6C4]/60 rounded-xl overflow-hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#51E6C4]"
                              >
                                <div className="relative w-full aspect-video bg-[#070c1d] flex items-center justify-center overflow-hidden p-2">
                                  <img
                                    src={item.src}
                                    alt={item.title}
                                    loading="lazy"
                                    className={`max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] ${
                                      item.pixelArt ? '[image-rendering:pixelated]' : ''
                                    }`}
                                  />
                                  <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#0A1128]/85 text-slate-300 group-hover:text-[#51E6C4] opacity-85 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                                <div className="px-3 py-2.5 space-y-0.5 border-t border-slate-800/70">
                                  <div className="text-xs font-semibold text-slate-100 group-hover:text-[#51E6C4] transition-colors truncate">
                                    {item.title}
                                  </div>
                                  {item.caption && (
                                    <p className="text-[11px] text-slate-400 line-clamp-2">
                                      {item.caption}
                                    </p>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-slate-800 bg-[#0A1128]/50 px-4 py-5 text-center space-y-1">
                            <p className="text-xs font-medium text-slate-300">
                              Sin archivos cargados en {category.label}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Comparte las imágenes o enlaces directos de «{category.notebookSectionTitle}» para mostrarlas aquí.
                            </p>
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Viewport-Fitted Artwork Lightbox Overlay with Clear Margins */}
      {activeArtwork &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeArtwork.title}
            onClick={handleCloseArtwork}
            className="fixed inset-0 z-[100] w-screen h-[100dvh] overflow-hidden bg-[#050914]/92 backdrop-blur-sm select-none flex flex-col p-4 sm:p-6 lg:p-8 gap-3 sm:gap-4"
          >
            {/* Header Controls */}
            <div className="shrink-0 w-full flex items-center justify-between gap-3 z-[110]">
              <div
                onClick={(e) => e.stopPropagation()}
                className="min-w-0 bg-[#0e1736]/95 border border-slate-800 rounded-xl px-3.5 py-2 shadow-xl"
              >
                <div className="text-xs sm:text-sm font-semibold text-white truncate">
                  {activeArtwork.title}
                </div>
                <div className="text-[11px] text-slate-400">
                  {GALLERY_CATEGORIES.find((c) => c.id === activeArtwork.category)?.label ??
                    (activeArtwork.category === GalleryCategoryId.CONCEPT_ART
                      ? 'Arte de Mazescape'
                      : 'Otros Proyectos')}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseArtwork();
                }}
                aria-label="Cerrar imagen"
                className="shrink-0 min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0e1736]/95 border border-slate-700/90 hover:border-[#51E6C4] text-slate-200 hover:text-white text-xs font-medium shadow-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#51E6C4]"
              >
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
            </div>

            {/* Viewport-Contained Artwork Stage with Surrounding Margin */}
            <div className="relative flex-1 min-h-0 min-w-0 w-full">
              <div className="absolute inset-0 p-2 sm:p-4 lg:px-10 lg:py-4 flex items-center justify-center">
                <img
                  src={activeArtwork.src}
                  alt={activeArtwork.title}
                  onClick={(e) => e.stopPropagation()}
                  className={`block max-w-full max-h-full w-auto h-auto object-contain shadow-2xl rounded-lg border border-slate-800/80 bg-[#070c1d] ${
                    activeArtwork.pixelArt ? '[image-rendering:pixelated]' : ''
                  }`}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
