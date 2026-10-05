// High-fidelity synthesized Web Audio sound effects for Nova Messenger
// 100% zero-dependency, works offline, zero latency, no broken MP3 URLs

class ChatSoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ringInterval = null;
    this.ringOscillators = [];

    // Load sound preference
    try {
      const saved = localStorage.getItem("nova_chat_sound_enabled");
      if (saved !== null) this.enabled = saved === "true";
    } catch (e) {}
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleSound() {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem("nova_chat_sound_enabled", String(this.enabled));
    } catch (e) {}
    return this.enabled;
  }

  isSoundEnabled() {
    return this.enabled;
  }

  // 1. WhatsApp-style crisp pop on message sent
  playMessageSent() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(540, t);
      osc.frequency.exponentialRampToValueAtTime(840, t + 0.08);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    } catch (e) {}
  }

  // 2. Telegram/Slack musical double chime on message received
  playMessageReceived() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // Note 1 (F#5 - 739.99 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(739.99, t);
      gain1.gain.setValueAtTime(0.14, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.14);

      // Note 2 (C#6 - 1108.73 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1108.73, t + 0.08);
      gain2.gain.setValueAtTime(0.16, t + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t + 0.08);
      osc2.stop(t + 0.32);
    } catch (e) {}
  }

  // 3. Call Connected celebratory upbeat chime
  playCallConnected() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = t + idx * 0.07;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });
    } catch (e) {}
  }

  // 4. Call Ended descending tone
  playCallEnded() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const notes = [783.99, 659.25, 523.25]; // G5, E5, C5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = t + idx * 0.09;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    } catch (e) {}
  }

  // 5. Outgoing Telecom PBX Dual-Frequency Ring (440Hz + 480Hz)
  startOutgoingRing() {
    this.stopRinging();
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const playBurst = () => {
        const t = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(440, t); // A4
        osc2.frequency.setValueAtTime(480, t); // 480Hz North American / International ring cadence

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.setValueAtTime(0.08, t + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 2.0);
        osc2.stop(t + 2.0);
      };

      playBurst();
      this.ringInterval = setInterval(playBurst, 4000);
    } catch (e) {}
  }

  // 6. Incoming Harmonic Phone Melody (WhatsApp / Telegram style)
  startIncomingRing() {
    this.stopRinging();
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const playMelody = () => {
        const t = ctx.currentTime;
        const melody = [
          { f: 587.33, d: 0.12, wait: 0 },    // D5
          { f: 880.00, d: 0.14, wait: 0.14 }, // A5
          { f: 1174.66, d: 0.2, wait: 0.3 },  // D6
          { f: 880.00, d: 0.14, wait: 0.55 }, // A5
          { f: 1046.50, d: 0.28, wait: 0.72 } // C6
        ];

        melody.forEach(({ f, d, wait }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = t + wait;
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, start);
          gain.gain.setValueAtTime(0.12, start);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + d + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + d + 0.1);
        });
      };

      playMelody();
      this.ringInterval = setInterval(playMelody, 2200);
    } catch (e) {}
  }

  stopRinging() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }
}

export const chatSounds = new ChatSoundEffects();
