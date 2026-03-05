import { redisClient } from '@/index';

const TTL = {
  SUCCESS: 1800,
  FAILURE: 600,
} as const;

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T | null | undefined | false>,
): Promise<T | undefined> {
  if (redisClient?.redis) {
    const cached = await redisClient.redis.get(key);
    if (cached === '') return undefined;
    if (cached !== null) return JSON.parse(cached) as T;
  }

  try {
    const result = await fetcher();
    if (result) {
      redisClient?.redis?.setex(key, TTL.SUCCESS, JSON.stringify(result));
      return result as T;
    }
  } catch {}

  redisClient?.redis?.setex(key, TTL.FAILURE, '');
  return undefined;
}

export async function hasCache(...keys: string[]): Promise<boolean> {
  if (!redisClient?.redis) return false;
  for (const key of keys) {
    const value = await redisClient.redis.get(key);
    if (value) return true;
  }
  return false;
}
