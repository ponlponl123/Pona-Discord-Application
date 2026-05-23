import { container } from '@/core/container';

const TTL = {
  SUCCESS: 1800,
  FAILURE: 600,
} as const;

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T | null | undefined | false>,
): Promise<T | undefined> {
  if (container.redis?.redis) {
    const cached = await container.redis.redis.get(key);
    if (cached === '') return undefined;
    if (cached !== null) return JSON.parse(cached) as T;
  }

  try {
    const result = await fetcher();
    if (result) {
      container.redis?.redis?.setex(key, TTL.SUCCESS, JSON.stringify(result));
      return result as T;
    }
  } catch {}

  container.redis?.redis?.setex(key, TTL.FAILURE, '');
  return undefined;
}

export async function hasCache(...keys: string[]): Promise<boolean> {
  if (!container.redis?.redis) return false;
  for (const key of keys) {
    const value = await container.redis.redis.get(key);
    if (value) return true;
  }
  return false;
}
