/**
 * pona-player – Audio filters via FFmpeg
 *
 * Generates FFmpeg -af filter chain strings.
 * Compatible API surface with the existing Lavalink Filters class.
 */

import type { EqualizerBand } from './types';

// ─── Equalizer Presets ────────────────────────────────────────────────────────

/** 15-band EQ: freq list matches standard Lavalink bands */
const EQ_FREQS = [
  25, 40, 63, 100, 160, 250, 400, 630, 1000, 1600, 2500, 4000, 6300, 10000,
  16000,
];

const PRESETS = {
  bassBoost: [
    0.6, 0.7, 0.8, 0.55, 0.25, 0, -0.25, -0.45, -0.55, -0.7, -0.3, -0.25, 0, 0,
    0,
  ],
  soft: [0, 0, 0, 0, 0, 0, -0.25, -0.25, -0.25, -0.25, 0, 0.15, 0.2, 0.15, 0],
  trebleBass: [
    0.6, 0.67, 0.67, 0, -0.5, 0.15, -0.45, 0.23, 0.35, 0.45, 0.55, 0.6, 0.55, 0,
    0,
  ],
  tv: [
    -0.37, -0.35, -0.25, 0, 0.4, 0.55, 0.6, 0.45, 0.35, 0.2, 0.1, 0, -0.25,
    -0.35, -0.4,
  ],
  vaporwave: [
    -0.3, -0.3, -0.2, 0, 0.2, 0.3, 0.35, 0.4, 0.35, 0.2, 0, -0.2, -0.3, -0.3,
    -0.3,
  ],
} as const;

// ─── Available Filter Keys ────────────────────────────────────────────────────

export type FilterName =
  | 'bassboost'
  | 'nightcore'
  | 'slowmo'
  | 'soft'
  | 'tv'
  | 'trebleBass'
  | 'vaporwave'
  | 'eightD'
  | 'karaoke'
  | 'distort';

// ─── Filters Class ───────────────────────────────────────────────────────────

export class Filters {
  // Currently active EQ gains (15 bands, 0.0 = flat)
  public equalizer: EqualizerBand[] = [];

  public timescale: { speed?: number; pitch?: number; rate?: number } | null =
    null;
  public vibrato: { frequency: number; depth: number } | null = null;
  public rotation: { hz: number } | null = null;
  public karaoke: {
    level?: number;
    monoLevel?: number;
    filterBand?: number;
    filterWidth?: number;
  } | null = null;
  public distortion: Record<string, number> | null = null;

  private status: Record<FilterName, boolean> = {
    bassboost: false,
    nightcore: false,
    slowmo: false,
    soft: false,
    tv: false,
    trebleBass: false,
    vaporwave: false,
    eightD: false,
    karaoke: false,
    distort: false,
  };

  /** Callback invoked when filters change so the player can rebuild the stream */
  private _onUpdate?: () => void;

  constructor(onUpdate?: () => void) {
    this._onUpdate = onUpdate;
  }

  // ─── Presets ──────────────────────────────────────────────────────────────

  public bassBoost(): this {
    this.setEqualizer(PRESETS.bassBoost);
    this.status.bassboost = true;
    this.notifyUpdate();
    return this;
  }

  public nightcore(): this {
    this.timescale = { speed: 1.1, pitch: 1.125, rate: 1.05 };
    this.status.nightcore = true;
    this.notifyUpdate();
    return this;
  }

  public slowmo(): this {
    this.timescale = { speed: 0.7, pitch: 1.0, rate: 0.8 };
    this.status.slowmo = true;
    this.notifyUpdate();
    return this;
  }

  public soft(): this {
    this.setEqualizer(PRESETS.soft);
    this.status.soft = true;
    this.notifyUpdate();
    return this;
  }

  public tv(): this {
    this.setEqualizer(PRESETS.tv);
    this.status.tv = true;
    this.notifyUpdate();
    return this;
  }

  public trebleBass(): this {
    this.setEqualizer(PRESETS.trebleBass);
    this.status.trebleBass = true;
    this.notifyUpdate();
    return this;
  }

  public vaporwave(): this {
    this.setEqualizer(PRESETS.vaporwave);
    this.timescale = { pitch: 0.55 };
    this.status.vaporwave = true;
    this.notifyUpdate();
    return this;
  }

  public eightD(): this {
    this.rotation = { hz: 0.125 };
    this.status.eightD = true;
    this.notifyUpdate();
    return this;
  }

  public setKaraoke(
    opts: {
      level?: number;
      monoLevel?: number;
      filterBand?: number;
      filterWidth?: number;
    } = {},
  ): this {
    this.karaoke = opts;
    this.status.karaoke = true;
    this.notifyUpdate();
    return this;
  }

  public distort(): this {
    this.distortion = {
      sinOffset: 0,
      sinScale: 0.2,
      cosOffset: 0,
      cosScale: 0.2,
      tanOffset: 0,
      tanScale: 0.2,
      offset: 0,
      scale: 1.2,
    };
    this.status.distort = true;
    this.notifyUpdate();
    return this;
  }

  // ─── Low-level setters ───────────────────────────────────────────────────

  public setEqualizer(
    gains: readonly number[] | number[] | EqualizerBand[],
  ): this {
    if (Array.isArray(gains) && typeof gains[0] === 'number') {
      this.equalizer = (gains as readonly number[]).map((gain, i) => ({
        band: i,
        gain,
      }));
    } else {
      this.equalizer = gains as EqualizerBand[];
    }
    return this;
  }

  public setTimescale(opts: {
    speed?: number;
    pitch?: number;
    rate?: number;
  }): this {
    this.timescale = opts;
    this.notifyUpdate();
    return this;
  }

  public setRotation(opts: { hz: number }): this {
    this.rotation = opts;
    this.notifyUpdate();
    return this;
  }

  public setVibrato(opts: { frequency: number; depth: number }): this {
    this.vibrato = opts;
    this.notifyUpdate();
    return this;
  }

  // ─── Status ──────────────────────────────────────────────────────────────

  public getStatus(filter: FilterName): boolean {
    return this.status[filter] ?? false;
  }

  // ─── Clear ───────────────────────────────────────────────────────────────

  public clear(): this {
    this.equalizer = [];
    this.timescale = null;
    this.vibrato = null;
    this.rotation = null;
    this.karaoke = null;
    this.distortion = null;
    for (const key of Object.keys(this.status) as FilterName[]) {
      this.status[key] = false;
    }
    this.notifyUpdate();
    return this;
  }

  // ─── FFmpeg Integration ──────────────────────────────────────────────────

  /** Returns true if any filter is currently active */
  public get hasActiveFilters(): boolean {
    return Object.values(this.status).some(Boolean);
  }

  /**
   * Build FFmpeg -af filter chain string from current filter state.
   * Returns array of filter expressions to join with ','.
   */
  public toFFmpegArgs(): string[] {
    const parts: string[] = [];

    // Equalizer
    if (this.equalizer.length > 0) {
      const eqParts = this.equalizer
        .filter((b) => b.gain !== 0)
        .map((b) => {
          const freq = EQ_FREQS[b.band] ?? 1000;
          // gain in the interface is -0.25 to 1.0 range, scale to dB (-6 to +24)
          const db = b.gain * 24;
          return `equalizer=f=${freq}:t=o:w=2:g=${db.toFixed(1)}`;
        });
      parts.push(...eqParts);
    }

    // Timescale (speed + pitch)
    if (this.timescale) {
      const { speed, pitch, rate } = this.timescale;
      if (speed && speed !== 1.0) {
        // atempo only supports 0.5..100.0
        const v = Math.max(0.5, Math.min(100, speed));
        parts.push(`atempo=${v}`);
      }
      if (pitch && pitch !== 1.0) {
        parts.push(`asetrate=48000*${pitch},aresample=48000`);
      }
      if (rate && rate !== 1.0 && !pitch) {
        parts.push(`asetrate=48000*${rate},aresample=48000`);
      }
    }

    // Vibrato
    if (this.vibrato) {
      const f = Math.max(0.1, Math.min(20000, this.vibrato.frequency));
      const d = Math.max(0, Math.min(1, this.vibrato.depth));
      parts.push(`vibrato=f=${f}:d=${d}`);
    }

    // Rotation (8D audio)
    if (this.rotation) {
      parts.push(`apulsator=hz=${this.rotation.hz}`);
    }

    // Karaoke (center channel removal)
    if (this.karaoke) {
      const level = this.karaoke.level ?? 1.0;
      const mono = this.karaoke.monoLevel ?? 1.0;
      parts.push(`stereotools=mlev=${(mono * 0.015625).toFixed(6)}`);
      if (level !== 1.0) {
        parts.push(`volume=${level}`);
      }
    }

    // Distortion
    if (this.distortion) {
      const gain = this.distortion.scale ?? 1.2;
      parts.push(`overdrive=gain=${Math.min(100, gain * 5)}:colour=50`);
    }

    return parts;
  }

  // ─── Internal ────────────────────────────────────────────────────────────

  private notifyUpdate(): void {
    this._onUpdate?.();
  }
}
