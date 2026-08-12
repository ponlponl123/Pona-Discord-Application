import { describe, it, expect } from 'bun:test';
import {
  parseYouTubeAuthorTitle,
  parseYouTubeVideoTitle,
  parseYouTubeTitle,
  balanceBrackets,
  escapeRegExp,
  parseLyrics,
  combineArtistName,
  noiseWords,
} from '@/utils/parser';

describe('parseYouTubeAuthorTitle', () => {
  it('removes " - Topic" suffix', () => {
    expect(parseYouTubeAuthorTitle('Adele - Topic')).toBe('Adele');
  });

  it('removes "-Topic" suffix even without spaces (\\s* matches zero-width)', () => {
    // The regex uses \s*-\s*Topic which matches zero or more spaces around the dash
    expect(parseYouTubeAuthorTitle('BTS-Topic')).toBe('BTS');
  });

  it('returns the author unchanged when no Topic suffix', () => {
    expect(parseYouTubeAuthorTitle('Taylor Swift')).toBe('Taylor Swift');
  });

  it('removes " - Release" suffix', () => {
    expect(parseYouTubeAuthorTitle('Adele - Release')).toBe('Adele');
  });

  it('trims surrounding whitespace', () => {
    expect(parseYouTubeAuthorTitle('  Artist - Topic  ')).toBe('Artist');
  });
});

describe('parseYouTubeVideoTitle', () => {
  it('removes noise words (case-insensitive)', () => {
    const result = parseYouTubeVideoTitle('Song Name (Official Video)');
    expect(result).not.toMatch(/official video/i);
  });

  it('removes empty bracket groups', () => {
    const result = parseYouTubeVideoTitle('Song Name []');
    expect(result).not.toContain('[]');
  });

  it('returns non-empty string for a typical title', () => {
    const result = parseYouTubeVideoTitle('Beautiful Song - Artist');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles already clean title (no noise/blocked words)', () => {
    // 'Clean' is in noiseWords, so use a title without any blocked words
    const result = parseYouTubeVideoTitle('Moonlight Sonata');
    expect(result).toContain('Moonlight Sonata');
  });
});

describe('parseYouTubeTitle', () => {
  it('returns raw Thai title unchanged and cleans author', () => {
    const { cleanTitle, cleanAuthor } = parseYouTubeTitle(
      'เพลงไทย',
      'ศิลปิน - Topic',
    );
    expect(cleanTitle).toBe('เพลงไทย');
    expect(cleanAuthor).toBe('ศิลปิน');
  });

  it('normalizes author from "Artist - Topic"', () => {
    const { cleanAuthor } = parseYouTubeTitle('Song Title', 'Artist - Topic');
    expect(cleanAuthor).toBe('Artist');
  });

  it('strips @mentions from title', () => {
    const { cleanTitle } = parseYouTubeTitle(
      '@Artist - Song',
      'Artist - Topic',
    );
    expect(cleanTitle).not.toContain('@Artist');
  });

  it('returns objects with cleanTitle and cleanAuthor keys', () => {
    const result = parseYouTubeTitle('Some Song', 'Some Artist');
    expect(result).toHaveProperty('cleanTitle');
    expect(result).toHaveProperty('cleanAuthor');
  });

  it('correctly splits Artist - Song Title when author is Artist - Release', () => {
    const { cleanTitle, cleanAuthor } = parseYouTubeTitle(
      'Billie Eilish - Bad Guy',
      'Billie Eilish - Release',
    );
    expect(cleanAuthor).toBe('Billie Eilish');
    expect(cleanTitle).toBe('Bad Guy');
  });
});

describe('balanceBrackets', () => {
  it('returns string unchanged when brackets are balanced', () => {
    expect(balanceBrackets('Hello (World)')).toBe('Hello (World)');
  });

  it('closes unclosed opening bracket', () => {
    const result = balanceBrackets('Hello (World');
    expect(result).toBe('Hello (World)');
  });

  it('handles nested brackets', () => {
    const result = balanceBrackets('a [b (c]');
    expect(typeof result).toBe('string');
  });

  it('leaves empty string unchanged', () => {
    expect(balanceBrackets('')).toBe('');
  });
});

describe('escapeRegExp', () => {
  it('escapes special regex characters', () => {
    expect(escapeRegExp('a.b*c')).toBe('a\\.b\\*c');
  });

  it('escapes parentheses', () => {
    expect(escapeRegExp('(hello)')).toBe('\\(hello\\)');
  });

  it('leaves normal strings unchanged', () => {
    expect(escapeRegExp('hello world')).toBe('hello world');
  });
});

describe('parseLyrics', () => {
  it('parses timestamp lyrics', () => {
    const raw = '[0:01.00] Line one\n[0:05.50] Line two';
    const result = parseLyrics(raw);
    expect(result.isTimestamp).toBe(true);
    expect(result.lyrics).toHaveLength(2);
    const first = result.lyrics[0] as { seconds: number; lyrics: string };
    expect(first.seconds).toBeCloseTo(1.0);
    expect(first.lyrics).toBe('Line one');
  });

  it('parses non-timestamp lyrics', () => {
    const raw = 'Line one\nLine two\nLine three';
    const result = parseLyrics(raw);
    expect(result.isTimestamp).toBe(false);
    expect(result.lyrics).toHaveLength(3);
  });

  it('ignores empty lines', () => {
    const raw = '[0:01.00] Line one\n\n[0:05.00] Line two';
    const result = parseLyrics(raw);
    expect(result.isTimestamp).toBe(true);
    expect(result.lyrics).toHaveLength(2);
  });
});

describe('combineArtistName', () => {
  it('joins single artist', () => {
    expect(combineArtistName([{ id: '1', name: 'Adele' }])).toBe('Adele');
  });

  it('joins multiple artists with " & "', () => {
    expect(
      combineArtistName([
        { id: '1', name: 'A' },
        { id: '2', name: 'B' },
        { id: '3', name: 'C' },
      ]),
    ).toBe('A & B & C');
  });

  it('handles empty array', () => {
    expect(combineArtistName([])).toBe('');
  });
});

describe('noiseWords', () => {
  it('is a non-empty array of strings', () => {
    expect(Array.isArray(noiseWords)).toBe(true);
    expect(noiseWords.length).toBeGreaterThan(0);
    noiseWords.forEach((w) => expect(typeof w).toBe('string'));
  });
});
