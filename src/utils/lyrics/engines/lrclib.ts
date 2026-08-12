import { parseLyrics } from '@/utils/parser';
import { fetchJsonWithTimeout } from '../http';
import { normalizeLyricSearchQuery } from './base';
import type { Lyric } from '../types';

export async function fetchLrclibLyrics(
  title: string,
  author: string,
  duration?: number,
): Promise<Lyric | false> {
  const { cleanTitle, cleanAuthor } = normalizeLyricSearchQuery(title, author);
  if (!cleanTitle || !cleanAuthor) return false;

  let getUrl = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(cleanAuthor)}&track_name=${encodeURIComponent(cleanTitle)}`;
  if (duration && duration > 0) {
    const durSeconds = duration > 10000 ? Math.floor(duration / 1000) : Math.floor(duration);
    getUrl += `&duration=${durSeconds}`;
  }

  const res = await fetchJsonWithTimeout(getUrl, 3500);
  if (res && res.status === 200 && res.data) {
    const data = res.data;
    if (data.syncedLyrics) {
      const parsed = parseLyrics(data.syncedLyrics, 'lrclib');
      if (parsed.isTimestamp) return parsed;
    } else if (data.plainLyrics) {
      return {
        isTimestamp: false,
        lyrics: data.plainLyrics.split('\n').map((l: string) => l.trim()).filter(Boolean),
        source: 'lrclib',
      };
    }
  }

  try {
    const searchUrl = `https://lrclib.net/api/search?track_name=${encodeURIComponent(cleanTitle)}&artist_name=${encodeURIComponent(cleanAuthor)}`;
    const searchRes = await fetchJsonWithTimeout<any[]>(searchUrl, 3500);
    if (searchRes && searchRes.status === 200 && Array.isArray(searchRes.data) && searchRes.data.length > 0) {
      const bestSynced = searchRes.data.find((item) => item.syncedLyrics);
      if (bestSynced?.syncedLyrics) {
        return parseLyrics(bestSynced.syncedLyrics, 'lrclib');
      }

      const bestPlain = searchRes.data.find((item) => item.plainLyrics);
      if (bestPlain?.plainLyrics) {
        return {
          isTimestamp: false,
          lyrics: bestPlain.plainLyrics.split('\n').map((l: string) => l.trim()).filter(Boolean),
          source: 'lrclib',
        };
      }
    }
  } catch {
    // Ignore fallback search errors
  }

  return false;
}
