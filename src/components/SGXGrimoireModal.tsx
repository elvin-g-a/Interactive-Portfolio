/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * EL GRIMORIO DEFINITIVO DEL DESARROLLADOR SGX (V2026.5)
 * Manual Clasificado para Initiates & Awakened
 */

import React, { useState } from 'react';
import { BookOpen, Search, X, Shield, Terminal, Code2, AlertTriangle, Cpu, Zap, Copy, Check } from 'lucide-react';
import { soundEngine } from '../services/sound-effects';

interface SGXGrimoireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GrimoireChapter {
  id: string;
  title: string;
  tag: string;
  content: string;
  codeSnippet?: string;
}

export const SGXGrimoireModal: React.FC<SGXGrimoireModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChapterId, setActiveChapterId] = useState('CAP_II');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isOpen) return null;

  const chapters: GrimoireChapter[] = [
    {
      id: 'CAP_I',
      title: 'Capítulo I: Arquitectura Fundacional & El Mandato Single-File',
      tag: 'Import Maps / Vanilla ES',
      content: 'En el ecosistema SGX evitamos entornos de compilación locales complejos (Node.js/npm) para distribuciones públicas bajo la premisa de "Fricción Cero". El stack permitido se basa en Vanilla JS impulsado por ES Modules y CDNs confiables (jsDelivr, esm.sh), Three.js puro, Anime.js y Web Audio API.',
      codeSnippet: `<!-- Import Maps Fundacionales SGX -->
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.147.0/examples/jsm/",
    "animejs": "https://esm.sh/animejs@3.2.1"
  }
}
</script>`
    },
    {
      id: 'CAP_II',
      title: 'Capítulo II: Modelos 3D, Texturas & La Ley de CORS',
      tag: 'Bypass CORS / RoomEnvironment',
      content: 'Los modelos 3D son el alma del pilar SGX.Showcase. Los bloqueos CORS en servidores rígidos provocan errores de "tainted canvas". Solución 1: loader.setCrossOrigin("anonymous"). Solución 2: Carga local de archivos convirtiendo a Blob con URL.createObjectURL(file) para evadir CORS al 100%. Además, para evitar el bug del "Modelo Oscuro" en materiales PBR, se integra RoomEnvironment.',
      codeSnippet: `// 1. Bypass CORS Anónimo
const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin('anonymous');

// 2. RoomEnvironment Oficial (Anti Modelo Oscuro)
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

// 3. Purga de Memoria GPU (.dispose)
function clearModel(group) {
  while(group.children.length > 0) {
    const obj = group.children[0];
    obj.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      }
    });
    group.remove(obj);
  }
}`
    },
    {
      id: 'CAP_III',
      title: 'Capítulo III: Renderizado Visual (Ubershaders GLSL vs CSS)',
      tag: 'WebGL / Fragment Shaders',
      content: 'NO utilizamos filtros CSS nativos (ctx.filter) en Canvas 2D. Provocan latencia masiva y caídas de FPS. Toda manipulación visual (Liquify, Glitch, Aberración Cromática) se procesa matemáticamente a nivel de píxel en la tarjeta gráfica usando Ubershaders (GLSL) en Three.js.',
      codeSnippet: `// Mitigación de deformación de mallas:
// En el Vertex Shader asegurar desplazamiento solo positivo para evitar
// colisión geométrica consigo misma (mesh intersection):
float displacement = max(0.0, offset);
vPosition = position + normal * displacement;`
    },
    {
      id: 'CAP_V',
      title: 'Capítulo V: Reactividad Acústica & FFT Analyzer',
      tag: 'Web Audio API / 25-220Hz',
      content: 'Para el desarrollo de Visualizadores VJ (SGX.Synthesize), el audio no es un simple efecto, es un parámetro matemático. Conectamos Web Audio API para procesar Transformadas Rápidas de Fourier (FFT), aislando Graves (25–220 Hz), Medios (220–2400 Hz) y Agudos (2400–16000 Hz).',
      codeSnippet: `// Ecuación de Enrutamiento SGX:
// m[d] = clamp(reactividadGlobal * sum(peso[d,b] * señal[b]), min, max)
// Graves (25-220Hz): Escala y masa de malla
// Medios (220-2400Hz): Rotación y deformación
// Agudos (2400-16000Hz): Aberración cromática y partículas`
    },
    {
      id: 'CAP_VI',
      title: 'Capítulo VI: UX/UI & El Estándar Visual de Spatialgineers',
      tag: 'Neo-Ingeniería / Paleta Oficial',
      content: 'La interfaz debe parecer una terminal cibernética de alta precisión. Tipografía Orbitron para encabezados e identidad; Space Grotesk y JetBrains Mono para telemetría. Paleta oficial: Azul Metálico (#32527B), Oro Metálico (#FDCC0D), Cyan Neón (#00FFFF), Cobre (#B87333), Negro Base (#050505).',
      codeSnippet: `/* Paleta Oficial SGX */
--sgx-blue: #32527B;      /* Base y estructuras */
--sgx-gold: #FDCC0D;      /* Energía y acentos */
--sgx-cyan: #00FFFF;      /* Luces y punteros */
--sgx-copper: #B87333;    /* Estados secundarios */
--sgx-dark: #050505;      /* Vacío y contraste */`
    },
    {
      id: 'CAP_XVI',
      title: 'Capítulo XVI: Controles de Performance en Vivo (Live Hotkeys)',
      tag: 'Atajos Globales / Escenario',
      content: 'Los visualizadores de grado Enterprise están diseñados para operarse en directo ante audiencia. Se reservan atajos de teclado globales estandarizados: 1–8 (Cambiar escena), Espacio (Pausar/Reanudar tiempo), P (Disparar pulso manual), M (Silenciar audio), F (Modo Escenario completo sin UI), Esc (Cerrar o salir).',
      codeSnippet: `// Tabla Oficial de Atajos de Teclado SGX:
Teclas 1 - 8: Cambiar de Escena o Universo
Barra Espaciadora: Congelar / Reanudar simulación
Tecla P: Disparar Pulso visual manual
Tecla M: Mutar (Mute) canal de audio
Tecla F: Modo Escenario (Oculta HUD para proyección)
Tecla Esc: Salir de inmersión`
    }
  ];

  const filteredChapters = chapters.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  const handleCopy = (text: string) => {
    soundEngine.playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0a0f18] border border-[#32527B]/60 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#32527B]/40 bg-[#0d1422]/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00FFFF]/10 border border-[#00FFFF]/30 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#00FFFF]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                El Grimorio Definitivo del Desarrollador SGX
              </h2>
              <span className="text-[11px] font-mono-telemetry text-slate-400">
                Documento Clasificado v2026.5 · Spatialgineers LLC
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#32527B]/30 bg-[#070b12] flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en el Grimorio: CORS, RoomEnvironment, FFT, Ubershaders, Memory Leaks..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* 2-Column Split: Index + Chapter Reader */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Chapter Index Column */}
          <div className="w-full md:w-72 border-r border-[#32527B]/30 bg-[#070b12]/60 overflow-y-auto p-3 space-y-1.5 shrink-0">
            {filteredChapters.map((ch) => {
              const isSelected = ch.id === activeChapter.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    soundEngine.playClickSound();
                    setActiveChapterId(ch.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all border ${
                    isSelected
                      ? 'bg-[#32527B]/40 border-[#00FFFF]/60 text-white font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <span className="text-[10px] text-[#FDCC0D] font-mono-telemetry block mb-0.5">
                    {ch.tag}
                  </span>
                  <span className="line-clamp-2 leading-snug">{ch.title}</span>
                </button>
              );
            })}
          </div>

          {/* Chapter Content Column */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="border-b border-[#32527B]/30 pb-3">
              <span className="text-xs text-[#00FFFF] font-mono-telemetry font-bold">
                {activeChapter.tag}
              </span>
              <h3 className="text-lg font-bold text-white font-heading mt-1">
                {activeChapter.title}
              </h3>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
              {activeChapter.content}
            </p>

            {activeChapter.codeSnippet && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold font-mono-telemetry">
                    Cheat Code Operacional:
                  </span>
                  <button
                    onClick={() => handleCopy(activeChapter.codeSnippet!)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-white/10 hover:bg-white/15 text-slate-200 rounded transition-colors"
                  >
                    {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet ? 'Copiado' : 'Copiar Snippet'}</span>
                  </button>
                </div>

                <pre className="p-4 bg-[#050505] border border-[#32527B]/40 rounded-xl text-[11px] font-mono-telemetry text-[#FDCC0D] overflow-x-auto leading-relaxed">
                  {activeChapter.codeSnippet}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#32527B]/40 bg-[#0d1422]/90 text-xs text-slate-400">
          <span>Sello Oficial de Spatialgineers Guild Master · 2026.5</span>
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
          >
            Cerrar Grimorio
          </button>
        </div>
      </div>
    </div>
  );
};
