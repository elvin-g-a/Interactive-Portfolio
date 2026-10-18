/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX Top Bar Contract (Strict 3-Zone Architecture)
 */

import React from 'react';
import { PillarId, PILLARS } from '../config/sgx-config';
import { Volume2, VolumeX, Sparkles, BookOpen, Download, Terminal, Maximize2, Compass } from 'lucide-react';
import { soundEngine } from '../services/sound-effects';

interface SGXHeaderProps {
  activePillar: PillarId;
  onSelectPillar: (pillar: PillarId) => void;
  onOpenRemixLab: () => void;
  onOpenGrimoire: () => void;
  onOpenExport: () => void;
  onOpenScopeModal: () => void;
  onToggleStageMode: () => void;
  isStageMode: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SGXHeader: React.FC<SGXHeaderProps> = ({
  activePillar,
  onSelectPillar,
  onOpenRemixLab,
  onOpenGrimoire,
  onOpenExport,
  onOpenScopeModal,
  onToggleStageMode,
  isStageMode,
  isMuted,
  onToggleMute
}) => {
  if (isStageMode) {
    // Stage mode (Grimorio Cap XVI: Hotkey F - Minimalist Floating Restorer)
    return (
      <div className="fixed top-3 right-4 z-50">
        <button
          onClick={onToggleStageMode}
          className="px-3 py-1.5 text-xs bg-[#0a0f18]/90 text-slate-300 hover:text-white border border-[#32527B]/60 rounded-md backdrop-blur-md shadow-xl transition-all"
        >
          Salir de Modo Escenario (F)
        </button>
      </div>
    );
  }

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#0A1128]/95 border-b border-[#51E6C4]/20 backdrop-blur-md z-40 shrink-0">
      {/* Zone 1: Single text element wordmark in display face (Orbitron) */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            soundEngine.playClickSound();
          }}
          className="text-lg font-black tracking-widest text-white font-heading hover:text-[#51E6C4] transition-colors whitespace-nowrap"
        >
          SGX OMNI-CANVAS
        </a>
        <span className="hidden sm:inline-block text-[11px] font-mono-telemetry text-slate-400">
          v2026.5
        </span>
      </div>

      {/* Zone 2: Navigation - Only Spark × Story tab per user instruction */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
        <div className="flex items-center p-1 bg-[#0e1736] rounded-lg border border-[#51E6C4]/35">
          <button
            onClick={() => {
              soundEngine.playPillarSwitchSound();
              onSelectPillar('SPARK_STORY');
            }}
            className="px-3.5 py-1.5 text-xs rounded-md transition-all whitespace-nowrap flex items-center gap-2 bg-[#141f45] text-[#51E6C4] font-bold shadow-sm border border-[#51E6C4]/60"
            title="Showcase x System: Portafolio Interactivo del Observador Cósmico"
          >
            <div className="w-2 h-2 rounded-full bg-[#51E6C4] shadow-[0_0_8px_#51E6C4]" />
            <span>Showcase x System</span>
          </button>
        </div>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            onOpenGrimoire();
          }}
          className="hover:text-slate-200 transition-colors whitespace-nowrap flex items-center gap-1.5 text-slate-300"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#51E6C4]" />
          <span>Grimorio SGX</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            onOpenExport();
          }}
          className="hover:text-[#51E6C4] transition-colors whitespace-nowrap flex items-center gap-1.5 text-slate-300"
        >
          <Download className="w-3.5 h-3.5 text-[#5E53CC]" />
          <span>Exportar Single-File</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action button + audio toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title={isMuted ? 'Activar Sonido (M)' : 'Silenciar Sonido (M)'}
          aria-label={isMuted ? 'Activar Sonido' : 'Silenciar Sonido'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#51E6C4]" />}
        </button>

        <button
          onClick={onToggleStageMode}
          className="hidden sm:flex p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Modo Escenario Inmersivo (Tecla F)"
          aria-label="Modo Escenario"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundEngine.playPulseSound();
            onOpenExport();
          }}
          className="px-4 py-2 text-xs font-semibold text-[#0A1128] bg-[#51E6C4] hover:bg-[#51E6C4]/90 rounded-lg transition-colors whitespace-nowrap shadow-[0_0_14px_rgba(81,230,196,0.35)] font-heading"
        >
          Exportar Single-File
        </button>
      </div>
    </header>
  );
};
