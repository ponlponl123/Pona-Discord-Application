import { describe, it, expect } from 'bun:test';
import randomString from '@/utils/randomString';

describe('randomString', () => {
  it('returns a string of the requested length', () => {
    expect(randomString(10)).toHaveLength(10);
    expect(randomString(1)).toHaveLength(1);
    expect(randomString(64)).toHaveLength(64);
  });

  it('returns an empty string when length is 0', () => {
    expect(randomString(0)).toBe('');
  });

  it('only uses allowed characters', () => {
    const allowed = /^[A-Za-z0-9_-]+$/;
    for (let i = 0; i < 20; i++) {
      expect(randomString(32)).toMatch(allowed);
    }
  });

  it('produces different values on repeated calls (probabilistic)', () => {
    const results = new Set(Array.from({ length: 10 }, () => randomString(16)));
    // Extremely unlikely all 10 are identical
    expect(results.size).toBeGreaterThan(1);
  });
});
