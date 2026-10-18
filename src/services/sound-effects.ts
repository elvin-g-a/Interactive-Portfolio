/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX Audio Engine & Web Audio Synthesizer (Grimorio Cap V & XV)
 * Zero external mp3/wav dependencies - 100% Client-side Web Audio API
 */

class SGXAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.65;
  private isSynthRunning: boolean = false;
  private synthTimer: number | null = null;
  private beatStep: number = 0;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private isMicActive: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.8;

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  /**
   * Crisp tactical UI click
   */
  public playClickSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio safety fallback
    }
  }

  /**
   * Resonant Pillar Activation Sound
   */
  public playPillarSwitchSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(560, now + 0.15);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(280, now);
      osc2.frequency.exponentialRampToValueAtTime(1120, now + 0.2);

      gain.gain.setValueAtTime(0.12 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } catch {
      // safe fallback
    }
  }

  /**
   * Pulse Trigger (HotKey P - Grimoire Cap XVI)
   */
  public playPulseSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // safe
    }
  }

  /**
   * Game collectible gem pickup sound
   */
  public playCollectSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.05); // A5
      osc.frequency.setValueAtTime(1174.66, now + 0.1); // D6

      gain.gain.setValueAtTime(0.12 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // safe
    }
  }

  /**
   * Retro Arcade Jump Sound (Geometry Dash style square/triangle blip)
   */
  public playArcadeJumpSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);

      gain.gain.setValueAtTime(0.14 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // safe fallback
    }
  }

  /**
   * Retro Arcade Crash Explosion Sound
   */
  public playArcadeCrashSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // White noise burst + low downward pitch osc
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.18);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
      noise.stop(now + 0.18);
    } catch {
      // safe fallback
    }
  }

  /**
   * Retro Jump Ring / Boost Orb Sound
   */
  public playArcadeRingSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(660, now + 0.05);
      osc.frequency.setValueAtTime(990, now + 0.09);

      gain.gain.setValueAtTime(0.18 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // safe fallback
    }
  }

  /**
   * Continuous Cyber Synthesizer Loop for Synthesize & Stage testing
   */
  public toggleCyberSynth(start?: boolean): boolean {
    const shouldStart = start !== undefined ? start : !this.isSynthRunning;
    this.initContext();

    if (shouldStart && !this.isSynthRunning) {
      this.isSynthRunning = true;
      this.beatStep = 0;
      this.synthTimer = window.setInterval(() => {
        this.stepBeat();
      }, 125); // 120 BPM 16th notes
      return true;
    } else if (!shouldStart && this.isSynthRunning) {
      this.isSynthRunning = false;
      if (this.synthTimer) {
        clearInterval(this.synthTimer);
        this.synthTimer = null;
      }
      return false;
    }
    return this.isSynthRunning;
  }

  private stepBeat() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const step = this.beatStep % 16;
    this.beatStep++;

    // 1. Kick on 0, 4, 8, 12
    if (step % 4 === 0) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(150, now);
      kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.1);
      kickGain.gain.setValueAtTime(0.25 * this.volume, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      kickOsc.connect(kickGain);
      kickGain.connect(this.masterGain);
      kickOsc.start(now);
      kickOsc.stop(now + 0.12);
    }

    // 2. Cyber Hi-hat on 2, 6, 10, 14
    if (step % 2 === 0) {
      const bufferSize = this.ctx.sampleRate * 0.03;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(7000, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06 * this.volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.03);
    }

    // 3. Arpeggiator Melody notes
    const notes = [130.81, 155.56, 196.00, 233.08, 261.63, 311.13, 392.00, 466.16]; // C minor pentatonic
    const noteFreq = notes[step % notes.length];
    if (step % 2 === 1) {
      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = 'sawtooth';
      leadOsc.frequency.setValueAtTime(noteFreq, now);
      leadGain.gain.setValueAtTime(0.05 * this.volume, now);
      leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      leadOsc.connect(leadGain);
      leadGain.connect(this.masterGain);
      leadOsc.start(now);
      leadOsc.stop(now + 0.08);
    }
  }

  /**
   * Spatial Audio Node simulation for Stage module
   * Calculates volume and stereo pan based on distance to source
   */
  public playSpatialBeaconPulse(beaconX: number, beaconZ: number, camX: number, camZ: number, pitch = 440) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const dx = beaconX - camX;
      const dz = beaconZ - camZ;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const maxDist = 35;
      if (dist > maxDist) return;

      const attenuation = Math.max(0, 1 - dist / maxDist);
      const pan = Math.max(-1, Math.min(1, dx / 15));

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.7, now + 0.15);

      gain.gain.setValueAtTime(attenuation * 0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      if (panner) {
        panner.pan.setValueAtTime(pan, now);
        osc.connect(panner);
        panner.connect(gain);
      } else {
        osc.connect(gain);
      }
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // safe fallback
    }
  }

  /**
   * Live FFT Analysis reading (Grimorio Cap XV)
   * Returns normalized 0.0 - 1.0 ranges for Bass, Mids, Highs and Peak
   */
  public getAudioTelemetry(): { bass: number; mids: number; highs: number; peak: number } {
    if (!this.analyser) {
      return { bass: 0.05, mids: 0.05, highs: 0.05, peak: 0.05 };
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    let bassSum = 0;
    let midsSum = 0;
    let highsSum = 0;
    let peak = 0;

    // Bass: bins 1 to 10 (~20 - 250 Hz)
    const bassBins = Math.min(10, bufferLength);
    for (let i = 1; i < bassBins; i++) {
      bassSum += dataArray[i];
      if (dataArray[i] > peak) peak = dataArray[i];
    }

    // Mids: bins 10 to 45 (~250 - 2500 Hz)
    const midBins = Math.min(45, bufferLength);
    for (let i = bassBins; i < midBins; i++) {
      midsSum += dataArray[i];
      if (dataArray[i] > peak) peak = dataArray[i];
    }

    // Highs: bins 45 to bufferLength
    for (let i = midBins; i < bufferLength; i++) {
      highsSum += dataArray[i];
      if (dataArray[i] > peak) peak = dataArray[i];
    }

    const bass = bassSum / (bassBins * 255);
    const mids = midsSum / ((midBins - bassBins) * 255);
    const highs = highsSum / ((bufferLength - midBins) * 255);

    return {
      bass: Math.min(1, bass * 1.5),
      mids: Math.min(1, mids * 1.6),
      highs: Math.min(1, highs * 2.0),
      peak: peak / 255
    };
  }

  public isSynthActive(): boolean {
    return this.isSynthRunning;
  }

  // Cozy Sci-Fi Ambient Drone nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isDroneRunning: boolean = false;

  public toggleCozyDrone(): boolean {
    if (this.isDroneRunning) {
      this.stopCozyDrone();
      return false;
    } else {
      this.startCozyDrone();
      return true;
    }
  }

  public isCozyDroneActive(): boolean {
    return this.isDroneRunning;
  }

  public startCozyDrone() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isDroneRunning) return;

    try {
      const now = this.ctx.currentTime;
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.09 * this.volume, now + 2.5);

      // Warm low-pass filter for cozy intimate depth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);

      // Root note Eb2 ~77.78 Hz + subtle 5th Bb2 ~116.54 Hz
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(77.78, now);

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(116.54, now);

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);
      this.isDroneRunning = true;
    } catch {
      // safe fallback
    }
  }

  public stopCozyDrone() {
    if (!this.ctx || !this.isDroneRunning || !this.droneGain) return;
    try {
      const now = this.ctx.currentTime;
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
          this.droneGain?.disconnect();
        } catch {}
        this.droneOsc1 = null;
        this.droneOsc2 = null;
        this.droneGain = null;
        this.isDroneRunning = false;
      }, 1250);
    } catch {
      this.isDroneRunning = false;
    }
  }

  /**
   * Resonant Celestial Planet Chime
   */
  public playPlanetResonance(index: number = 0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const scale = [261.63, 311.13, 349.23, 392.00, 466.16, 523.25]; // Cozy cosmic pentatonic
      const baseFreq = scale[Math.abs(index) % scale.length];
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * 2, now); // Octave overtone

      gain.gain.setValueAtTime(0.12 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch {
      // safe fallback
    }
  }

  /**
   * Sci-fi Probe Launch Sound
   */
  public playProbeLaunchSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.3);

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // safe fallback
    }
  }
}

export const soundEngine = new SGXAudioEngine();
