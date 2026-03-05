import { describe, it, expect } from 'bun:test';
import {
  eqPrefix_bassBoost,
  eqPrefix_soft,
  eqPrefix_tvStyle,
  eqPrefix_trebleBass,
  eqPrefix_vaporwave,
  type Band,
} from '@/utils/lavalink/equalizers';

function validateBandArray(bands: Band[]) {
  expect(Array.isArray(bands)).toBe(true);
  expect(bands.length).toBeGreaterThan(0);
  bands.forEach((band, index) => {
    expect(typeof band.band).toBe('number');
    expect(typeof band.gain).toBe('number');
    expect(band.gain).toBeGreaterThanOrEqual(-1);
    expect(band.gain).toBeLessThanOrEqual(1);
    // Bands should be in ascending order
    if (index > 0) {
      expect(band.band).toBeGreaterThan(bands[index - 1].band);
    }
  });
}

describe('Bass Boost equalizer', () => {
  it('has valid band structure', () => validateBandArray(eqPrefix_bassBoost));
  it('has 15 bands', () => expect(eqPrefix_bassBoost).toHaveLength(15));
  it('has positive gain on low bands', () => {
    expect(eqPrefix_bassBoost[0].gain).toBeGreaterThan(0);
  });
});

describe('Soft equalizer', () => {
  it('has valid band structure', () => validateBandArray(eqPrefix_soft));
  it('attenuates high bands', () => {
    const highBands = eqPrefix_soft.slice(8);
    highBands.forEach((b) => expect(b.gain).toBeLessThan(0));
  });
});

describe('TV Style equalizer', () => {
  it('has valid band structure', () => validateBandArray(eqPrefix_tvStyle));
  it('boosts high-mid bands', () => {
    const boostedBands = eqPrefix_tvStyle.filter((b) => b.gain > 0);
    expect(boostedBands.length).toBeGreaterThan(0);
  });
});

describe('Treble Bass equalizer', () => {
  it('has valid band structure', () => validateBandArray(eqPrefix_trebleBass));
  it('has positive gain on band 0', () => {
    expect(eqPrefix_trebleBass[0].gain).toBeGreaterThan(0);
  });
});

describe('Vaporwave equalizer', () => {
  it('has valid band structure', () => validateBandArray(eqPrefix_vaporwave));
});
