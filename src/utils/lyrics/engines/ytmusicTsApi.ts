import { tsYtmusicClient } from '@/utils/ytmusic-api/barebone';
import type { Lyric, TimestampLyrics, TimedLyricsRes } from '@/interfaces/lyrics';

export const ytmusicTsApiGetLyrics = (videoId: string, timestamp?: boolean): Promise<string[] | TimedLyricsRes | null> => {
  return tsYtmusicClient.getLyrics(videoId, timestamp as any);
};

export async function fetchYtmusicTsApiLyrics(videoId: string): Promise<Lyric | false> {
  const timedRes = await tsYtmusicClient.getLyrics(videoId, true).catch(() => null);
  if (timedRes && Array.isArray(timedRes.timedLyricsData) && timedRes.timedLyricsData.length > 0) {
    const timestampLyrics: TimestampLyrics[] = timedRes.timedLyricsData
      .map((item) => ({
        seconds: Number(item.cueRange?.startTimeMilliseconds ?? 0) / 1000,
        lyrics: String(item.lyricLine ?? '').trim(),
      }))
      .filter((item) => Boolean(item.lyrics));

    if (timestampLyrics.length > 0) {
      return {
        isTimestamp: true,
        lyrics: timestampLyrics,
        source: `Youtube Music (${timedRes.sourceMessage || 'ts-api'})`,
      };
    }
  }

  const plainLines = await tsYtmusicClient.getLyrics(videoId).catch(() => null);
  if (plainLines && Array.isArray(plainLines) && plainLines.length > 0) {
    return {
      isTimestamp: false,
      lyrics: plainLines,
      source: 'Youtube Music (ts-api)',
    };
  }

  return false;
}
