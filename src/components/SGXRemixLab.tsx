/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * EL ARTE DEL REMIX EN GOOGLE AI STUDIO (The Remix Lab)
 * Metodología SGX: Aislar -> Contextualizar -> Mutar con Prompt Quirúrgico
 */

import React, { useState } from 'react';
import { PillarId, PILLARS } from '../config/sgx-config';
import {
  SPARK_STORY_MODULE_JS,
  SGX_CONFIG_JS
} from '../modules/sourceCodeBank';
import { Sparkles, Copy, Check, Download, X, Terminal, Code2, Cpu, ArrowRight, Layers, FileCode } from 'lucide-react';
import { soundEngine } from '../services/sound-effects';

interface SGXRemixLabProps {
  initialPillar: PillarId;
  isOpen: boolean;
  onClose: () => void;
  onSelectPillar: (pillar: PillarId) => void;
}

export const SGXRemixLab: React.FC<SGXRemixLabProps> = ({
  initialPillar,
  isOpen,
  onClose,
  onSelectPillar
}) => {
  const [selectedPillar, setSelectedPillar] = useState<PillarId>(initialPillar);
  const [activeTab, setActiveTab] = useState<'WORKFLOW' | 'PROMPT_BUILDER' | 'CODE_INSPECTOR'>('PROMPT_BUILDER');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [customGoal, setCustomGoal] = useState<string>('');

  if (!isOpen) return null;

  const pillarMeta = PILLARS[selectedPillar];

  const getModuleCode = (_pillar: PillarId): string => {
    return SPARK_STORY_MODULE_JS;
  };

  const getFullSurgicalPrompt = (): string => {
    const goalText = customGoal.trim().length > 0 ? customGoal : pillarMeta.challenge;

    return `// ========================================================
// PROMPT QUIRÚRGICO SGX PARA GOOGLE AI STUDIO
// METODOLOGÍA THE REMIX: AISLAR -> CONTEXTUALIZAR -> MUTAR
// ========================================================

Hola Gemini, estoy trabajando sobre el Baseline Template oficial SGX Omni-Canvas (Spatialgineers v2026.5).
Estoy operando bajo la Afinidad de Pilar: [${pillarMeta.name} - ${pillarMeta.archetype}].

CONTEXTO DEL SISTEMA:
1. Archivo de configuración central: sgx-config.js (con ACTIVE_PILLAR = '${selectedPillar}').
2. Archivo del módulo aislado: /modules/${pillarMeta.moduleFile}
3. Entorno de ejecución: Navegador moderno con WebGL y Web Audio API sin compilación compleja local (Fricción Cero).

OBJETIVO QUIRÚRGICO DE MUTACIÓN:
${goalText}

REGLAS DE ARQUITECTURA SGX (EL GRIMORIO V2026.5):
- Si manipulas 3D en Three.js, mantén RoomEnvironment activo para evitar el 'Modelo Oscuro', y usa .dispose() al reemplazar mallas para evitar fugas de memoria.
- Si usas archivos locales, decodifícalos con FileReader Blob URLs para evadir CORS al 100%.
- Mantén la función limpia y no generes dependencias externas que no existan en el baseline.
- Entrégame únicamente la versión actualizada del módulo ${pillarMeta.moduleFile} con comentarios explicativos de los cambios realizados.`;
  };

  const handleCopyPrompt = () => {
    soundEngine.playClickSound();
    navigator.clipboard.writeText(getFullSurgicalPrompt());
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleCopyCode = () => {
    soundEngine.playClickSound();
    navigator.clipboard.writeText(getModuleCode(selectedPillar));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadModule = () => {
    soundEngine.playClickSound();
    const blob = new Blob([getModuleCode(selectedPillar)], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pillarMeta.moduleFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0a0f18] border border-[#32527B]/60 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#32527B]/40 bg-[#0d1422]/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FDCC0D]/10 border border-[#FDCC0D]/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FDCC0D]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                El Arte del Remix en AI Studio
              </h2>
              <span className="text-[11px] font-mono-telemetry text-slate-400">
                Metodología SGX: De espectadores a arquitectos de realidades
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

        {/* Pillar Selector Strip */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#32527B]/30 bg-[#070b12] overflow-x-auto scrollbar-none">
          <span className="text-xs text-slate-400 whitespace-nowrap font-mono-telemetry mr-2">Pilar:</span>
          {(Object.keys(PILLARS) as PillarId[]).map((pId) => {
            const p = PILLARS[pId];
            const isSelected = selectedPillar === pId;
            return (
              <button
                key={pId}
                onClick={() => {
                  soundEngine.playPillarSwitchSound();
                  setSelectedPillar(pId);
                  onSelectPillar(pId);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#32527B] text-[#FDCC0D] border-[#FDCC0D]/60 shadow-md'
                    : 'bg-[#0a0f18] text-slate-300 border-transparent hover:border-[#32527B]'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 px-6 border-b border-[#32527B]/30 bg-[#0a0f18] text-xs">
          <button
            onClick={() => setActiveTab('PROMPT_BUILDER')}
            className={`py-3 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'PROMPT_BUILDER'
                ? 'border-[#FDCC0D] text-[#FDCC0D]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prompt Quirúrgico</span>
          </button>
          <button
            onClick={() => setActiveTab('WORKFLOW')}
            className={`py-3 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'WORKFLOW'
                ? 'border-[#00FFFF] text-[#00FFFF]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Los 3 Pasos del Remix</span>
          </button>
          <button
            onClick={() => setActiveTab('CODE_INSPECTOR')}
            className={`py-3 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'CODE_INSPECTOR'
                ? 'border-[#4A7AB7] text-[#00FFFF]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código Aislado ({pillarMeta.moduleFile})</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {activeTab === 'PROMPT_BUILDER' && (
            <div className="space-y-5">
              {/* Pillar Header Card */}
              <div className="p-4 bg-[#0d1422] border border-[#32527B]/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-heading">{pillarMeta.name}</span>
                    <span className="text-xs text-[#FDCC0D] font-mono-telemetry">({pillarMeta.archetype})</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{pillarMeta.tagline}</p>
                </div>
                <div className="text-xs font-mono-telemetry bg-black/40 px-3 py-1.5 rounded border border-white/10 text-[#00FFFF]">
                  {pillarMeta.moduleFile}
                </div>
              </div>

              {/* Pre-programmed Challenge Recipe */}
              <div>
                <span className="text-xs text-slate-400 block mb-2 font-semibold">
                  Reto de Aprendizaje Pre-programado:
                </span>
                <div className="p-3 bg-black/50 border border-[#FDCC0D]/30 rounded-lg text-xs text-slate-200 leading-relaxed">
                  {pillarMeta.challenge}
                </div>
              </div>

              {/* Custom Goal Input */}
              <div>
                <label className="text-xs text-slate-400 block mb-2 font-semibold">
                  Personalizar Mutación Quirúrgica (Opcional):
                </label>
                <textarea
                  rows={3}
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder={`Ej: ${pillarMeta.promptExample}`}
                  className="w-full bg-[#050505] border border-[#32527B]/50 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#FDCC0D] transition-colors"
                />
              </div>

              {/* Formatted Prompt Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-semibold">
                    Prompt Completo Listo para Copiar a AI Studio:
                  </span>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-[#FDCC0D] hover:bg-[#e5b800] text-black rounded transition-all shadow"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? '¡Copiado al Portapapeles!' : 'Copiar Prompt para Gemini'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-[#050505] border border-[#32527B]/40 rounded-xl text-[11px] font-mono-telemetry text-slate-300 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap">
                  {getFullSurgicalPrompt()}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'WORKFLOW' && (
            <div className="space-y-6">
              <div className="text-xs text-slate-300 leading-relaxed">
                El mayor error que se comete al usar IA sin método es darle instrucciones genéricas como <code className="text-rose-400">"Hazme un portafolio web"</code>. Eso produce código monolítico, pesado y lleno de alucinaciones. La clave del éxito de Spatialgineers radica en la <strong className="text-[#FDCC0D]">precisión y la iteración modular</strong>:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#0d1422] border border-[#32527B]/40 rounded-xl space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#FDCC0D] text-black font-bold flex items-center justify-center text-xs font-heading">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-white font-heading">Aislar</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Abran únicamente el archivo del módulo que les corresponde (ej. <code className="text-[#00FFFF] font-mono-telemetry">{pillarMeta.moduleFile}</code>) en Google AI Studio. No carguen todo el proyecto de golpe.
                  </p>
                </div>

                <div className="p-4 bg-[#0d1422] border border-[#32527B]/40 rounded-xl space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#00FFFF] text-black font-bold flex items-center justify-center text-xs font-heading">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-white font-heading">Contextualizar</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Provean el archivo <code className="text-[#00FFFF] font-mono-telemetry">sgx-config.js</code> y el módulo seleccionado para que la IA entienda las constantes, la paleta y las reglas del entorno sin inventar dependencias.
                  </p>
                </div>

                <div className="p-4 bg-[#0d1422] border border-[#32527B]/40 rounded-xl space-y-2">
                  <div className="w-7 h-7 rounded-full bg-[#B87333] text-white font-bold flex items-center justify-center text-xs font-heading">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-white font-heading">Mutar (Prompt Quirúrgico)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Instruyan cambios exactos y delimitados: "Reemplaza el cuadrado por mi sprite, haz que la barra espaciadora salte y suma puntos de combo". Si algo falla, restauran el Baseline y prueban de nuevo.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#050505] border border-[#FDCC0D]/30 rounded-xl text-xs space-y-2">
                <span className="text-[#FDCC0D] font-bold block font-heading">FILOSOFÍA DE LA PLASTILINA SGX:</span>
                <p className="text-slate-300 leading-relaxed">
                  "Este ecosistema es su laboratorio. Si el código se rompe por completo durante el proceso, simplemente restauran el módulo original del Baseline, verifican en qué falló su prompt y vuelven a intentarlo. Utilícenlo como plastilina; el objetivo es que aprendan a dirigir a la IA, no que la IA trabaje por ustedes ciegamente."
                </p>
              </div>
            </div>
          )}

          {activeTab === 'CODE_INSPECTOR' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#00FFFF]" />
                  <span className="text-xs font-mono-telemetry text-slate-200 font-bold">
                    modules/{pillarMeta.moduleFile}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs bg-white/10 hover:bg-white/15 text-slate-200 rounded transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copiado' : 'Copiar Código'}</span>
                  </button>
                  <button
                    onClick={handleDownloadModule}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs bg-[#32527B] hover:bg-[#4A7AB7] text-white rounded transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar .JS</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-[#050505] border border-[#32527B]/40 rounded-xl text-[11px] font-mono-telemetry text-slate-300 overflow-x-auto max-h-[380px] leading-relaxed">
                {getModuleCode(selectedPillar)}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#32527B]/40 bg-[#0d1422]/90">
          <div className="text-xs text-slate-400">
            Afinidad Seleccionada: <strong className="text-[#FDCC0D]">{pillarMeta.name}</strong>
          </div>
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
          >
            Cerrar Laboratorio
          </button>
        </div>
      </div>
    </div>
  );
};
