import { Elysia } from 'elysia';
import { config } from '@/config/express';

export const apiKeyPlugin = new Elysia().derive(({ headers, set }) => {
  const authHead = headers['authorization'];

  if (
    !authHead ||
    !authHead.startsWith('Pona! ') ||
    authHead.split(' ')[1] !== config.EXPRESS_SECRET_API_KEY
  ) {
    set.status = 401;
    throw new Error('Invalid API key');
  }

  return { authenticated: true };
});

export default function apiKeyIsValid(context: any): any {
  const authHead = context.headers['authorization'];

  if (
    !authHead ||
    !authHead.startsWith('Pona! ') ||
    authHead.split(' ')[1] !== config.EXPRESS_SECRET_API_KEY
  ) {
    context.set.status = 401;
    return { error: 'Invalid API key' };
  }

  return true;
}
