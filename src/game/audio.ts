/**
 * Procedural Web Audio Sound Synthesizer for Outpost Pioneer.
 * Generates all sound effects and ambient musical cues via Web Audio API.
 * Zero external audio files, zero 404s, instant response.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private volume: number = 0.3;

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Generic helper for synth notes
  private playTone(freq: number, type: OscillatorType, duration: number, startVol = 0.4, endVol = 0.001) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(startVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(endVol, 0.0001), this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }

  // Noise generator for hits/wooshes/explosions
  private playNoise(duration: number, lowpassFreq = 800, startVol = 0.3) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(lowpassFreq, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(startVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start();
    } catch {
      // Audio fallback
    }
  }

  // Specific gameplay sounds
  public playFootstep() {
    this.playNoise(0.06, 450, 0.08);
  }

  public playSwing() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {}
  }

  public playHit() {
    this.playNoise(0.15, 1200, 0.35);
    this.playTone(110, 'triangle', 0.12, 0.3);
  }

  public playWoodChop() {
    this.playTone(180, 'square', 0.08, 0.25);
    this.playNoise(0.08, 1400, 0.25);
  }

  public playMineRock() {
    this.playTone(520, 'triangle', 0.1, 0.3);
    this.playTone(280, 'square', 0.12, 0.2);
    this.playNoise(0.07, 2200, 0.2);
  }

  public playHarvest() {
    this.playTone(440, 'sine', 0.1, 0.2);
    this.playTone(660, 'sine', 0.15, 0.25);
  }

  public playBuild() {
    this.playTone(330, 'triangle', 0.1, 0.3);
    setTimeout(() => this.playTone(493.88, 'triangle', 0.15, 0.35), 80);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.25, 0.4), 160);
  }

  public playWaveWarning() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    try {
      // Ominous war horn
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(112, this.ctx.currentTime); // detuned for beating

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.8);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc2.start();
      osc.stop(this.ctx.currentTime + 1.8);
      osc2.stop(this.ctx.currentTime + 1.8);
    } catch {}
  }

  public playVictory() {
    const notes = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.35, 0.3), i * 140);
    });
  }

  public playDefeat() {
    const notes = [349.23, 311.13, 261.63, 196]; // F4, Eb4, C4, G3
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.4, 0.25), i * 220);
    });
  }

  public playArrowFire() {
    this.playNoise(0.09, 3200, 0.2);
    this.playTone(400, 'sine', 0.08, 0.15);
  }

  public playLevelUp() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((n, idx) => {
      setTimeout(() => this.playTone(n, 'triangle', 0.2, 0.25), idx * 100);
    });
  }
}

export const sound = new SoundSystem();
