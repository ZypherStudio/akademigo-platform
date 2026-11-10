// Pure Web Audio API Synthesizer & Procedural BGM Engine for Knowza
// 100% Offline, Zero external MP3 downloads, Zero latency, Studio Quality

class SoundSystem {
  private ctx: AudioContext | null = null;
  private sfxEnabled: boolean = true;
  private bgmEnabled: boolean = false;
  private bgmInterval: ReturnType<typeof setInterval> | null = null;
  private bgmStep: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedSfx = localStorage.getItem('knowza_sfx_enabled');
      const savedBgm = localStorage.getItem('knowza_bgm_enabled');
      if (savedSfx !== null) this.sfxEnabled = savedSfx === 'true';
      if (savedBgm !== null) this.bgmEnabled = savedBgm === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    localStorage.setItem('knowza_sfx_enabled', String(enabled));
  }

  public getSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public toggleSfx(): boolean {
    this.setSfxEnabled(!this.sfxEnabled);
    if (this.sfxEnabled) {
      this.playClick();
    }
    return this.sfxEnabled;
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    localStorage.setItem('knowza_bgm_enabled', String(enabled));
    if (enabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
  }

  public getBgmEnabled(): boolean {
    return this.bgmEnabled;
  }

  public toggleBgm(): boolean {
    this.setBgmEnabled(!this.bgmEnabled);
    return this.bgmEnabled;
  }

  // Legacy compat
  public setMuted(muted: boolean) {
    this.setSfxEnabled(!muted);
  }

  public getMuted(): boolean {
    return !this.sfxEnabled;
  }

  public toggleMute(): boolean {
    return !this.toggleSfx();
  }

  // Procedural Lo-Fi Study & Game Music (Soft Marimba / E-Piano Chord Progression)
  public startBgm() {
    if (!this.bgmEnabled) return;
    this.initCtx();
    if (this.bgmInterval) return;

    // Peaceful pentatonic melody notes: C4, D4, E4, G4, A4, C5, D5, E5
    const melody = [
      523.25, 659.25, 783.99, 659.25, // C5, E5, G5, E5
      587.33, 698.46, 880.00, 698.46, // D5, F5, A5, F5
      659.25, 783.99, 987.77, 783.99, // E5, G5, B5, G5
      523.25, 783.99, 1046.50, 783.99 // C5, G5, C6, G5
    ];

    const bass = [261.63, 293.66, 329.63, 261.63]; // C4, D4, E4, C4

    this.bgmInterval = setInterval(() => {
      if (!this.bgmEnabled || !this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const t = this.ctx.currentTime;
      const noteIdx = this.bgmStep % melody.length;
      const freq = melody[noteIdx];

      // Play soft treble bell
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      // Soft envelope
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.04, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.6);

      // Play bass note every 4 steps
      if (noteIdx % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bass[Math.floor(noteIdx / 4) % bass.length], t);

        bassGain.gain.setValueAtTime(0, t);
        bassGain.gain.linearRampToValueAtTime(0.06, t + 0.08);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

        bassOsc.connect(bassGain);
        bassGain.connect(this.ctx.destination);
        bassOsc.start(t);
        bassOsc.stop(t + 1.25);
      }

      this.bgmStep++;
    }, 450); // Relaxed 133 BPM ambient groove
  }

  public stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // Duolingo-style signature "Correct" chime (bright ascending chord)
  public playCorrect() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + index * 0.08);
      osc.stop(this.ctx.currentTime + index * 0.08 + 0.4);
    });
  }

  // Duolingo-style soft "Wrong" buzzer
  public playWrong() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.3);

    osc2.frequency.setValueAtTime(155, this.ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(105, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.35);
    osc2.stop(this.ctx.currentTime + 0.35);
  }

  // UI Pop / Click
  public playClick() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  // Kahoot-style countdown tick sound
  public playTick() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(950, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  // Quick level victory fanfare
  public playVictory() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const chord = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.50, d: 0.35 }, // C6
      { f: 1318.51, d: 0.5 } // E6
    ];

    let t = this.ctx.currentTime;
    chord.forEach((item, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = i === chord.length - 1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(item.f, t);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + item.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + item.d);
      t += 0.12;
    });
  }

  // Grand Test & Quiz Completion Fanfare (Full 7-note celebratory arpeggio)
  public playTestComplete() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, time: 0.0, dur: 0.2 }, // C5
      { f: 659.25, time: 0.12, dur: 0.2 }, // E5
      { f: 783.99, time: 0.24, dur: 0.2 }, // G5
      { f: 1046.50, time: 0.36, dur: 0.3 }, // C6
      { f: 880.00, time: 0.52, dur: 0.2 }, // A5
      { f: 1046.50, time: 0.68, dur: 0.25 }, // C6
      { f: 1318.51, time: 0.88, dur: 0.7 } // E6 (long celebratory sustain)
    ];

    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime + n.time;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + n.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + n.dur + 0.05);
    });
  }

  // Chest Open sparkle
  public playChest() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [659.25, 783.99, 987.77, 1318.51, 1567.98];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.05);
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.3);
    });
  }
}

export const sound = new SoundSystem();
export const soundSystem = sound;
export default sound;
