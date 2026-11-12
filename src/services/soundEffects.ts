/**
 * Futuristic Web Audio Sound Effects & Synthesizer Engine for Bexus AI
 */

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch {
          return null;
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        this.ctx.resume().catch(() => {});
      } catch {}
    }
    return this.ctx;
  }

  // High-tech subtle click
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext safe fail
    }
  }

  // Futuristic message send swoosh
  public playSend() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // AudioContext safe fail
    }
  }

  // Futuristic AI Response Chime (pleasant crystal two-tone chord)
  public playReceive() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const freqs = [587.33, 880, 1174.66]; // D5, A5, D6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = ctx.currentTime + idx * 0.06;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.03, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch {
      // AudioContext safe fail
    }
  }

  // Mode Switch / Tool Activated
  public playModeSwitch() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.08); // B5
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // AudioContext safe fail
    }
  }

  // Triumphant success chime
  public playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = ctx.currentTime + idx * 0.05;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.05, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch {
      // AudioContext safe fail
    }
  }

  // Subtle alert / error tone
  public playError() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // AudioContext safe fail
    }
  }

  // Generate Full Multi-Track Song (Chords + Lead Melody + Sub Bass + Drums + Percussion)
  public playMultiTrackSong(options: {
    bpm?: number;
    scaleKey?: string;
    includeDrums?: boolean;
    includeBass?: boolean;
    includeChords?: boolean;
    includeLead?: boolean;
    onFrequencyData?: (data: Uint8Array) => void;
  }): () => void {
    const ctx = this.getContext();
    if (!ctx) return () => {};

    const {
      bpm = 110,
      scaleKey = 'romantic',
      includeDrums = true,
      includeBass = true,
      includeChords = true,
      includeLead = true,
    } = options;

    let isPlaying = true;
    const interval = (60 / bpm) * 1000 * 0.25; // 16th note subdivision
    let step = 0;

    // Master bus & analyser node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.22, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    masterGain.connect(analyser);

    // Musical Scales & Harmonies
    const scaleMap: Record<string, { root: number[]; chords: number[][]; lead: number[] }> = {
      funk: {
        root: [82.41, 110.0, 98.0, 87.31], // E, A, G, F (Groovy Funk)
        chords: [
          [329.63, 415.30, 493.88, 587.33], // E9 / E7#9 Hendrix chord
          [220.0, 277.18, 329.63, 392.0],  // A7
          [196.0, 246.94, 293.66, 349.23], // G7
          [174.61, 220.0, 261.63, 329.63], // Fmaj7
        ],
        lead: [329.63, 392.0, 440.0, 466.16, 493.88, 587.33, 659.25], // Funk Dorian / Blues with blue note
      },
      motivational: {
        root: [130.81, 98.0, 110.0, 87.31], // C, G, Am, F (Anthemic Progression)
        chords: [
          [261.63, 329.63, 392.0, 523.25], // C Major
          [196.0, 246.94, 293.66, 392.0],  // G Major
          [220.0, 261.63, 329.63, 440.0],  // Am
          [174.61, 220.0, 261.63, 349.23], // F Major
        ],
        lead: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 659.25, 783.99], // Uplifting major fanfare
      },
      romantic: {
        root: [146.83, 116.54, 174.61, 130.81], // D, Bb, F, C
        chords: [
          [293.66, 349.23, 440.0], // Dm (D4, F4, A4)
          [233.08, 293.66, 349.23], // Bb (Bb3, D4, F4)
          [174.61, 220.0, 261.63], // F (F3, A3, C4)
          [261.63, 329.63, 392.0], // C (C4, E4, G4)
        ],
        lead: [293.66, 329.63, 349.23, 392.0, 440.0, 523.25, 587.33], // D minor natural
      },
      sufi: {
        root: [146.83, 130.81, 116.54, 110.0], // D, C, Bb, A
        chords: [
          [293.66, 349.23, 440.0], // Dm
          [261.63, 329.63, 392.0], // C
          [233.08, 293.66, 349.23], // Bb
          [220.0, 277.18, 329.63], // A Maj (Phrygian Dominant)
        ],
        lead: [220.0, 233.08, 277.18, 293.66, 329.63, 349.23, 440.0, 466.16], // Sufi Raga Bhairav / Phrygian
      },
      hiphop: {
        root: [110.0, 110.0, 98.0, 87.31], // A, A, G, F
        chords: [
          [220.0, 261.63, 329.63], // Am
          [220.0, 261.63, 329.63], // Am
          [196.0, 246.94, 293.66], // G
          [174.61, 220.0, 261.63], // F
        ],
        lead: [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25], // Pentatonic
      },
      cyber: {
        root: [110.0, 130.81, 146.83, 164.81], // A, C, D, E
        chords: [
          [220.0, 261.63, 329.63], // Am
          [261.63, 329.63, 392.0], // C
          [293.66, 349.23, 440.0], // Dm
          [164.81, 207.65, 246.94], // E
        ],
        lead: [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 659.25],
      },
      acoustic: {
        root: [130.81, 98.0, 110.0, 87.31], // C, G, Am, F
        chords: [
          [261.63, 329.63, 392.0], // C
          [196.0, 246.94, 293.66], // G
          [220.0, 261.63, 329.63], // Am
          [174.61, 220.0, 261.63], // F
        ],
        lead: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25], // C Major
      },
      chill: {
        root: [174.61, 164.81, 146.83, 130.81], // F, E, D, C
        chords: [
          [174.61, 220.0, 261.63, 329.63], // Fmaj7
          [164.81, 196.0, 246.94, 293.66], // Em7
          [146.83, 174.61, 220.0, 261.63], // Dm7
          [130.81, 164.81, 196.0, 246.94], // Cmaj7
        ],
        lead: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25],
      },
      rock: {
        root: [164.81, 130.81, 146.83, 123.47], // E, C, D, B
        chords: [
          [164.81, 246.94, 329.63], // E5 Power Chord
          [130.81, 196.0, 261.63], // C5 Power Chord
          [146.83, 220.0, 293.66], // D5 Power Chord
          [123.47, 185.0, 246.94], // B5 Power Chord
        ],
        lead: [164.81, 196.0, 220.0, 246.94, 293.66, 329.63, 392.0, 440.0],
      },
      edm: {
        root: [110.0, 87.31, 130.81, 98.0], // Am, F, C, G
        chords: [
          [220.0, 261.63, 329.63],
          [174.61, 220.0, 261.63],
          [261.63, 329.63, 392.0],
          [196.0, 246.94, 293.66],
        ],
        lead: [440.0, 523.25, 659.25, 783.99, 880.0],
      },
    };

    const activeScale = scaleMap[scaleKey] || scaleMap.romantic;

    const timer = setInterval(() => {
      if (!isPlaying || !ctx) return;

      const barStep = step % 16;
      const chordIndex = Math.floor(step / 16) % activeScale.chords.length;
      const currentChord = activeScale.chords[chordIndex];
      const currentRoot = activeScale.root[chordIndex];

      try {
        // 1. CHORDS PAD & FUNK CHOPS
        const isFunkChord = scaleKey === 'funk' && (barStep === 2 || barStep === 6 || barStep === 10 || barStep === 14);
        const isStandardChord = barStep === 0 || barStep === 8;
        if (includeChords && (isStandardChord || isFunkChord)) {
          currentChord.forEach((noteFreq, idx) => {
            const chordOsc = ctx.createOscillator();
            const chordGain = ctx.createGain();
            chordOsc.type = scaleKey === 'funk' ? 'sawtooth' : 'triangle';
            chordOsc.frequency.setValueAtTime(noteFreq, ctx.currentTime + idx * 0.015);

            const duration = scaleKey === 'funk' ? 0.22 : 0.85;
            chordGain.gain.setValueAtTime(scaleKey === 'funk' ? 0.05 : 0.04, ctx.currentTime);
            chordGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

            chordOsc.connect(chordGain);
            chordGain.connect(masterGain);
            chordOsc.start(ctx.currentTime + idx * 0.015);
            chordOsc.stop(ctx.currentTime + duration + 0.05);
          });
        }

        // 2. SUB BASS (Groovy Slap Bass / 808)
        const isFunkBass = scaleKey === 'funk' && (barStep === 0 || barStep === 3 || barStep === 6 || barStep === 10 || barStep === 13);
        const isStandardBass = barStep === 0 || barStep === 6 || barStep === 10 || barStep === 14;
        if (includeBass && (isFunkBass || isStandardBass)) {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = scaleKey === 'funk' ? 'triangle' : 'sine';
          
          // Funk slap octave pop on step 6 & 13
          const pitch = scaleKey === 'funk' && (barStep === 6 || barStep === 13) ? currentRoot : currentRoot / 2;
          bassOsc.frequency.setValueAtTime(pitch, ctx.currentTime);

          const bDuration = scaleKey === 'funk' ? 0.22 : 0.45;
          bassGain.gain.setValueAtTime(0.2, ctx.currentTime);
          bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + bDuration);

          bassOsc.connect(bassGain);
          bassGain.connect(masterGain);
          bassOsc.start();
          bassOsc.stop(ctx.currentTime + bDuration);
        }

        // 3. LEAD MELODY SYNTH / INSTRUMENT (Acoustic Pluck & Melodic runs)
        if (includeLead && barStep % 2 === 0) {
          const noteIdx = (Math.floor(step * 1.7) + (barStep > 8 ? 2 : 0)) % activeScale.lead.length;
          const leadFreq = activeScale.lead[noteIdx];

          const leadOsc = ctx.createOscillator();
          const leadGain = ctx.createGain();
          leadOsc.type = scaleKey === 'sufi' || scaleKey === 'acoustic' ? 'sine' : scaleKey === 'funk' ? 'square' : 'sawtooth';
          leadOsc.frequency.setValueAtTime(leadFreq, ctx.currentTime);

          // Subtle pitch vibrato/glide for expression
          if (scaleKey === 'sufi' || scaleKey === 'romantic') {
            leadOsc.frequency.exponentialRampToValueAtTime(leadFreq * 1.01, ctx.currentTime + 0.1);
          }

          const lVol = scaleKey === 'funk' ? 0.04 : 0.06;
          leadGain.gain.setValueAtTime(lVol, ctx.currentTime);
          leadGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

          leadOsc.connect(leadGain);
          leadGain.connect(masterGain);
          leadOsc.start();
          leadOsc.stop(ctx.currentTime + 0.28);
        }

        // 4. DRUMS & PERCUSSION
        if (includeDrums) {
          // Kick (Four-on-the-floor for motivational/edm or syncopated for funk/hiphop)
          const isKick = scaleKey === 'motivational' || scaleKey === 'edm'
            ? (barStep === 0 || barStep === 4 || barStep === 8 || barStep === 12)
            : (barStep === 0 || barStep === 8 || (scaleKey === 'funk' ? barStep === 10 : barStep === 12));

          if (isKick) {
            const kickOsc = ctx.createOscillator();
            const kickGain = ctx.createGain();
            kickOsc.frequency.setValueAtTime(140, ctx.currentTime);
            kickOsc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.12);

            kickGain.gain.setValueAtTime(0.25, ctx.currentTime);
            kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

            kickOsc.connect(kickGain);
            kickGain.connect(masterGain);
            kickOsc.start();
            kickOsc.stop(ctx.currentTime + 0.14);
          }

          // Snare / Rim / Clap (Beats 4 and 12)
          if (barStep === 4 || barStep === 12) {
            const snareOsc = ctx.createOscillator();
            const snareGain = ctx.createGain();
            snareOsc.type = 'triangle';
            snareOsc.frequency.setValueAtTime(220, ctx.currentTime);

            snareGain.gain.setValueAtTime(0.12, ctx.currentTime);
            snareGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

            snareOsc.connect(snareGain);
            snareGain.connect(masterGain);
            snareOsc.start();
            snareOsc.stop(ctx.currentTime + 0.15);
          }

          // Hi-Hats / Shaker (Every 2nd 16th note)
          if (barStep % 2 === 0) {
            const hatOsc = ctx.createOscillator();
            const hatGain = ctx.createGain();
            hatOsc.type = 'highpass' as any;
            hatOsc.frequency.setValueAtTime(7000, ctx.currentTime);

            hatGain.gain.setValueAtTime(0.02, ctx.currentTime);
            hatGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

            hatOsc.connect(hatGain);
            hatGain.connect(masterGain);
            hatOsc.start();
            hatOsc.stop(ctx.currentTime + 0.04);
          }
        }

        step++;
      } catch {
        // Audio tick safe fail
      }
    }, interval);

    return () => {
      isPlaying = false;
      clearInterval(timer);
      try {
        masterGain.disconnect();
      } catch {}
    };
  }

  // Generate Music Melody in Realtime with Synth Synthesizer
  public playSynthesizedMelody(bpm: number = 120, scaleKey: 'cyber' | 'chill' | 'uplifting' | 'romantic' | 'sufi' = 'cyber'): () => void {
    return this.playMultiTrackSong({ bpm, scaleKey: scaleKey as any });
  }
}

export const sounds = new SoundEffectsService();
