import { describe, it, expect } from 'bun:test';
import color, { colorHEX, type Color } from '@/config/embedColor';

describe('colorHEX array', () => {
  it('has exactly 4 hex colour values', () => {
    expect(colorHEX).toHaveLength(4);
  });

  it('all values are valid hex colour strings', () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    colorHEX.forEach((c) => expect(c).toMatch(hexRegex));
  });
});

describe('color()', () => {
  const cases: Array<[Color, string]> = [
    ['light', colorHEX[0]],
    ['normal', colorHEX[1]],
    ['dark', colorHEX[2]],
    ['focus', colorHEX[3]],
  ];

  cases.forEach(([type, expected]) => {
    it(`returns correct colour for type "${type}"`, () => {
      expect(color(type) as string).toBe(expected);
    });
  });

  it('falls back to normal colour for unknown type', () => {
    expect(color('unknown' as any) as string).toBe(colorHEX[1]);
  });
});
