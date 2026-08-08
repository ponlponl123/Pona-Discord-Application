import type { User } from 'discord.js';
import { container } from '@/core/container';

export async function fetchUserByOAuthAccessToken(
  type: 'Bearer' | string,
  key: string,
): Promise<User | false> {
  return fetchUserByOAuth(`${type} ${key}`);
}

export async function fetchUserByOAuth(
  authorization: string,
): Promise<User | false> {
  const { redis } = container;
  const cacheKey = `oauth:user:${authorization}`;

  if (redis?.redis) {
    try {
      const cached = await redis.redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch {
      // Ignore cache error, fallback to API
    }
  }

  try {
    const response = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Pona! Endpoint (OpenPonlponl123.com/v1)',
      },
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const userData = (await response.json()) as User;
      if (redis?.redis) {
        redis.redis.setex(cacheKey, 600, JSON.stringify(userData)).catch(() => {});
      }
      return userData;
    }
  } catch {
    return false;
  }
  return false;
}
