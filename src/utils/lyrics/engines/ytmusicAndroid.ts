import { container } from '@/core/container';
import type { Lyric, TimestampLyrics } from '@/interfaces/lyrics';
import { traverse, traverseList, traverseString, ANDROID_CLIENTNAME, ANDROID_CLIENTVERSION } from '@/utils/ytmusic-api/barebone';

export async function fetchYtmusicAndroidLyrics(videoId: string): Promise<Lyric | false> {
  if (!videoId || !videoId.match(/^[a-zA-Z0-9-_]{11}$/)) return false;

  try {
    const client = container.ytmusic?.client;
    if (!client?.actions) return false;

    const nextRes: any = await client.actions.execute('/next', { videoId });
    const nextData = nextRes?.data || nextRes;

    const browseId: string | undefined = traverse(traverseList(nextData, 'tabs', 'tabRenderer')[1], 'browseId');
    if (!browseId) return false;

    const browseRes: any = await client.actions.execute('/browse', {
      browseId,
      clientName: ANDROID_CLIENTNAME,
      clientVersion: ANDROID_CLIENTVERSION,
    });

    const lyricsData = browseRes?.data || browseRes;

    const timedLyrics = traverse(lyricsData, 'contents', 'type', 'lyricsData');
    const rawTimedData = timedLyrics?.timedLyricsData || traverse(lyricsData, 'timedLyricsData');

    if (Array.isArray(rawTimedData) && rawTimedData.length > 0) {
      const timestampLyrics: TimestampLyrics[] = [];
      for (const item of rawTimedData) {
        const startMs = Number(
          item?.cueRange?.startTimeMilliseconds ?? item?.startTimeMs ?? item?.start_time_ms ?? 0,
        );
        const lineText = String(item?.lyricLine ?? item?.line ?? item?.text ?? '').trim();
        if (lineText) {
          timestampLyrics.push({
            seconds: startMs / 1000,
            lyrics: lineText,
          });
        }
      }

      if (timestampLyrics.length > 0) {
        return {
          isTimestamp: true,
          lyrics: timestampLyrics,
          source: 'Youtube Music (android)',
        };
      }
    }

    const plainString = traverseString(lyricsData, 'description', 'runs', 'text');
    if (plainString) {
      const lines = plainString
        .replaceAll('\r', '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length > 0) {
        return {
          isTimestamp: false,
          lyrics: lines,
          source: 'Youtube Music (android)',
        };
      }
    }

    return false;
  } catch {
    return false;
  }
}
