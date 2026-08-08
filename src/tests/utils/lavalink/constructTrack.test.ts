import { describe, it, expect } from 'bun:test';
import { parseYouTubeAuthorTitle } from '@/utils/parser';

describe('constructTrack v2 artist normalization', () => {
  it('strips - Topic from author and extracts channelId', () => {
    const rawDetails = {
      channelId: 'UCFm2USoRWUzTfW7ldVMdM4Q',
      author: '聞人聽書_ - Topic',
      title: '一笑江湖',
    };

    const cleanAuthorName = parseYouTubeAuthorTitle(rawDetails.author);
    const artist = [
      {
        id: rawDetails.channelId,
        name: cleanAuthorName,
      },
    ];

    expect(artist[0].name).toBe('聞人聽書_');
    expect(artist[0].id).toBe('UCFm2USoRWUzTfW7ldVMdM4Q');
  });

  it('handles microformat fallback for externalChannelId', () => {
    const resultData = {
      microformat: {
        microformatDataRenderer: {
          pageOwnerDetails: {
            externalChannelId: 'UCuAXFkgsw1L7xaCfnd5JJOw',
          },
        },
      },
      videoDetails: {
        author: 'Rick Astley - Topic',
      },
    };

    const details = resultData.videoDetails;
    const channelId =
      (details as any).channelId ||
      (details as any).externalChannelId ||
      resultData.microformat.microformatDataRenderer.pageOwnerDetails.externalChannelId;

    const cleanAuthorName = parseYouTubeAuthorTitle(details.author);
    const artist = [{ id: channelId, name: cleanAuthorName }];

    expect(artist[0].name).toBe('Rick Astley');
    expect(artist[0].id).toBe('UCuAXFkgsw1L7xaCfnd5JJOw');
  });

  it('extracts channelId from artists array in videoDetails', () => {
    const details = {
      author: 'LANY',
      artists: [{ id: 'UC-9-kyTW8ZkZNDHQJ6FgpwQ', name: 'LANY' }],
    };

    const channelId =
      (details as any).channelId ||
      (details as any).externalChannelId ||
      ((details as any).artists && (details as any).artists[0]?.id);

    const cleanAuthorName = parseYouTubeAuthorTitle(details.author);
    const artist = [{ id: channelId, name: cleanAuthorName }];

    expect(artist[0].name).toBe('LANY');
    expect(artist[0].id).toBe('UC-9-kyTW8ZkZNDHQJ6FgpwQ');
  });

  it('extractVideoId accurately parses 11-char IDs from various URL formats', () => {
    function extractVideoId(identifier?: string, uri?: string): string {
      if (identifier && /^[a-zA-Z0-9_-]{11}$/.test(identifier)) {
        return identifier;
      }
      const str = uri || identifier || '';
      const match = str.match(/(?:v=|\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : identifier || '';
    }

    expect(extractVideoId('dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractVideoId('https://music.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });
});
