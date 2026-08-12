import { container } from '@/core/container';
import { normalizeLyricSearchQuery } from './base';
import type { Lyric } from '../types';

export async function fetchYtmusicWebLyrics(title: string, author?: string): Promise<Lyric | false> {
  const { searchQuery } = normalizeLyricSearchQuery(title, author);
  if (!searchQuery) return false;

  try {
    const yt = container.ytmusic?.client;
    if (!yt?.music) return false;

    const searcher = await yt.music.search(searchQuery).catch(() => null);
    const song = searcher?.songs?.contents?.[0];
    if (!song || !song.id) return false;

    const info = await yt.music.getInfo(song.id).catch(() => null);
    const lyricsData: any = info ? await info.getLyrics().catch(() => null) : null;
    if (!lyricsData) return false;

    if (lyricsData.description?.text) {
      return {
        isTimestamp: false,
        lyrics: String(lyricsData.description.text).split('\n').filter(Boolean),
        source: 'Youtube Music (web)',
      };
    }
    return false;
  } catch {
    return false;
  }
}
