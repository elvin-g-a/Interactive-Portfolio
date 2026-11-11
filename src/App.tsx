/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX OMNI-CANVAS | Spatialgineers LLC
 * Baseline Template & Interactive Playground (Modular Edition)
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  PillarId,
  VERTICAL_VIEWPORT_MEDIA_QUERY,
  MOBILE_ONLY_MEDIA_QUERY,
  TABLET_LANDSCAPE_MEDIA_QUERY,
  DESKTOP_OR_TABLET_LANDSCAPE_MEDIA_QUERY,
  MOBILE_OR_TABLET_DEVICE_MEDIA_QUERY,
  isMobileOrTabletViewport,
  isMobileOnlyViewport,
  isTabletLandscapeViewport,
  isDesktopOrTabletLandscapeViewport,
  isMobileOrTabletDeviceViewport
} from './config/sgx-config';
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
  const [isVerticalOverlay, setIsVerticalOverlay] = useState<boolean>(() =>
    isMobileOrTabletViewport()
  );
  const [isMobileOnly, setIsMobileOnly] = useState<boolean>(() =>
    isMobileOnlyViewport()
  );
  const [isTabletLandscape, setIsTabletLandscape] = useState<boolean>(() =>
    isTabletLandscapeViewport()
  );
  const [isDesktopOrTabletLandscape, setIsDesktopOrTabletLandscape] = useState<boolean>(() =>
    isDesktopOrTabletLandscapeViewport()
  );
  const [isMobileOrTabletDevice, setIsMobileOrTabletDevice] = useState<boolean>(() =>
    isMobileOrTabletDeviceViewport()
  );
  const [hasSelectedPlanet, setHasSelectedPlanet] = useState<boolean>(false);

  // Sync portrait (vertical), tablet landscape (centered), and desktop/mobile landscape overlay modes
  useEffect(() => {
    let rafId = 0;
    const syncViewportMode = () => {
      setIsVerticalOverlay(isMobileOrTabletViewport());
      setIsMobileOnly(isMobileOnlyViewport());
      setIsTabletLandscape(isTabletLandscapeViewport());
      setIsDesktopOrTabletLandscape(isDesktopOrTabletLandscapeViewport());
      setIsMobileOrTabletDevice(isMobileOrTabletDeviceViewport());
    };

    const handleOrientationChange = () => {
      syncViewportMode();
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(syncViewportMode);
    };

    syncViewportMode();
    const verticalMediaQuery = window.matchMedia(VERTICAL_VIEWPORT_MEDIA_QUERY);
    const mobileMediaQuery = window.matchMedia(MOBILE_ONLY_MEDIA_QUERY);
    const tabletLandscapeMediaQuery = window.matchMedia(TABLET_LANDSCAPE_MEDIA_QUERY);
    const desktopOrTabletLandscapeMediaQuery = window.matchMedia(DESKTOP_OR_TABLET_LANDSCAPE_MEDIA_QUERY);
    const mobileOrTabletDeviceMediaQuery = window.matchMedia(MOBILE_OR_TABLET_DEVICE_MEDIA_QUERY);
    verticalMediaQuery.addEventListener('change', syncViewportMode);
    mobileMediaQuery.addEventListener('change', syncViewportMode);
    tabletLandscapeMediaQuery.addEventListener('change', syncViewportMode);
    desktopOrTabletLandscapeMediaQuery.addEventListener('change', syncViewportMode);
    mobileOrTabletDeviceMediaQuery.addEventListener('change', syncViewportMode);
    window.addEventListener('resize', syncViewportMode);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      cancelAnimationFrame(rafId);
      verticalMediaQuery.removeEventListener('change', syncViewportMode);
      mobileMediaQuery.removeEventListener('change', syncViewportMode);
      tabletLandscapeMediaQuery.removeEventListener('change', syncViewportMode);
      desktopOrTabletLandscapeMediaQuery.removeEventListener('change', syncViewportMode);
      mobileOrTabletDeviceMediaQuery.removeEventListener('change', syncViewportMode);
      window.removeEventListener('resize', syncViewportMode);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

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

  const shouldShiftMobileOverlay = isVerticalOverlay && isMobileOnly && hasSelectedPlanet;
  const shouldCenterTabletLandscape = !isVerticalOverlay && isTabletLandscape;

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
          isVerticalLayout={isVerticalOverlay}
          isMobileOnly={isMobileOnly}
          isDesktopOrTabletLandscape={isDesktopOrTabletLandscape}
          isMobileOrTabletDevice={isMobileOrTabletDevice}
          onPlanetSelectionChange={setHasSelectedPlanet}
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

      {/* Unstretched Viewport & Extended Wall Pixel-Art Overlay (z-30: above 3D scene z-10, below planet panels z-50) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-30 overflow-hidden pointer-events-none select-none"
      >
        {shouldCenterTabletLandscape ? (
          <div className="absolute top-0 left-[calc(50vw_-_188.888889vh)] flex flex-row items-start justify-start h-screen">
            <div className="w-[100vh] h-screen shrink-0 bg-[linear-gradient(to_bottom,#13184e_0%,#13184e_5.28%,#3b3c7f_5.28%,#3b3c7f_13.06%,#5f6593_13.06%,#5f6593_84.72%,#3b3c7f_84.72%,#3b3c7f_92.22%,#5c6285_92.22%,#5c6285_92.50%,#1d2752_92.50%,#1d2752_96.94%,#0d1049_96.94%,#0d1049_97.78%,#02030f_97.78%,#02030f_98.33%,#0d1049_98.33%,#0d1049_100%)]" />
            <img
              src="/assets/aistudio/viewport_fbe8d8eb.png"
              alt=""
              draggable={false}
              className="h-screen w-auto max-w-none shrink-0 [image-rendering:pixelated] pointer-events-none select-none"
            />
            <div className="w-[100vw] h-screen shrink-0 bg-[linear-gradient(to_bottom,#3b3c7f_0%,#3b3c7f_13.06%,#5f6593_13.06%,#5f6593_84.72%,#3b3c7f_84.72%,#3b3c7f_92.22%,#5c6285_92.22%,#5c6285_100%)]" />
          </div>
        ) : (
          <div
            className={`flex flex-row items-start justify-start w-[calc(100vw+8vh)] h-screen transition-transform duration-500 ease-out motion-reduce:transition-none will-change-transform ${
              shouldShiftMobileOverlay ? '-translate-x-[6.25vh]' : 'translate-x-0'
            }`}
          >
            <img
              src={
                isVerticalOverlay
                  ? '/assets/aistudio/viewport-vertical_94332b37.png'
                  : '/assets/aistudio/viewport_fbe8d8eb.png'
              }
              alt=""
              draggable={false}
              className="h-screen w-auto max-w-none shrink-0 [image-rendering:pixelated] pointer-events-none select-none"
            />
            <div
              className={
                isVerticalOverlay
                  ? 'flex-1 h-screen bg-[linear-gradient(to_bottom,#282675_0%,#282675_9.38%,#5d6492_9.38%,#5d6492_90.63%,#282675_90.63%,#282675_95.47%,#5a6183_95.47%,#5a6183_99.84%,#282675_99.84%,#282675_100%)]'
                  : 'flex-1 h-screen bg-[linear-gradient(to_bottom,#3b3c7f_0%,#3b3c7f_13.06%,#5f6593_13.06%,#5f6593_84.72%,#3b3c7f_84.72%,#3b3c7f_92.22%,#5c6285_92.22%,#5c6285_100%)]'
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
