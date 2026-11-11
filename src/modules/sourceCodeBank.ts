/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX OMNI-CANVAS - Clean Modular Source Code Bank
 * Single-Pillar Edition: Showcase × System (The Celestial Viewport)
 */

export const SGX_CONFIG_JS = `/**
 * ========================================================
 * SGX OMNI-CANVAS: sgx-config.js (Panel de Control Central)
 * ========================================================
 * Afinidad Única Activa: 'SHOWCASE_SYSTEM' (Showcase × System)
 * Entorno de ciencia ficción acogedora (#0A1128, #51E6C4, #5E53CC)
 * Personaje en 3ra persona observando Viewport rectangular y planetas vivos a 60 FPS.
 */

export const ACTIVE_PILLAR = 'SHOWCASE_SYSTEM';

export const CREATOR_PROFILE = {
  authorName: 'Spatialgineers Creator',
  specialtyRole: 'Virtual Architect & Creative Technologist',
  projectTitle: 'Interactive Spatial Portfolio (Showcase × System)',
  contactEmail: 'creator@spatialgineers.com',
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    artstation: 'https://artstation.com'
  }
};

export const SGX_SETTINGS = {
  appName: 'SGX Omni-Canvas: Showcase × System Portfolio',
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

export const SHOWCASE_SYSTEM_MODULE_JS = `/**
 * ========================================================
 * MÓDULO SGX.Showcase × SGX.System: Portafolio del Observador Cósmico
 * ========================================================
 * Arquitectura Three.js PBR a 60 FPS · Ciencia Ficción Acogedora (#0A1128, #51E6C4, #5E53CC)
 * Personaje geométrico en 3ra persona observando Viewport rectangular y sistema de planetas.
 * Código Vanilla JS / ES Modules 100% libre de dependencias npm externas.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ShowcaseSystemPortfolioEngine {
  constructor(container) {
    this.container = container;
    this.clock = new THREE.Clock();
    this.probesCount = 0;
    this.activePlanetId = null;

    this.initScene();
    this.initLights();
    this.initOverlay();
    this.initPlanetarySystem();
    this.initRaycasting();
    this.initAudioSynthesizer();

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);

    this.animate = this.animate.bind(this);
    this.renderLoop = requestAnimationFrame(this.animate);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0A1128);
    this.scene.fog = new THREE.FogExp2(0x0A1128, 0.012);

    const w = Math.max(Math.round(this.container.clientWidth || window.innerWidth || 1280), 1);
    const h = Math.max(Math.round(this.container.clientHeight || window.innerHeight || 720), 1);

    this.homeCamPos = new THREE.Vector3(0, 2.55, 5.2);
    this.homeLookTarget = new THREE.Vector3(0, 0.65, -2.5);

    this.homeCamera = new THREE.PerspectiveCamera(42, w / h, 0.1, 120);
    this.homeCamera.position.copy(this.homeCamPos);
    this.homeCamera.lookAt(this.homeLookTarget);
    this.homeCamera.updateProjectionMatrix();
    this.homeCamera.updateMatrixWorld(true);

    this.homeRight = new THREE.Vector3();
    this.homeUp = new THREE.Vector3();
    this.homeBack = new THREE.Vector3();
    this.homeCamera.matrixWorld.extractBasis(this.homeRight, this.homeUp, this.homeBack);

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 120);
    this.camera.position.copy(this.homeCamPos);
    this.camera.lookAt(this.homeLookTarget);
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld(true);

    this.currentCamPos = this.homeCamPos.clone();
    this.currentLookTarget = this.homeLookTarget.clone();
    this.desiredCamPos = this.homeCamPos.clone();
    this.desiredLookTarget = this.homeLookTarget.clone();
    this.axisWorldPos = new THREE.Vector3();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x0A1128, 1);
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;position:fixed;inset:0;z-index:10;';
    this.container.appendChild(this.renderer.domElement);

    try {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    } catch (e) {}
  }

  initLights() {
    this.scene.add(new THREE.AmbientLight(0x8fa8ff, 0.19));

    const key = new THREE.DirectionalLight(0xdef8ff, 0.925);
    key.position.set(4, 7, 5);
    this.scene.add(key);

    const hemi = new THREE.HemisphereLight(0x51E6C4, 0x5E53CC, 0.36);
    this.scene.add(hemi);

    const rim = new THREE.DirectionalLight(0x5E53CC, 0.675);
    rim.position.set(-5, 3, -4);
    this.scene.add(rim);

    const starCount = 1400;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);
    const c1 = new THREE.Color(0x51E6C4);
    const c2 = new THREE.Color(0x5E53CC);
    const c3 = new THREE.Color(0xffffff);
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const r = 18 + Math.random() * 55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i3 + 2] = -r * Math.abs(Math.cos(phi)) - 6;
      const pick = Math.random();
      const c = pick < 0.45 ? c1 : pick < 0.85 ? c2 : c3;
      starCol[i3] = c.r;
      starCol[i3 + 1] = c.g;
      starCol[i3 + 2] = c.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    this.scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.18, vertexColors: true, transparent: true, opacity: 0.85, fog: false })));
  }

  initOverlay() {
    const overlay = document.createElement('img');
    overlay.src = '/assets/aistudio/viewport_fbe8d8eb.png';
    overlay.alt = '';
    overlay.style.cssText = 'position:fixed;top:0;left:0;height:100vh;width:auto;max-width:none;image-rendering:pixelated;pointer-events:none;z-index:30;';
    document.body.appendChild(overlay);
    this.overlayElement = overlay;
  }

  initPlanetarySystem() {
    this.planets = [
      { id: 'spark', name: 'Planeta Spark', color: 0xE06D53, r: 0.68, sx: 0.7294, sy: 0.6810, hasRings: false, url: 'https://static.wixstatic.com/3d/06361e_eccac59d52044676884a981e435e7c7d.glb', chapter: 'Mecánicas Interactivas & Spark Engine' },
      { id: 'story', name: 'Planeta Story', color: 0xD8C39D, r: 0.72, sx: 0.4948, sy: 0.4741, hasRings: true, url: 'https://static.wixstatic.com/3d/06361e_968472237ff14ce49099d980a5fb9467.glb', chapter: 'Crónicas del Viajero & Manifiesto' },
      { id: 'nexus', name: 'Planeta Nexus', color: 0x4A90E2, r: 0.66, sx: 0.7258, sy: 0.3199, hasRings: false, url: 'https://static.wixstatic.com/3d/06361e_04dd2853553440ca9c08d03ef60aa335.glb', chapter: 'Bóveda de Obras y Proyectos' },
      { id: 'matrix', name: 'Planeta Matrix', color: 0x41729F, r: 0.65, sx: 0.2529, sy: 0.6810, hasRings: false, url: 'https://static.wixstatic.com/3d/06361e_3852ab5e10ff4120975dd5b5d3a0ef12.glb', chapter: 'El Bastión Tecnológico' },
      { id: 'beacon', name: 'Planeta Beacon', color: 0xA0A0A0, r: 0.63, sx: 0.2529, sy: 0.3157, hasRings: false, url: 'https://static.wixstatic.com/3d/06361e_edab7517a8a94eb0a249f502dd4b21f2.glb', chapter: 'El Faro de Contacto' }
    ];

    const loader = new GLTFLoader();
    this.planetMeshes = [];
    this.hitTargets = [];

    this.planets.forEach((p) => {
      const group = new THREE.Group();
      const hitMesh = new THREE.Mesh(
        new THREE.SphereGeometry(p.r * (p.hasRings ? 1.45 : 1.15), 16, 16),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
      );
      hitMesh.userData = { planetId: p.id };
      group.add(hitMesh);
      this.hitTargets.push(hitMesh);

      const defaultRotAxis = new THREE.Group();
      defaultRotAxis.name = 'rotation_axis';
      group.add(defaultRotAxis);

      const geo = new THREE.SphereGeometry(p.r, 32, 32);
      const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.45, metalness: 0.1 });
      const placeholder = new THREE.Mesh(geo, mat);
      defaultRotAxis.add(placeholder);

      this.scene.add(group);
      const entry = { group, hitMesh, rotAxis: defaultRotAxis, data: p, baseScale: 1.0 };
      this.planetMeshes.push(entry);

      loader.load(p.url, (gltf) => {
        defaultRotAxis.remove(placeholder);
        geo.dispose();
        mat.dispose();
        const modelScene = gltf.scene;
        modelScene.updateMatrixWorld(true);
        const modelRotAxis = modelScene.getObjectByName('rotation_axis');
        if (modelRotAxis) {
          modelRotAxis.scale.set(1, 1, 1);
          modelScene.updateMatrixWorld(true);
          [...modelScene.children].filter((c) => c !== modelRotAxis).forEach((child) => modelRotAxis.attach(child));
          group.remove(defaultRotAxis);
          group.add(modelScene);
          entry.rotAxis = modelRotAxis;
        } else {
          defaultRotAxis.add(modelScene);
        }
        modelScene.scale.setScalar(p.r);
      });
    });

    this.updateStaticLayout();
  }

  updateStaticLayout() {
    this.homeCamera.aspect = this.camera.aspect;
    this.homeCamera.updateProjectionMatrix();
    this.homeCamera.updateMatrixWorld(true);
    const depth = 8.0;
    const halfH = depth * Math.tan(THREE.MathUtils.degToRad(this.homeCamera.fov * 0.5));
    const halfW = halfH * this.homeCamera.aspect;
    const scale = THREE.MathUtils.clamp(this.homeCamera.aspect / 1.6, 0.65, 1.0);

    this.planetMeshes.forEach((pm) => {
      const ndcX = pm.data.sx * 2 - 1;
      const ndcY = 1 - pm.data.sy * 2;
      const pos = new THREE.Vector3(ndcX * halfW, ndcY * halfH, -depth).applyMatrix4(this.homeCamera.matrixWorld);
      pm.group.position.copy(pos);
      pm.baseScale = scale;
      pm.group.scale.setScalar(scale);
    });
  }

  onResize() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.updateStaticLayout();
  }

  initRaycasting() {
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-999, -999);
    this.onPointerDown = (e) => {
      const rect = this.container.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      this.pointer.x = ((cx - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((cy - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hits = this.raycaster.intersectObjects(this.hitTargets, false);
      this.activePlanetId = hits.length > 0 ? hits[0].object.userData.planetId : null;
    };
    this.container.addEventListener('pointerdown', this.onPointerDown);
  }

  closePlanetMenu() {
    this.activePlanetId = null;
  }

  initAudioSynthesizer() {
    this.audioCtx = null;
  }

  launchProbe() {
    this.probesCount++;
  }

  animate() {
    this.renderLoop = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.1);
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5));

    let selectedEntry = null;
    this.planetMeshes.forEach((pm) => {
      if (pm.rotAxis) {
        pm.rotAxis.rotateY(-((Math.PI * 2) / 40) * delta);
      }
      if (pm.data.id === this.activePlanetId) {
        selectedEntry = pm;
      }
    });

    if (selectedEntry) {
      selectedEntry.group.updateMatrixWorld(true);
      selectedEntry.rotAxis.getWorldPosition(this.axisWorldPos);
      const sphereRadius = selectedEntry.data.r * selectedEntry.baseScale * 1.14;
      const vertRadius = sphereRadius * 1.08;
      const horizRadius = selectedEntry.data.hasRings ? sphereRadius * 1.86 : sphereRadius * 1.05;
      const zoomDist = Math.max(
        (vertRadius / (2 * 0.27)) / tanHalfFov,
        (horizRadius / (2 * 0.22 * this.camera.aspect)) / tanHalfFov,
        2.5
      );
      const halfH = zoomDist * tanHalfFov;
      const halfW = halfH * this.camera.aspect;
      const ndcX = 0.35 * 2 - 1;
      const ndcY = 1 - 0.51 * 2;
      this.desiredLookTarget.copy(this.axisWorldPos).addScaledVector(this.homeRight, -ndcX * halfW).addScaledVector(this.homeUp, -ndcY * halfH);
      this.desiredCamPos.copy(this.desiredLookTarget).addScaledVector(this.homeBack, zoomDist);
    } else {
      this.desiredCamPos.copy(this.homeCamPos);
      this.desiredLookTarget.copy(this.homeLookTarget);
    }

    this.currentCamPos.x = THREE.MathUtils.damp(this.currentCamPos.x, this.desiredCamPos.x, 4.8, delta);
    this.currentCamPos.y = THREE.MathUtils.damp(this.currentCamPos.y, this.desiredCamPos.y, 4.8, delta);
    this.currentCamPos.z = THREE.MathUtils.damp(this.currentCamPos.z, this.desiredCamPos.z, 4.8, delta);
    this.currentLookTarget.x = THREE.MathUtils.damp(this.currentLookTarget.x, this.desiredLookTarget.x, 4.8, delta);
    this.currentLookTarget.y = THREE.MathUtils.damp(this.currentLookTarget.y, this.desiredLookTarget.y, 4.8, delta);
    this.currentLookTarget.z = THREE.MathUtils.damp(this.currentLookTarget.z, this.desiredLookTarget.z, 4.8, delta);
    this.camera.position.copy(this.currentCamPos);
    this.camera.lookAt(this.currentLookTarget);

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this.renderLoop);
    window.removeEventListener('resize', this.onResize);
    if (this.onPointerDown) {
      this.container.removeEventListener('pointerdown', this.onPointerDown);
    }
    if (this.overlayElement && this.overlayElement.parentNode) {
      this.overlayElement.parentNode.removeChild(this.overlayElement);
    }
    this.renderer.dispose();
  }
}
`;
