import axios from 'axios';
import type { User } from 'discord.js';

export async function fetchUserByOAuthAccessToken(
  type: 'Bearer' | string,
  key: string,
): Promise<User | false> {
  return fetchUserByOAuth(`${type} ${key}`);
}

export async function fetchUserByOAuth(
  authorization: string,
): Promise<User | false> {
  try {
    const user = await axios.get('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Pona! Endpoint (OpenPonlponl123.com/v1)',
      },
    });
    if (user.status === 200) return user.data;
  } catch {
    return false;
  }
  return false;
}
