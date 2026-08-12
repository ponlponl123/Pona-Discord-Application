import { fetchJsonWithTimeout } from '../http';
import { normalizeLyricSearchQuery } from './base';
import type { Lyric } from '../types';

export async function fetchBoiduLyrics(title: string, author: string): Promise<Lyric | false> {
  const { cleanTitle, cleanAuthor } = normalizeLyricSearchQuery(title, author);
  if (!cleanTitle || !cleanAuthor) return false;

  const searchUrl = `https://boidu.ponlponl123.com/api/lyrics?title=${encodeURIComponent(cleanTitle)}&artist=${encodeURIComponent(cleanAuthor)}`;
  const res = await fetchJsonWithTimeout(searchUrl, 3500);

  if (res && res.status === 200 && res.data?.lyrics) {
    return {
      isTimestamp: false,
      lyrics: res.data.lyrics,
      source: 'boidu',
    };
  }
  return false;
}
