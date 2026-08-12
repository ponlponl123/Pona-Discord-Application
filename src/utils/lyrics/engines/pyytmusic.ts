import YTMusicAPI from '@/utils/ytmusic-api/request';
import type { Lyric, TimestampLyrics } from '../types';

export async function fetchPyytmusicLyrics(videoId: string, userId?: string): Promise<Lyric | false> {
  if (!videoId || videoId === 'undefined' || videoId === 'null') return false;

  const uid = userId || 'pona_system';
  try {
    const watchRes = await YTMusicAPI(
      'GET',
      `watch/playlist/${encodeURIComponent(videoId)}?limit=1`,
      { userId: uid },
      undefined,
      uid,
    );
    const lyricsBrowseId: string | undefined = watchRes?.data?.result?.lyrics;
    if (!lyricsBrowseId) return false;

    const lyricsRes = await YTMusicAPI(
      'GET',
      `browsing/lyrics/${encodeURIComponent(lyricsBrowseId)}?timestamps=true`,
      { userId: uid },
      undefined,
      uid,
    );
    const lyricsResult = lyricsRes?.data?.result;
    if (!lyricsResult) return false;

    if (lyricsResult.hasTimestamps && Array.isArray(lyricsResult.lyrics)) {
      const timestampLyrics: TimestampLyrics[] = lyricsResult.lyrics.map((line: any) => ({
        seconds: (line.start_time_ms ?? line.startTimeMs ?? 0) / 1000,
        lyrics: line.text ?? line.line ?? '',
      }));
      if (timestampLyrics.length > 0) {
        return { isTimestamp: true, lyrics: timestampLyrics, source: 'Youtube Music (community)' };
      }
    }

    if (lyricsResult.lyrics && typeof lyricsResult.lyrics === 'string') {
      const lines = lyricsResult.lyrics.split('\n').map((l: string) => l.trim()).filter(Boolean);
      return { isTimestamp: false, lyrics: lines, source: 'Youtube Music (community)' };
    }

    return false;
  } catch {
    return false;
  }
}
