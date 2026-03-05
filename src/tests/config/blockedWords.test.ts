import { describe, it, expect } from 'bun:test';
import { blockedWords } from '@/config/blockedWords';

describe('blockedWords', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(blockedWords)).toBe(true);
    expect(blockedWords.length).toBeGreaterThan(0);
  });

  it('every entry is a non-empty string', () => {
    blockedWords.forEach((word) => {
      expect(typeof word).toBe('string');
      expect(word.length).toBeGreaterThan(0);
    });
  });

  it('contains expected music-related terms', () => {
    const lowerCased = blockedWords.map((w) => w.toLowerCase());
    expect(lowerCased).toContain('lyrics');
    expect(lowerCased).toContain('official');
    expect(lowerCased).toContain('audio');
  });

  it('has no duplicate entries', () => {
    const unique = new Set(blockedWords);
    expect(unique.size).toBe(blockedWords.length);
  });
});
