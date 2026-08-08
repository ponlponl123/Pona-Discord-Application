import type { SongDetailed } from '@/interfaces/ytmusic-api';
import { container } from '@/core/container';
import { fetchWithCache, hasCache } from '@/utils/ytmusic-api/cache';
import YTMusicAPI from '@/utils/ytmusic-api/request';
import type { YTMusic } from 'youtubei.js';

export interface VideoResult {
  message: string;
  result: {
    v1: YTMusic.TrackInfo | undefined;
    v2: SongDetailed | undefined;
  };
}

const KEYS = {
  v1: (id: string) => `yt:video:v1:${id}`,
  v2: (id: string) => `yt:video:v2:${id}:info`,
} as const;

export async function IsValidVideo(videoId: string, userId?: string): Promise<boolean> {
  try {
    if (await hasCache(KEYS.v1(videoId), KEYS.v2(videoId))) return true;

    const encodedId = encodeURIComponent(videoId);

    if (await container.ytmusic.client.music.getInfo(videoId).catch((): null => null))
      return true;
    if (await YTMusicAPI('GET', `song/${encodedId}`, undefined, undefined, userId).catch((): null => null))
      return true;

    return false;
  } catch {
    return false;
  }
}

export async function getVideo(videoId: string, userId?: string): Promise<VideoResult> {
  const encodedId = encodeURIComponent(videoId);

  const [v1, v2] = await Promise.all([
    fetchWithCache<YTMusic.TrackInfo>(KEYS.v1(videoId), () =>
      container.ytmusic.client.music.getInfo(videoId),
    ),
    fetchWithCache<SongDetailed>(KEYS.v2(videoId), async () => {
      const res = await YTMusicAPI('GET', `song/${encodedId}`, undefined, undefined, userId);
      return res ? res.data.result : null;
    }),
  ]);

  return { message: 'Ok', result: { v1, v2 } };
}
