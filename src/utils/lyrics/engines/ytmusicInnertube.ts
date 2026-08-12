import { container } from '@/core/container';
import type { Lyric } from '../types';

export async function fetchYtmusicInnertubeLyrics(videoId: string): Promise<Lyric | false> {
  if (!videoId || videoId === 'undefined' || videoId === 'null') return false;

  try {
    const client = container.ytmusic?.client;
    if (!client?.music) return false;

    const lyricsData: any = await client.music.getLyrics(videoId).catch(() => null);
    if (lyricsData?.description?.text) {
      const lines = String(lyricsData.description.text).split('\n').filter(Boolean);
      return {
        isTimestamp: false,
        lyrics: lines,
        source: 'Youtube Music (innertube)',
      };
    }
    return false;
  } catch {
    return false;
  }
}
