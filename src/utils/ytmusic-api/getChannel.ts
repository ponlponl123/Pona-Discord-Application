import type { ArtistFull, ProfileFull } from '@/interfaces/ytmusic-api';
import { ytmusic } from '@/index';
import { fetchWithCache, hasCache } from '@/utils/ytmusic-api/cache';
import YTMusicAPI from '@/utils/ytmusic-api/request';
import type { YTMusic } from 'youtubei.js';

export interface ChannelResult {
  message: string;
  result: {
    v1: YTMusic.Artist | undefined;
    v2: ArtistFull | undefined;
    user: ProfileFull | undefined;
  };
}

const KEYS = {
  v1: (id: string) => `yt:artist:v1:${id}`,
  v2: (id: string) => `yt:artist:v2:${id}:info`,
  user: (id: string) => `yt:user:${id}:info`,
} as const;

export async function IsValidChannel(channelId: string): Promise<boolean> {
  try {
    if (
      await hasCache(
        KEYS.v1(channelId),
        KEYS.v2(channelId),
        KEYS.user(channelId),
      )
    ) {
      return true;
    }

    const encodedId = encodeURIComponent(channelId);

    if (await ytmusic.client.music.getArtist(channelId).catch((): null => null))
      return true;
    if (await YTMusicAPI('GET', `user/${encodedId}`).catch((): null => null))
      return true;
    if (await YTMusicAPI('GET', `artist/${encodedId}`).catch((): null => null))
      return true;

    return false;
  } catch {
    return false;
  }
}

export async function getChannel(channelId: string): Promise<ChannelResult> {
  const encodedId = encodeURIComponent(channelId);

  const [v1, v2, user] = await Promise.all([
    fetchWithCache<YTMusic.Artist>(KEYS.v1(channelId), () =>
      ytmusic.client.music.getArtist(channelId),
    ),
    fetchWithCache<ArtistFull>(KEYS.v2(channelId), async () => {
      const res = await YTMusicAPI('GET', `artist/${encodedId}`);
      return res ? res.data.result : null;
    }),
    fetchWithCache<ProfileFull>(KEYS.user(channelId), async () => {
      const res = await YTMusicAPI('GET', `user/${encodedId}`);
      return res ? res.data.result : null;
    }),
  ]);

  return { message: 'Ok', result: { v1, v2, user } };
}
