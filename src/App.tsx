/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX OMNI-CANVAS | Spatialgineers LLC
 * Baseline Template & Interactive Playground (Modular Edition)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PillarId, PILLARS, DEFAULT_CONFIG } from './config/sgx-config';
import { soundEngine } from './services/sound-effects';
import { SGXHeader } from './components/SGXHeader';
import { SGXLoader } from './components/SGXLoader';
import { SGXRemixLab } from './components/SGXRemixLab';
import { SGXGrimoireModal } from './components/SGXGrimoireModal';
import { SGXExportModal } from './components/SGXExportModal';
import { SGXPillarScopeModal } from './components/SGXPillarScopeModal';

import { ShowcaseSystemPortfolioModule } from './components/modules/ShowcaseSystemPortfolioModule';
import { Sparkles, BookOpen, Download, Compass } from 'lucide-react';

export default function App() {
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [activePillar, setActivePillar] = useState<PillarId>('SHOWCASE_SYSTEM');
  const [isStageMode, setIsStageMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals
  const [isRemixLabOpen, setIsRemixLabOpen] = useState<boolean>(false);
  const [isGrimoireOpen, setIsGrimoireOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isScopeModalOpen, setIsScopeModalOpen] = useState<boolean>(false);

  // Toggle Mute
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMute(next);
      return next;
    });
  }, []);

  // Global Keyboard Shortcuts (Grimorio Cap XVI)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Prevent native window scroll on arrow keys and spacebar
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      // Hotkey F: Stage Mode
      if (e.code === 'KeyF') {
        e.preventDefault();
        setIsStageMode((prev) => !prev);
        soundEngine.playClickSound();
      }
      // Hotkey M: Mute
      else if (e.code === 'KeyM') {
        e.preventDefault();
        handleToggleMute();
      }
      // Hotkey Esc: Close modals or exit Stage mode
      else if (e.code === 'Escape') {
        if (isScopeModalOpen) setIsScopeModalOpen(false);
        else if (isRemixLabOpen) setIsRemixLabOpen(false);
        else if (isGrimoireOpen) setIsGrimoireOpen(false);
        else if (isExportOpen) setIsExportOpen(false);
        else if (isStageMode) setIsStageMode(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleToggleMute, isExportOpen, isGrimoireOpen, isRemixLabOpen, isScopeModalOpen, isStageMode]);

  const currentPillarMeta = PILLARS[activePillar];

  return (
    <div className="relative w-full h-screen min-h-screen flex flex-col bg-[#0A1128] text-slate-100 overflow-hidden select-none">
      {/* Official SGX Holographic Loader on initial boot */}
      {showLoader && (
        <SGXLoader onComplete={() => setShowLoader(false)} />
      )}

      {/* Top Bar Contract (Grimorio & Universal Design) */}
      <SGXHeader
        activePillar={activePillar}
        onSelectPillar={setActivePillar}
        onOpenRemixLab={() => setIsRemixLabOpen(true)}
        onOpenGrimoire={() => setIsGrimoireOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenScopeModal={() => setIsScopeModalOpen(true)}
        onToggleStageMode={() => setIsStageMode(!isStageMode)}
        isStageMode={isStageMode}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Secondary Sub-Bar: Active Pillar Architecture Status (Hidden in Stage Mode) */}
      {!isStageMode && (
        <div className="bg-[#0e1736] border-b border-[#51E6C4]/20 px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 z-30">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-white font-bold font-heading">{currentPillarMeta.name}</span>
            <span className="text-slate-600">·</span>
            <span className="text-[#51E6C4]">{currentPillarMeta.archetype}</span>
            <span className="text-slate-600">·</span>
            <span className="font-mono-telemetry text-slate-400">{currentPillarMeta.codename}</span>
            <span className="text-slate-600 hidden md:inline">·</span>
            <span className="hidden md:inline text-slate-400 truncate max-w-md">
              {currentPillarMeta.tagline}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playClickSound();
                setShowLoader(true);
              }}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-[#51E6C4] hover:underline"
              title="Reproducir animación cinemática y boot holográfico oficial SGX"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intro SGX</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setIsGrimoireOpen(true)}
              className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition-colors"
            >
              <BookOpen className="w-3 h-3 text-slate-400" />
              <span>Grimorio v2026.5</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-[#51E6C4] hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Single-File</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary Active Module Viewport: Showcase × System */}
      <main className="relative flex-1 w-full h-full overflow-hidden bg-[#0A1128]">
        <ShowcaseSystemPortfolioModule
          onOpenRemix={() => setIsRemixLabOpen(true)}
          isMuted={isMuted}
        />
      </main>

      {/* Interactive Modals */}
      <SGXRemixLab
        initialPillar={activePillar}
        isOpen={isRemixLabOpen}
        onClose={() => setIsRemixLabOpen(false)}
        onSelectPillar={setActivePillar}
      />

      <SGXGrimoireModal
        isOpen={isGrimoireOpen}
        onClose={() => setIsGrimoireOpen(false)}
      />

      <SGXExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        activePillar={activePillar}
      />

      <SGXPillarScopeModal
        initialPillar={activePillar}
        isOpen={isScopeModalOpen}
        onClose={() => setIsScopeModalOpen(false)}
        onSelectPillar={setActivePillar}
      />
    </div>
  );
}
