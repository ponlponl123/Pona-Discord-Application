import { container } from '@/core/container';
import type { Lyric } from './types';

export const CACHE_TTL = {
  TIMED_LYRICS: 2592000,   // 30 days
  PLAIN_LYRICS: 1209600,   // 14 days
  NOT_FOUND: 86400,        // 24 hours
};

export async function getCachedLyrics(videoId: string): Promise<Lyric | null> {
  if (!videoId || !container.redis?.redis) return null;
  try {
    const cachedValue = await container.redis.redis.get(`yt:lyrics:${videoId}`);
    if (cachedValue) {
      const parsed = JSON.parse(cachedValue) as Lyric;
      if (parsed && (parsed.isTimestamp || parsed.error || (parsed.lyrics && parsed.lyrics.length > 0))) {
        return parsed;
      }
    }
  } catch {
    // Ignore Redis read errors
  }
  return null;
}

export async function setCachedLyrics(videoId: string, lyric: Lyric): Promise<void> {
  if (!videoId || !container.redis?.redis) return;
  try {
    let ttl = CACHE_TTL.PLAIN_LYRICS;
    if (lyric.isTimestamp) {
      ttl = CACHE_TTL.TIMED_LYRICS;
    } else if (lyric.error || !lyric.lyrics || lyric.lyrics.length === 0) {
      ttl = CACHE_TTL.NOT_FOUND;
    }
    await container.redis.redis.setex(`yt:lyrics:${videoId}`, ttl, JSON.stringify(lyric)).catch(() => {});
  } catch {
    // Ignore Redis write errors
  }
}
