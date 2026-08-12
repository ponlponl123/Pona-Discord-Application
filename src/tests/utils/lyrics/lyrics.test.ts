import { describe, expect, it } from 'bun:test';
import {
  traverse,
  traverseList,
  traverseString,
  normalizeLyricSearchQuery,
  type Lyric,
  type TimestampLyrics,
} from '@/utils/lyrics';

describe('Lyrics Module - Traversal Helpers (copied from ts-npm-ytmusic-api)', () => {
  const mockPayload = {
    contents: {
      sectionListRenderer: {
        contents: [
          {
            musicDescriptionShelfRenderer: {
              description: {
                runs: [{ text: 'Sample lyric line 1\nSample lyric line 2' }],
              },
            },
          },
          {
            musicTimedLyricsRenderer: {
              timedLyricsData: [
                {
                  lyricLine: 'Line 1',
                  cueRange: { startTimeMilliseconds: '1000', endTimeMilliseconds: '2000' },
                },
              ],
            },
          },
        ],
      },
    },
  };

  it('traverses deeply nested keys', () => {
    const item: any = traverse(mockPayload, 'timedLyricsData');
    const lyricLine = Array.isArray(item) ? item[0].lyricLine : item.lyricLine;
    expect(lyricLine).toBe('Line 1');
  });

  it('traverses strings using traverseString', () => {
    const text = traverseString(mockPayload, 'description', 'runs', 'text');
    expect(text).toContain('Sample lyric line 1');
  });

  it('traverses lists using traverseList', () => {
    const list = traverseList(mockPayload, 'timedLyricsData');
    expect(list.length).toBeGreaterThan(0);
  });
});

describe('Lyrics Module - Metadata Normalization', () => {
  it('cleans song title and artist for external lyric engines', () => {
    const { cleanTitle, cleanAuthor, searchQuery } = normalizeLyricSearchQuery(
      'Never Gonna Give You Up (Official Music Video) [HD]',
      'Rick Astley - Topic',
    );
    expect(cleanAuthor).toBe('Rick Astley');
    expect(cleanTitle).toBe('Never Gonna Give You Up');
    expect(searchQuery).toBe('Never Gonna Give You Up Rick Astley');
  });

  it('handles empty author gracefully', () => {
    const { cleanTitle, cleanAuthor } = normalizeLyricSearchQuery('Unstoppable');
    expect(cleanTitle).toBe('Unstoppable');
    expect(cleanAuthor).toBe('');
  });
});
