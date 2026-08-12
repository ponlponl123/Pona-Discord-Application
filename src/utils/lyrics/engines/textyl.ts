import { fetchJsonWithTimeout } from '../http';
import { normalizeLyricSearchQuery } from './base';
import type { Lyric } from '../types';

export async function fetchTextylLyrics(title: string, author: string): Promise<Lyric | false> {
  const { searchQuery } = normalizeLyricSearchQuery(title, author);
  if (!searchQuery) return false;

  const searchUrl = `https://textyl.ponlponl123.com/api/lyrics?q=${encodeURIComponent(searchQuery)}`;
  const res = await fetchJsonWithTimeout(searchUrl, 3500);

  if (res && res.status === 200 && res.data?.lyrics) {
    return {
      isTimestamp: false,
      lyrics: res.data.lyrics,
      source: 'textyl',
    };
  }
  return false;
}
