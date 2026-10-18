/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Loader Oficial de SGX (Spatialgineers Holographic Initializer)
 */

import React, { useEffect, useState } from 'react';
import { soundEngine } from '../services/sound-effects';
import { ShieldCheck, ChevronRight, Cpu } from 'lucide-react';

interface SGXLoaderProps {
  onComplete: () => void;
}

export const SGXLoader: React.FC<SGXLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Inicializando WebGL 2.0 & RoomEnvironment PBR...',
    'Montando Web Audio API Synthesizer & Analizador FFT...',
    'Verificando mitigación CORS para decodificación Blob local...',
    'Inyectando sgx-config.js y arquitectura modular...',
    'Sistemas en línea. Bienvenido al Arsenal SGX.'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + 5;
        const currentStep = Math.min(steps.length - 1, Math.floor((next / 100) * steps.length));
        setStepIndex(currentStep);
        return next;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [steps.length]);

  const handleEnter = () => {
    soundEngine.playPillarSwitchSound();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] text-white p-6 overflow-hidden">
      {/* Background Holographic Grid with scanning line */}
      <div className="absolute inset-0 holodeck-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-[#00FFFF]/10 to-transparent pointer-events-none animate-scanline" />

      {/* Center Hologram Pod */}
      <div className="relative z-10 max-w-md w-full bg-[#0a0f18]/90 border border-[#32527B]/60 p-8 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
        {/* Spatialgineers Crest Emblem */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          {/* Concentric rotating glowing rings */}
          <div className="absolute inset-0 border border-[#FDCC0D]/40 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute inset-2 border border-dashed border-[#00FFFF]/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
          <div className="absolute inset-4 border border-[#32527B] rounded-full" />
          
          <div className="relative w-12 h-12 bg-gradient-to-br from-[#162032] to-[#0a0f18] border border-[#FDCC0D] rounded-lg flex items-center justify-center shadow-lg">
            <Cpu className="w-6 h-6 text-[#FDCC0D]" />
          </div>
        </div>

        {/* Brand Lockup */}
        <span className="text-[11px] font-mono-telemetry text-slate-400 tracking-wider uppercase mb-1">
          Spatialgineers LLC · Baseline Template
        </span>
        <h1 className="text-2xl font-black text-white font-heading tracking-widest mb-2">
          SGX OMNI-CANVAS
        </h1>
        <p className="text-xs text-slate-400 mb-6 font-light">
          Infraestructura modular para arquitectos de realidades.
        </p>

        {/* Progress Bar & Telemetry Diagnostics */}
        <div className="w-full space-y-2 mb-6">
          <div className="flex justify-between text-[11px] font-mono-telemetry text-slate-400">
            <span className="text-left truncate max-w-[280px]">{steps[stepIndex]}</span>
            <span className="text-[#FDCC0D] font-bold">{progress}%</span>
          </div>

          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-[#32527B]/40">
            <div
              className="h-full bg-gradient-to-r from-[#32527B] via-[#FDCC0D] to-[#00FFFF] rounded-full transition-all duration-100 shadow-md"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        {progress >= 100 ? (
          <button
            onClick={handleEnter}
            className="w-full py-3 px-6 bg-[#FDCC0D] hover:bg-[#e5b800] text-black font-bold font-heading text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>INGRESAR AL PLAYGROUND</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <div className="text-[11px] font-mono-telemetry text-slate-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FFFF] animate-ping" />
            <span>Sincronizando hilos de computación WebGL...</span>
          </div>
        )}
      </div>
    </div>
  );
};
