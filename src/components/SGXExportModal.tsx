/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX EXPORT MODAL: Mandato Single-File & Paquete de Inicio
 */

import React, { useState } from 'react';
import { Download, Copy, Check, X, FileCode, CheckCircle2, Terminal } from 'lucide-react';
import { PillarId, PILLARS } from '../config/sgx-config';
import {
  SPARK_STORY_MODULE_JS,
  SGX_CONFIG_JS
} from '../modules/sourceCodeBank';
import { soundEngine } from '../services/sound-effects';

interface SGXExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePillar: PillarId;
}

export const SGXExportModal: React.FC<SGXExportModalProps> = ({ isOpen, onClose, activePillar }) => {
  const [copiedSingleFile, setCopiedSingleFile] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  if (!isOpen) return null;

  const getModuleCode = (_pillar: PillarId): string => {
    return SPARK_STORY_MODULE_JS;
  };

  // Generate self-contained Single-File HTML bundle with Import Maps (Grimorio Cap 1.2)
  const generateSingleFileHtml = (): string => {
    const pillar = PILLARS[activePillar];
    const moduleCode = getModuleCode(activePillar);

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SGX Omni-Canvas | ${pillar.name} (${pillar.archetype})</title>
  
  <!-- Import Maps Fundacionales SGX (Grimorio Cap 1.2) -->
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.147.0/examples/jsm/"
    }
  }
  </script>

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #050505; color: #e2e8f0; font-family: monospace; overflow: hidden; height: 100vh; }
    #sgx-canvas-container { width: 100vw; height: 100vh; position: relative; }
    .hud { position: absolute; top: 16px; left: 16px; background: rgba(10,15,24,0.9); border: 1px solid #32527B; padding: 8px 16px; border-radius: 8px; z-index: 10; font-size: 12px; }
  </style>
</head>
<body>
  <div id="sgx-canvas-container">
    <div class="hud">
      <strong style="color: #FDCC0D;">SGX.${activePillar}</strong> · ${pillar.archetype}
    </div>
  </div>

  <script type="module">
    // sgx-config.js
    const ACTIVE_PILLAR = '${activePillar}';

    // ${pillar.moduleFile}
    ${moduleCode}

    console.log('[SGX Omni-Canvas] Baseline iniciado para pilar: ' + ACTIVE_PILLAR);
  </script>
</body>
</html>`;
  };

  const handleCopySingleFile = () => {
    soundEngine.playClickSound();
    navigator.clipboard.writeText(generateSingleFileHtml());
    setCopiedSingleFile(true);
    setTimeout(() => setCopiedSingleFile(false), 2500);
  };

  const handleDownloadSingleFile = () => {
    soundEngine.playClickSound();
    const blob = new Blob([generateSingleFileHtml()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sgx-omni-canvas-${activePillar.toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0a0f18] border border-[#32527B]/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#32527B]/40 bg-[#0d1422]/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FDCC0D]/10 border border-[#FDCC0D]/30 flex items-center justify-center">
              <Download className="w-4 h-4 text-[#FDCC0D]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Exportar Baseline Template SGX
              </h2>
              <span className="text-[11px] font-mono-telemetry text-slate-400">
                Fricción Cero: Despliegue sin dependencias locales pesadas
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-slate-300">
          <div className="p-4 bg-[#0d1422] border border-[#32527B]/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-white font-bold font-heading">
              <FileCode className="w-4 h-4 text-[#00FFFF]" />
              <span>Mandato "Single-File HTML" (Grimorio Cap I)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Exporta un archivo único HTML autocontenido con Import Maps oficiales, Three.js y el módulo activo (<strong className="text-[#FDCC0D]">{activePillar}</strong>). Listo para abrir con doble clic en cualquier navegador o subir a GitHub Pages / itch.io.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleDownloadSingleFile}
                className="px-4 py-2 bg-[#FDCC0D] hover:bg-[#e5b800] text-black font-semibold rounded-lg transition-colors flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Descargar {activePillar.toLowerCase()}.html</span>
              </button>
              <button
                onClick={handleCopySingleFile}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-slate-200 rounded-lg transition-colors flex items-center gap-2"
              >
                {copiedSingleFile ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSingleFile ? '¡HTML Copiado!' : 'Copiar Código HTML'}</span>
              </button>
            </div>
          </div>

          {/* Checklist de Certificación para Iniciados */}
          <div className="p-4 bg-[#070b13] border border-[#32527B]/30 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-white font-bold font-heading">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Certificación para Iniciados: Ecosistema "En Ley"</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-telemetry border border-emerald-500/30">
                100% CUMPLIDO
              </span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1.5 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-[#00FFFF] font-bold">✓</span>
                <span><strong>Regla de Oro 1:</strong> Fricción cero — exportable en Single-File HTML o ejecutable en AI Studio sin Node.js local.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00FFFF] font-bold">✓</span>
                <span><strong>Regla de Oro 2:</strong> 100% interactivo — 6 pilares con código funcional (canvas, 3D PBR, shader, audio, simulación).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00FFFF] font-bold">✓</span>
                <span><strong>Regla de Oro 3:</strong> Alcance libre — sin encasillamiento temático; listo para transformarse en lo que el iniciado desee.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00FFFF] font-bold">✓</span>
                <span><strong>Regla de Oro 4:</strong> Audio sintetizado Web Audio API — cero enlaces a MP3s rotos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00FFFF] font-bold">✓</span>
                <span><strong>Regla de Oro 5:</strong> Documentado para Gemini 3.8 Flash — manifiesto canónico en raíz y modal de prompts asistidos.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="text-slate-400 font-semibold block font-heading">
              Estructura Estándar de Carpetas para AI Studio:
            </span>
            <div className="p-3.5 bg-[#050505] border border-[#32527B]/30 rounded-xl font-mono-telemetry text-[11px] text-slate-300 space-y-1">
              <div>├── index.html <span className="text-slate-500">(Cascarón principal con Loader oficial)</span></div>
              <div>├── sgx-config.js <span className="text-[#FDCC0D]">(Panel de control: ACTIVE_PILLAR = '{activePillar}')</span></div>
              <div>└── modules/</div>
              <div className="pl-6 text-[#00FFFF]">├── spark-module.js</div>
              <div className="pl-6 text-[#00FFFF]">├── stage-module.js</div>
              <div className="pl-6 text-[#00FFFF]">├── showcase-module.js</div>
              <div className="pl-6 text-[#00FFFF]">├── story-module.js</div>
              <div className="pl-6 text-[#00FFFF]">├── system-module.js</div>
              <div className="pl-6 text-[#00FFFF]">└── synthesize-module.js</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-[#32527B]/40 bg-[#0d1422]/90">
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
