/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MANIFIESTO DE ALCANCE Y GUÍA PARA IA (Google AI Studio)
 * Define el Scope abierto de cada pilar para que cualquier IA entienda la libertad creativa del creador.
 */

import React, { useState } from 'react';
import { PillarId, PILLARS } from '../config/sgx-config';
import { soundEngine } from '../services/sound-effects';
import {
  Compass,
  Sparkles,
  X,
  Copy,
  Check,
  Zap,
  Lightbulb,
  ShieldCheck,
  Cpu,
  FileCode,
  ArrowRight
} from 'lucide-react';

interface SGXPillarScopeModalProps {
  initialPillar: PillarId;
  isOpen: boolean;
  onClose: () => void;
  onSelectPillar: (pillar: PillarId) => void;
}

export const SGXPillarScopeModal: React.FC<SGXPillarScopeModalProps> = ({
  initialPillar,
  isOpen,
  onClose,
  onSelectPillar
}) => {
  const [selectedPillar, setSelectedPillar] = useState<PillarId>(initialPillar);
  const [customIdea, setCustomIdea] = useState<string>('');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  if (!isOpen) return null;

  const current = PILLARS[selectedPillar];

  const generateAIPrompt = (): string => {
    const userGoal = customIdea.trim().length > 0 ? customIdea : current.challenge;

    return `// ========================================================
// PROMPT DIRECTO PARA GOOGLE AI STUDIO (GEMINI 3.8 FLASH)
// CONTRATO DE DOMINIO Y ALCANCE ABIERTO (SPATIALGINEERS SGX)
// ========================================================

Hola Gemini, estoy desarrollando mi portafolio interactivo con el SGX Omni-Canvas.
Quiero que entiendas que el código actual de la plantilla es solo mi punto de partida (Baseline "Hello World"), y que mi pilar seleccionado no es un molde rígido: tengo total libertad para llevarlo a lo que yo quiera.

PILAR SELECCIONADO: ${current.name} (${current.archetype})
DOMINIO / SCOPE: ${current.scopeDescription}
ARCHIVO PRINCIPAL: modules/${current.moduleFile} (activado en sgx-config.js)

MI VISIÓN / LO QUE QUIERO CONSTRUIR:
"${userGoal}"

REGLAS TÉCNICAS INQUEBRANTABLES (MANIFIESTO SGX):
1. Fricción Cero: Debe correr de forma autónoma en el navegador con ES Modules/WebGL sin dependencias rotas.
2. Si usas Three.js, incluye siempre limpieza profunda de mallas (.dispose()) al eliminar objetos.
3. Si utilizas archivos subidos por el usuario, decodifícalos localmente como Blob URLs para evadir CORS al 100%.
4. Mantén la tasa de refresco a 60 FPS y una estética limpia tipo Neo-Ingeniería / Cyberpunk.

Por favor, actúa como mi arquitecto técnico senior y reescribe/expande ${current.moduleFile} para convertirlo en mi portafolio interactivo soñado.`;
  };

  const handleCopyPrompt = () => {
    soundEngine.playClickSound();
    navigator.clipboard.writeText(generateAIPrompt());
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0a0f18] border border-[#32527B]/60 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#32527B]/40 bg-[#0d1422]/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FDCC0D]/10 border border-[#FDCC0D]/30 flex items-center justify-center">
              <Compass className="w-4 h-4 text-[#FDCC0D]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Alcance del Pilar & Guía para IA
              </h2>
              <span className="text-[11px] font-mono-telemetry text-slate-400">
                Los pilares son territorios abiertos: llévalos a lo que te dé la gana
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
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#32527B]/30 bg-[#070b12] overflow-x-auto scrollbar-none shrink-0">
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

        {/* Scrollable Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Freedom Callout Banner */}
          <div className="p-4 bg-gradient-to-r from-[#162032] via-[#0d1422] to-[#0a0f18] border border-[#FDCC0D]/40 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-[#FDCC0D] font-bold font-heading text-xs">
              <Zap className="w-4 h-4" />
              <span>EL PRINCIPIO DE LIBERTAD CREATIVA SGX</span>
            </div>
            <p className="text-slate-200">
              No estás obligado a mantener el minijuego, la maqueta o el texto de la demo. <strong>{current.name}</strong> es simplemente una zapata de alto rendimiento. En Google AI Studio puedes pedirle a Gemini transformar este archivo en <strong>cualquier cosa</strong> que encaje dentro de este dominio técnico.
            </p>
          </div>

          {/* Current Pillar Scope Card */}
          <div className="p-4 bg-[#0d1422] border border-[#32527B]/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#32527B]/30">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-heading">{current.name}</span>
                <span className="text-[#FDCC0D] font-mono-telemetry font-bold">({current.archetype})</span>
              </div>
              <span className="font-mono-telemetry text-[#00FFFF] text-[11px]">
                modules/{current.moduleFile}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Definición y Alcance del Dominio (Scope):
              </span>
              <p className="text-slate-200 bg-black/40 p-3 rounded-lg border border-white/5">
                {current.scopeDescription}
              </p>
            </div>

            {/* Creative Possibilities List */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#FDCC0D]" />
                <span>¿Qué puedes construir con este pilar? (Ejemplos sin límite):</span>
              </span>
              <ul className="space-y-1.5 pl-2">
                {current.creativePossibilities.map((pos, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <ArrowRight className="w-3.5 h-3.5 text-[#00FFFF] shrink-0 mt-0.5" />
                    <span>{pos}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Prompt Generator */}
          <div className="p-4 bg-[#0d1422] border border-[#32527B]/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold font-heading">
                <Cpu className="w-4 h-4 text-[#00FFFF]" />
                <span>¿Qué tienes en mente para este pilar?</span>
              </div>
              <button
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#FDCC0D] hover:bg-[#e5b800] text-black rounded-lg transition-all shadow"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? '¡Copiado para Gemini!' : 'Copiar Prompt para AI Studio'}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              placeholder={`Escribe tu visión aquí (ej: "Quiero que mi portafolio sea un ${current.creativePossibilities[0]}")`}
              className="w-full bg-[#050505] border border-[#32527B]/50 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#FDCC0D] transition-colors"
            />

            <span className="text-[10px] text-slate-500 block">
              Pega este prompt generado en el chat de Google AI Studio con Gemini 3.8 Flash para que la IA entienda el scope y construya tu visión exacta.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#32527B]/40 bg-[#0d1422]/90 text-xs text-slate-400 shrink-0">
          <span>El límite del portafolio lo define tu imaginación · Spatialgineers v2026.5</span>
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
          >
            Cerrar Manifiesto
          </button>
        </div>
      </div>
    </div>
  );
};
