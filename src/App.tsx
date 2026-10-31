/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX OMNI-CANVAS | Spatialgineers LLC
 * Baseline Template & Interactive Playground (Modular Edition)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PillarId } from './config/sgx-config';
import { soundEngine } from './services/sound-effects';
import { SGXLoader } from './components/SGXLoader';
import { SGXRemixLab } from './components/SGXRemixLab';
import { SGXGrimoireModal } from './components/SGXGrimoireModal';
import { SGXExportModal } from './components/SGXExportModal';
import { SGXPillarScopeModal } from './components/SGXPillarScopeModal';
import { ShowcaseSystemPortfolioModule } from './components/modules/ShowcaseSystemPortfolioModule';

export default function App() {
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [activePillar, setActivePillar] = useState<PillarId>('SHOWCASE_SYSTEM');
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

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'KeyM') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.code === 'Escape') {
        if (isScopeModalOpen) setIsScopeModalOpen(false);
        else if (isRemixLabOpen) setIsRemixLabOpen(false);
        else if (isGrimoireOpen) setIsGrimoireOpen(false);
        else if (isExportOpen) setIsExportOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleToggleMute, isExportOpen, isGrimoireOpen, isRemixLabOpen, isScopeModalOpen]);

  return (
    <div className="relative w-screen h-screen min-h-screen flex flex-col bg-[#0A1128] text-slate-100 overflow-hidden select-none">
      {showLoader && (
        <SGXLoader onComplete={() => setShowLoader(false)} />
      )}

      {/* Primary Active Module Viewport: Showcase × System (3D Canvas at z-10, Planet Panels at z-50) */}
      <main className="relative flex-1 w-full h-full bg-[#0A1128]">
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

      {/* Full-Application Viewport & Character/Terminal Pixel-Art Overlay (z-30: above 3D scene z-10, below planet panels z-50) */}
      <img
        src="/assets/aistudio/viewport_6e3741b8.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="fixed inset-0 z-30 w-full h-full object-fill [image-rendering:pixelated] pointer-events-none select-none"
      />
    </div>
  );
}
